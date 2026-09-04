import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Lock } from "lucide-react";
import { projects, projectBySlug } from "@/content/projects";
import { site } from "@/content/site";
import Nav from "@/components/Nav";
import DraftNotice from "@/components/case-study/DraftNotice";
import Poster from "@/components/case-study/Poster";
import Gallery from "@/components/Gallery";

// All nine routes are known at build time, so they prerender as static HTML.
// dynamicParams stays false: an unknown slug is a 404, never an on-demand
// render of a project that does not exist.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};

  // The description is the problem statement verbatim. It is one sentence,
  // leads with the pain, and is already written to be read cold — which is
  // exactly what a search snippet needs.
  // openGraph.images is supplied by the co-located opengraph-image.tsx route —
  // a generated card that always exists, unlike media.poster (four projects
  // have no still yet).
  return {
    title: project.title,
    description: project.problem,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} — ${site.name}`,
      description: project.problem,
      url: `/work/${project.slug}`,
      type: "article",
    },
  };
}

const STATUS_LABEL: Record<string, string> = {
  production: "In production",
  evaluation: "In evaluation",
  research: "Research / prototype",
  competition: "Competition build",
};

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  // Every DRAFT: string is Hamza's to fill. They are stripped here rather than
  // rendered as placeholder prose — CLAUDE.md §2 forbids shipping a slot whose
  // content does not exist yet.
  const limitations = project.limitations.filter(
    (l) => !l.startsWith("DRAFT:")
  );
  const drafts = project.limitations.filter((l) => l.startsWith("DRAFT:"));

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    abstract: project.problem,
    creator: { "@type": "Person", name: site.name },
    dateCreated: project.year,
    keywords: project.stack.join(", "),
    about: project.domains,
    url: `${site.seo.url.replace(/\/$/, "")}/work/${project.slug}`,
  }).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <a className="skip-link" href="#case-body">
        Skip to case study
      </a>
      <Nav />

      <main id="case-body" className="mx-auto w-full max-w-4xl px-6 pb-24 pt-32 md:px-10">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-sm text-fg-dim transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All work
        </Link>

        {/* ---- Title block. One h1 per page, and it is the project name. ---- */}
        <header className="mt-8 border-b border-line pb-10">
          <p className="label">{project.kicker}</p>
          <h1 className="display mt-3 text-[clamp(2rem,5vw,3.25rem)]">
            {project.title}
          </h1>

          {/* Status carries a text label, never colour alone (CLAUDE.md §5). */}
          <dl className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
            <div>
              <dt className="label">Status</dt>
              <dd className="mt-1 text-fg">
                {STATUS_LABEL[project.status] ?? project.status}
              </dd>
            </div>
            <div>
              <dt className="label">Role</dt>
              <dd className="mt-1 text-fg">{project.role}</dd>
            </div>
            <div>
              <dt className="label">Organisation</dt>
              <dd className="mt-1 text-fg">{project.org}</dd>
            </div>
            <div>
              <dt className="label">Year</dt>
              <dd className="mt-1 text-fg tabular-nums">{project.year}</dd>
            </div>
          </dl>
        </header>

        {/* ---- The problem, first and alone. Pain before model. ---- */}
        <section className="mt-14" aria-labelledby="h-problem">
          <h2 id="h-problem" className="label">
            The problem
          </h2>
          <p className="mt-4 max-w-2xl text-xl leading-relaxed text-balance">
            {project.problem}
          </p>
        </section>

        {/* ---- Outcome. Every value is a field in projects.ts; nothing is
                derived, rounded or computed here. A project with no outcome
                simply does not render this section. ---- */}
        {project.outcome.length > 0 && (
          <section className="mt-14" aria-labelledby="h-outcome">
            <h2 id="h-outcome" className="label">
              Outcome
            </h2>
            <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
              {project.outcome.map((m) => (
                <div key={m.label} className="border-t border-line pt-4">
                  <dt className="sr-only">{m.label}</dt>
                  <dd>
                    <span className="block text-3xl font-light tracking-tight tabular-nums">
                      {m.value}
                    </span>
                    <span className="mt-1 block text-sm text-fg-dim">
                      {m.label}
                    </span>
                    {m.note && (
                      <span className="mt-1 block text-xs text-fg-mute">
                        {m.note}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* ---- Media. A `gallery` becomes a captioned carousel; otherwise the
                single poster (or its schematic fallback). Explicit dimensions
                reserve the box so the metrics above never shift (CLS). ---- */}
        {project.media.gallery && project.media.gallery.length > 1 ? (
          <figure className="mt-14">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-surface">
              <Gallery
                items={project.media.gallery}
                variant="feature"
                sizes="(max-width: 896px) 100vw, 896px"
                poster={project.media.poster}
              />
            </div>
            <figcaption className="mt-3 text-xs text-fg-mute">
              {project.media.alt}
            </figcaption>
          </figure>
        ) : (
          <Poster
            src={project.media.poster}
            alt={project.media.alt}
            frames={project.media.frames}
          />
        )}

        {/* ---- Approach ---- */}
        <section className="mt-14" aria-labelledby="h-approach">
          <h2 id="h-approach" className="label">
            Approach
          </h2>
          <ul className="mt-5 space-y-4">
            {project.approach.map((a, i) => (
              <li key={i} className="flex gap-4 border-t border-line pt-4">
                <span className="label shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="leading-relaxed text-fg-dim">{a}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ---- Stack ---- */}
        <section className="mt-14" aria-labelledby="h-stack">
          <h2 id="h-stack" className="label">
            Stack
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <li
                key={s}
                className="rounded-full border border-line px-3 py-1.5 text-sm text-fg-dim"
              >
                {s}
              </li>
            ))}
          </ul>
        </section>

        {/* ---- Limitations. Renders only what is real; DRAFT entries are
                stripped above and surfaced to Hamza in dev only. ---- */}
        {limitations.length > 0 && (
          <section className="mt-14" aria-labelledby="h-limits">
            <h2 id="h-limits" className="label">
              Limitations
            </h2>
            <ul className="mt-5 space-y-3">
              {limitations.map((l, i) => (
                <li
                  key={i}
                  className="border-t border-line pt-4 leading-relaxed text-fg-dim"
                >
                  {l}
                </li>
              ))}
            </ul>
          </section>
        )}

        <DraftNotice slug={project.slug} drafts={drafts} />

        {/* ---- Confidentiality, stated rather than implied ---- */}
        {project.confidential && (
          <p className="mt-14 flex items-start gap-3 rounded-lg border border-line bg-surface/50 p-4 text-sm text-fg-dim">
            <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              <span className="font-medium text-fg">Restricted. </span>
              {project.confidential}
            </span>
          </p>
        )}

        {/* ---- Links ---- */}
        {project.links.length > 0 && (
          <section className="mt-14" aria-labelledby="h-links">
            <h2 id="h-links" className="label">
              Links
            </h2>
            <ul className="mt-5 flex flex-wrap gap-3">
              {project.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm transition-colors hover:bg-surface"
                  >
                    {l.label}
                    <ExternalLink className="size-3.5" aria-hidden />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ---- Next project ---- */}
        <nav aria-label="Next project" className="mt-20 border-t border-line pt-8">
          <Link href={`/work/${next.slug}`} className="group block">
            <span className="label">Next</span>
            <span className="mt-2 flex items-center gap-3 text-2xl font-light tracking-tight">
              {next.title}
              <ArrowRight
                className="size-5 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </span>
          </Link>
        </nav>
      </main>
    </>
  );
}
