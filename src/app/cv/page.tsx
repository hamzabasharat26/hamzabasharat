import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import {
  site,
  experience,
  education,
  awards,
  certifications,
  skillGroups,
} from "@/content/site";
import { projectBySlug } from "@/content/projects";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "CV",
  description: `${site.roleLong}. ${site.subhead}`,
  alternates: { canonical: "/cv" },
};

/** A highlight's text, with the project name linked where one is mapped. */
function Highlight({ text, slug }: { text: string; slug?: string }) {
  const project = slug ? projectBySlug(slug) : undefined;
  if (!project) return <>{text}</>;
  return (
    <>
      {text}{" "}
      <Link
        href={`/work/${project.slug}`}
        className="whitespace-nowrap border-b border-line-strong pb-0.5 text-fg transition-colors hover:border-a2 hover:text-a2"
      >
        Case study ↗
      </Link>
    </>
  );
}

export default function CV() {
  return (
    <>
      <a className="skip-link" href="#cv-body">
        Skip to CV
      </a>
      <Nav />

      <main
        id="cv-body"
        className="mx-auto w-full max-w-3xl px-6 pb-24 pt-32 md:px-10"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-fg-dim transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Home
        </Link>

        {/* ---- Header ---- */}
        <header className="mt-8 border-b border-line pb-8">
          <h1 className="display text-[clamp(2rem,5vw,3rem)]">{site.name}</h1>
          <p className="mt-2 text-fg-dim">{site.roleLong}</p>

          <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-fg-dim">
            <div className="flex gap-2">
              <dt className="sr-only">Location</dt>
              <dd>
                {site.location} · {site.relocation}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="sr-only">Email</dt>
              <dd>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-fg"
                >
                  {site.email}
                </a>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="sr-only">Phone</dt>
              <dd>{site.phone}</dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <a
              href={site.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-line-strong pb-0.5 transition-colors hover:border-a2 hover:text-a2"
            >
              LinkedIn ↗
            </a>
            <a
              href={site.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-line-strong pb-0.5 transition-colors hover:border-a2 hover:text-a2"
            >
              GitHub ↗
            </a>
            <a
              href={site.links.cv}
              className="inline-flex items-center gap-1.5 border-b border-line-strong pb-0.5 transition-colors hover:border-a2 hover:text-a2"
            >
              Download PDF
              <Download className="size-3.5" aria-hidden />
            </a>
          </div>
        </header>

        {/* ---- Summary ---- */}
        <section className="mt-12" aria-labelledby="cv-summary">
          <h2 id="cv-summary" className="label">
            Summary
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-balance">
            {site.subhead}
          </p>
        </section>

        {/* ---- Experience ---- */}
        <section className="mt-12" aria-labelledby="cv-experience">
          <h2 id="cv-experience" className="label">
            Experience
          </h2>
          <div className="mt-6 space-y-10">
            {experience.map((role) => (
              <article key={`${role.org}-${role.start}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-lg font-medium text-fg">
                    {role.title}
                  </h3>
                  <p className="text-sm tabular-nums text-fg-mute">
                    {role.start} — {role.end}
                  </p>
                </div>
                <p className="mt-0.5 text-sm text-fg-dim">
                  {role.org} · {role.location}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {role.highlights.map((h) => (
                    <li
                      key={h.text}
                      className="flex gap-3 text-sm leading-relaxed text-fg-dim"
                    >
                      <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-fg-mute" />
                      <span>
                        <Highlight text={h.text} slug={h.projectSlug} />
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* ---- Education ---- */}
        <section className="mt-12" aria-labelledby="cv-education">
          <h2 id="cv-education" className="label">
            Education
          </h2>
          <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="text-lg font-medium text-fg">{education.degree}</h3>
            <p className="text-sm tabular-nums text-fg-mute">{education.years}</p>
          </div>
          <p className="mt-0.5 text-sm text-fg-dim">
            {education.institution} · {education.location}
          </p>
        </section>

        {/* ---- Skills ---- */}
        <section className="mt-12" aria-labelledby="cv-skills">
          <h2 id="cv-skills" className="label">
            Skills
          </h2>
          <dl className="mt-5 space-y-5">
            {skillGroups.map((g) => (
              <div key={g.title}>
                <dt className="text-sm font-medium text-fg">{g.title}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-fg-dim">
                  {g.items.join(" · ")}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---- Awards ---- */}
        <section className="mt-12" aria-labelledby="cv-awards">
          <h2 id="cv-awards" className="label">
            Awards
          </h2>
          <ul className="mt-5 space-y-3">
            {awards.map((a) => {
              const project = a.projectSlug ? projectBySlug(a.projectSlug) : undefined;
              return (
                <li
                  key={`${a.title}-${a.event}`}
                  className="flex flex-wrap items-baseline gap-x-3 text-sm text-fg-dim"
                >
                  <span className="font-medium text-fg">{a.place}</span>
                  <span>
                    {project ? (
                      <Link
                        href={`/work/${project.slug}`}
                        className="border-b border-line-strong pb-0.5 text-fg transition-colors hover:border-a2 hover:text-a2"
                      >
                        {a.title}
                      </Link>
                    ) : (
                      a.title
                    )}
                    {" — "}
                    {a.event}
                    {a.year ? ` (${a.year})` : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ---- Certifications ---- */}
        <section className="mt-12" aria-labelledby="cv-certs">
          <h2 id="cv-certs" className="label">
            Certifications
          </h2>
          <ul className="mt-5 space-y-2.5">
            {certifications.map((c) => (
              <li key={c.name} className="text-sm leading-relaxed text-fg-dim">
                {c.credential ? (
                  <a
                    href={c.credential}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fg underline decoration-line-strong underline-offset-2 transition-colors hover:decoration-a2"
                  >
                    {c.name}
                  </a>
                ) : (
                  <span className="text-fg">{c.name}</span>
                )}
                {" — "}
                {c.issuer}
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-16 border-t border-line pt-6 text-xs text-fg-mute">
          Every figure on this page traces to the PDF CV. Last reviewed{" "}
          {new Date().getFullYear()}.
        </p>
      </main>
    </>
  );
}
