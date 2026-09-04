# Drive + LinkedIn audit — 2026-08-25

Read with `CONTENT-ARCHITECTURE.md`. This replaces §5 of that file ("Things I
could not access"). Both sources have now been read directly.

---

## 1. The media assumption in `projects.ts` is wrong

`projects.ts` assumes a video per project (`/media/magicqc.mp4`, `/media/fabric.mp4`).
The Drive folder is named "Portfolio _ Vedios" but is **mostly stills**.

| Folder | Actual contents |
|---|---|
| `Size Measurement` (MagicQC) | 1 subfolder "Deployed Magic QC (MEB)" + 3 JPEGs. **No video.** |
| `FYP` (fabric defect) | 10 images — 2 real inference frames (`fabric_IOU_fusion_frame1022.jpg`, `frame_0092_..._panel.jpg`), 1 screenshot, 7 WhatsApp photos. **No video.** |
| `Drone HEXA` (SkyResQ) | **Empty.** |
| `DockVisionAI.mp4` | The only project video at top level. |
| `MY profile pic` | 2 AI-generated PNGs + 2 WhatsApp photos. |
| `ICAT`, `Visit at karachi`, `Visit at lahore`, `Workshop At Lahore` | Event/credibility photos, not project media. |

**Consequence:** make `media.video` genuinely optional in the card component and
render the poster when it is absent. Only `dock-vision-ai` gets a video on day one.
Do not hold the build waiting for videos that do not exist.

The two real inference frames in `FYP` are the most valuable images in the whole
Drive — they show the system working. Use `fabric_IOU_fusion_frame1022.jpg` as the
fabric-defect poster.

---

## 2. `UP-Videos` is the biggest untapped asset on this project

33 subfolders plus 15 loose videos, and **none of it appears in `projects.ts`**.

Loose videos, all demo-ready:
`Hamza_Age_Gender`, `Hamza_Emotion_Recognition`, `Hamza_Face_Blur`,
`Hamza_Gaze_Estimation`, `Hamza_Head_Posture_Detection`, `Hamza_OCR`,
`Hamza_Open_Pose_estimation`, `Hamza_Palm_Detection`,
`Hamza_Person_Segmentation_Deeplabv3`, `Hexa_UAV`, `interaction_detection_output`,
`interactive_tracking_output`, `linkedin_professional_output`.

Subfolders spanning ~33 distinct applications:
3D railway lidar, anomaly detection on parts, anti-collision depth, ball/bowling
tracking, cake cutting, candy detection, car defect, cold-drink counting, thermal
detection+tracking, driver monitoring, drone, gate-open software, licence plate
(×2 + OCR), object detection on Jetson, pothole, person re-ID, mall person
tracking, pig counting, railway track, robotic arm, safety rail, smoke detection,
vehicle counting.

**This changes the site's structure.** Nine written case studies plus a wall of
thirty-three working demos is a fundamentally stronger portfolio than nine case
studies alone — it is the difference between "I have done four things" and "I have
done this for a living."

Recommended: a new route `/lab` — a filterable grid of short looping clips, each
with a one-line caption and a domain tag (detection / tracking / OCR / depth /
anomaly / pose). No case study per item. No metrics per item. It is volume as
evidence, deliberately lightweight. Add a `demos: Demo[]` array to
`src/content/`, keyed by folder name.

Two cautions. Several of these are near-certainly **client work** — Jetson
deployments, railway lidar, pig counting are not hobby projects. Every clip needs
a clearance check against the same rule that already governs `magicqc` and
`industrial-pose-suite`. And thirty-three autoplaying videos will destroy the
motion budget in `CLAUDE.md §4`; lazy-mount via `IntersectionObserver`, poster-first,
play on hover only.

---

## 3. Headshot

`MY profile pic` holds two `ChatGPT Image ….png` files and two real photographs.

**Use a real photograph.** An AI-generated headshot on the portfolio of an AI
engineer whose entire pitch is "my systems work in the real world" undercuts the
pitch, and recruiters increasingly spot them. The WhatsApp photos need a crop and
a colour pass, nothing more.

---

## 4. Broken link, confirmed

`projects.ts` gives `ppe-safety-detection` the demo-video link
`drive.google.com/drive/folders/18whbCFOpdwCY5AiYg586mnqDIr0vKrvy`.

That folder is **`Size Measurement`** — MagicQC's media, not PPE's. Copy-paste
error. There is no PPE footage in the Drive at all. Remove the link.

---

## 5. LinkedIn recommendations — read, transcribed, real

Five received recommendations, all transcribed verbatim into `testimonials.ts`.
Nothing was written or paraphrased.

| Author | Relationship | Date | Value |
|---|---|---|---|
| Nasir Mehmood | Client | 2026-08-13 | **Strongest.** Names edge deployment in live industrial settings, an owned end-to-end cloud deployment, LLM/retrieval work, and ends with an explicit hiring recommendation. |
| Sami Uddin | Same team | 2026-08-10 | **Most credible.** A peer engineer writing "I never had to double-check his work" is worth more than any adjective. |
| Saira Gillani | Client | 2026-05-18 | Specific to LLM/RAG chatbot delivery — the only one that corroborates the agent work. |
| Mohammed Faisal Ghayas | Client | 2026-05-10 | Corroborates the safety/monitoring platform. Generic in wording. |
| Haris Ai | Same team | 2026-05-19 | Warm, generic. Cut first if the section runs long. |

Two things to fix before shipping:

- **`authorOrg` is not clean.** LinkedIn exposes a headline, not an employer field.
  Saira Gillani and Mohammed Faisal Ghayas are marked `'Client'` because inventing
  a company name is exactly the failure this file exists to prevent. Confirm each
  and correct it.
- **`source` is one shared URL** — the recommendations page, not a per-quote
  permalink. LinkedIn does not expose per-recommendation URLs. That is honest and
  verifiable, but a logged-out visitor sees a login wall. Acceptable; just know it.

**A gap worth closing.** All five speak to competence and reliability. None cite a
number. The strongest recommendation you could still get is one from a Robionix
supervisor confirming the MagicQC production figures — "500+ garments a day at 90%+
accuracy, running since 2025". One sentence from Dr. Awais Yasin, who appears as a
1st-degree connection and is Robionix's founder, would independently corroborate
the site's headline metric. That is the single highest-value ask left on this
project, and it costs one message.
