import type { Award, Certification, Photo, Role, Workshop } from './types'

// ---------------------------------------------------------------------------
// Identity, positioning and contact. One place. Nothing here is invented -
// it all comes from Hamza_BasharatCV.pdf.
//
// POSITIONING DECISION (2026-08): the spine of this site is
// "AI / Computer Vision Engineer who ships to production". The WebGL hero is
// evidence of real-time rendering skill, NOT the pitch. Every headline,
// meta description and CTA must serve that spine.
// ---------------------------------------------------------------------------

export const site = {
  name: 'Hamza Basharat',
  /** The single label the whole site defends. Broadened 2026-09: the CV backs
   *  CV, RAG/LLM and MLOps work, not vision alone — leading with "Computer
   *  Vision" alone was underselling half the portfolio. */
  role: 'AI / ML Engineer',
  /** Sub-role for meta and the CV route. Order = depth. */
  roleLong: 'AI / ML Engineer · Computer Vision, RAG & LLM Agents, MLOps',

  /**
   * HERO HEADLINE. The pain, client-side: models that work in a notebook and
   * die on contact with production. Must still be a line only Hamza could
   * write — the proof (factory floor) is what makes it his.
   */
  headline: 'AI that survives production — not notebooks.',
  /**
   * Hero sub — ~34 words. Names the range and the differentiator; the domains
   * list is trimmed so it holds three lines under the masthead.
   */
  subhead:
    'I build computer-vision pipelines, RAG agents and the automation around them — from raw dataset to a deployment you can monitor and hand off. Shipped into manufacturing QC, industrial safety, UAV perception and enterprise tooling.',
  /**
   * About-section opening line, in two parts so the middle clause can be set
   * in the accent gradient. A statement, not a summary.
   */
  aboutLede: {
    before: 'A model that stays in a notebook is worth nothing to you. I build the ones that ',
    accent: 'reach production',
    after: ' — and keep running after the hand-off.',
  },

  location: 'Lahore, Pakistan',
  relocation: 'Open to relocation',
  availability: 'Open to full-time AI/ML roles, contract engagements and freelance projects',
  /** Real client geography — freelance/contract, not fabricated headcount. */
  clients: 'Freelance and contract work with teams in the US, Canada and Pakistan.',

  email: 'hamzabasharat2004@gmail.com',
  phone: '+92 300 6547302',

  links: {
    linkedin: 'https://www.linkedin.com/in/hamzabasharat26',
    github: 'https://github.com/hamzabasharat26',
    recommendations:
      'https://www.linkedin.com/in/hamzabasharat26/details/recommendations/?detailScreenTabIndex=0',
    cv: '/media/Hamza_Basharat_AI_CV.pdf',
  },

  /**
   * Headline numbers for the strip under the hero.
   * These REPLACE the current "91k particles / 8.3ms / 60fps" strip, which
   * describes the website rather than the engineer. Keep the frame-budget
   * numbers if you like them, but not above the fold.
   */
  proofStrip: [
    // Re-worded 2026-09 on request: lead MagicQC with the platform it actually
    // is (web + desktop, delivered, in production), not a single garment/day
    // count — the number still lives on the project card, where there's room
    // to back it up.
    { value: 'Delivered', label: 'MagicQC — web + desktop, in production', context: 'Computer vision, end to end' },
    { value: '90%+', label: 'Measurement accuracy', context: 'MagicQC' },
    { value: '0.81', label: 'mAP50, fabric defect', context: 'YOLO + PatchCore' },
    // Context kept to one line — the two-line wrap was what pushed the strip
    // into the fold. Both real "1st" placements folded into one tile rather
    // than adding a 5th and breaking the 4-up grid.
    { value: '1st', label: 'National podium finishes ×2', context: 'IEEE Hackathon · ICAT Robotics' },
  ],

  /**
   * SERVICES. Reframed from generic web-dev to what the CV can actually back.
   * Three is the right number; a fourth dilutes.
   */
  services: [
    {
      n: '01',
      title: 'Production Vision Systems',
      blurb:
        'Detection, segmentation, pose and anomaly detection — from dataset curation to a monitored deployment on the hardware you already run. You get a system, not a notebook.',
      evidence: ['magicqc', 'fabric-defect-detection', 'ppe-safety-detection'],
    },
    {
      n: '02',
      title: 'Edge & Real-Time Inference',
      blurb:
        'Models that hold accuracy inside an embedded compute budget. OAK-1W / DepthAI, ONNX, quantisation, and the throughput trade-offs stated up front — not discovered in production.',
      evidence: ['fabric-defect-detection', 'industrial-pose-suite', 'skyresq'],
    },
    {
      n: '03',
      title: 'RAG Agents & Automation',
      blurb:
        'Retrieval pipelines and agents that cite their sources, plus the workflow automation around them — served as REST APIs into the backends you already have: Laravel, React, MySQL.',
      evidence: ['enterprise-rag-agents', 'cv-recruiter-rag'],
    },
  ],

  /** SEO. One canonical description; do not let each page invent its own. */
  seo: {
    url: 'https://hamzabasharat.tech',
    title: 'Hamza Basharat — AI / ML Engineer',
    description:
      'AI / ML Engineer in Pakistan shipping production systems: MagicQC garment QC (500+/day on AWS, 90%+ accuracy), edge defect detection at 0.81 mAP50 on OAK-1W, UAV perception for NESCOM, RAG agents into live Laravel/React backends. PyTorch · YOLO · LangGraph · Docker.',
    keywords: [
      'AI ML engineer',
      'machine learning engineer',
      'computer vision engineer',
      'RAG engineer',
      'LLM agents engineer',
      'MLOps engineer',
      'AI engineer Pakistan',
      'production machine learning',
      'YOLO object detection',
      'edge AI OAK-1W',
      'LangGraph RAG pipelines',
      'AI automation engineer',
      'freelance AI engineer',
    ],
    ogImage: '/og/default.jpg',
  },

  /**
   * FAQ. Required as a disclosure widget by CLAUDE.md §5. This is the highest-
   * leverage sales surface for cold outreach traffic — it pre-answers the
   * objections that decide the deal. The "what can you not do" entry is the
   * one that makes the other four believable.
   */
  faq: [
    {
      q: 'How do engagements usually start?',
      a: 'A feasibility read on a sample of your own data, at no cost — you get a straight yes or no on whether it will work. Then a scoped, fixed-price pilot of two to three weeks. A full build only after the pilot has proven the approach on your data, not a demo set.',
    },
    {
      q: 'What does a project cost?',
      a: 'Pilots start at $1,500. Full deployments run $5,000–15,000 depending on scope. Priced per project, not hourly — the number is fixed the moment we agree it, and it covers the hand-off, not just the model.',
    },
    {
      q: 'You are not in our timezone — how does that work?',
      a: 'Calls happen in your hours. Work ships in weekly increments, so you see progress instead of a reveal at the end. The pilot exists precisely so you can test how we work together on something small before committing to a build.',
    },
    {
      q: 'Do you work alongside an in-house team?',
      a: 'Usually, yes. Most of this is the specialist vision or retrieval piece a team does not want to pause its roadmap to build — I take that part and hand back clean, documented interfaces.',
    },
    {
      q: 'What can you not do?',
      a: 'I am a vision, ML and retrieval specialist — not a full data-engineering or DevOps team. I build the model and the inference service and hand off clean interfaces; I do not run your data warehouse or own your cloud estate. Where a project needs that, I say so up front and help you scope it out.',
    },
  ],

  nav: [
    { label: 'Work', href: '/#work' },
    { label: 'Proof', href: '/#proof' },
    { label: 'Capabilities', href: '/#capabilities' },
    { label: 'CV', href: '/cv' },
  ],
} as const

