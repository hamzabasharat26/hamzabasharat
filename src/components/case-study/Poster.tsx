"use client";

import { useEffect, useState } from "react";

/**
 * Case-study poster. Takes one still, or a set of `frames` that cross-fade in
 * place (first frame only under reduced motion). A missing file degrades to a
 * schematic panel — blueprint grid, accent wash, alt text as caption — so it
 * reads as a placeholder by intent, not a bug.
 *
 * Dimensions are declared either way so the box is reserved and nothing below
 * shifts when the real asset lands (CLS).
 */
export default function Poster({
  src,
  alt,
  frames,
}: {
  src: string;
  alt: string;
  frames?: string[];
}) {
  const [failed, setFailed] = useState(false);
  const shots = frames && frames.length > 1 ? frames : [src];
  const [i, setI] = useState(0);

  useEffect(() => {
    if (shots.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % shots.length), 3600);
    return () => clearInterval(t);
  }, [shots.length]);

  return (
    <figure className="mt-14">
      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        {failed ? (
          <div
            role="img"
            aria-label={alt}
            className="relative flex aspect-video w-full flex-col items-center justify-center gap-3 overflow-hidden bg-ink-2 px-8 text-center"
          >
            <div
              aria-hidden
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "linear-gradient(color-mix(in oklab, var(--color-a2) 12%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--color-a2) 12%, transparent) 1px, transparent 1px)",
                backgroundSize: "38px 38px",
                maskImage:
                  "radial-gradient(120% 90% at 15% 15%, #000 25%, transparent 80%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full opacity-40"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in oklab, var(--color-a1) 45%, transparent), transparent 70%)",
              }}
            />
            <p className="relative label">Visualisation pending</p>
            <p className="relative max-w-md text-sm leading-relaxed text-fg-dim">
              {alt}
            </p>
          </div>
        ) : (
          <div className="relative aspect-video w-full">
            {shots.map((s, n) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={s}
                src={s}
                alt={n === 0 ? alt : ""}
                width={1600}
                height={900}
                loading={n === 0 ? "eager" : "lazy"}
                decoding="async"
                onError={n === 0 ? () => setFailed(true) : undefined}
                className="absolute inset-0 size-full object-cover transition-opacity duration-[900ms] ease-out"
                style={{ opacity: n === i ? 1 : 0 }}
              />
            ))}
          </div>
        )}
      </div>
      {!failed && (
        <figcaption className="mt-3 text-xs text-fg-mute">{alt}</figcaption>
      )}
    </figure>
  );
}
