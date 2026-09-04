# Media inventory

Generated 2026-09-01 by Phase 1 of the media-pipeline prompt. Read-only —
nothing here was copied, encoded, or written into `assets/` or `public/`. Source: `docs/drive/`
(confirmed by Hamza as the real path; the master prompt's own copy said `assets/drive/`, which does
not exist and has been corrected in `MEDIA-PROMPT.md` on his end).

**54 media files inventoried** (41 images, 13 videos, 118.7 MB) across
the flat `docs/drive/` listing plus the three extracted zips. **11 files skipped** — 5 `.txt` briefs
(read as content input, never emitted as media), 3 zip archives themselves, and 2 explicitly excluded:
`freelance_client_leads.xlsx` (real people's contact data) and `Hamza_Basharat_CV_EY_MLEngineer.docx`
(non-shipping CV variant). Neither of those two appears anywhere below, and neither will appear in any
future pass of this script — the exclusion is by filename, in code, not a one-time filter.

`DRIVE-AUDIT.md` (Aug 25) is stale and was **not** used to drive this pass — see "Corrections against
DRIVE-AUDIT.md and the master prompt's source map" below, which is long, because the folder structure
that document and the prompt both assumed no longer exists.

## Full table

| Path | Type | Dimensions | Duration | FPS | Bitrate | Size | Audio |
|---|---|---|---|---|---|---|---|
| [zip] Candy_Dt/CD.mp4 | video | 1000×426 | 2.96s | 25 | 757 kbps | 273 KB | yes **[SHORT (<3s)]** |
| [zip] Size Measurement/Deployed Magic QC (MEB) karachi industry/WhatsApp Image 2026-08-08 at 3.22.45 PM.jpeg | image | 1280×963 | — | — | 14480 kbps | 71 KB | — |
| [zip] Size Measurement/Deployed Magic QC (MEB) karachi industry/WhatsApp Image 2026-08-08 at 3.22.46 PM.jpeg | image | 1280×963 | — | — | 17640 kbps | 86 KB | — |
| [zip] Size Measurement/Deployed Magic QC (MEB) karachi industry/WhatsApp Video 2026-08-08 at 3.22.41 PM.mp4 | video | 848×478 | 13.16s | 29.56 | 1932 kbps | 3.0 MB | yes |
| [zip] Size Measurement/Deployed Magic QC (MEB) karachi industry/WhatsApp Video 2026-08-08 at 3.22.44 PM.mp4 | video | 848×478 | 5.31s | 26.75 | 1910 kbps | 1.2 MB | yes |
| [zip] Size Measurement/half t shirt measurement.jpg | image | 963×1280 | — | — | 11149 kbps | 54 KB | — |
| [zip] Size Measurement/measurement.jpeg | image | 963×1280 | — | — | 13462 kbps | 66 KB | — |
| [zip] Size Measurement/trouser mesure ment.jpg | image | 1280×963 | — | — | 13234 kbps | 65 KB | — |
| [zip] Workshop At Lahore on AI & Computer vision/Copy of Copy of Lahore Workshop.png | image | 1587×2245 | — | — | — | 2.0 MB | — |
| [zip] Workshop At Lahore on AI & Computer vision/WhatsApp Image 2026-08-08 at 3.36.23 PM.jpeg | image | 1200×1600 | — | — | 40035 kbps | 195 KB | — |
| [zip] Workshop At Lahore on AI & Computer vision/WhatsApp Image 2026-08-08 at 3.36.24 PM.jpeg | image | 1200×1600 | — | — | 38672 kbps | 189 KB | — |
| [zip] Workshop At Lahore on AI & Computer vision/WhatsApp Image 2026-08-08 at 3.45.04 PM (1).jpeg | image | 963×1280 | — | — | 15210 kbps | 74 KB | — |
| [zip] Workshop At Lahore on AI & Computer vision/WhatsApp Image 2026-08-08 at 3.45.04 PM.jpeg | image | 1280×963 | — | — | 33919 kbps | 166 KB | — |
| docs/drive/Car defect_1.jpg | image | 2403×1067 | — | — | 155826 kbps | 761 KB | — |
| docs/drive/Car_defect_2.jpg | image | 2400×533 | — | — | 92900 kbps | 454 KB | — |
| docs/drive/Dashboard fabric software view.jpeg | image | 1536×695 | — | — | 28972 kbps | 141 KB | — |
| docs/drive/Discussion with clent at expo.jpeg | image | 1080×743 | — | — | 24640 kbps | 120 KB | — |
| docs/drive/Dock_Vision_AI_Dashboard.png | image | 1515×690 | — | — | — | 652 KB | — |
| docs/drive/Dock_VisionAI_Detection.png | image | 1517×700 | — | — | — | 667 KB | — |
| docs/drive/DockVisioAI_Analytics.png | image | 1517×692 | — | — | — | 251 KB | — |
| docs/drive/Drove upper view.png | image | 1767×1022 | — | — | — | 2.1 MB | — |
| docs/drive/expo at lahore booth pic.jpeg | image | 1280×960 | — | — | 48387 kbps | 236 KB | — |
| docs/drive/expo at lahore with members.jpeg | image | 1600×1066 | — | — | 66896 kbps | 327 KB | — |
| docs/drive/Fabric defect machine view.jpeg | image | 1600×900 | — | — | 52177 kbps | 255 KB | — |
| docs/drive/Fabric One page PPT brief img.png | image | 767×432 | — | — | — | 230 KB | — |
| docs/drive/fabric result view.jpeg | image | 1535×678 | — | — | 27765 kbps | 136 KB | — |
| docs/drive/fabric_IOU_fusion_frame1022.jpg | image | 563×563 | — | — | 16877 kbps | 82 KB | — |
| docs/drive/FBDT.mp4 | video | 1000×500 | 15s | 2 | 1001 kbps | 1.8 MB | no |
| docs/drive/Gazebo_Quad_Drone.png | image | 1658×897 | — | — | — | 293 KB | — |
| docs/drive/Hamza_Face_Blur.mp4 | video | 1278×668 | 20.03s | 30 | 3725 kbps | 8.9 MB | yes |
| docs/drive/Hamza_Gaze_Estimation.mp4 | video | 1678×970 | 43.37s | 30 | 7109 kbps | 36.8 MB | yes |
| docs/drive/Hamza_OCR.mp4 | video | 1022×998 | 15.9s | 30 | 4292 kbps | 8.1 MB | yes |
| docs/drive/Hamza_Palm_Detection.mp4 | video | 716×748 | 26.57s | 30 | 2453 kbps | 7.8 MB | yes |
| docs/drive/Hamza_Person_Segmentation_Deeplabv3.mp4 | video | 636×666 | 14.9s | 30 | 1887 kbps | 3.4 MB | yes |
| docs/drive/honey-bee.jpg | image | 1000×683 | — | — | 23215 kbps | 113 KB | — |
| docs/drive/ICAT - Robot.jpeg | image | 1280×963 | — | — | 16483 kbps | 80 KB | — |
| docs/drive/lidar.mp4 | video | 1000×664 | 5.06s | 10 | 937 kbps | 579 KB | yes **[frame0 dark (luma 23)]** |
| docs/drive/Mission.jpeg | image | 1600×900 | — | — | 68766 kbps | 336 KB | — |
| docs/drive/n8n_Automation_workflow.png | image | 1200×595 | — | — | — | 252 KB | — |
| docs/drive/Nexus_AI_RAG_Chatbot.png | image | 1532×692 | — | — | — | 206 KB | — |
| docs/drive/Nexus_architecture.png | image | 1245×377 | — | — | — | 53 KB | — |
| docs/drive/OC.jpg | image | 1593×929 | — | — | 35322 kbps | 172 KB | — |
| docs/drive/people count.png | image | 1391×740 | — | — | — | 1.3 MB | — |
| docs/drive/Profile.png | image | 1254×1254 | — | — | — | 1.8 MB | — |
| docs/drive/profile1.png | image | 1254×1254 | — | — | — | 1.8 MB | — |
| docs/drive/Recording 2025-09-19 231159.mp4 | video | 412×442 | 60.2s | 30 | 778 kbps | 5.6 MB | yes |
| docs/drive/Recording 2025-09-21 215704.mp4 | video | 412×442 | 174.07s | 30 | 914 kbps | 19.0 MB | yes |
| docs/drive/Safepulse_app_data_videos/Safepulse_front_1_mobile.jpeg | image | 720×1600 | — | — | 14772 kbps | 72 KB | — |
| docs/drive/Safepulse_app_data_videos/Safepulse_front_2_mobile.jpeg | image | 720×1600 | — | — | 10410 kbps | 51 KB | — |
| docs/drive/Safepulse_app_data_videos/Safepulse_front_3_mobile.jpeg | image | 720×1600 | — | — | 12502 kbps | 61 KB | — |
| docs/drive/Safepulse_app_data_videos/Safepulse_mobile_app.mp4 | video | 720×1280 | 16.67s | 30 | 2735 kbps | 5.4 MB | yes |
| docs/drive/Screenshot 2025-11-25 192957.png | image | 881×708 | — | — | — | 576 KB | — |
| docs/drive/Screenshot 2025-11-25 193315.png | image | 593×545 | — | — | — | 324 KB | — |
| docs/drive/Smoking_detect.png | image | 731×417 | — | — | — | 222 KB | — |

`[zip]` paths were extracted read-only to a scratch temp directory for inventory only — the zips
themselves are untouched in `docs/drive/`, and nothing was written back into the repo.

## Corrections against DRIVE-AUDIT.md and the master prompt's source map

The prompt's Phase 5 source map, and DRIVE-AUDIT.md, both describe a **nested** folder layout
(`UP-Videos/`, `Drone HEXA/`, `assets/drive/rag/`) with specific named files inside it.
**`docs/drive/` is now flat** — no such subfolders exist at all except `Safepulse_app_data_videos/`,
which is new. Every path below was checked directly, not inferred:

| Source map expected | Reality |
|---|---|
| `UP-Videos/Hexa_UAV.mp4` → skyresq-poster | **Does not exist.** No file with "hexa" in the name anywhere in `docs/drive/`. SkyResQ has only 3 stills: `Drove upper view.png`, `Gazebo_Quad_Drone.png`, `Mission.jpeg` — already held pending Hamza's per-file sign-off (defence-adjacent, CLAUDE §7). No video source exists to encode even if sign-off is given. |
| `UP-Videos/Hamza_Open_Pose_estimation .mp4` (space before extension) → pose-poster | **Does not exist under that name or any variant.** No "open_pose"/"openpose" match anywhere. The closest asset is `Hamza_Person_Segmentation_Deeplabv3.mp4` — a **different technique** (segmentation, not pose estimation) — and `Hamza_Palm_Detection.mp4`, also not pose estimation. There is no pose-estimation video in the current export. Flagging rather than substituting one of these under the wrong label. |
| `UP-Videos/Safety_Rail/` → ppe-poster | **Folder does not exist.** Closest PPE/safety-adjacent stills: `Smoking_detect.png`, `people count.png` — both plausible for the PPE/safety-detection project, neither confirmed as the intended asset. |
| `DockVisionAI.mp4` → dockvision-poster **and** dockvision.mp4/webm | **No video file exists.** Only three PNG screenshots: `DockVisioAI_Analytics.png`, `Dock_VisionAI_Detection.png`, `Dock_Vision_AI_Dashboard.png`. This directly contradicts the master prompt's Phase 6 instruction to *"ADD media.video to dock-vision-ai... This is the one project with a real clip"* — there is currently no clip to add. Treatment falls through to poster-only (single or collage from the three screenshots) unless a video surfaces elsewhere. |
| `assets/drive/rag/` → rag-poster, recruiter-poster | **No `rag/` folder.** Flat equivalents exist and are good matches: `Nexus_AI_RAG_Chatbot.png`, `Nexus_architecture.png`. |
| safepulse-poster: "MISSING. Report it. Do not invent one." | **No longer missing.** `Safepulse_app_data_videos/` (added Sep 1, after DRIVE-AUDIT.md was written) has 3 mobile screenshots (`Safepulse_front_1/2/3_mobile.jpeg`) plus `Safepulse_mobile_app.mp4` (16.67s, 30fps, frame-0 luma 143 — not dark). This is a real, usable source; confirmed by Hamza as something to check for in Phase 1. |

## New files not in DRIVE-AUDIT.md — flagged, not decided

Per instruction, not deciding what these are for — just naming what exists and where it sits:

- **`DockVisioAI_Analytics.png`, `Dock_VisionAI_Detection.png`, `Dock_Vision_AI_Dashboard.png`**
  (added Aug 29–30) — three screenshots for Dock Vision AI, using three different spellings of the
  project name in their filenames (`DockVisioAI` missing an "n", `Dock_VisionAI`, `Dock_Vision_AI`).
  Worth normalizing before anything references them, independent of which frame(s) get used.
- **`n8n_Automation_workflow.png`** (added Aug 29) — an n8n workflow diagram. Not tied to any project
  slug in `projects.ts` by name. Could be Nexus/RAG-adjacent (n8n is a common orchestration layer next
  to LangGraph) or could be unrelated tooling — genuinely ambiguous from the filename alone.
- **`Safepulse_app_data_videos/`** (added Sep 1, see above) — fills the previously-missing
  safepulse-poster gap.

## Filename oddities

- **Three spellings of one project name** in the Dock Vision AI screenshots (above) — the only
  filename-consistency issue found; nothing else in the 54-file set has a stray space, mismatched
  case, or duplicate-with-suffix pattern worth flagging.
- The master prompt specifically called out a space before `.mp4` on `Hamza_Open_Pose_estimation .mp4`
  — moot, since that file does not exist in this export (see table above).

## Videos under 3 seconds

- `[zip] Candy_Dt/CD.mp4` — 2.96s

`[zip] Candy_Dt/CD.mp4` at 2.96s is the only one. Not a defect — Candy_Dt isn't a `projects.ts` entry,
so this is out of scope for the nine case studies regardless.

## Corrupt or unreadable streams

None. All 13 videos and 41 images ffprobed cleanly — 0 errors across the full pass.

## Frame-0 darkness check

Sampled the true first decodable frame of every video via `signalstats` (mean luma, 0–255 scale;
flagged under 30 as likely black/fading-in and unsafe to use as a poster source without picking a
later frame in Phase 3):

- `docs/drive/lidar.mp4` — frame 0 luma 23

`lidar.mp4` is the one hit (luma 23) — consistent with a LiDAR point-cloud visualization, which is
plausibly dark-background by design rather than a bad capture. Worth a manual look before assuming
it needs a different start frame.

## Zip contents (extracted for inventory only)

- **`Size Measurement-...zip`** → `Size Measurement/` — 7 files, including a
  `Deployed Magic QC (MEB) karachi industry/` subfolder with 2 WhatsApp images and 2 WhatsApp videos.
  This is the **preferred magicqc-poster source** per the master prompt ("prefer a frame showing the
  deployed rig over a close-up") — `measurement.jpeg` (a closer shot) is also present as an alternative.
- **`Workshop At Lahore on AI & Computer vision-...zip`** → 5 files: 4 WhatsApp photos + one composed
  PNG (`Copy of Copy of Lahore Workshop.png`). Recognition/credibility material per the earlier stage
  brief, not project-gallery material.
- **`Candy_Dt-...zip`** → `Candy_Dt/CD.mp4` (2.96s) + `Candy.txt`. Not a `projects.ts` slug — no
  current home for this asset. Flagging its existence, not proposing where it goes.

## Excluded from the walk — confirmed absent below

- `freelance_client_leads.xlsx` — real third-party contact data. Not in the table above, not read,
  not copied anywhere.
- `Hamza_Basharat_CV_EY_MLEngineer.docx` — non-shipping CV variant. Not in the table above.

Both exclusions are enforced by filename match in `inventory.mjs`, not a manual skip — the same rule
will apply automatically if this script runs again later.
