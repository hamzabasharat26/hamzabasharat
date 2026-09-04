import type { Project } from './types'

// ---------------------------------------------------------------------------
// SOURCE OF TRUTH: Hamza_BasharatCV.pdf (Aug 2026) + its embedded links.
//
// Every number below is taken from the CV verbatim. Do not add a metric that
// is not in the CV or that you cannot defend in an interview — one inflated
// number invalidates the other eleven.
//
// Fields marked DRAFT are the ones only Hamza can fill. They are not optional:
// `limitations` is the single highest-signal block on the page for a senior
// reviewer, and an empty one reads as inexperience.
// ---------------------------------------------------------------------------

export const projects: Project[] = [
  {
    slug: 'magicqc',
    title: 'MagicQC',
    kicker: 'Textile QC platform — web + desktop',
    year: '2024-2026',
    role: 'Project Lead',
    org: 'Robionix Technologies',
    status: 'production',
    domains: ['computer-vision', 'mlops', 'full-stack'],

    problem:
      'Finished garments are size-checked by hand with a tape measure, so QC is slow, inconsistent between operators, and impossible to audit after the fact — and the brands, operators and purchase orders behind that QC line have no system of record at all.',

    approach: [
      'Built an automated size-measurement pipeline that extracts each piece’s dimensions from a fixed-camera capture, replacing manual tape measurement.',
      'Served the model behind a FastAPI inference API, containerised with Docker and deployed live on AWS EC2 for continuous production use.',
      'Delivered it as a complete solution, not just a model: a desktop measurement app (Electron.js + FastAPI + the CV pipeline) on the factory floor, and a web app (Laravel/PHP + Vue + React/TypeScript) for brand, operator and purchase-order management — the two talk to each other over a GraphQL API. Both are running in production in the textile industry.',
      'Led the project end to end - dataset curation, training, API design, deployment and monitoring - rather than handing a notebook to someone else.',
      'Hardened the loop for real conditions: throughput at production volume rather than benchmark-set accuracy.',
      // DRAFT for Hamza: the workshop flyer also shows a MagicQC roundness/
      // tolerance check (a ball inspected to ~0.8 mm deviation, pass/fail).
      // Confirm whether that shipped as part of the same MagicQC deployment
      // before wording it as a bullet here.
    ],

    // DRAFT for Hamza: you asked to remove the "500+ garments/day" and
    // "AI-based garment size measurement" framing as the project's identity —
    // done above (kicker/problem/approach now lead with the full web+desktop
    // platform). I did NOT delete the 500+/90%+ numbers below: they're real,
    // CV-backed measured outcomes (CLAUDE.md §2 - never drop verified proof
    // without being told to specifically), so I kept them as supporting
    // evidence and added the platform-delivery line instead. Say the word if
    // you want them gone outright.
    outcome: [
      { label: 'Delivery', value: 'Web + desktop', note: 'Both in production, linked over a GraphQL API.' },
      { label: 'Pieces / day', value: '500+', note: 'Sustained production volume on the deployed measurement system.' },
      { label: 'Measurement accuracy', value: '90%+' },
      { label: 'Deployment', value: 'Live on EC2', note: 'Not a demo - running against a real line.' },
    ],

    // DRAFT - replace with what you actually observed in production.
    // Good limitations are specific and technical: lighting, fabric type,
    // occlusion, pose, drift over time, throughput ceiling.
    limitations: [
      'DRAFT: which fabrics, colours or drape conditions degrade the measurement, and by roughly how much.',
      'DRAFT: what the system requires of the capture rig (fixed height, backdrop, lighting) to hold accuracy.',
      'DRAFT: what happens on garment types outside the trained catalogue.',
    ],

    stack: [
      'PyTorch', 'OpenCV', 'FastAPI', 'Electron.js', 'Docker', 'AWS EC2', 'Python',
      'GraphQL', 'Laravel', 'PHP', 'Vue.js', 'React', 'TypeScript', 'Tailwind CSS',
    ],

    links: [
      { label: 'Live site', href: 'https://magicqc.online', kind: 'demo' },
    ],

    // A gallery cycles through the deployed system: the measurement UI calling
    // PASS with the garment dimensions on screen, the rig running on the MEB
    // Karachi floor (photo + a 5s clip), the web app (brand/operator/PO
    // management), the desktop measurement app, the TextileAsia stand, and the
    // product site Hamza built. Every asset is cleared by the confidential
    // note below. The desktop-app screenshot is cropped to the measurement
    // panel only — the source frame showed real third-party brand logos
    // (Adidas, Puma, Under Armour, Reebok, Zara …) configured as sample
    // brands, and those are not cleared to publish (CLAUDE §7).
    media: {
      poster: '/media/magicqc/measure.jpg',
      alt: 'The MagicQC size-measurement system returning a PASS with per-panel garment dimensions, and the deployed rig running on the MEB Karachi production floor.',
      gallery: [
        { kind: 'image', src: '/media/magicqc/measure.jpg', caption: 'The measurement view: a shirt checked to spec, PASS, every panel dimension in centimetres.' },
        { kind: 'clip', src: '/media/magicqc/rig.jpg', webm: '/media/magicqc/rig.webm', mp4: '/media/magicqc/rig.mp4', caption: 'The rig running on the MEB Karachi floor — a garment placed, measured, graded in seconds.' },
        { kind: 'image', src: '/media/magicqc/web-dashboard.jpg', caption: 'The web app: brands, operators and purchase orders — the management side of the platform.', fit: 'contain' },
        { kind: 'image', src: '/media/magicqc/desktop.jpg', caption: 'The desktop app: live per-panel measurement against tolerance, on the factory floor.', fit: 'contain' },
        { kind: 'image', src: '/media/magicqc/rig-1.jpg', caption: 'The deployed MagicQC station on the production line at MEB Karachi.' },
        { kind: 'image', src: '/media/magicqc/measure-shirt.jpg', caption: 'A second garment type checked to the same tolerance — PASS.' },
        { kind: 'image', src: '/media/magicqc/measure-trouser.jpg', caption: 'Trouser measurement, paused mid-check, dimensions held on screen for the operator.' },
        { kind: 'image', src: '/media/magicqc-exhibit.jpg', caption: 'The MagicQC stand at TextileAsia, Lahore Expo Centre.' },
        { kind: 'image', src: '/media/magicqc-site.jpg', caption: 'The MagicQC product site Hamza built — magicqc.online.' },
      ],
    },

    featured: true,
    confidential:
      'Client system. Source is not public; the metrics, the deployed-rig photography and the public product site are what can be shown.',
  },

  {
    slug: 'rallylens',
    title: 'RallyLens',
    kicker: 'Sports analytics — computer vision',
    // DRAFT for Hamza: confirm the year(s) — going by "2026" since that is
    // when this entry was added; correct if the repo predates that.
    year: '2026',
    role: 'Creator — solo project',
    org: 'Independent',
    status: 'research',
    domains: ['computer-vision', 'edge-ai'],

    problem:
      'Most tennis computer-vision systems assume a fixed camera, a regulation court, labelled training data and a GPU. Real coaching footage — a handheld camera, a driveway wall, no dataset — has none of those, so the tooling that exists does not run on it.',

    approach: [
      'Runs zero-shot on real footage: YOLO11x and YOLO11x-pose (COCO-pretrained) for player detection and pose, with no tennis-specific fine-tuning.',
      'Tracks players with BoT-SORT and ReID embeddings, and recovers the small, fast ball through ROI-gated SAHI tiling, camera-motion-compensated residual detection and Kalman filtering — engineered around the ball-detection problem rather than trained around it.',
      'Calibrates a moving, non-regulation camera with OpenCV homography (ORB/SIFT + RANSAC) and a one-time manual court/wall annotation, so pans and zooms do not break tracking.',
      'Calls bounces, impacts and wall-target hits with physics-based rules instead of a black-box classifier, so every event is explainable, and scores coaching accuracy against painted wall targets by dual-plane geometry.',
      'Delivers an annotated H.264 video through FastAPI and Streamlit, run entirely on CPU.',
    ],

    // Every number here is the project's own reported test, not a benchmark
    // claim — from a single 630-frame (21s) CPU-only clip. Reported as-is,
    // coverage included, because that honesty is the point of this section.
    outcome: [
      { label: 'Ball speed range', value: '22.8–76.1', note: 'km/h, measured on a 21s CPU-only test clip.' },
      { label: 'Ball track coverage', value: '36.3%', note: '229/630 frames — recovered by tiling, motion residual and Kalman prediction where YOLO alone misses it.' },
      { label: 'Pipeline runtime', value: '~13 min', note: 'Full pipeline, CPU-only, for the 21s clip.' },
    ],

    limitations: [
      'Tested on a single 21-second clip — no multi-clip generalisation evidence yet.',
      'Ball track coverage is 36.3%: for most of the clip the ball position is inferred (tiling / motion residual / Kalman), not directly detected by YOLO.',
      'Court and wall-target geometry is still annotated once, by hand — automatic court-line detection is on the roadmap, not built yet.',
    ],

    stack: ['YOLO11x', 'YOLO11x-pose', 'Ultralytics', 'BoT-SORT', 'ReID', 'OpenCV', 'SAHI', 'Kalman filtering', 'FastAPI', 'Streamlit'],

    links: [
      { label: 'Source', href: 'https://github.com/hamzabasharat26/RallyLens', kind: 'code' },
    ],

    media: {
      poster: '/media/rallylens/hero.jpg',
      alt: 'RallyLens tracking four players and the ball on a tennis court, with per-player role labels, ball speed and rally/shot/bounce counts overlaid.',
      gallery: [
        { kind: 'image', src: '/media/rallylens/hero.jpg', caption: 'Live overlay: players tracked by role (coach / student), ball speed, rally and shot counts, wall-target distance.' },
        { kind: 'image', src: '/media/rallylens/dashboard.jpg', caption: 'The full analytics dashboard — ball speed, wall-target geometry, per-player shot counts, bird’s-eye map and event timeline.' },
      ],
    },

    featured: true,
  },

  {
    slug: 'fabric-defect-detection',
    title: 'AI-Enabled Fabric Defect Detection',
    kicker: 'Textile inspection - MEB Karachi',
    year: '2025-2026',
    role: 'Final Year Project - lead engineer',
    org: 'NUTECH x MEB Karachi',
    status: 'evaluation',
    domains: ['computer-vision', 'edge-ai'],

    problem:
      'Fabric defects are caught by human inspectors watching moving cloth, so rare and unfamiliar defect types slip through and nothing is logged for the mill to act on.',

    approach: [
      'Fused two complementary detectors: supervised YOLO classification for known defect classes, and PatchCore anomaly detection to catch defect types absent from the training set.',
      'Curated a 1,400+ image dataset of real fabric defects rather than using a public benchmark.',
      'Deployed to an OAK-1W edge camera so inspection runs at the loom instead of round-tripping to a server.',
      'Wrapped it in a shippable product, not a script: an Electron + React desktop app over a FastAPI/SQLite backend, running entirely on-premise with no cloud dependency.',
      'Scored rolls automatically against the 4-Point grading standard used by the industry, with pass/fail grading, role-based access for admin/operator/viewer, and audit-grade PDF reports with full traceability.',
      'Added OEE tracking and optional MQTT telemetry, off by default.',
    ],

    outcome: [
      { label: 'mAP50', value: '0.81', note: 'Supervised YOLO branch on the curated defect set.' },
      { label: 'Dataset size', value: '1,400+', note: 'Hand-curated real defect images.' },
      { label: 'Inference', value: 'On-camera', note: 'OAK-1W edge deployment, no server round trip.' },
      { label: 'Grading', value: '4-Point standard', note: 'Automatic penalty scoring and pass/fail, on-premise.' },
      { label: 'Status', value: 'Multi-site evaluation' },
    ],

    limitations: [
      'DRAFT: PatchCore anomaly scoring is sensitive to lighting and texture shifts not represented in the reference set - say what that cost you in false positives.',
      'DRAFT: which defect classes the supervised branch is weakest on, and the class imbalance behind it.',
      'DRAFT: the throughput ceiling on OAK-1W and the loom speed it implies.',
    ],

    stack: ['YOLO', 'PatchCore', 'OAK-1W / DepthAI', 'PyTorch', 'FastAPI', 'Electron', 'React', 'SQLite', 'Python'],

    links: [
      { label: 'Source', href: 'https://github.com/hamzabasharat26/Automated-Fabric-Defect-Detection-System', kind: 'code' },
    ],

    // Gallery: the four-panel fusion frame, the live anomaly heatmap clip
    // (FBDT.mp4), the operator dashboard, the physical inspection rig on the
    // floor, and the live camera view with a detection drawn on moving cloth.
    // Source: docs/drive/ (FBDT.mp4, Dashboard fabric software view, Fabric
    // defect machine view, fabric result view).
    media: {
      poster: '/media/fabric-poster.jpg',
      alt: 'Four-panel fusion output on woven fabric: raw camera frame, PatchCore anomaly heatmap, YOLO detections, and the fused result with confidence scores.',
      gallery: [
        { kind: 'image', src: '/media/fabric-poster.jpg', caption: 'One frame, four stages: raw cloth, PatchCore anomaly heatmap, YOLO detections, fused result.' },
        { kind: 'clip', src: '/media/fabric/detect.jpg', webm: '/media/fabric/detect.webm', mp4: '/media/fabric/detect.mp4', caption: 'The anomaly branch running live — defects flare on the heatmap as the cloth moves.' },
        { kind: 'image', src: '/media/fabric/dashboard.jpg', caption: 'The operator dashboard: roll statistics, 4-point penalty score, defect log, pass/fail.' },
        { kind: 'image', src: '/media/fabric/machine.jpg', caption: 'The inspection rig on the floor — camera and lighting over the fabric roll, operator PC alongside.' },
        { kind: 'image', src: '/media/fabric/result.jpg', caption: 'The live inspection camera view with a detection boxed on moving cloth.' },
      ],
    },

    featured: true,
  },

  {
    slug: 'skyresq',
    title: 'SkyResQ',
    kicker: 'Autonomous UAV disaster response',
    year: '2025',
    role: 'AI & UAV Engineer (Intern)',
    org: 'NESCOM, National Development Complex',
    status: 'research',
    domains: ['computer-vision', 'edge-ai'],

    problem:
      'In a disaster zone, finding people fast is the whole problem, and a human pilot watching a UAV feed cannot search a wide area quickly or reliably.',

    approach: [
      'Built detection and tracking pipelines in Python/OpenCV for aerial perception under the conditions a search UAV actually flies in.',
      'Validated the stack in Gazebo simulation before flight, with integration testing across the perception and control layers.',
      'Presented results directly to Pakistani government stakeholders evaluating the system for national emergency preparedness.',
    ],

    outcome: [
      { label: 'Evaluated by', value: 'NESCOM / NDC', note: 'Pakistan national defence research organisation.' },
      { label: 'Validation', value: 'Gazebo + flight', note: 'Simulation-first, then integration testing.' },
      { label: 'Audience', value: 'Government stakeholders' },
    ],

    limitations: [
      'DRAFT: altitude and ground-sample-distance band where detection holds, and where it falls apart.',
      'DRAFT: what simulation did not capture that real flight did.',
    ],

    stack: ['Python', 'OpenCV', 'Gazebo', 'PX4 SITL', 'MAVSDK', 'ROS2'],

    links: [
      { label: 'Source', href: 'https://github.com/hamzabasharat26/UAV-simulation-Gazebo-Q-Ground', kind: 'code' },
    ],

    // Two frames: the Gazebo sim, and the real airframe photo — Hamza
    // explicitly cleared "Drove upper view.png" to publish (2026-09-03). The
    // other Drive still (a mission-planning screenshot over a real named site
    // with live GPS waypoints) is still held out on the CLAUDE §7 check —
    // that one needs its own sign-off before it ships.
    media: {
      poster: '/media/skyresq/sim.jpg',
      alt: 'Gazebo simulation of the UAV airframe used to validate the perception stack before flight, and the physical hexacopter airframe.',
      gallery: [
        { kind: 'image', src: '/media/skyresq/sim.jpg', caption: 'Gazebo simulation of the UAV airframe, used to validate the perception stack before flight.' },
        { kind: 'image', src: '/media/skyresq/airframe.jpg', caption: 'The physical hexacopter airframe, built for the perception payload.' },
      ],
    },

    featured: true,
    confidential:
      'Defence-adjacent work. Keep the public description at the level the CV already states and no further.',
  },

  {
    slug: 'dock-vision-ai',
    title: 'Dock Vision AI',
    kicker: 'Dock operations analytics',
    year: '2024',
    role: 'Engineer',
    org: 'IEEE Hackathon to commercial deployment',
    status: 'competition',
    domains: ['computer-vision'],

    // Copy re-grounded 2026-09 to match the three screenshots Hamza confirmed
    // for this project (docs/drive/Dock_VisionAI_Detection.png etc): a
    // truck-dock turnaround analytics platform - live detection feed, event
    // feed, turnaround-stage timing, an executive view. The wording below only
    // describes what those screenshots plainly show.
    // DRAFT for Hamza: confirm the hackathon origin - was the IEEE 2024 entry
    // this dock-operations system, or a maritime/berth version that later
    // pivoted? The old copy said "vessel docking, hull and berth".
    problem:
      'A loading dock’s turnaround - gate, docked, unloading, gone - is tracked by eye and on clipboards, so a slow stage is only noticed after the truck has left and the detention charge has already landed.',

    approach: [
      'Built a real-time video-analytics system that watches the dock feed, detects the people and vehicles in frame, and calls each stage of a truck’s turnaround as it happens.',
      'Wrapped it in an operations view, a supervisor view and an executive dashboard - a live event feed, turnaround-stage timing, and the cost of the delays it flags.',
      'Took it from an IEEE hackathon build to a paid commercial deployment - the part most competition projects never reach.',
    ],

    outcome: [
      { label: 'Placement', value: '1st place', note: 'IEEE Hackathon 2024.' },
      { label: 'Afterlife', value: 'Paid deployment', note: 'Converted into a commercial installation.' },
    ],

    limitations: [
      'DRAFT: camera angle, lighting and dock layouts the stage detection was not validated on.',
      'DRAFT: how the turnaround-stage calls degrade when two trucks are worked at once.',
    ],

    stack: ['Python', 'OpenCV', 'Object detection', 'Video analytics'],

    links: [
      { label: 'Source', href: 'https://github.com/hamzabasharat26/DockVision-AI', kind: 'code' },
    ],

    // Three real product screenshots, cycled with captions. poster = the
    // detection view. Source: docs/drive/Dock_Vision*.png.
    media: {
      poster: '/media/dockvision-1.jpg',
      alt: 'The DockVision AI operations view - a live dock-camera feed with a detected worker boxed, beside a running event feed of the truck’s turnaround stages.',
      gallery: [
        { kind: 'image', src: '/media/dockvision-1.jpg', caption: 'Operations view: the live dock feed with people and vehicles detected, beside the turnaround event feed.' },
        { kind: 'image', src: '/media/dockvision-2.jpg', caption: 'Turnaround-stage timing — how long the truck sat at each stage of the dwell.' },
        { kind: 'image', src: '/media/dockvision-3.jpg', caption: 'The executive dashboard: detention cost and the delays that drove it.' },
      ],
    },

    featured: true,
  },

  {
    slug: 'cv-recruiter-rag',
    title: 'CV Recruiter RAG Agent',
    kicker: 'Hiring workflow automation',
    year: '2025',
    role: 'Engineer',
    org: 'Independent',
    status: 'research',
    domains: ['llm-agents'],

    problem:
      'Screening a stack of CVs against one job description is slow, inconsistent, and the reasoning behind a rejection is never written down.',

    approach: [
      'Parses PDF and DOCX CVs into a vector store, then ranks candidates against a job description.',
      'Every score is citation-backed - the agent points at the line in the CV that justified it, so a decision can be audited.',
      'Orchestrated with LangGraph over the Claude API, served through FastAPI.',
    ],

    outcome: [
      { label: 'Scoring', value: 'Citation-backed', note: 'Each ranking traces to source text.' },
      { label: 'Inputs', value: 'PDF + DOCX' },
    ],

    limitations: [
      'DRAFT: how the agent behaves on CVs in unusual layouts or scanned images.',
      'DRAFT: what you did about the obvious bias risk in automated candidate ranking - reviewers will ask.',
    ],

    stack: ['LangGraph', 'Claude API', 'FAISS', 'FastAPI', 'Python'],

    // BROKEN LINK - ACTION NEEDED.
    // The CV's "Code" link for this project points at
    //   github.com/hamzabasharat26/CV-Projects/tree/main/assets/images
    // I checked it: that repo is coursework plus an old portfolio page. It does
    // NOT contain the RAG agent. Until this project has a real public repo,
    // `links` stays empty and the card renders without a source link - which is
    // honest. Push the code, then add the URL here AND fix it on the CV.
    links: [],

    // A built UI mockup of the ranking output (public/media/recruiter/ranking.svg)
    // — job description in, candidates ranked out, every score pointing back at
    // the CV line that justified it. Clearly an illustration, not a screenshot;
    // there is no public capture of the running agent yet.
    media: {
      poster: '/media/recruiter/ranking.svg',
      alt: 'The CV Recruiter ranking view: a job description on the left, candidates ranked by match score on the right, each score citing the exact line in the CV that earned it.',
    },

    featured: false,
  },

  {
    slug: 'ppe-safety-detection',
    title: 'Real-Time PPE & Workplace Safety Detection',
    kicker: 'Industrial safety monitoring',
    year: '2025',
    role: 'AI Engineer (Contract)',
    org: 'Essenceware Technologies',
    status: 'production',
    domains: ['computer-vision', 'mlops'],

    problem:
      'Safety compliance on a work site is checked by supervisors who cannot watch every area at once, so violations are found after an incident rather than before.',

    approach: [
      'Trained and deployed real-time PPE detection, then handed it off with inference dashboards and model versioning so the client could operate it without me.',
      'Shipped an accompanying pose-estimation and activity-monitoring module into the Essenceware product stack.',
    ],

    outcome: [
      { label: 'Delivery', value: 'Trained to handed off' },
      { label: 'Operability', value: 'Versioned + dashboarded' },
    ],

    limitations: [
      'DRAFT: camera placement and crowd-density conditions where detection degrades.',
    ],

    stack: ['PyTorch', 'FastAPI', 'Flask', 'Streamlit', 'Python'],

    // Link removed: it pointed at drive.google.com/.../18whbCFOpdwCY5AiYg586mnqDIr0vKrvy,
    // which is MagicQC's "Size Measurement" folder, not PPE media - a confirmed
    // copy-paste error (DRIVE-AUDIT.md §4, HANDOFF.md §2). Card renders without
    // an external link, which is honest.
    links: [],

    // Real detection footage now exists (docs/drive/Recording 2025-09-*.mp4):
    // hi-vis / helmet / mask compliance called per worker, plus the crowd-count
    // and smoking-detection stills from the activity-monitoring module.
    // DRAFT for Hamza: confirm the two Recording clips are from the Essenceware
    // engagement and are OK to show (they look like a test capture, not a
    // client site) — say the word and they stay, or name a safer clip.
    media: {
      poster: '/media/ppe/detect.jpg',
      alt: 'Real-time PPE detection calling hi-vis vest, helmet and mask compliance on each worker in a site camera feed.',
      gallery: [
        { kind: 'clip', src: '/media/ppe/detect.jpg', webm: '/media/ppe/detect.webm', mp4: '/media/ppe/detect.mp4', caption: 'PPE compliance called per worker in real time — hi-vis vest present, flagged when it is not.' },
        { kind: 'image', src: '/media/ppe/crowd-count.jpg', caption: 'The activity-monitoring module: 28 people in frame, 42 unique IDs held across the scene.' },
        { kind: 'image', src: '/media/ppe/smoking.jpg', caption: 'Prohibited-action detection — a lit cigarette flagged on the floor.' },
      ],
    },

    featured: false,
  },

  {
    slug: 'industrial-pose-suite',
    title: 'Industrial Detection & Pose-Estimation Suite',
    kicker: 'Edge inference on constrained hardware',
    year: '2024-2026',
    role: 'AI & Computer Vision Engineer',
    org: 'Robionix Technologies',
    status: 'production',
    domains: ['computer-vision', 'edge-ai'],

    problem:
      'Industrial vision has to run on whatever hardware is already bolted to the line - a GPU server is rarely on offer.',

    approach: [
      'YOLOv8 detection plus keypoint pose estimation, tuned to hold accuracy inside an embedded compute budget.',
      'Optimised the inference path for constrained edge hardware rather than assuming a datacentre GPU.',
    ],

    outcome: [
      { label: 'mAP', value: '92%+' },
      { label: 'Throughput', value: '15+ FPS', note: 'On constrained edge hardware.' },
    ],

    limitations: [
      'DRAFT: the accuracy you traded away to hit 15 FPS, and on which classes.',
    ],

    stack: ['YOLOv8', 'ONNX', 'PyTorch', 'Embedded inference'],

    links: [],

    // The client system's own footage stays private (see note below). This
    // gallery is Hamza's own pose-keypoint demo — the technique the suite is
    // built on — plus two stills. Source: docs/drive/Hamza_Open_Pose_estimation.
    media: {
      poster: '/media/pose/track.jpg',
      alt: 'Full-body pose keypoint tracking — the estimation technique behind the industrial detection and pose suite.',
      gallery: [
        { kind: 'clip', src: '/media/pose/track.jpg', webm: '/media/pose/track.webm', mp4: '/media/pose/track.mp4', caption: 'Full-body keypoint tracking holding through movement — the pose branch of the suite.' },
        { kind: 'image', src: '/media/pose/still-1.jpg', caption: 'Skeleton overlay: torso, limbs and face landmarks resolved per frame.' },
        { kind: 'image', src: '/media/pose/still-2.jpg', caption: 'The same estimator tracking a changed stance without losing the joints.' },
      ],
    },

    featured: false,
    confidential: 'Client system. Metrics are shareable; the deployed footage may not be — the demo shown here is Hamza’s own.',
  },

  {
    slug: 'enterprise-rag-agents',
    title: 'Enterprise RAG & Conversational Agents',
    kicker: 'Knowledge-base search in production backends',
    year: '2024-2026',
    role: 'AI Engineer',
    org: 'Robionix Technologies',
    status: 'production',
    domains: ['llm-agents', 'full-stack'],

    problem:
      'Company knowledge sits in documents nobody can find, and a chatbot that hallucinates the answer is worse than no chatbot.',

    approach: [
      'Built RAG pipelines over vector databases with LangChain and LangGraph, driven by the Claude and OpenAI APIs.',
      'Served them as inference REST APIs consumed by existing Laravel, React and MySQL production backends - integration into a live stack, not a standalone demo.',
    ],

    outcome: [
      { label: 'Integration', value: 'REST into Laravel + React' },
      { label: 'Retrieval', value: 'Vector-backed', note: 'FAISS / Chroma.' },
    ],

    limitations: [
      'DRAFT: your actual grounding failure rate and what you did about it.',
    ],

    stack: ['LangChain', 'LangGraph', 'Claude API', 'OpenAI API', 'FAISS', 'Chroma', 'FastAPI', 'MySQL'],

    links: [],

    // The Nexus knowledge chatbot: a company-policy question answered with
    // FAISS-backed citations, plus the end-to-end data-flow diagram
    // (User → Chat UI → FastAPI → FAISS → LLaMA 3 → response).
    // Source: docs/drive/Nexus_AI_RAG_Chatbot.png, Nexus_architecture.png.
    media: {
      poster: '/media/rag-poster.jpg',
      alt: 'The Nexus RAG chatbot answering a company-policy question with FAISS retrieval results and source citations shown alongside.',
      gallery: [
        { kind: 'image', src: '/media/rag-poster.jpg', caption: 'A policy question answered with the exact source chunks cited alongside — grounded, not guessed.' },
        { kind: 'image', src: '/media/rag/architecture.jpg', caption: 'The end-to-end flow: chat UI → FastAPI → FAISS vector search → LLaMA 3 → grounded response.' },
      ],
    },

    featured: false,
  },

  {
    slug: 'safepulse',
    title: 'SafePulse',
    kicker: 'Emergency alerting',
    year: '2024',
    role: 'Full-stack developer',
    org: 'Independent',
    status: 'research',
    domains: ['full-stack'],

    problem:
      'In an emergency the useful thing is not a phone call - it is your location in someone else hands within seconds.',

    approach: [
      'Shipped a real-time emergency-alert application end to end, with live geolocation and push notifications.',
    ],

    outcome: [{ label: 'Scope', value: 'Shipped end to end' }],

    limitations: ['DRAFT: what it does when the network drops - the exact case it exists for.'],

    stack: ['React', 'Node.js', 'Push notifications', 'Geolocation API'],

    links: [{ label: 'Source', href: 'https://github.com/hamzabasharat26/safepulse', kind: 'code' }],

    // The app clip (docs/drive/Safepulse_app_data_videos/Safepulse_mobile_app.mp4,
    // t=7-10s: "Detecting → coordinates found → Send tapped → confirmed") plus
    // the three real app screens from the same folder.
    media: {
      poster: '/media/safepulse-poster.jpg',
      video: { webm: '/media/safepulse.webm', mp4: '/media/safepulse.mp4' },
      alt: 'SafePulse emergency card sharing a live GPS location, confirmed sent to emergency contacts.',
      gallery: [
        { kind: 'clip', src: '/media/safepulse-poster.jpg', webm: '/media/safepulse.webm', mp4: '/media/safepulse.mp4', caption: 'The core loop: location detected, coordinates found, Send tapped, delivery confirmed.' },
        { kind: 'image', src: '/media/safepulse/screen-1.jpg', caption: 'The emergency card a contact receives — masked details, one tap to reveal.', fit: 'contain' },
        { kind: 'image', src: '/media/safepulse/screen-2.jpg', caption: 'Emergency contacts set up ahead of time, ready before they are needed.', fit: 'contain' },
        { kind: 'image', src: '/media/safepulse/screen-3.jpg', caption: 'Live location sharing with the contact, updating in place.', fit: 'contain' },
      ],
    },

    featured: false,
  },
]

export const featuredProjects = projects.filter((p) => p.featured)
export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug)
