"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  site,
  experience,
  education,
  skillGroups,
  awards,
  certifications,
} from "@/content/site";
import { appear, revealCopy, withMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Two opaque light cards over the fixed canvas — About, then FAQ.
   About renders from real material (subhead + experience + credentials + CV),
   not the deleted Vesper `about.*` fields. No portrait until a real photo
   exists. Highlights that map to a project link straight to the case study. */
export default function LightSections() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".lt-reveal");
      withMotion(
        () => {
          for (const el of items) revealCopy(el, { root: el, start: "top 88%" });
        },
        () => appear(items)
      );
    },
    { scope: root }
  );

  return (
    <div ref={root} id="light-band" data-theme="light" className="relative z-10 px-3 py-10 md:px-6 md:py-16">
      {/* ---------- About ---------- */}
      <section
        id="about"
        className="mx-auto w-full max-w-[1440px] rounded-[22px] bg-surface border border-line px-6 pt-20 pb-16 text-fg shadow-[0_30px_90px_-45px_rgba(0,0,0,0.28)] md:px-12 md:pt-24 md:pb-20"
      >
        <div className="mx-auto w-full max-w-4xl">
          <p className="lt-reveal mb-6 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-accent-ink">
            {site.role} · {site.location} · {site.relocation}
          </p>
          <h2 className="lt-reveal display text-[clamp(1.75rem,4.5vw,3.25rem)]">
            {site.aboutLede.before}
            <span className="gradient-text">{site.aboutLede.accent}</span>
            {site.aboutLede.after}
          </h2>
          <p className="lt-reveal mt-6 max-w-2xl text-base leading-relaxed text-fg-dim">
            {site.subhead}
          </p>

          {/* ---- Experience timeline ---- */}
          <div className="lt-reveal mt-14 border-t border-line pt-10">
            <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-accent-ink">
              Experience
            </p>
            <div className="mt-6 space-y-9">
              {experience.map((role) => (
                <article key={`${role.org}-${role.start}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-base font-semibold text-fg">
                      {role.title}
                    </h3>
                    <p className="text-xs tabular-nums text-fg-mute">
                      {role.start} — {role.end}
                    </p>
                  </div>
                  <p className="mt-0.5 text-sm text-fg-dim">
                    {role.org} · {role.location}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {role.highlights.map((h) => (
                      <li
                        key={h.text}
                        className="flex gap-2.5 text-sm leading-relaxed text-fg-dim"
                      >
                        <span
                          aria-hidden
                          className="mt-[0.5rem] size-1 shrink-0 rounded-full bg-fg-mute"
                        />
                        <span>
                          {h.text}
                          {h.projectSlug && (
                            <>
                              {" "}
                              <Link
                                href={`/work/${h.projectSlug}`}
                                className="whitespace-nowrap border-b border-fg/25 pb-px font-medium text-fg transition-colors hover:border-fg"
                              >
                                Case study ↗
                              </Link>
                            </>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          {/* ---- Skills ---- */}
          <div className="lt-reveal mt-12 border-t border-line pt-10">
            <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-accent-ink">
              Skills
            </p>
            <dl className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {skillGroups.map((g) => (
                <div key={g.title}>
                  <dt className="text-sm font-semibold text-fg">
                    {g.title}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-fg-dim">
                    {g.items.join(" · ")}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ---- Credentials ---- */}
          <div className="lt-reveal mt-12 grid grid-cols-1 gap-8 border-t border-line pt-10 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-accent-ink">
                Awards
              </p>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-fg-dim">
                {awards.map((a) => (
                  <li key={`${a.title}-${a.event}`}>
                    <span className="font-semibold text-fg">
                      {a.place}
                    </span>{" "}
                    {a.title} — {a.event}
                    {a.year ? ` (${a.year})` : ""}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-accent-ink">
                Certifications
              </p>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-fg-dim">
                {certifications.map((c) => (
                  <li key={c.name}>
                    <span className="text-fg">{c.name}</span> — {c.issuer}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lt-reveal mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-8 text-sm text-fg-dim">
            <span>
              {education.degree}, {education.institution} ({education.years})
            </span>
            <Link
              href="/cv"
              className="border-b border-fg/30 pb-0.5 font-medium text-fg transition-colors hover:border-fg"
            >
              Full CV →
            </Link>
            <a
              href={site.links.cv}
              className="border-b border-fg/30 pb-0.5 font-medium text-fg transition-colors hover:border-fg"
            >
              Download PDF ↗
            </a>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section
        id="faq"
        className="mx-auto mt-3 w-full max-w-[1440px] rounded-[22px] bg-surface border border-line px-6 pt-24 pb-28 text-fg shadow-[0_30px_90px_-45px_rgba(0,0,0,0.28)] md:mt-6 md:px-10 md:pb-36"
      >
        <div className="mx-auto w-full max-w-3xl">
          <h2 className="lt-reveal display mb-14 text-center text-[clamp(2rem,5vw,3.5rem)]">
            Frequently <span className="gradient-text">asked</span>
          </h2>

          <div className="lt-reveal">
            {site.faq.map((item) => (
              <details
                key={item.q}
                className="group border-b border-line py-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                  <span className="text-base font-medium text-fg">{item.q}</span>
                  <span className="shrink-0 text-lg text-accent-ink transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-fg-dim">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
