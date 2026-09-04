"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { testimonials, hasTestimonials } from "@/content/testimonials";
import { appear, withMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Received LinkedIn recommendations, verbatim.
 *
 * Renders only when `hasTestimonials` is true — an empty array returns null and
 * leaves no gap. Nothing here is written, paraphrased or placeheld; see the
 * rules at the top of src/content/testimonials.ts.
 *
 * No avatars unless a testimonial carries a real local `avatar` path. No stock
 * photos, no generated faces, no initials circles that imply a photo exists.
 */
export default function Testimonials() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".tm-card");
      withMotion(
        () => {
          gsap.from(".tm-head", {
            y: 20,
            autoAlpha: 0,
            duration: 0.8,
            ease: "expo.out",
            scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
          });
          gsap.from(cards, {
            y: 30,
            autoAlpha: 0,
            duration: 0.8,
            ease: "expo.out",
            stagger: 0.09,
            scrollTrigger: { trigger: cards[0] ?? root.current, start: "top 85%", once: true },
          });
        },
        () => appear([".tm-head", ...cards])
      );
    },
    { scope: root }
  );

  if (!hasTestimonials) return null;

  return (
    <section
      ref={root}
      id="testimonials"
      className="relative border-t border-line px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="tm-head mb-14 flex items-end justify-between gap-6">
          <h2 className="display text-[clamp(2rem,5vw,3.75rem)]">
            What people <span className="gradient-text">say</span>
          </h2>
          <p className="label hidden sm:block">
            [ {String(testimonials.length).padStart(2, "0")} recommendations ]
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <li
              key={`${t.author}-${t.date}`}
              className="tm-card flex min-w-0 flex-col rounded-2xl border border-line bg-surface/40 p-6 transition-colors hover:border-line-strong md:p-8"
            >
              <blockquote className="flex-1 text-pretty text-sm leading-relaxed text-fg-dim [overflow-wrap:anywhere]">
                {t.quote}
              </blockquote>

              <div className="mt-6 flex min-w-0 items-center gap-3 border-t border-line pt-5">
                {t.avatar && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.avatar}
                    alt=""
                    width={40}
                    height={40}
                    className="size-10 shrink-0 rounded-full object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-fg">{t.author}</p>
                  <p className="truncate text-xs text-fg-mute">
                    {t.authorTitle}
                    {t.authorOrg ? ` · ${t.authorOrg}` : ""}
                  </p>
                </div>
                <a
                  href={t.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto shrink-0 border-b border-line-strong pb-0.5 text-xs text-fg-dim transition-colors hover:border-a2 hover:text-a2"
                >
                  LinkedIn ↗
                  <span className="sr-only"> — recommendation from {t.author}</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