export const experience: Role[] = [
  {
    org: 'Robionix Technologies',
    title: 'AI & Computer Vision Engineer',
    location: 'Islamabad, Pakistan',
    start: 'Aug 2024',
    end: 'Jul 2026',
    highlights: [
      { text: 'Led MagicQC end to end — an automated size-measurement system for apparel production, live on AWS EC2 at 500+ items/day and 90%+ accuracy. Showcased at My Karachi Expo and TextileAsia, Lahore.', projectSlug: 'magicqc' },
      { text: 'Shipped a detection and pose-estimation suite hitting 92%+ mAP at 15+ FPS on constrained edge hardware.', projectSlug: 'industrial-pose-suite' },
      { text: 'Built enterprise RAG and conversational agents served as REST APIs into Laravel, React and MySQL production backends.', projectSlug: 'enterprise-rag-agents' },
      { text: 'Automated tag, label and document OCR feeding downstream QC reporting and inventory records.' },
      { text: 'Used diffusion-based augmentation and ViT/VLM fine-tuning to close class gaps in scarce industrial datasets.' },
    ],
  },
  {
    org: 'Essenceware Technologies',
    title: 'AI Engineer (Contract)',
    location: 'Pakistan',
    start: 'Jul 2025',
    end: 'Sep 2025',
    highlights: [
      { text: 'Trained, deployed and handed off real-time PPE and workplace safety detection with inference dashboards and model versioning.', projectSlug: 'ppe-safety-detection' },
      { text: 'Integrated a real-time pose-estimation and activity-monitoring module into the Essenceware product stack.' },
    ],
  },
  {
    org: 'NESCOM, National Development Complex',
    title: 'AI & UAV Engineer (Intern)',
    location: 'Islamabad, Pakistan',
    start: 'Jun 2025',
    end: 'Sep 2025',
    highlights: [
      { text: 'Built detection and tracking pipelines and Gazebo simulation for SkyResQ, an autonomous UAV disaster-response perception system.', projectSlug: 'skyresq' },
      { text: 'Presented results directly to Pakistani government stakeholders evaluating the system for national emergency preparedness.' },
    ],
  },
]

