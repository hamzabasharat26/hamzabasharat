/* ============================================================
   hero-fit.mjs — DEV ONLY. Checks the hero actually fits at every
   acceptance size, and screenshots each one.

   "Looks fine" is not a check. This reads the real bounding boxes of
   the elements that must be visible at scroll-top and fails the size if
   any of them extends past the fold, so a regression is a non-zero exit
   code rather than something someone has to notice in a PNG.

   Also asserts the launcher does not overlap the proof strip, which is
   a geometric test, not a visual one.

   Usage: node scripts/hero-fit.mjs [outDir] [baseUrl] [--reduce]
   ============================================================ */

import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

// Flags are stripped before positional lookup, or `--reduce` in slot 2 is
// read as the base URL and Chrome is asked to navigate to it.
const argv = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const OUT = argv[0] ?? "shots/hero-fit";
const BASE = argv[1] ?? "http://localhost:3000";
const REDUCE = process.argv.includes("--reduce");

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((p) => fs.existsSync(p));
if (!CHROME) throw new Error("No Chrome/Edge found");

// 1366x768 is the acceptance case: if it passes there it passes above it.
const SIZES = [
  { w: 1920, h: 1080, name: "1920x1080" },
  { w: 1536, h: 864, name: "1536x864" },
  { w: 1440, h: 900, name: "1440x900" },
  { w: 1366, h: 768, name: "1366x768", acceptance: true },
  { w: 1280, h: 720, name: "1280x720" },
  { w: 390, h: 844, name: "390x844", mobile: true },
  { w: 360, h: 740, name: "360x740", mobile: true },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--hide-scrollbars"],
});

const results = [];

for (const size of SIZES) {
  const page = await browser.newPage();
  await page.setViewport({
    width: size.w,
    height: size.h,
    deviceScaleFactor: 1,
    isMobile: !!size.mobile,
    hasTouch: !!size.mobile,
  });
  if (REDUCE) {
    await page.emulateMediaFeatures([
      { name: "prefers-reduced-motion", value: "reduce" },
    ]);
  }

  await page.goto(BASE, { waitUntil: "networkidle2", timeout: 60000 });
  // Let the intro timeline settle; the CTAs animate in on a delay.
  await sleep(2600);
  // Park the cursor out of the way — the field's pointer uniform defaults to
  // canvas centre and biases the glow if the mouse is left there.
  await page.mouse.move(4, 4);
  await sleep(250);

  const m = await page.evaluate(() => {
    const box = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
    };
    const all = (sel) =>
      [...document.querySelectorAll(sel)].map((el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
      });

    const sub = document.querySelector(".hero-sub");
    let subLines = 0;
    if (sub) {
      const cs = getComputedStyle(sub);
      const lh = parseFloat(cs.lineHeight);
      subLines = Math.round(sub.getBoundingClientRect().height / lh);
    }

    return {
      vh: window.innerHeight,
      ctas: all(".hero-cta"),
      stats: all(".hero-stat"),
      strip: box(".proof-strip"),
      launcher: box(".agent-launcher"),
      cue: box(".scroll-cue"),
      subLines,
      // Stat 4's context line must not wrap.
      statContextLines: [...document.querySelectorAll(".hero-stat-context")].map(
        (el) => {
          const lh = parseFloat(getComputedStyle(el).lineHeight);
          return Math.round(el.getBoundingClientRect().height / lh);
        }
      ),
    };
  });

  const fails = [];
  const EPS = 1; // sub-pixel rounding

  for (const [i, c] of m.ctas.entries()) {
    if (c.bottom > m.vh + EPS) fails.push(`CTA ${i + 1} clipped (bottom ${c.bottom.toFixed(0)} > ${m.vh})`);
  }
  for (const [i, s] of m.stats.entries()) {
    if (s.bottom > m.vh + EPS) fails.push(`stat ${i + 1} clipped (bottom ${s.bottom.toFixed(0)} > ${m.vh})`);
  }
  if (m.subLines > 3) fails.push(`subhead is ${m.subLines} lines (max 3)`);
  for (const [i, n] of m.statContextLines.entries()) {
    if (n > 1) fails.push(`stat ${i + 1} context wraps to ${n} lines`);
  }

  // The launcher must never sit on top of proof-strip TEXT. Testing the strip
  // container is wrong: the reserved corner is padding-inline-end, which keeps
  // the text clear but leaves the container's own box spanning underneath the
  // launcher. Test the stat cells, which are the content.
  if (m.launcher) {
    for (const [i, s] of m.stats.entries()) {
      const overlap =
        m.launcher.left < s.right &&
        m.launcher.right > s.left &&
        m.launcher.top < s.bottom &&
        m.launcher.bottom > s.top;
      if (overlap) fails.push(`launcher overlaps stat ${i + 1}`);
    }
  }

  await page.screenshot({ path: path.join(OUT, `${size.name}.png`) });
  const bytes = fs.statSync(path.join(OUT, `${size.name}.png`)).size;

  results.push({ size, fails, subLines: m.subLines, bytes });
  await page.close();
}

// Windows holds a lock on the throwaway Chrome profile's crashpad file, so
// close() can throw EPERM while unlinking it long after every page has been
// captured. That is teardown noise, not a failed run — swallowing it here
// keeps a real check failure as the only reason this script exits non-zero.
try {
  await browser.close();
} catch {
  browser.process()?.kill("SIGKILL");
}

let bad = 0;
for (const r of results) {
  const tag = r.size.acceptance ? " (acceptance)" : "";
  if (r.fails.length === 0) {
    console.log(`PASS  ${r.size.name}${tag}   subhead ${r.subLines} lines   ${(r.bytes / 1024).toFixed(0)}KB`);
  } else {
    bad++;
    console.log(`FAIL  ${r.size.name}${tag}`);
    for (const f of r.fails) console.log(`        - ${f}`);
  }
}
console.log(bad === 0 ? "\nALL PASS" : `\n${bad} size(s) failing`);
process.exit(bad === 0 ? 0 : 1);
