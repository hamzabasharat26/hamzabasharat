import Marquee from "./Marquee";

/**
 * The working toolkit, ticking under the hero. Not a skills wall — a quick
 * read of the stack while the eye is still on the masthead. Pulled tight to
 * the names a recruiter or a client actually recognises. Full list lives in
 * `skillGroups` (About section).
 */
const TECH = [
  "PyTorch",
  "YOLOv8 / v11",
  "OpenCV",
  "PatchCore",
  "ONNX",
  "OAK-1W / DepthAI",
  "TensorRT",
  "FastAPI",
  "Docker",
  "AWS EC2",
  "LangGraph",
  "Claude API",
  "FAISS",
  "Vision Transformers",
  "PaddleOCR",
  "Gazebo / PX4",
  "React / Next.js",
  "MLflow",
];

export default function TechStrip() {
  return (
    <section
      aria-label="Core stack"
      className="relative border-y border-line bg-surface/30 py-4"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-6 overflow-hidden px-6 md:px-10">
        <span className="label hidden shrink-0 sm:block">The stack</span>
        <div className="min-w-0 flex-1">
          <Marquee items={TECH} className="text-[0.8125rem]" />
        </div>
      </div>
    </section>
  );
}
