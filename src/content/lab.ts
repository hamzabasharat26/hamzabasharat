import type { LabItem } from './types'

// ---------------------------------------------------------------------------
// "In the lab" — the technique wall. Volume as evidence: each item is one
// computer-vision technique shown working, with a plain label and a domain
// tag. No case study, no metrics, no client names.
//
// Sources: Hamza's own demo clips (docs/drive/Hamza_*.mp4) and standalone
// freelance builds, each described by its own brief in docs/drive/*.txt.
// Every clip is muted, <=6s, encoded by scripts/build-media.mjs, and mounts
// only on hover (CLAUDE §4). Still-only items carry no video at all.
// ---------------------------------------------------------------------------

export const lab: LabItem[] = [
  {
    slug: 'ocr',
    label: 'Licence-plate OCR',
    technique: 'ocr',
    poster: '/media/demos/ocr.jpg',
    clip: { webm: '/media/demos/ocr.webm', mp4: '/media/demos/ocr.mp4' },
    alt: 'YOLOv8 locating a vehicle number plate and PaddleOCR reading the characters off it in real time.',
  },
  {
    slug: 'segmentation',
    label: 'Person segmentation',
    technique: 'segmentation',
    poster: '/media/demos/segmentation.jpg',
    clip: { webm: '/media/demos/segmentation.webm', mp4: '/media/demos/segmentation.mp4' },
    alt: 'DeepLabV3 segmenting a walking person from the background frame by frame.',
  },
  {
    slug: 'palm',
    label: 'Hand keypoint tracking',
    technique: 'tracking',
    poster: '/media/demos/palm.jpg',
    clip: { webm: '/media/demos/palm.webm', mp4: '/media/demos/palm.mp4' },
    alt: 'Twenty-one hand landmarks tracked across a moving hand.',
  },
  {
    slug: 'faceblur',
    label: 'Face anonymisation',
    technique: 'detection',
    poster: '/media/demos/faceblur.jpg',
    clip: { webm: '/media/demos/faceblur.webm', mp4: '/media/demos/faceblur.mp4' },
    alt: 'Faces detected and blurred automatically as people move through the frame.',
  },
  {
    slug: 'gaze',
    label: 'Gaze estimation',
    technique: 'pose',
    poster: '/media/demos/gaze.jpg',
    clip: { webm: '/media/demos/gaze.webm', mp4: '/media/demos/gaze.mp4' },
    alt: 'Head pose and gaze direction estimated from a webcam feed and drawn as a vector.',
  },
  {
    slug: 'openpose',
    label: 'Full-body pose tracking',
    technique: 'pose',
    poster: '/media/pose/track.jpg',
    clip: { webm: '/media/pose/track.webm', mp4: '/media/pose/track.mp4' },
    alt: 'Full-body skeletal keypoints — torso, limbs, face — tracked frame to frame as a person moves.',
  },
  {
    slug: 'fabric-anomaly',
    label: 'Fabric anomaly heatmap',
    technique: 'anomaly',
    poster: '/media/fabric/detect.jpg',
    clip: { webm: '/media/fabric/detect.webm', mp4: '/media/fabric/detect.mp4' },
    alt: 'Woven fabric beside its PatchCore anomaly heatmap, defects lighting up as the cloth moves.',
  },
  {
    slug: 'candy-count',
    label: 'Conveyor counting',
    technique: 'tracking',
    poster: '/media/lab/candy.jpg',
    clip: { webm: '/media/lab/candy.webm', mp4: '/media/lab/candy.mp4' },
    alt: 'Chocolates tracked and tallied in and out of frame as they move along a conveyor.',
  },
  {
    slug: 'lidar-lane',
    label: '3D LiDAR lane lines',
    technique: 'depth',
    poster: '/media/lab/lidar.jpg',
    clip: { webm: '/media/lab/lidar.webm', mp4: '/media/lab/lidar.mp4' },
    alt: 'Lane lines extracted from a LiDAR point cloud with threshold and region-of-interest filtering.',
  },
  {
    slug: 'crowd-count',
    label: 'Crowd counting + re-ID',
    technique: 'tracking',
    poster: '/media/ppe/crowd-count.jpg',
    alt: 'Twenty-eight people detected in one frame with 42 unique tracking IDs held across the scene.',
  },
  {
    slug: 'vehicle-damage',
    label: 'Vehicle damage segmentation',
    technique: 'segmentation',
    poster: '/media/lab/car-defect-1.jpg',
    alt: "Detectron2 instance masks over a car's dented and cracked panels for insurance assessment.",
  },
  {
    slug: 'hornet',
    label: 'Invasive-hornet detection',
    technique: 'detection',
    poster: '/media/lab/hornet.jpg',
    alt: 'A YOLO detector separating an Asian hornet from a native bee on a monitoring plate.',
  },
  {
    slug: 'age-gender',
    label: 'Age & gender estimation',
    technique: 'detection',
    poster: '/media/lab/age-gender.jpg',
    alt: 'A face detected and labelled with an estimated age and gender from a single webcam frame.',
  },
  {
    slug: 'emotion',
    label: 'Emotion recognition',
    technique: 'detection',
    poster: '/media/lab/emotion.jpg',
    alt: 'A face classified as happy in real time with the detection box drawn around it.',
  },
  {
    slug: 'gate',
    label: 'Barrier-gate vehicle trigger',
    technique: 'detection',
    poster: '/media/lab/gate.jpg',
    alt: 'A vehicle detected at an automatic aluminium boom barrier to trigger the gate.',
  },
  {
    slug: 'n8n-automation',
    label: 'Content automation (n8n)',
    technique: 'automation',
    poster: '/media/lab/n8n.jpg',
    alt: 'An n8n workflow pulling a note from Notion, formatting it, and posting to LinkedIn on a schedule.',
  },
]

export const LAB_TECHNIQUES = [
  'detection',
  'tracking',
  'segmentation',
  'ocr',
  'pose',
  'depth',
  'anomaly',
  'automation',
] as const
