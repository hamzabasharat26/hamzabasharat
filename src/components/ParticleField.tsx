"use client";

import { useEffect, useRef } from "react";

/**
 * A small drifting particle field for the hero — the detection grid coming
 * alive. Deliberately NOT the CDN `particles.js` a request pasted in: a remote
 * third-party script is a supply-chain risk, and 140 particles + O(n²)
 * line-linking + a full-screen sky-blue gradient would blow the motion budget
 * (CLAUDE §4) and paint over the backdrop.
 *
 * This is ~34 dots on a contained <canvas>, neighbour lines only, one rAF loop
 * that:
 *   - never blocks first paint (starts in an effect, after mount)
 *   - pauses when the hero scrolls out of view (IntersectionObserver) and when
 *     the tab is hidden
 *   - freezes to a single static frame under `prefers-reduced-motion`
 * Colour is read from `--color-accent-ink`, so it tracks the light/dark theme.
 * `pointer-events: none` and it sits behind the hero text — never over a
 * button or icon.
 */
const COUNT = 34;
const LINK_DIST = 116;
const SPEED = 0.14;

export default function ParticleField({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let w = 0;
    let h = 0;
    let dpr = 1;
    type P = { x: number; y: number; vx: number; vy: number };
    let pts: P[] = [];
    let raf = 0;
    let inView = true;
    let accent = "#38bdf8";

    const readAccent = () => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-accent-ink")
        .trim();
      if (v) accent = v;
    };

    const seed = () => {
      pts = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * SPEED * 2,
        vy: (Math.random() - 0.5) * SPEED * 2,
      }));
    };

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!pts.length) seed();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.34;
            ctx.strokeStyle = accent;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = accent;
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));
      }
      draw();
      raf = requestAnimationFrame(loop);
    };

    // Runs only while the field is on screen, the tab is visible and motion is
    // allowed — otherwise fully stopped, not an idling rAF.
    const start = () => {
      if (!raf && inView && !document.hidden && !reduced.matches) {
        raf = requestAnimationFrame(loop);
      }
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    readAccent();
    resize();
    draw();
    start();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        if (inView) start();
        else stop();
      },
      { rootMargin: "120px" }
    );
    io.observe(wrap);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    const themeObs = new MutationObserver(() => {
      readAccent();
      draw();
    });
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    const onReduced = () => {
      stop();
      draw();
      start();
    };
    reduced.addEventListener("change", onReduced);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      themeObs.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      reduced.removeEventListener("change", onReduced);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
}
