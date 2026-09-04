/* ============================================================
   shoot-agent.mjs — DEV ONLY. Captures the assistant panel open,
   and mid-reply so the avatar's thinking state is actually on screen.

   Usage: node scripts/shoot-agent.mjs [outDir] [baseUrl] [--reduce]
   ============================================================ */

import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const argv = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const OUT = argv[0] ?? "shots/agent";
const BASE = argv[1] ?? "http://localhost:3000";
const REDUCE = process.argv.includes("--reduce");

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((p) => fs.existsSync(p));
if (!CHROME) throw new Error("No Chrome/Edge found");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1 });
if (REDUCE) {
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
}
await page.goto(BASE, { waitUntil: "networkidle2", timeout: 60000 });
await sleep(2600);
await page.mouse.move(4, 4);

await page.click(".agent-launcher");
await sleep(600);
await page.screenshot({ path: path.join(OUT, "panel-open.png") });

// Fire a chip and catch the frame while the reply is still pending, which is
// the only moment the thinking state is on screen.
const chip = await page.$(".agent-panel .agent-chip");
if (chip) {
  await chip.click();
  await sleep(150);
  const thinking = await page.$eval(
    ".agent-panel",
    (el) => !!el.querySelector('[data-state="thinking"]')
  );
  await page.screenshot({ path: path.join(OUT, "panel-thinking.png") });
  console.log(`thinking avatar present mid-reply: ${thinking}`);
  await sleep(900);
  await page.screenshot({ path: path.join(OUT, "panel-replied.png") });
}

// Report which animations are actually running, so "static under reduced
// motion" is a measurement rather than a claim.
const anim = await page.evaluate(() => {
  const el = document.querySelector(".agent-avatar-ring");
  if (!el) return null;
  return document.getAnimations
    ? el.getAnimations().map((a) => ({
        name: a.animationName ?? "?",
        duration: a.effect?.getTiming?.().duration,
        playState: a.playState,
      }))
    : "unsupported";
});
console.log("ring animations:", JSON.stringify(anim));

try {
  await browser.close();
} catch {
  browser.process()?.kill("SIGKILL");
}
