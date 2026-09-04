"use client";

import { useEffect, useRef } from "react";

/**
 * A soft trailing cursor ring + a hard dot at the true pointer.
 *
 * - `mix-blend-mode: difference` so one element reads on the near-black ground
 *   AND the inset white cards without a second colour.
 * - Only mounts for `(hover: hover) and (pointer: fine)` — never on touch.
 * - Fully suppressed under `prefers-reduced-motion`: the ring is the motion.
 * - One rAF loop, transforms only, `pointer-events: none` — it can never eat a
 *   click or trigger layout.
 * - Grows over anything interactive (`a`, `button`, `[data-cursor]`, form
 *   controls) so the affordance is felt, not just seen.
 */
export default function Cursor() {
  const layer = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || still.matches) return;

    const r = ring.current;
    const d = dot.current;
    if (!r || !d || !layer.current) return;
    layer.current.dataset.on = "true";

    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let tx = rx;
    let ty = ry;
    let hovering = false;
    let visible = false;
    let raf = 0;

    const INTERACTIVE = "a, button, summary, label, input, [role='button'], [data-cursor]";

    // The lerp loop idles itself once the ring has caught the pointer — a
    // permanently-running rAF that writes a transform every frame keeps the
    // compositor awake for nothing. pointer input wakes it back up.
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      d.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
      if (!visible) {
        visible = true;
        r.style.opacity = "1";
        d.style.opacity = "1";
      }
      const next = Boolean((e.target as Element)?.closest?.(INTERACTIVE));
      if (next !== hovering) {
        hovering = next;
        r.dataset.hover = String(hovering);
      }
      wake();
    };
    const onLeave = () => {
      visible = false;
      r.style.opacity = "0";
      d.style.opacity = "0";
    };
    const onDown = () => {
      r.dataset.down = "true";
      wake();
    };
    const onUp = () => (r.dataset.down = "false");

    const tick = () => {
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      // Settled within a subpixel of the target — park the loop until the next
      // pointer event calls wake().
      if (Math.abs(tx - rx) < 0.1 && Math.abs(ty - ry) < 0.1) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div
      ref={layer}
      aria-hidden
      className="cursor-layer pointer-events-none fixed inset-0 z-[200]"
    >
      <div ref={ring} className="cursor-ring" style={{ opacity: 0 }} />
      <div ref={dot} className="cursor-dot" style={{ opacity: 0 }} />
    </div>
  );
}