export const education = {
  degree: 'BS Computer Engineering',
  institution: 'National University of Technology (NUTECH)',
  location: 'Islamabad',
  years: '2022 - 2026',
}

export const awards: Award[] = [
  { place: '1st', title: 'Dock Vision AI', event: 'IEEE Hackathon', year: '2024', projectSlug: 'dock-vision-ai' },
  { place: '1st', title: 'ICAT National Robotics Competition', event: 'ICAT', year: '' },
  { place: 'Runner-up', title: 'National AI Sprint (NAIS)', event: 'National Centre of Physics', year: '2025' },
  // TextileAsia entry — from the 5 exhibition photos in
  // docs/drive/TextileAsia_Lahore/. What the badge and banners actually say:
  // "TextileAsia, 32nd Edition", "South Asia's Largest Textile Industry
  // Exhibition & Conference", "04-06 July", "Lahore Expo Centre, Pakistan",
  // "Student / National University of Technology (NUTECH) / Exhibitor". The
  // MagicQC booth banner reads "AI-Based Automated Garment Size Measurement
  // System".
  // DRAFT for Hamza: (1) confirm the year — the badge shows "04-06 July" but
  // the year digits are not legible in the photos (2025 or 2026?). (2) confirm
  // whether this was purely an exhibitor showcase or carried any placement /
  // recognition. Leaving `place: 'Exhibitor'` and `year: ''` until confirmed
  // rather than guessing.
  { place: 'Exhibitor', title: 'MagicQC at TextileAsia', event: '32nd Edition · Lahore Expo Centre · NUTECH', year: '', projectSlug: 'magicqc' },
]

export const certifications: Certification[] = [
  { name: 'AWS Certified Machine Learning Engineer - Associate', issuer: 'Amazon Web Services' },
  { name: 'AI & ML Engineering Professional Certificate', issuer: 'Microsoft' },
  { name: 'Advanced Computer Vision with TensorFlow', issuer: 'DeepLearning.AI' },
  { name: 'Exploratory Data Analysis for Machine Learning', issuer: 'IBM' },
  { name: 'Azure AI / Computer Vision', issuer: 'Microsoft' },
  { name: 'LangChain for LLM Application Development', issuer: 'DeepLearning.AI' },
  { name: 'Introduction to Embedded Machine Learning', issuer: 'Edge Impulse' },
  { name: 'Claude 101 & AI Fluency Framework Foundations', issuer: 'Anthropic' },
  { name: 'First Principles of Computer Vision', issuer: 'University of Colorado Boulder' },
  { name: 'Python for Everybody', issuer: 'University of Michigan' },
  // DRAFT for Hamza: confirm this is distinct from "Introduction to Embedded
  // Machine Learning" above (same issuer, Edge Impulse) — could be the same
  // course under a different name. Keeping both until you confirm.
  { name: 'Edge AI', issuer: 'Edge Impulse' },
  { name: 'AI for All: From Practice to Gen AI', issuer: 'NVIDIA' },
  { name: 'Prompt Engineering', issuer: 'Google' },
]

/**
 * Teaching / speaking. Every field below is transcribed from the workshop's
 * own flyer (docs/drive/Workshop At Lahore...) — nothing is invented. Hamza
 * was on the Robionix engineering team that delivered it.
 */
