"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { appear, revealCopy, withMotion } from "@/lib/motion";
import { lab } from "@/content/lab";
import type { LabItem } from "@/content/types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "In the lab" — the technique wall. Every tile is one computer-vision
 * technique shown working, from `src/content/lab.ts`: a clip where Hamza has
 * one, a single labelled still otherwise. Volume as evidence, deliberately
 * lighter than a case study — a plain label + a domain tag, no metrics, no
 * client names.
 *
 * Motion budget (CLAUDE §4): poster-first. A tile's `<video>` is created only
 * the first time that specific tile is hovered — never all of them on scroll —
 * and only on a hover-capable pointer. Under reduced motion nothing but the
 * poster ever renders.
 */
const TAG: Record<LabItem["technique"], string> = {
  detection: "Detection",
  tracking: "Tracking",
  segmentation: "Segmentation",
  ocr: "OCR",
  pose: "Pose",
  depth: "Depth",
  anomaly: "Anomaly",
  automation: "Automation",
};

function LabTile({ item }: { item: LabItem }) {
  const vid = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false);
  const hoverable =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onEnter = () => {
    if (!item.clip || !hoverable) return;
    setArmed(true);
    requestAnimationFrame(() => vid.current?.play().catch(() => {}));
  };

  return (
    <figure
      className="lab-tile group relative aspect-square overflow-hidden rounded-xl border border-line bg-surface"
      onMouseEnter={onEnter}
      onMouseLeave={() => vid.current?.pause()}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.poster}
        alt={item.alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover"
      />
      {item.clip && armed && (
        <video
          ref={vid}
          muted
          loop
          playsInline
          preload="metadata"
          poster={item.poster}
          className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <source src={item.clip.webm} type="video/webm" />
          <source src={item.clip.mp4} type="video/mp4" />
        </video>
      )}
      <span className="absolute left-2.5 top-2.5 rounded-full border border-line-strong bg-ink/70 px-2 py-0.5 text-[0.5625rem] uppercase tracking-wider text-fg-dim backdrop-blur-sm">
        {TAG[item.technique]}
      </span>
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-3 text-xs font-medium text-fg">
        {item.label}
      </figcaption>
    </figure>
  );
}

export default function Demos() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tiles = gsap.utils.toArray<HTMLElement>(".lab-tile");
      withMotion(
        () => {
          revealCopy(gsap.utils.toArray(".demo-head"), {
            root: root.current,
            start: "top 85%",
          });
          gsap.from(tiles, {
            y: 22,
            autoAlpha: 0,
            duration: 0.55,
            ease: "expo.out",
            stagger: 0.045,
            scrollTrigger: { trigger: tiles[0] ?? root.current, start: "top 92%", once: true },
          });
        },
        () => appear([".demo-head", ...tiles])
      );
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="lab"
      className="relative border-t border-line px-6 py-20 md:px-10 md:py-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="demo-head mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-light tracking-tight md:text-3xl">
            In the <span className="gradient-text">lab</span>
          </h2>
          <p className="label hidden sm:block">
            [ {String(lab.length).padStart(2, "0")} techniques · hover to play ]
          </p>
        </div>
        {/* flex-wrap + justify-center, not grid — the tile count doesn't
            divide evenly at every breakpoint, and a trailing partial row in
            a grid stays left-aligned (an orphaned single tile). Each tile's
            width replicates the same 2/3/4/5-column math grid-cols would
            have given it, so the sizing is identical; only the leftover
            row's alignment changes. */}
        <div className="flex flex-wrap justify-center gap-3">
          {lab.map((item) => (
            <div
              key={item.slug}
              className="w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.5rem)] md:w-[calc(25%-0.5625rem)] lg:w-[calc(20%-0.6rem)]"
            >
              <LabTile item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
