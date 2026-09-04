/* ============================================================
   build-media.mjs — the ONLY path from docs/drive/ into public/media/.

   Reads the raw Drive export (gitignored, private) + the three zips,
   encodes every shipping asset down to budget, and writes organised
   output into public/media/<group>/. Nothing else touches public/media.

   Rules baked in here, not left to a human:
   - videos  -> .webm (VP9) + .mp4 (H.264), NO audio, <=720px wide,
     a short motion window, target ~120-260 KB. A poster JPG is cut
     from the same window.
   - images  -> .jpg (q82) + .webp (q80), <=1440px wide.
   - excluded by filename, always: freelance_client_leads.xlsx,
     Hamza_Basharat_CV_EY_MLEngineer.docx, the AI-generated Profile*.png.
   - SkyResQ: only the Gazebo simulation frame ships. The real-airframe
     photo and the mission-planner screenshot are defence-adjacent
     (CLAUDE §7) and are NOT emitted here — they need Hamza's explicit
     per-file sign-off first.

   Usage:  node scripts/build-media.mjs [--force]
   Requires ffmpeg/ffprobe on PATH and the `sharp` dep (already a
   transitive dep of next).
   ============================================================ */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const DRIVE = path.join(ROOT, "docs/drive");
const OUT = path.join(ROOT, "public/media");
const FORCE = process.argv.includes("--force");

// The three zips are unpacked to a temp dir once per run. (`tar` on Windows
// reads `D:\` as a remote host; `unzip` is already what the repo uses.)
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "hb-media-"));
for (const z of fs.readdirSync(DRIVE).filter((f) => f.endsWith(".zip"))) {
  execFileSync("unzip", ["-o", "-q", path.join(DRIVE, z), "-d", TMP]);
}
const D = (p) => path.join(DRIVE, p);
const Z = (p) => path.join(TMP, p);

const ff = (args) => execFileSync("ffmpeg", ["-y", "-v", "error", ...args]);
const exists = (p) => fs.existsSync(p);
const ensure = (d) => fs.mkdirSync(d, { recursive: true });
const kb = (p) => (fs.statSync(p).size / 1024).toFixed(0) + "KB";

/** image -> <out>.jpg + <out>.webp, capped width. `q` trades size for detail:
 *  card/case-study media stays at 82, gallery-thumbnail photos drop to 76. */
async function image(src, outRel, width = 1400, q = 82) {
  if (!exists(src)) return console.warn("  ! missing", src);
  const out = path.join(OUT, outRel);
  ensure(path.dirname(out));
  if (!FORCE && exists(out + ".jpg")) return console.log("  = ", outRel);
  const base = sharp(src, { failOn: "none" }).rotate().resize({
    width,
    withoutEnlargement: true,
  });
  await base.clone().jpeg({ quality: q, mozjpeg: true }).toFile(out + ".jpg");
  await base.clone().webp({ quality: q - 4 }).toFile(out + ".webp");
  console.log(`  + ${outRel}.{jpg,webp}  ${kb(out + ".jpg")}`);
}

/** one frame of a video -> <out>.jpg + <out>.webp, <=w px. */
async function still(src, outRel, at, w = 1200) {
  if (!exists(src)) return console.warn("  ! missing", src);
  const out = path.join(OUT, outRel);
  ensure(path.dirname(out));
  if (!FORCE && exists(out + ".jpg")) return console.log("  = ", outRel);
  const raw = out + ".raw.png";
  ff(["-ss", String(at), "-i", src, "-vframes", "1", raw]);
  const base = sharp(raw).resize({ width: w, withoutEnlargement: true });
  await base.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(out + ".jpg");
  await base.clone().webp({ quality: 76 }).toFile(out + ".webp");
  fs.rmSync(raw, { force: true });
  console.log(`  + ${outRel}.{jpg,webp}  ${kb(out + ".jpg")}`);
}

/** video -> <out>.webm + <out>.mp4 + <out>.jpg poster. Muted, short, <=w px. */
function clip(src, outRel, { start = 0, dur = 3.6, w = 720, posterAt } = {}) {
  if (!exists(src)) return console.warn("  ! missing", src);
  const out = path.join(OUT, outRel);
  ensure(path.dirname(out));
  if (!FORCE && exists(out + ".webm")) return console.log("  = ", outRel);
  const vf = `scale='min(${w},iw)':-2:flags=lanczos`;
  const common = ["-ss", String(start), "-t", String(dur), "-i", src, "-an", "-vf", vf];
  ff([...common, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "40", "-row-mt", "1", "-pix_fmt", "yuv420p", out + ".webm"]);
  ff([...common, "-c:v", "libx264", "-profile:v", "high", "-crf", "27", "-preset", "veryslow", "-movflags", "+faststart", "-pix_fmt", "yuv420p", out + ".mp4"]);
  ff(["-ss", String(posterAt ?? start + Math.min(1, dur / 2)), "-i", src, "-vframes", "1", "-vf", vf, "-q:v", "3", out + ".jpg"]);
  console.log(`  + ${outRel}.{webm,mp4,jpg}  ${kb(out + ".webm")} / ${kb(out + ".mp4")}`);
}

const MEB = "Size Measurement/Deployed Magic QC (MEB) karachi industry";

