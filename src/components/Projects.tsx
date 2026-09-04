"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// Type-only, straight from types.ts — not the barrel. A type-only import from
// "@/content" was enough to keep the whole projects.ts module (DRAFT text
// included) in this client chunk; importing the concrete submodule removes the
// edge. Only the Pick below crosses the server/client boundary, picked in a
// Server Component parent.
import type { Domain, Project } from "@/content/types";
import { appear, revealCopy, withMotion } from "@/lib/motion";
import Gallery from "./Gallery";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type ProjectCard = Pick<
  Project,
  | "slug"
  | "title"
  | "kicker"
  | "year"
  | "role"
  | "org"
  | "status"
  | "domains"
  | "problem"
  | "outcome"
  | "stack"
  | "links"
  | "media"
  | "featured"
  | "confidential"
>;

const DOMAIN_LABEL: Record<Domain, string> = {
  "computer-vision": "Computer Vision",
  "edge-ai": "Edge AI",
  "llm-agents": "LLM / RAG",
  mlops: "MLOps",
  "full-stack": "Full-stack",
};

const FILTERS: { label: string; domain: Domain | "all" }[] = [
  { label: "All", domain: "all" },
  { label: "Vision", domain: "computer-vision" },
  { label: "Edge", domain: "edge-ai" },
  { label: "LLM / RAG", domain: "llm-agents" },
  { label: "Full-stack", domain: "full-stack" },
];

const HOME_LIMIT = 6;

/** Poster with a designed fallback for projects that have no source still. */
function CardImage({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="relative flex size-full flex-col items-center justify-center gap-3 overflow-hidden bg-ink-2 px-6 text-center"
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(color-mix(in oklab, var(--color-a2) 12%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--color-a2) 12%, transparent) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
            maskImage:
              "radial-gradient(120% 90% at 15% 15%, #000 25%, transparent 80%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 -top-16 size-56 rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--color-a1) 45%, transparent), transparent 70%)",
          }}
        />
        <p className="relative label">Visualisation pending</p>
        <p className="relative max-w-xs text-xs leading-relaxed text-fg-dim">
          {alt}
        </p>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      onError={() => setFailed(true)}
      className="proj-img object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]"
      unoptimized={src.endsWith(".svg")}
    />
  );
}

/** Cross-fades a set of stills in place. First frame under reduced motion. */
function CardSlideshow({ frames, alt, sizes }: { frames: string[]; alt: string; sizes: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % frames.length), 3200);
    return () => clearInterval(t);
  }, [frames.length]);

  return (
    <div className="proj-img absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]">
      {frames.map((src, n) => (
        <Image
          key={src}
          src={src}
          alt={n === 0 ? alt : ""}
          fill
          sizes={sizes}
          className="object-cover transition-opacity duration-[900ms] ease-out"
          style={{ opacity: n === i ? 1 : 0 }}
          priority={n === 0}
        />
      ))}
    </div>
  );
}

/** Gallery / video / slideshow / image / placeholder for a project card. */
function CardMedia({ media, sizes }: { media: ProjectCard["media"]; sizes: string }) {
  if (media.gallery && media.gallery.length > 1) {
    return (
      <Gallery
        items={media.gallery}
        variant="card"
        sizes={sizes}
        poster={media.poster}
      />
    );
  }
  if (media.video) {
    return (
      <video
        poster={media.poster}
        muted
        loop
        playsInline
        autoPlay
        aria-label={media.alt}
        className="proj-img size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]"
      >
        <source src={media.video.webm} type="video/webm" />
        <source src={media.video.mp4} type="video/mp4" />
      </video>
    );
  }
  if (media.frames && media.frames.length > 1) {
    return <CardSlideshow frames={media.frames} alt={media.alt} sizes={sizes} />;
  }
  return <CardImage src={media.poster} alt={media.alt} sizes={sizes} />;
}

/** The chip metric: an outcome whose value leads with a number ("500+", "0.81",
 *  "92%+", "1st place"), with its unit label. If a project has no numeric
 *  outcome the chip is omitted entirely — a word like "NESCOM / NDC" or
 *  "Trained to handed off" dressed as a metric is worse than no chip, and on a
 *  confidential project it leaks a client name (CLAUDE §7). */
function chipMetric(outcome: ProjectCard["outcome"]) {
  const numeric = outcome.find((m) => /^[\d$+±<>]/.test(m.value.trim()));
  return numeric ? { value: numeric.value, label: numeric.label } : null;
}

