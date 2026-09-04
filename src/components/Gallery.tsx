"use client";

import { useEffect, useRef, useState } from "react";
import type { MediaItem } from "@/content/types";

/**
 * The media carousel — cycles a project's `gallery` one item at a time, stills
 * cross-fading and short clips playing in place. Two shapes:
 *
 *  - `card`    compact. Dots only, clips play on hover, no captions. Sits inside
 *              the whole-cell link on the project grid, so its controls are
 *              `z-10` and swallow their own clicks.
 *  - `feature` large. Prev/next arrows + dots + a visible caption; the active
 *              clip autoplays (muted). Used on the case-study page.
 *
 * Motion budget (CLAUDE §4): only the active `<video>` is ever mounted; nothing
 * downloads until an item is shown (`card`) or hovered. Auto-advance stops on
 * hover/focus, when the tab is hidden, and under `prefers-reduced-motion` —
 * which also drops the cross-fade and turns clips into opt-in `controls`.
 */
export default function Gallery({
  items,
  variant = "card",
  sizes = "(max-width: 768px) 100vw, 33vw",
  poster,
}: {
  items: MediaItem[];
  variant?: "card" | "feature";
  sizes?: string;
  /** LCP/OG still — used as frame 0's src if it differs from items[0]. */
  poster?: string;
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  const n = items.length;
  const feature = variant === "feature";

  // Only cycle while the carousel is actually on screen — the home grid has
  // several of these and the motion budget (CLAUDE §4) does not allow a wall
  // of always-looping carousels.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-advance. Off on hover/focus, off-screen, under reduced motion, or when
  // the tab is backgrounded (the interval would otherwise pile up advances).
  useEffect(() => {
    if (n < 2 || paused || reduced || !inView) return;
    const t = setInterval(() => {
      if (document.visibilityState === "visible") {
        setI((v) => (v + 1) % n);
      }
    }, feature ? 4200 : 2200);
    return () => clearInterval(t);
  }, [n, paused, reduced, inView, feature]);

  const go = (next: number) => setI(((next % n) + n) % n);

  return (
    <div
      ref={rootRef}
      className="group/gal absolute inset-0"
      onMouseEnter={() => {
        setPaused(true);
        setHovered(true);
      }}
      onMouseLeave={() => {
        setPaused(false);
        setHovered(false);
      }}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      {items.map((item, idx) => {
        const active = idx === i;
        // Only the active frame and its immediate neighbours are in the DOM —
        // a 7-image gallery must not pull 7 files the moment it scrolls in.
        const near =
          idx === i || idx === (i + 1) % n || idx === (i - 1 + n) % n;
        if (!near) return null;
        const src = idx === 0 && poster ? poster : item.src;
        return (
          <div
            key={item.src}
            aria-hidden={!active}
            className="absolute inset-0 transition-opacity duration-[600ms] ease-out"
            style={{
              opacity: active ? 1 : 0,
              transitionDuration: reduced ? "0ms" : undefined,
            }}
          >
            {item.kind === "clip" && active && (hovered || feature || reduced) ? (
              <ClipLayer item={item} reduced={reduced} play={feature ? !reduced : hovered} />
            ) : item.fit === "contain" ? (
              // The frame's own aspect is far off the box (a portrait phone
              // screenshot, an ultra-wide dashboard) — show it whole,
              // letterboxed, on a blurred fill of itself, rather than crop
              // its edges away to force a cover fit.
              <div className="relative size-full overflow-hidden bg-ink">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="absolute inset-0 size-full scale-110 object-cover opacity-50 blur-2xl"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={active ? item.caption : ""}
                  loading={idx === 0 && feature ? "eager" : "lazy"}
                  decoding="async"
                  sizes={sizes}
                  className="absolute inset-0 size-full object-contain"
                />
              </div>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={src}
                alt={active ? item.caption : ""}
                loading={idx === 0 && feature ? "eager" : "lazy"}
                decoding="async"
                sizes={sizes}
                className="size-full object-cover"
              />
            )}
            {item.kind === "clip" && !(active && (hovered || feature || reduced)) && (
              <span
                aria-hidden
                className="absolute bottom-3 left-3 flex size-8 items-center justify-center rounded-full border border-white/30 bg-ink/60 backdrop-blur-sm"
              >
                <svg viewBox="0 0 24 24" className="size-3.5 fill-white/90" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            )}
          </div>
        );
      })}

      {/* gradient so controls read on any frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/80 to-transparent"
      />

      {feature && n > 1 && (
        <>
          <GalBtn side="left" onClick={() => go(i - 1)} label="Previous image" />
          <GalBtn side="right" onClick={() => go(i + 1)} label="Next image" />
        </>
      )}

      {n > 1 && (
        <div
          className={`absolute inset-x-0 z-10 flex items-center justify-center gap-2 ${
            feature ? "bottom-3" : "bottom-2.5"
          }`}
        >
          {items.map((item, idx) => (
            <button
              key={item.src}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                go(idx);
              }}
              aria-label={`Show: ${item.caption}`}
              aria-current={idx === i}
              className={`h-1.5 rounded-full transition-all ${
                idx === i
                  ? "w-5 bg-white"
                  : "w-1.5 bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}

      {feature && (
        <p className="pointer-events-none absolute inset-x-0 bottom-9 z-[9] px-6 text-center text-xs text-white/85">
          {items[i]?.caption}
        </p>
      )}
    </div>
  );
}

function ClipLayer({
  item,
  reduced,
  play,
}: {
  item: MediaItem;
  reduced: boolean;
  play: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (play && !reduced) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [play, reduced]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={item.src}
      controls={reduced}
      className="size-full object-cover"
    >
      {item.webm && <source src={item.webm} type="video/webm" />}
      {item.mp4 && <source src={item.mp4} type="video/mp4" />}
    </video>
  );
}

function GalBtn({
  side,
  onClick,
  label,
}: {
  side: "left" | "right";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={`absolute top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-ink/55 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-ink/80 focus-visible:opacity-100 group-hover/gal:opacity-100 ${
        side === "left" ? "left-3" : "right-3"
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d={side === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
      </svg>
    </button>
  );
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}
