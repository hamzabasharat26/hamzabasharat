// Bake the agent avatar from the source robot-hand / circuit-brain image.
//
// The source is white-on-pale-grey. Dropped in unmodified it reads as stock
// art pasted onto a near-black site, so the luminance is remapped onto the
// site's own accent ramp (ink -> a2) at build time. Doing it here rather than
// with a CSS filter keeps the runtime paint cost at zero while the ring
// animates.
//
//   node scripts/bake-agent-avatar.mjs
//
// Writes public/media/agent/avatar-{128,64}.{avif,webp}.

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "image.png");
const OUT = path.join(ROOT, "public", "media", "agent");

// Tight crop on the circuit-brain motif. The source is 1080x1080; this square
// frames the brain and lets only the fingertips into the bottom of the circle,
// because the hand degenerates into mush below ~80px.
const CROP = { left: 222, top: 132, width: 596, height: 596 };

// The source's whole tonal range lives between roughly 205 and 250 — white
// traces on a near-white ground. Everything outside that window is noise, so
// the levels are stretched onto it explicitly rather than by normalise(),
// which was measured (mean 217, stdev 24) rather than guessed.
const LEVEL_LO = 229;
const LEVEL_HI = 251;

// Downsampling averages the hairline circuit traces towards the ground, so the
// survivors are re-expanded in the pixel loop below. Applied there rather than
// as a second sharp .linear() for the reason noted in bake().
const POST_GAIN = 2.4;

// Luminance ramp, dark -> light. Stop 0 is a hair off --color-ink so the disc
// still reads as an object against the near-black panel; stop 3 sits just
// above --color-a2 so the brightest traces stay light on the disc.
const RAMP = [
  [0x07, 0x14, 0x1a],
  [0x0c, 0x45, 0x58],
  [0x22, 0xd3, 0xee],
  [0xd8, 0xfb, 0xff],
];

function rampAt(t) {
  const x = Math.min(0.9999, Math.max(0, t)) * (RAMP.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  const a = RAMP[i];
  const b = RAMP[i + 1];
  return [
    Math.round(a[0] + (b[0] - a[0]) * f),
    Math.round(a[1] + (b[1] - a[1]) * f),
    Math.round(a[2] + (b[2] - a[2]) * f),
  ];
}

async function bake(size) {
  // TWO PASSES, deliberately. sharp applies resize before linear regardless of
  // call order, and a second .linear() replaces the first rather than composing
  // with it — so a single chained pipeline silently drops the level stretch and
  // bakes a flat disc. Materialising between the two steps is what makes the
  // order real.
  const gain = 255 / (LEVEL_HI - LEVEL_LO);
  const levelled = await sharp(SRC)
    .extract(CROP)
    .greyscale()
    .linear(gain, -LEVEL_LO * gain)
    .png()
    .toBuffer();

  const { data, info } = await sharp(levelled)
    .resize(size, size, { fit: "cover", kernel: "lanczos3" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const px = new Uint8ClampedArray(size * size * 4);
  const c = (size - 1) / 2;
  const r = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * size + x;
      const lum = (data[i * info.channels] * POST_GAIN) / 255;
      const [rr, gg, bb] = rampAt(lum);

      // 1px antialiased circular mask.
      const d = Math.hypot(x - c, y - c);
      const alpha = Math.round(255 * Math.min(1, Math.max(0, r - d)));

      px[i * 4] = rr;
      px[i * 4 + 1] = gg;
      px[i * 4 + 2] = bb;
      px[i * 4 + 3] = alpha;
    }
  }

  const img = sharp(Buffer.from(px.buffer), {
    raw: { width: size, height: size, channels: 4 },
  });

  const webp = await img.clone().webp({ quality: 82, alphaQuality: 90 }).toBuffer();
  const avif = await img.clone().avif({ quality: 55 }).toBuffer();

  await writeFile(path.join(OUT, `avatar-${size}.webp`), webp);
  await writeFile(path.join(OUT, `avatar-${size}.avif`), avif);

  return { size, webp: webp.length, avif: avif.length };
}

await mkdir(OUT, { recursive: true });
for (const size of [128, 64]) {
  const r = await bake(size);
  console.log(`avatar-${r.size}  webp ${r.webp} B   avif ${r.avif} B`);
}
