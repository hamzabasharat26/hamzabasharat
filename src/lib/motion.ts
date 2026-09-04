/* ============================================================
   Shared motion vocabulary.

   Before this existed, 10 of the 12 tweens on the site were the
   same treatment — from { y, autoAlpha: 0 }, expo.out, ~1s —
   differing only by 10px of travel. That is why the page read as
   generic next to a reference whose entire pitch is motion.

   Every helper here is gated on prefers-reduced-motion and ships a
   reduced variant, because GSAP writes inline styles that the CSS
   media query in globals.css cannot reach.

   Trimmed 2026-09: revealMask, revealLines, splitLines and countUp had zero
   call sites left after the hero/case-study rewrites and were dead weight.
   ============================================================ */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Matches the --ease-* tokens in globals.css so DOM and GSAP agree. */
export const EASE = {
  outExpo: "expo.out",
  inOutQuint: "power4.inOut",
} as const;

type Ctx = { root?: gsap.DOMTarget | null; start?: string };

/**
 * Runs `full` when motion is welcome, `reduced` otherwise. Both branches are
 * reverted automatically by the surrounding useGSAP scope.
 */
export function withMotion(
  full: () => void | (() => void),
  reduced: () => void
) {
  const mm = gsap.matchMedia();
  mm.add(
    {
      ok: "(prefers-reduced-motion: no-preference)",
      reduce: "(prefers-reduced-motion: reduce)",
    },
    (ctx) => {
      // gsap.matchMedia runs a returned function as cleanup when the query
      // stops matching or the context reverts — so a `full` branch that wires
      // listeners can hand its teardown straight back.
      if (ctx.conditions?.ok) return full();
      reduced();
    }
  );
  return mm;
}

/**
 * The reduced-motion answer for every reveal: make sure the content is simply
 * THERE.
 *
 * This used to be a `from({ autoAlpha: 0 })` with a ScrollTrigger, which was a
 * bug — `.from()` renders its start state immediately, so every target was
 * hidden up front and only revealed if its trigger later fired. Any trigger
 * that didn't fire left the content invisible permanently, which is how the
 * nav, headings and corner text vanished on the reduced-motion path.
 *
 * There is also no reason to animate here at all. Reduced motion means show it,
 * not fade it in on scroll. No tween, no trigger, nothing to get stuck.
 */
export function appear(targets: gsap.TweenTarget) {
  return gsap.set(targets, {
    autoAlpha: 1,
    x: 0,
    y: 0,
    xPercent: 0,
    yPercent: 0,
    scale: 1,
    clearProps: "clipPath",
  });
}

/** Body copy and small furniture. Short travel, quick — a supporting move. */
export function revealCopy(targets: gsap.TweenTarget, trigger?: Ctx) {
  return gsap.from(targets, {
    y: 14,
    autoAlpha: 0,
    duration: 0.75,
    ease: EASE.outExpo,
    stagger: 0.07,
    scrollTrigger: trigger?.root
      ? { trigger: trigger.root, start: trigger.start ?? "top 82%", once: true }
      : undefined,
  });
}

/**
 * Magnetic pull: the element eases toward the pointer while it is within
 * `radius` px, and springs back on leave. Transforms only. Returns a cleanup
 * fn; call it from the surrounding effect. No-op is the caller's job —
 * withMotion() should gate this so reduced motion never wires the listeners.
 */
export function magnetic(el: HTMLElement, radius = 90, strength = 0.32) {
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    if (Math.hypot(dx, dy) > radius + Math.max(r.width, r.height) / 2) {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: EASE.outExpo });
      return;
    }
    gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.4, ease: EASE.outExpo });
  };
  const reset = () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: EASE.outExpo });

  window.addEventListener("pointermove", move, { passive: true });
  el.addEventListener("pointerleave", reset);
  return () => {
    window.removeEventListener("pointermove", move);
    el.removeEventListener("pointerleave", reset);
    gsap.set(el, { x: 0, y: 0 });
  };
}