// --- MagicQC — deployed rig at MEB Karachi + the measurement UI -------------
console.log("magicqc");
await image(Z("Size Measurement/measurement.jpeg"), "magicqc/measure", 1400);
await image(Z("Size Measurement/half t shirt measurement.jpg"), "magicqc/measure-shirt", 1200);
await image(Z("Size Measurement/trouser mesure ment.jpg"), "magicqc/measure-trouser", 1400);
await image(Z(`${MEB}/WhatsApp Image 2026-08-08 at 3.22.45 PM.jpeg`), "magicqc/rig-1", 1400);
await image(Z(`${MEB}/WhatsApp Image 2026-08-08 at 3.22.46 PM.jpeg`), "magicqc/rig-2", 1400);
clip(Z(`${MEB}/WhatsApp Video 2026-08-08 at 3.22.44 PM.mp4`), "magicqc/rig", { start: 0, dur: 5, w: 720 });

// --- Fabric defect detection ----------------------------------------------
console.log("fabric");
await image(D("Dashboard fabric software view.jpeg"), "fabric/dashboard", 1400);
await image(D("Fabric defect machine view.jpeg"), "fabric/machine", 1400);
await image(D("fabric result view.jpeg"), "fabric/result", 1400);
clip(D("FBDT.mp4"), "fabric/detect", { start: 0, dur: 6, w: 640, posterAt: 4 });

// --- PPE & workplace safety — real detection footage ---------------------
console.log("ppe");
clip(D("Recording 2025-09-19 231159.mp4"), "ppe/detect", { start: 2, dur: 5, w: 480, posterAt: 3 });
await image(D("people count.png"), "ppe/crowd-count", 1400);
await image(D("Smoking_detect.png"), "ppe/smoking", 1200);

// --- Enterprise RAG / Nexus --------------------------------------------------
console.log("enterprise-rag");
await image(D("Nexus_AI_RAG_Chatbot.png"), "rag/chatbot", 1400);
await image(D("Nexus_architecture.png"), "rag/architecture", 1400);

// --- SafePulse ------------------------------------------------------------
console.log("safepulse");
await image(D("Safepulse_app_data_videos/Safepulse_front_1_mobile.jpeg"), "safepulse/screen-1", 900);
await image(D("Safepulse_app_data_videos/Safepulse_front_2_mobile.jpeg"), "safepulse/screen-2", 900);
await image(D("Safepulse_app_data_videos/Safepulse_front_3_mobile.jpeg"), "safepulse/screen-3", 900);

// --- Industrial pose-estimation suite ----------------------------------
// Generic pose-keypoint demo footage (Hamza's own). The industrial client
// system's footage stays private (CLAUDE §7); this shows the technique.
console.log("pose");
clip(D("Hamza_Open_Pose_estimation .mp4"), "pose/track", { start: 6, dur: 4, w: 720, posterAt: 8 });
await still(D("Hamza_Open_Pose_estimation .mp4"), "pose/still-1", 14, 1200);
await still(D("Hamza_Open_Pose_estimation .mp4"), "pose/still-2", 26, 1200);

// --- SkyResQ — simulation frame ONLY (see header) -----------------------
console.log("skyresq");
await image(D("Gazebo_Quad_Drone.png"), "skyresq/sim", 1400);

// --- Proof / credibility — TextileAsia, ICAT, expo ---------------------
console.log("proof");
for (const n of [1, 2, 3, 4, 5]) await image(D(`TextileAsia_Lahore/ta${n}.jpeg`), `proof/ta-${n}`, 1080, 76);
await image(D("ICAT - Robot.jpeg"), "proof/icat-robot", 1080, 76);
await image(D("expo at lahore booth pic.jpeg"), "proof/expo-booth", 1200, 74);
await image(D("expo at lahore with members.jpeg"), "proof/expo-team", 1200, 74);
await image(D("Discussion with clent at expo.jpeg"), "proof/client-talk", 1080, 76);

// --- Teaching / workshop ------------------------------------------------
console.log("teaching");
const WS = "Workshop At Lahore on AI & Computer vision";
await image(Z(`${WS}/WhatsApp Image 2026-08-08 at 3.36.23 PM.jpeg`), "teaching/podium-1", 1080, 76);
await image(Z(`${WS}/WhatsApp Image 2026-08-08 at 3.36.24 PM.jpeg`), "teaching/podium-2", 1080, 76);
await image(Z(`${WS}/WhatsApp Image 2026-08-08 at 3.45.04 PM.jpeg`), "teaching/certificate", 1200, 78);
await image(Z(`${WS}/WhatsApp Image 2026-08-08 at 3.45.04 PM (1).jpeg`), "teaching/badge", 1000, 78);

// --- Lab — standalone technique work ------------------------------------
console.log("lab");
await image(D("Car defect_1.jpg"), "lab/car-defect-1", 1400);
await image(D("Car_defect_2.jpg"), "lab/car-defect-2", 1400);
await image(D("honey-bee.jpg"), "lab/hornet", 1200);
await image(D("OC.jpg"), "lab/gate", 1400);
await image(D("Screenshot 2025-11-25 192957.png"), "lab/age-gender", 1100);
await image(D("Screenshot 2025-11-25 193315.png"), "lab/emotion", 1100);
await image(D("n8n_Automation_workflow.png"), "lab/n8n", 1400);
clip(D("lidar.mp4"), "lab/lidar", { start: 0, dur: 4, w: 640 });
clip(Z("Candy_Dt/CD.mp4"), "lab/candy", { start: 0, dur: 3, w: 720 });

fs.rmSync(TMP, { recursive: true, force: true });
console.log("\ndone — public/media/");
