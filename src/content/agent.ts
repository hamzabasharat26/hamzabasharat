import { site } from "./site";

// ---------------------------------------------------------------------------
// Knowledge base for the site's chat widget.
//
// Every answer is a fixed string written in Hamza's voice — first person,
// plain, specific. It CANNOT hallucinate because there is no model in the
// loop; the widget matches a question to one of these topics and returns the
// text verbatim.
//
// HARD RULE (also binds any future LLM tier): every claim here traces to
// src/content/projects.ts, src/content/site.ts or the CV. No invented
// employer, metric, date or personal detail. No price outside the published
// bands ($1,500 pilots · $5,000–15,000 builds).
// ---------------------------------------------------------------------------

export type AgentTopic = {
  id: string;
  /** Short label on the suggestion chip. `null` = matchable but not offered as a chip. */
  chip: string | null;
  /** Keywords for free-text matching. Longer / rarer phrases score higher. */
  patterns: string[];
  /** The reply — Hamza's voice, first person, honest. */
  answer: string;
  cta?: { label: string; href: string };
};

export const agentTopics: AgentTopic[] = [
  {
    id: "build",
    chip: "What do you build?",
    patterns: ["what do you build", "what do you make", "services", "what do you offer", "specialise", "specialize", "what kind of work", "capabilities", "computer vision", "cv work", "software development", "web development", "app development"],
    answer:
      "Four things, always shipped, never a notebook. Computer vision — detection, segmentation, pose, OCR, anomaly — trained on real data, deployed on the hardware you run. Agentic AI and RAG that retrieve, reason and cite sources instead of guessing. The automation workflows that keep both running without a human babysitting them. And the software around it — APIs, dashboards, a desktop or web app — when the job needs a full product, not just a model: MagicQC shipped as both, same vision core underneath. Everything ships with monitoring and a hand-off your team can run without me.",
    cta: { label: "See the work", href: "#work" },
  },
  {
    id: "hire",
    chip: "Can I hire you for a project?",
    patterns: ["freelance", "freelancer", "hire for a project", "hire you for a project", "available for hire", "contract work", "outsource this", "take on clients", "new clients", "need a developer", "need an engineer", "looking for a developer", "looking for an engineer", "can you build this", "build this for us", "work for my company", "small business", "for my business", "for my startup", "take on freelance"],
    answer:
      "Yes — freelance and contract work is exactly what this site is for. Computer vision, agentic AI, RAG, automation workflows, or the software to ship any of it: describe the problem and I'll say within a day whether it's a fit, no cost to ask. Remote is normal for this work — the pilot below is how we find out before either of us commits to more.",
    cta: { label: "Email me", href: `mailto:${site.email}` },
  },
  {
    id: "proof",
    chip: "Does any of it actually ship?",
    patterns: ["proof", "real", "results", "does it ship", "actually work", "deployed", "in production", "live", "evidence", "case study"],
    answer:
      "Yes — that's the whole point. MagicQC has run on AWS since 2025: 500+ garments a day at 90%+ measurement accuracy, demoed live at TextileAsia in Lahore. The fabric-defect system hits 0.81 mAP50 on an OAK-1W camera with no server in the loop. RAG agents are in production behind live Laravel and React backends. Dock Vision AI won an IEEE hackathon and became a paid install. Every number on this site is from my CV.",
    cta: { label: "See the work", href: "#work" },
  },
  {
    id: "stack",
    chip: "What's your stack?",
    patterns: ["your stack", "tech stack", "what tech", "what do you use", "which tools", "tools do you", "what language", "frameworks", "pytorch", "yolo", "tensorflow", "opencv", "libraries", "toolchain"],
    answer:
      "PyTorch and YOLO for the models, OpenCV for the glue, FastAPI plus Docker to serve them. Edge work runs on OAK-1W / DepthAI and ONNX. For agents it's LangGraph and LangChain over the Claude and OpenAI APIs. When the job needs a full product rather than just an API, it's React, Next.js or Laravel on top — MagicQC ships both a desktop app and a web app on that stack. I deploy on AWS EC2 and hand off with model versioning and monitoring already in place.",
  },
  {
    id: "edge",
    chip: null,
    patterns: ["edge", "jetson", "embedded", "on device", "on-device", "raspberry", "oak", "fps", "real-time", "real time", "latency", "quantis", "quantiz"],
    answer:
      "Edge is most of what I do. The fabric-defect detector runs entirely on an OAK-1W camera — no server round trip. On other embedded hardware I've held 92%+ mAP at 15+ FPS by quantising, converting to the board's native runtime, and profiling against the real frame rate instead of a benchmark set.",
  },
  {
    id: "projects",
    chip: null,
    patterns: ["best project", "favourite project", "favorite project", "which project", "strongest", "magicqc", "fabric", "dock vision", "skyresq", "safepulse", "rag"],
    answer:
      "The one I'd point a recruiter to is MagicQC — I took it from dataset to a monitored AWS deployment on my own, and it's been running against a real production line since 2025. The strongest pure-CV piece is the fabric-defect project: a YOLO + PatchCore fusion on edge hardware, shipped as a proper Electron app rather than a script.",
    cta: { label: "See the work", href: "#work" },
  },
  {
    id: "who",
    chip: null,
    patterns: ["who are you", "who is hamza", "background", "about you", "experience", "cv", "resume", "education", "study", "degree", "are you a bot", "what are you"],
    answer:
      "I'm Pixel, the assistant for Hamza Basharat's portfolio — I answer from his real project record, nothing invented. Hamza is an AI / ML Engineer in Lahore: two years at Robionix leading production computer-vision and RAG work, plus contract and research stints in industrial safety and UAV perception. BS Computer Engineering from NUTECH, AWS ML Engineer certified.",
    cta: { label: "Full CV", href: site.links.cv },
  },
  {
    id: "start",
    chip: "How does a project start?",
    patterns: ["how do we start", "how does a project start", "process", "engage", "first step", "get started", "kick off", "onboard"],
    answer:
      "Usually a quick look at a sample of your own data first, at no cost, to say whether it's feasible. If it is, a short fixed-price pilot — two or three weeks — and a full build only once the pilot has proven it out.",
  },
  {
    id: "cost",
    chip: "What does it cost?",
    patterns: ["cost", "price", "pricing", "budget", "rate", "how much", "fee", "quote", "expensive", "charge"],
    answer:
      "Pilots are $1,500. A full deployment is $5,000–15,000 depending on scope. It's priced per project, not by the hour, so the number is fixed once we agree it.",
  },
  {
    id: "timeline",
    chip: null,
    patterns: ["how long", "timeline", "how fast", "when can you start", "can you start", "start next", "start soon", "availability", "available", "lead time", "turnaround", "delivery time", "weeks", "how quickly"],
    answer:
      "A pilot is two to three weeks. A full build runs four to eight, depending on scope and how clean the data is. I can usually start within a week or two — email me what you're trying to do and I'll give you a real date.",
    cta: { label: "Email me", href: `mailto:${site.email}` },
  },
  {
    id: "timezone",
    chip: null,
    patterns: ["timezone", "time zone", "remote", "pakistan", "hours", "async", "where are you", "location", "overlap"],
    answer:
      "I'm in Pakistan (PKT). Calls happen in your hours, and I ship in weekly increments so you see progress rather than a reveal at the end. The pilot is there precisely so you can test how we work together on something small.",
  },
  {
    id: "team",
    chip: null,
    patterns: ["work with our team", "in-house", "in house", "collaborate", "alongside", "existing team", "internal team", "our engineers"],
    answer:
      "Usually alongside one. Most of this is the specialist vision piece an in-house team doesn't want to pause its roadmap to build — I take that part and hand back clean interfaces.",
  },
  {
    id: "limits",
    chip: "What can't you do?",
    patterns: ["cant do", "can't do", "cannot do", "limitation", "not do", "weakness", "bad at", "avoid", "outside your"],
    answer:
      "I'm a vision and ML specialist, not a data-engineering or DevOps team. I'll build the model and the inference service and give you clean interfaces; I won't run your data warehouse or own your cloud estate. If a project needs that, I say so early.",
  },
  {
    id: "fulltime",
    chip: null,
    patterns: ["full-time", "fulltime", "full time", "hire you", "job", "employment", "position", "recruit", "salary", "relocate", "relocation"],
    answer:
      "Yes — I'm open to AI/CV engineering roles and select contract work, and open to relocating. The CV has the full history; email is the fastest way to reach me.",
    cta: { label: "Download CV", href: site.links.cv },
  },
];

/** Shown when nothing matches — still gives the visitor something, then the handoff. */
export const agentFallback = {
  answer:
    "I don't have a ready answer for that one, and I'd rather give you a real one than guess. Leave your email and I'll reply the same day — or write to me directly.",
  email: site.email,
};

export const agentGreeting =
  "I'm Pixel, Hamza's portfolio assistant. He's an AI/ML engineer shipping computer vision, agentic AI, RAG and the automation and software around them — production systems, not notebooks. Ask what he builds, whether it actually ships, his stack, cost, or how a project starts. Pick one below or type your own.";
