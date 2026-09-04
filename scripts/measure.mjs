/* ============================================================
   measure.mjs — DEV ONLY. Numeric colour/density gate.

   Compares our rendered sections against the Vesper reference
   frames on the metrics that actually diverged, so parity is a
   pass/fail number rather than a judgement call.

   Metrics are computed over LIT pixels only (max channel >= 28),
   because both images are mostly black background and including
   it drags every average toward zero.

   Usage: node scripts/measure.mjs <oursDir> [refDir]
   ============================================================ */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";
import path from "node:path";

const run = promisify(execFile);
const OURS = process.argv[2] ?? "shots";
const REF =
  process.argv[3] ??
  path.join(
    process.env.LOCALAPPDATA ?? "",
    "Temp/claude/d--hamza-portfolio/3ea14c02-e1fb-42fc-9818-8489ee284bc7/scratchpad/ref2"
  );

/** Matched pairs: our section screenshot <-> the reference frame of that state. */
const PAIRS = [
  { name: "hero", ours: "top.png", ref: "r17.jpg" },
  { name: "galaxy", ours: "presence.png", ref: "r05.jpg" },
  { name: "brain", ours: "approach.png", ref: "r09.jpg" },
];

/** Targets derived from measuring the reference itself. */
const TARGET = { sat: [0.46, 0.58], lit: [30, 45] };

const HUES = ["red","orange","yellow","chartreuse","green","spring","cyan","azure","blue","violet","magenta","rose"];

/**
 * Reference frames are cropped to the preview player (886x690, aspect 1.28)
 * while our screenshots are a full 1440x900 viewport (aspect 1.60). Comparing
 * coverage across those directly is meaningless — the wider frame carries more
 * empty margin. Centre-crop everything to 1.28 first.
 */
const REF_ASPECT = 886 / 690;

async function stats(file) {
  const filter =
    `crop='min(iw,ih*${REF_ASPECT})':'min(ih,iw/${REF_ASPECT})',scale=240:-1`;
  const { stdout } = await run(
    "ffmpeg",
    ["-v", "error", "-i", file, "-vf", filter, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
    { encoding: "buffer", maxBuffer: 1 << 28 }
  );
  const buf = stdout;
  const W = 240;
  const H = Math.floor(buf.length / 3 / W);

  let lit = 0, sumSat = 0, total = 0;
  const hue = new Array(12).fill(0);
  let hueN = 0;

  for (let i = 0; i < W * H; i++) {
    const r = buf[i * 3], g = buf[i * 3 + 1], b = buf[i * 3 + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    total++;
    if (mx < 28) continue; // background
    lit++;
    const sat = mx === 0 ? 0 : (mx - mn) / mx;
    sumSat += sat;
    if (sat > 0.18) {
      let h;
      if (mx === mn) h = 0;
      else if (mx === r) h = ((g - b) / (mx - mn)) % 6;
      else if (mx === g) h = (b - r) / (mx - mn) + 2;
      else h = (r - g) / (mx - mn) + 4;
      hue[Math.floor((((h * 60) % 360) + 360) % 360 / 30)]++;
      hueN++;
    }
  }
  const top = hue
    .map((v, i) => [HUES[i], v])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .filter(([, v]) => v > 0)
    .map(([n, v]) => `${n} ${Math.round((v / hueN) * 100)}%`);

  return { lit: (lit / total) * 100, sat: sumSat / lit, top };
}

const inRange = (v, [lo, hi]) => v >= lo && v <= hi;
let failures = 0;

console.log("\n  metric        ours      reference   target        verdict");
console.log("  " + "-".repeat(64));

for (const p of PAIRS) {
  const ourFile = path.join(OURS, p.ours);
  const refFile = path.join(REF, p.ref);
  if (!fs.existsSync(ourFile)) {
    console.log(`  ${p.name}: MISSING ${ourFile}`);
    failures++;
    continue;
  }
  const a = await stats(ourFile);
  const b = fs.existsSync(refFile) ? await stats(refFile) : null;

  for (const [label, key, fmt, target] of [
    ["saturation", "sat", (v) => v.toFixed(3), TARGET.sat],
    ["coverage %", "lit", (v) => v.toFixed(1), TARGET.lit],
  ]) {
    const ok = inRange(a[key], target);
    if (!ok) failures++;
    console.log(
      `  ${p.name.padEnd(7)}${label.padEnd(12)}${fmt(a[key]).padStart(6)}    ` +
        `${(b ? fmt(b[key]) : "—").padStart(7)}     ${`${target[0]}-${target[1]}`.padEnd(12)}  ${ok ? "pass" : "FAIL"}`
    );
  }
  console.log(`  ${" ".repeat(7)}hue         ours: ${a.top.join(", ")}`);
  if (b) console.log(`  ${" ".repeat(7)}            ref:  ${b.top.join(", ")}`);
  console.log();
}

console.log(failures === 0 ? "  ALL PASS\n" : `  ${failures} FAILING\n`);
process.exit(failures === 0 ? 0 : 1);
