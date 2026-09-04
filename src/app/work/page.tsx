import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import Nav from "@/components/Nav";
import Projects, { type ProjectCard } from "@/components/Projects";

export const metadata: Metadata = {
  title: "Work",
  description: `Every shipped project by ${site.name} — ${site.roleLong}.`,
  alternates: { canonical: "/work" },
};

const cards: ProjectCard[] = projects.map(
  ({ slug, title, kicker, year, role, org, status, domains, problem, outcome, stack, links, media, featured, confidential }) => ({
    slug, title, kicker, year, role, org, status, domains, problem, outcome, stack, links, media, featured, confidential,
  })
);

export default function WorkIndex() {
  return (
    <>
      <a className="skip-link" href="#work">Skip to work</a>
      <Nav />
      <main className="pt-28">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-fg-dim transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Home
          </Link>
          <h1 className="display mt-4 text-[clamp(2rem,5vw,3.25rem)]">
            Every shipped project
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg-dim">
            {projects.length} systems — computer vision, edge inference and LLM
            agents — from dataset to a monitored deployment.
          </p>
        </div>
        <Projects projects={cards} showAll heading={false} />
      </main>
    </>
  );
}
