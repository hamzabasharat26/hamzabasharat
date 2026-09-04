"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site, skillGroups } from "@/content/site";
import { appear, withMotion } from "@/lib/motion";

/** Flattened, de-duped stack for the ticker under the capabilities list. */
const STACK = [...new Set(skillGroups.flatMap((g) => g.items))];

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The capabilities section — the block that answers "what can you do for me".
 * Numbered rows rather than cards: the page already leans on the [ 01 ] bracket
 * motif, and a card grid here would compete with the project grid below it.
 *
 * Each capability names its evidence projects as links, so the claim and its
 * proof sit next to each other. `projectTitles` is resolved server-side in
 * page.tsx — Services never imports projects.ts, so the DRAFT limitation
 * strings never reach this client bundle.
 */
export default function Services({
  projectTitles,
}: {
  projectTitles: Record<string, string>;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      withMotion(
        () => {
          gsap.from(".sv-row", {
            xPercent: -2,
            autoAlpha: 0,
            duration: 0.95,
            stagger: 0.11,
            ease: "expo.out",
            scrollTrigger: { trigger: root.current, start: "top 72%", once: true },
          });
        },
        () => appear(".sv-row")
      );
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="capabilities"
      className="relative border-t border-line px-6 pt-24 pb-16 md:px-10 md:pt-32 md:pb-20"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="sv-row mb-16 flex items-end justify-between gap-6">
          <h2 className="display text-[clamp(2rem,5vw,3.75rem)]">
            What I <span className="gradient-text">do</span>
          </h2>
          <p className="label hidden sm:block">
            [ {String(site.services.length).padStart(2, "0")} capabilities ]
          </p>
        </div>

        <ul>
          {site.services.map((s) => (
            <li
              key={s.title}
              className="sv-row grid gap-4 border-t border-line py-10 md:grid-cols-12 md:items-baseline md:gap-8 md:py-12"
            >
              <p className="label md:col-span-2">[ {s.n} ]</p>
              <h3 className="text-2xl font-light tracking-tight md:col-span-4 md:text-3xl">
                {s.title}
              </h3>
              <div className="md:col-span-6">
                <p className="max-w-prose leading-relaxed text-fg-dim">
                  {s.blurb}
                </p>
                {s.evidence.length > 0 && (
                  <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                    <span className="label">Proof</span>
                    {s.evidence.map((slug, i) => (
                      <span key={slug} className="text-fg-dim">
                        <Link
                          href={`/work/${slug}`}
                          className="border-b border-line-strong pb-0.5 text-fg transition-colors hover:border-a2 hover:text-a2"
                        >
                          {projectTitles[slug] ?? slug}
                        </Link>
                        {i < s.evidence.length - 1 ? "," : ""}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* The full stack, static chips — the animated ticker lives up by the
            hero (TechStrip); a second looping marquee here just spent frame
            budget for nothing. */}
        <div className="sv-row mt-16 border-t border-line pt-8">
          <p className="label mb-5">The stack I build and maintain on</p>
          <ul className="flex flex-wrap gap-x-2 gap-y-2.5">
            {STACK.map((s) => (
              <li
                key={s}
                className="rounded-full border border-line px-3 py-1 text-[0.8125rem] text-fg-dim"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
