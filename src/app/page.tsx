import Cursor from "@/components/Cursor";
import AgentLauncher from "@/components/Agent/AgentLauncher";
import Nav from "@/components/Nav";
import HeroBackdrop from "@/components/HeroBackdrop";
import Hero from "@/components/Hero";
import TechStrip from "@/components/TechStrip";
import ProjectStrip from "@/components/ProjectStrip";
import Services from "@/components/Services";
import Projects, { type ProjectCard } from "@/components/Projects";
import Demos from "@/components/Demos";
import Achievements from "@/components/Achievements";
import LightSections from "@/components/LightSections";
import Testimonials from "@/components/Testimonials";
import Closing from "@/components/Closing";
import PersonJsonLd from "@/components/PersonJsonLd";
import type { StripItem } from "@/components/ProjectStrip";
import { projects } from "@/content/projects";
import { lab } from "@/content/lab";

// The picking happens here, in the Server Component, not inside Projects
// itself: `projects` (full records, `limitations` DRAFT text included) is
// only ever read server-side. Only this narrowed shape crosses into the
// client bundle. See the ProjectCard comment in Projects.tsx for why that
// distinction matters.
const projectCards: ProjectCard[] = projects.map(
  ({
    slug,
    title,
    kicker,
    year,
    role,
    org,
    status,
    domains,
    problem,
    outcome,
    stack,
    links,
    media,
    featured,
    confidential,
  }) => ({
    slug,
    title,
    kicker,
    year,
    role,
    org,
    status,
    domains,
    problem,
    outcome,
    stack,
    links,
    media,
    featured,
    confidential,
  })
);

// slug → title, resolved server-side so Services (a client component) can link
// each capability to its evidence projects without importing projects.ts and
// dragging the DRAFT limitation strings into the client bundle.
const projectTitles: Record<string, string> = Object.fromEntries(
  projects.map((p) => [p.slug, p.title])
);

// The strip: every shipped project + a curated handful of lab techniques
// (Automation, hornet detection, segmentation, tracking) the user asked to
// surface up top. Project cards deep-link to the case study; lab cards jump
// to the "In the lab" section (`#lab`).
const DOMAIN_TAG: Record<string, string> = {
  "computer-vision": "Vision",
  "edge-ai": "Edge",
  "llm-agents": "LLM / RAG",
  mlops: "MLOps",
  "full-stack": "Full-stack",
};
const LAB_IN_STRIP: Record<string, string> = {
  "n8n-automation": "Automation",
  hornet: "Detection",
  segmentation: "Segmentation",
  "candy-count": "Tracking",
};

const stripItems: StripItem[] = [
  ...projects.map((p) => ({
    id: p.slug,
    title: p.title,
    poster: p.media.frames?.[0] ?? p.media.poster,
    tag: DOMAIN_TAG[p.domains[0]] ?? "Vision",
    href: `/work/${p.slug}`,
  })),
  ...lab
    .filter((d) => d.slug in LAB_IN_STRIP)
    .map((d) => ({
      id: `lab-${d.slug}`,
      title: d.label,
      poster: d.poster,
      tag: LAB_IN_STRIP[d.slug],
      href: "/#lab",
    })),
  // MagicQC ships two products (a web app and a desktop app) that a single
  // strip card can't show at once — surface each as its own card here, both
  // pointing at the one case study that covers both.
  {
    id: "magicqc-web",
    title: "MagicQC — Web App",
    poster: "/media/magicqc/web-dashboard.jpg",
    tag: "Full-stack",
    href: "/work/magicqc",
  },
  {
    id: "magicqc-desktop",
    title: "MagicQC — Desktop App",
    poster: "/media/magicqc/desktop.jpg",
    tag: "Vision",
    href: "/work/magicqc",
  },
];

export default function Home() {
  return (
    <>
      <PersonJsonLd />
      <a className="skip-link" href="#work">Skip to work</a>
      <Cursor />
      <HeroBackdrop />
      <Nav />

      <main className="flex-1">
        <Hero />
        <TechStrip />
        <ProjectStrip items={stripItems} />
        <Projects projects={projectCards} />
        <Demos />
        <Achievements />
        <Services projectTitles={projectTitles} />
        <LightSections />
        <Testimonials />
        <Closing />
      </main>

      <AgentLauncher />
    </>
  );
}
