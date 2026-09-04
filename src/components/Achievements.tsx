"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site, awards, certifications, workshops, gallery } from "@/content/site";
import type { MediaItem } from "@/content/types";
import { appear, revealCopy, withMotion } from "@/lib/motion";
import Gallery from "./Gallery";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "Proof, not promises" — the recognition and reach the hero proof strip
 * doesn't carry. Every figure is derived from real content — award count from
 * `awards`, certifications from `certifications`, workshops from `workshops`,
 * client geography from `site.clients`. Nothing invented.
 */
const wins = awards.filter((a) => /1st|winner|runner/i.test(a.place)).length;

const STATS = [
  { value: `${wins}`, label: "National podium finishes", sub: "IEEE · ICAT · NAIS" },
  { value: `${certifications.length}`, label: "Certifications", sub: "AWS ML · Microsoft · DeepLearning.AI" },
  { value: `${workshops.length}`, label: "Industrial CV workshop taught", sub: "PTUT Lahore · with Robionix" },
  { value: "3", label: "Client geographies", sub: "US · Canada · Pakistan" },
];

export default function Achievements() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      withMotion(
        () => {
          revealCopy(gsap.utils.toArray(".ach-reveal"), {
            root: root.current,
            start: "top 80%",
          });
        },
        () => appear(".ach-reveal")
      );
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="proof"
      className="relative border-t border-line px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="ach-reveal mb-14 flex flex-wrap items-end justify-between gap-6">
          <h2 className="display text-[clamp(2rem,5vw,3.75rem)]">
            Proof, <span className="gradient-text">not promises</span>
          </h2>
          <p className="label hidden max-w-[24ch] text-right sm:block">
            {site.clients}
          </p>
        </div>

        {/* ---- Big numbers ---- */}
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 border-y border-line py-12 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="ach-reveal">
              <dt className="text-[clamp(2.5rem,6vw,4rem)] font-light leading-none tracking-tight tabular-nums">
                {s.value}
              </dt>
              <dd className="mt-3 text-sm text-fg-dim">{s.label}</dd>
              <dd className="label mt-1 normal-case tracking-normal text-fg-mute">
                {s.sub}
              </dd>
            </div>
          ))}
        </dl>

        {/* ---- Awards ---- */}
        <p className="ach-reveal label mt-14 mb-4">Awards</p>
        <ul className="divide-y divide-line">
          {awards.map((a) => {
            const slug = a.projectSlug;
            return (
              <li
                key={`${a.title}-${a.event}`}
                className="ach-reveal grid gap-2 py-5 md:grid-cols-12 md:items-baseline md:gap-6"
              >
                <span className="text-sm font-medium tracking-tight text-a2 md:col-span-2">
                  {a.place}
                </span>
                <span className="text-base text-fg md:col-span-6">
                  {slug ? (
                    <Link
                      href={`/work/${slug}`}
                      className="border-b border-line-strong pb-0.5 transition-colors hover:border-a2 hover:text-a2"
                    >
                      {a.title}
                    </Link>
                  ) : (
                    a.title
                  )}
                </span>
                <span className="text-sm text-fg-mute md:col-span-4 md:text-right">
                  {a.event}
                  {a.year ? ` · ${a.year}` : ""}
                </span>
              </li>
            );
          })}
        </ul>

        {/* ---- Teaching ---- */}
        {workshops.length > 0 && (
          <>
            <p className="ach-reveal label mt-16 mb-4">Teaching</p>
            {workshops.map((w) => (
              <article
                key={w.title}
                className="ach-reveal grid gap-8 rounded-2xl border border-line bg-surface/40 p-6 md:grid-cols-12 md:p-8"
              >
                {(w.photos?.length ?? 0) > 0 ? (
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line md:col-span-5">
                    <Gallery
                      items={(w.photos ?? []).map<MediaItem>((p) => ({
                        kind: "image",
                        src: p.src,
                        caption: p.alt,
                      }))}
                      variant="card"
                      sizes="(max-width: 768px) 100vw, 42vw"
                    />
                  </div>
                ) : (
                  w.image && (
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line md:col-span-5">
                      <Image
                        src={w.image}
                        alt={w.imageAlt ?? ""}
                        fill
                        sizes="(max-width: 768px) 100vw, 42vw"
                        className="object-cover"
                      />
                    </div>
                  )
                )}
                <div className={w.image || w.photos?.length ? "md:col-span-7" : "md:col-span-12"}>
                  <h3 className="text-xl font-light tracking-tight">{w.title}</h3>
                  <p className="mt-2 text-sm text-fg-dim">{w.host}</p>
                  <p className="label mt-1 normal-case tracking-normal text-fg-mute">
                    {w.venue} · {w.dates}
                  </p>
                  <p className="mt-4 text-sm text-fg-dim">{w.role}</p>
                  <ul className="mt-4 space-y-2">
                    {w.curriculum.map((c) => (
                      <li
                        key={c}
                        className="flex gap-2.5 text-sm leading-relaxed text-fg-mute"
                      >
                        <span
                          aria-hidden
                          className="mt-2 size-1 shrink-0 rounded-full bg-fg-mute"
                        />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </>
        )}

        {/* ---- From the field — real events, no stock (CLAUDE §7).
                Masonry columns so each photo keeps its own aspect ratio and
                nothing is cropped by a forced box. ---- */}
        {gallery.length > 0 && (
          <>
            <p className="ach-reveal label mt-16 mb-4">From the field</p>
            <div className="gap-3 [column-fill:balance] sm:columns-2 lg:columns-3">
              {gallery.map((p) => (
                <figure
                  key={p.src}
                  className="ach-reveal group relative mb-3 break-inside-avoid overflow-hidden rounded-xl border border-line bg-surface"
                >
                  <div
                    className="relative w-full"
                    style={{ aspectRatio: p.aspect ?? "3 / 2" }}
                  >
                    <Image
                      src={p.src}
                      alt={p.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink/80 to-transparent"
                  />
                  {p.tag && (
                    <figcaption className="absolute inset-x-3 bottom-2.5 truncate text-[0.6875rem] font-medium text-white">
                      {p.tag}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