/** One uniform card — screenshot + chips, then title/year/problem/tags. */
function Card({ p }: { p: ProjectCard }) {
  const metric = chipMetric(p.outcome);
  return (
    <article className="proj-cell group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface/40 transition-colors hover:border-line-strong">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
        <CardMedia
          media={p.media}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* category + metric chips, croge-style */}
        <span className="absolute left-3 top-3 rounded-full border border-line-strong bg-ink/70 px-2.5 py-1 text-[0.625rem] uppercase tracking-wider text-fg backdrop-blur-sm">
          {DOMAIN_LABEL[p.domains[0]]}
        </span>
        {metric && (
          <span className="absolute right-3 top-3 flex max-w-[calc(100%-7rem)] items-baseline gap-1.5 overflow-hidden rounded-full border border-line-strong bg-ink/80 px-2.5 py-1 backdrop-blur-sm">
            <b className="shrink-0 text-[0.75rem] font-semibold text-a1">{metric.value}</b>
            {metric.label && (
              <span className="truncate text-[0.625rem] text-fg-dim">{metric.label}</span>
            )}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <h3 className="text-xl font-light tracking-tight">
            {/* Card-wide link — the whole cell is clickable via ::after */}
            <Link
              href={`/work/${p.slug}`}
              className="transition-colors after:absolute after:inset-0 hover:text-a2"
            >
              {p.title}
            </Link>
          </h3>
          <span className="shrink-0 text-xs tabular-nums text-fg-mute">
            {p.year}
          </span>
        </div>
        <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-fg-dim">
          {p.problem}
        </p>
        <ul className="flex flex-wrap gap-1.5">
          {p.stack.slice(0, 4).map((s) => (
            <li
              key={s}
              className="rounded-full border border-line px-2.5 py-0.5 text-[0.6875rem] text-fg-mute"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function Projects({
  projects,
  showAll = false,
  heading = true,
}: {
  projects: ProjectCard[];
  showAll?: boolean;
  /** The /work index supplies its own <h1>, so it hides this <h2>. */
  heading?: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<Domain | "all">("all");

  const shown = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((p) => p.domains.includes(filter)),
    [filter, projects]
  );
  const visible = showAll ? shown : shown.slice(0, HOME_LIMIT);
  const hiddenCount = shown.length - visible.length;

  useGSAP(
    () => {
      const cells = gsap.utils.toArray<HTMLElement>(".proj-cell");
      withMotion(
        () => {
          revealCopy(gsap.utils.toArray(".proj-head"), {
            root: root.current,
            start: "top 82%",
          });
          if (cells.length) {
            gsap.from(cells, {
              y: 26,
              autoAlpha: 0,
              duration: 0.65,
              ease: "expo.out",
              stagger: { each: 0.07, grid: "auto", from: "start" },
              scrollTrigger: { trigger: cells[0], start: "top 88%", once: true },
            });
          }
        },
        () => appear([".proj-head", ...cells])
      );
    },
    { scope: root, dependencies: [filter, showAll] }
  );

  return (
    <section
      ref={root}
      id="work"
      className="relative border-t border-line px-6 pt-24 pb-28 md:px-10 md:pt-28 md:pb-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        {heading && (
          <div className="proj-head mb-4 flex flex-wrap items-end justify-between gap-6">
            <h2 className="display text-[clamp(2rem,5vw,3.75rem)]">
              Shipped products, <span className="gradient-text">measurable outcomes</span>
            </h2>
            <p className="label hidden sm:block">
              [ {String(projects.length).padStart(2, "0")} projects, shipped ]
            </p>
          </div>
        )}

        <div
          className="proj-head mb-12 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter projects by domain"
        >
          {FILTERS.map((f) => {
            const active = filter === f.domain;
            return (
              <button
                key={f.label}
                type="button"
                onClick={() => setFilter(f.domain)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-fg bg-fg text-ink"
                    : "border-line text-fg-dim hover:border-line-strong hover:text-fg"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {visible.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <Card key={p.slug} p={p} />
            ))}
          </div>
        ) : (
          <p className="text-fg-mute">No projects in this domain.</p>
        )}

        {!showAll && hiddenCount > 0 && (
          <div className="mt-14">
            <Link
              href="/work"
              className="hero-magnet inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm transition-colors hover:bg-surface"
            >
              View all {shown.length} projects
              <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
