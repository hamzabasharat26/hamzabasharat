/* ============================================================
   motion-diff.mjs — DEV ONLY.

   Compares the SHAPE OF THE SCROLL, not single frames.

   Every previous comparison sampled one still per section, which
   can only show what a state looks like — never when it arrives,
   how long it is held, or how fast it hands over to the next. That
   is exactly where a motion-led template lives, and it is the one
   axis never measured here.

   Captures N frames evenly across our full scroll, extracts the
   reference at the same density, and prints both as a timeline of
   dominant hue + coverage so the pacing can be read off directly.

   Usage: node scripts/motion-diff.mjs [outDir] [frames]
   ============================================================ */

import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import puppeteer from "puppeteer-core";

const run = promisify(execFile);
const OUT = process.argv[2] ?? "motion";
const FRAMES = Number(process.argv[3] ?? 24);
const BASE = "http://localhost:3000";
const VIDEO = "Requirement.mp4";
/** Crop to the preview player; matches scripts/measure.mjs. */
const REF_CROP = "crop=886:690:514:250";

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
].find((p) => fs.existsSync(p));
if (!CHROME) throw new Error("No Chrome found");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const HUES = ["red","orange","yellow","chartreuse","green","spring","cyan","azure","blue","violet","magenta","rose"];

/** Same metric as measure.mjs: lit pixels only, common aspect. */
async function stats(file) {
  const { stdout } = await run(
    "ffmpeg",
    ["-v","error","-i",file,"-vf","crop='min(iw,ih*1.284)':'min(ih,iw/1.284)',scale=200:-1","-f","rawvideo","-pix_fmt","rgb24","-"],
    { encoding: "buffer", maxBuffer: 1 << 28 }
  );
  const b = stdout, W = 200, H = Math.floor(b.length / 3 / W);
  let lit = 0, total = 0, hueN = 0;
  const hue = new Array(12).fill(0);
  for (let i = 0; i < W * H; i++) {
    const r = b[i*3], g = b[i*3+1], bl = b[i*3+2];
    const mx = Math.max(r,g,bl), mn = Math.min(r,g,bl);
    total++;
    if (mx < 28) continue;
    lit++;
    const sat = mx === 0 ? 0 : (mx - mn) / mx;
    if (sat > 0.18) {
      let h;
      if (mx === mn) h = 0;
      else if (mx === r) h = ((g - bl) / (mx - mn)) % 6;
      else if (mx === g) h = (bl - r) / (mx - mn) + 2;
      else h = (r - g) / (mx - mn) + 4;
      hue[Math.floor(((((h*60)%360)+360)%360)/30)]++;
      hueN++;
    }
  }
  const top = hue.map((v,i) => [HUES[i], v]).sort((a,z) => z[1]-a[1])[0];
  return {
    lit: (lit/total)*100,
    hue: hueN ? top[0] : "—",
    hueShare: hueN ? (top[1]/hueN)*100 : 0,
  };
}

/* ---- 1. our scroll ---------------------------------------- */
fs.mkdirSync(path.join(OUT, "ours"), { recursive: true });
fs.mkdirSync(path.join(OUT, "ref"), { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--enable-unsafe-swiftshader","--use-angle=swiftshader","--hide-scrollbars","--window-size=1440,900"],
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
await page.goto(BASE, { waitUntil: "networkidle2", timeout: 90_000 });
await page.evaluate(() => document.fonts.ready);
await page.mouse.move(4, 4); // no phantom centre cursor
await sleep(4000);

const maxScroll = await page.evaluate(
  () => document.documentElement.scrollHeight - window.innerHeight
);
console.log(`  our scrollable height: ${maxScroll}px over ${FRAMES} samples\n`);

for (let i = 0; i < FRAMES; i++) {
  const p = i / (FRAMES - 1);
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), Math.round(p * maxScroll));
  await sleep(900); // morph lerp settles in ~0.6s
  await page.screenshot({ path: path.join(OUT, "ours", `f${String(i).padStart(2,"0")}.png`) });
}
await browser.close().catch(() => {});

/* ---- 2. reference at the same density ---------------------- */
const fps = (FRAMES / 8.6).toFixed(3);
await run("ffmpeg", ["-v","error","-y","-i",VIDEO,"-vf",`${REF_CROP},fps=${fps}`,"-q:v","2",
  path.join(OUT,"ref","f%02d.jpg")]);

/* ---- 3. timeline ------------------------------------------- */
const ourFiles = fs.readdirSync(path.join(OUT,"ours")).sort();
const refFiles = fs.readdirSync(path.join(OUT,"ref")).sort();

console.log("  progress │ ours                    │ reference");
console.log("  ─────────┼─────────────────────────┼──────────────────────");
const n = Math.min(ourFiles.length, refFiles.length);
for (let i = 0; i < n; i++) {
  const a = await stats(path.join(OUT,"ours",ourFiles[i]));
  const b = await stats(path.join(OUT,"ref",refFiles[i]));
  const pct = String(Math.round((i/(n-1))*100)).padStart(3);
  const fmt = (s) => `${s.hue.padEnd(10)} ${String(Math.round(s.hueShare)).padStart(3)}%  lit ${s.lit.toFixed(1).padStart(4)}%`;
  const flag = a.hue !== b.hue ? "  <-- state differs" : "";
  console.log(`   ${pct}%    │ ${fmt(a)} │ ${fmt(b)}${flag}`);
}
console.log();
