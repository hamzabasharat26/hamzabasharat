"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// A resize on mobile is usually just the URL bar showing/hiding — don't
// re-measure every trigger for it. And end scrub work the moment a fast
// flick stops rather than easing it out.
ScrollTrigger.config({ ignoreMobileResize: true });
ScrollTrigger.defaults({ fastScrollEnd: true });

/**
 * Drives Lenis from GSAP's ticker so scroll-linked animations and the
 * smooth-scroll position update on the SAME frame. Running Lenis on its own
 * RAF loop is the usual cause of ScrollTrigger jitter.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let teardown: (() => void) | null = null;

    const start = () => {
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.6,
      });

      lenis.on("scroll", ScrollTrigger.update);

      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      // Anchor links go through Lenis so they inherit the easing
      const onClick = (e: MouseEvent) => {
        const el = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
        if (!el) return;
        const href = el.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -80 });
      };
      document.addEventListener("click", onClick);

      teardown = () => {
        document.removeEventListener("click", onClick);
        gsap.ticker.remove(raf);
        gsap.ticker.lagSmoothing(500, 33); // GSAP's default
        lenis.destroy();
      };
    };

    // Toggling the OS setting fires no reload, so tear Lenis down or bring it
    // back live instead of reading the preference once on mount.
    const sync = () => {
      teardown?.();
      teardown = null;
      if (!reduce.matches) start();
    };

    sync();
    reduce.addEventListener("change", sync);
    return () => {
      reduce.removeEventListener("change", sync);
      teardown?.();
    };
  }, []);

  return <>{children}</>;
}