export const workshops: Workshop[] = [
  {
    title: 'CPD Workshop — Applications of Vision AI in Manufacturing Industries',
    host: 'Punjab Tianjin University of Technology (PTUT), Lahore · conducted by NUTECH in collaboration with Robionix Technologies',
    venue: 'PTUT Township Campus, Lahore',
    dates: '2-3 July 2026',
    role: 'Instructor — Robionix engineering team, with Prof. Dr. Awais Yasin (Founder & CEO, Robionix)',
    curriculum: [
      'Day 1: computer vision and AI fundamentals, YOLO detection and classification, Python/Django web APIs, MySQL from shop-floor to manager PC, React/Next.js dashboards, real-time industrial camera interfacing.',
      'Day 2: a full fabric-defect-detection build — dataset preparation and training, back-end API configuration, real-time ERP quality dashboards, the automated textile pipeline demo, and a prompt-engineering session.',
    ],
    image: '/media/workshop-lahore.jpg',
    imageAlt: 'Hamza presenting the Vision AI workshop at a lectern in a PTUT computer lab, slides and the workshop banner behind him.',
    photos: [
      { src: '/media/teaching/podium-1.jpg', alt: 'Hamza presenting from the lectern to attendees at rows of workstations in the PTUT computer lab.' },
      { src: '/media/teaching/podium-2.jpg', alt: 'Hamza mid-talk at the lectern, an attendee in the foreground following along.' },
      { src: '/media/teaching/certificate.jpg', alt: 'Certificate of appreciation from PTUT naming Hamza Basharat for the two-day CPD workshop, signed by the Vice Chancellor.', tag: 'PTUT · signed by the VC' },
      { src: '/media/teaching/badge.jpg', alt: 'Hamza’s workshop trainer badge: "Application of Vision AI in Manufacturing Industries — Trainer — 2-3 July 2026".', tag: 'Trainer credential' },
    ],
  },
]

/**
 * Field / credibility photos for the Proof section. All from real events —
 * TextileAsia (Lahore Expo Centre), the ICAT robotics final, client meetings
 * at the expo. Nothing staged, nothing stock (CLAUDE §7).
 */
// Six DISTINCT frames — no near-duplicates. ta-1/ta-3/ta-5 were three near-
// identical solo portraits (kept ta-1); ta-2 and expo-team were the same team
// photo (kept ta-2). Natural aspect ratios are preserved in the layout so no
// face or banner is cropped off.
export const gallery: Photo[] = [
  { src: '/media/proof/ta-1.jpg', alt: 'Hamza on the MagicQC stand at TextileAsia, Lahore Expo Centre.', tag: 'TextileAsia · Lahore', aspect: '2/3' },
  { src: '/media/proof/ta-2.jpg', alt: 'The Robionix team on the MagicQC stand at TextileAsia, Lahore Expo Centre.', tag: 'The team · TextileAsia', aspect: '3/2' },
  { src: '/media/proof/ta-4.jpg', alt: 'Hamza demonstrating the MagicQC size-measurement rig to a visitor at the TextileAsia stand.', tag: 'MagicQC demo · TextileAsia', aspect: '3/2' },
  { src: '/media/fabric/machine.jpg', alt: 'The AI-enabled fabric-defect inspection rig on the mill floor — camera and lighting over the fabric roll, operator PC alongside.', tag: 'Defect-detection rig · on the floor', aspect: '16/9' },
  { src: '/media/proof/icat-robot.jpg', alt: 'The autonomous sorting robot Hamza’s team built for the ICAT National Robotics Competition, bins labelled metal / plastic / unknown.', tag: 'ICAT robotics · 1st', aspect: '4/3' },
  { src: '/media/proof/client-talk.jpg', alt: 'Hamza in a working discussion with a client at the exhibition table.', tag: 'Client meeting · Lahore', aspect: '3/2' },
]

/**
 * Skills, grouped the way a hiring manager reads them - by what the skill
 * lets you DO, not by vendor. Order within each group is by depth, not
 * alphabet. Never render this as a wall of logo badges.
 */
export const skillGroups = [
  {
    title: 'Computer Vision & Video Analytics',
    items: ['YOLOv5/v8/v11/26', 'OpenCV', 'PatchCore', 'Vision Transformers (ViT)', 'Vision-Language Models', 'PaddleOCR', 'Tesseract', 'Tracking', 'Pose estimation', 'Segmentation', 'Anomaly detection'],
  },
  {
    title: 'Deep Learning & Generative AI',
    items: ['PyTorch', 'TensorFlow', 'Keras', 'Hugging Face Transformers', 'Diffusers', 'Diffusion models', 'Transfer learning', 'Fine-tuning', 'Data augmentation'],
  },
  {
    title: 'LLM & Agentic AI',
    items: ['Anthropic Claude API', 'OpenAI API', 'LangChain', 'LangGraph', 'RAG pipelines', 'FAISS', 'Chroma', 'Prompt engineering', 'Context management'],
  },
  {
    title: 'Edge AI & MLOps',
    items: ['OAK-1W / DepthAI', 'ONNX', 'Embedded inference', 'Docker', 'AWS EC2', 'Azure AI', 'REST API design', 'Model versioning', 'Monitoring', 'CI/CD'],
  },
  {
    title: 'Backend, Tooling & Languages',
    items: ['Python', 'C++', 'C', 'JavaScript', 'MATLAB', 'SQL', 'FastAPI', 'Flask', 'Streamlit', 'React', 'Next.js', 'Node.js', 'Laravel', 'MySQL', 'MongoDB', 'Roboflow', 'CVAT', 'Gazebo', 'Linux'],
  },
]
