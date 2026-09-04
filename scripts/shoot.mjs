/* ============================================================
   shoot.mjs — DEV ONLY. Screenshots each section of the running
   site by actually scrolling to it, so ScrollTrigger reveals and
   the morph state are what a real visitor would see.

   Deep links (/#work) do NOT work for this: headless captures the
   frame before paint, and a trigger that starts already-scrolled
   past never fires its reveal. Real scrolling is the only way.

   Drives the system Chrome via puppeteer-core — no browser download.

   Usage: node scripts/shoot.mjs [outDir] [baseUrl]
   ============================================================ */

import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const OUT = process.argv[2] ?? "shots";
const BASE = process.argv[3] ?? "http://localhost:3000";
/** `--reduce` emulates prefers-reduced-motion so the degraded path is testable. */
const REDUCE = process.argv.includes("--reduce");

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((p) => fs.existsSync(p));
if (!CHROME) throw new Error("No Chrome/Edge found");

// Anchor ids in scroll order. Keep in sync with src/app/page.tsx.
const SECTIONS = ["top", "proof", "services", "work", "about", "faq", "contact"];
/** Sections where the particle field is on screen, so a blank frame is a bug. */
// #contact only shows a 0.2-opacity ghost, so its frames are legitimately
// small — excluded or it retries forever.
const CANVAS_SECTIONS = new Set(["top", "proof"]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: [
    "--enable-unsafe-swiftshader",
    "--use-angle=swiftshader",
    "--hide-scrollbars",
    "--window-size=1440,900",
  ],
  defaultViewport: { width: 1440, height: 900 },
});

const page = await browser.newPage();
const problems = [];
page.on("console", (m) => {
  if (m.type() === "error") problems.push(`console: ${m.text()}`);
});
page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));

if (REDUCE) {
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  console.log("  (emulating prefers-reduced-motion: reduce)");
}

await page.goto(BASE, { waitUntil: "networkidle2", timeout: 90_000 });
// The point cloud is a deferred fetch; give the canvas real frames to settle.
await page.evaluate(() => document.fonts.ready);

// Park the cursor in a corner. react-three-fiber's state.pointer defaults to
// (0,0) — the CENTRE of the canvas — until a real mouse event arrives, which
// put a phantom cursor in the middle of every shape. That drove the shader's
// pointer term: extra glow, extra alpha and 3x point size right where the
// measurement samples hardest. Every reading taken before this was flattered
// by an interaction that no real visitor was performing.
await page.mouse.move(4, 4);

await sleep(4000);

for (const id of SECTIONS) {
  const found = await page.evaluate((sel) => {
    const el = document.getElementById(sel);
    if (!el) return null;
    // Native scroll, then let Lenis + ScrollTrigger catch up on their own ticker.
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "instant" });
    return true;
  }, id);

  if (!found) {
    console.log(`  ${id.padEnd(10)} MISSING (no element with that id)`);
    continue;
  }

  await sleep(2500); // reveals + morph lerp
  const file = path.join(OUT, `${id}.png`);

  // The compositor occasionally hands back a frame before the WebGL canvas has
  // painted, which yields a near-uniform image. That silently corrupts any
  // measurement taken from it, so retry until the shot has real content.
  // Dark sections with a live canvas land well above 300KB; a blank frame is
  // ~340KB of flat colour at most and text-only sections are far smaller, so
  // compare against the best shot seen rather than a fixed threshold.
  let kb = 0;
  for (let attempt = 1; attempt <= 3; attempt++) {
    await page.screenshot({ path: file });
    kb = Math.round(fs.statSync(file).size / 1024);
    const expectsCanvas = CANVAS_SECTIONS.has(id);
    if (!expectsCanvas || kb > 500) break;
    if (attempt < 3) {
      console.log(`  ${id.padEnd(10)} ${String(kb).padStart(5)} KB  retrying (canvas not painted)`);
      await sleep(1800);
    }
  }
  console.log(`  ${id.padEnd(10)} ${String(kb).padStart(5)} KB  ${file}`);
}

// Chrome's temp profile sometimes refuses to unlink on Windows; the shots
// are already on disk by this point, so a cleanup failure is not a failure.
await browser.close().catch(() => {});

if (problems.length) {
  console.log("\n  page problems:");
  for (const p of [...new Set(problems)].slice(0, 10)) console.log("   -", p);
} else {
  console.log("\n  no console errors");
}
