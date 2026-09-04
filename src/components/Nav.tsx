"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { site } from "@/content/site";
import { appear, withMotion } from "@/lib/motion";
import ThemeToggle from "./ThemeToggle";
import BrandMark from "./BrandMark";

gsap.registerPlugin(useGSAP);

/** The pill occupies roughly this band, measured from the viewport top. */
const PILL_TOP = 16;
const PILL_BOTTOM = 60;

export default function Nav() {
  const root = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu on Escape or when the viewport grows past the
  // breakpoint where the inline nav takes over.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    const mq = window.matchMedia("(min-width: 640px)");
    const onWide = () => mq.matches && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onWide);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onWide);
    };
  }, [menuOpen]);

  useGSAP(
    () => {
      // The one reveal that was never routed through withMotion, which left the
      // nav permanently hidden on the reduced-motion path.
      // The 0.9s delay is choreographed against the home hero's reveal. On a
      // subpage there is no hero to wait for, and a nav that fades in a second
      // late reads as a broken header — so the delay is home-only.
      const isHome = document.getElementById("top") !== null;

      withMotion(
        () => {
          gsap.from(root.current, {
            y: -24,
            autoAlpha: 0,
            duration: isHome ? 1 : 0.5,
            delay: isHome ? 0.9 : 0,
            ease: "expo.out",
          });
        },
        () => appear(root.current)
      );

    },
    { scope: root }
  );

  /**
   * The pill is translucent dark; over the white About/FAQ band it composites
   * to mid-grey and the links fall to ~3:1, below AA. Invert it while that band
   * is behind the pill.
   *
   * IntersectionObserver rather than ScrollTrigger: this is a pure geometric
   * overlap test, and a ScrollTrigger range expressed as "bottom 16px" was
   * measurably still reporting active with the band's bottom edge at 0px. The
   * observer asks the browser the question directly, costs nothing per frame,
   * and needs no refresh bookkeeping.
   */
  useEffect(() => {
    const el = root.current;
    // Observe the CARDS, not their wrapper: the light band is now padded, so
    // the wrapper extends past the white edges and would flip the pill early.
    const cards = ["about", "faq"]
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => n !== null);
    if (!el || cards.length === 0) return;

    let io: IntersectionObserver | null = null;
    const overlapping = new Set<Element>();

    const attach = () => {
      io?.disconnect();
      overlapping.clear();
      // Collapse the observation root to just the strip the pill sits in.
      const bottomInset = Math.max(0, window.innerHeight - PILL_BOTTOM);
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) overlapping.add(e.target);
            else overlapping.delete(e.target);
          }
          el.classList.toggle("nav-light", overlapping.size > 0);
        },
        { rootMargin: `-${PILL_TOP}px 0px -${bottomInset}px 0px`, threshold: 0 }
      );
      for (const c of cards) io.observe(c);
    };

    attach();
    window.addEventListener("resize", attach);
    return () => {
      window.removeEventListener("resize", attach);
      io?.disconnect();
    };
  }, []);

  return (
    <header
      ref={root}
      className="fixed inset-x-0 top-4 z-50 flex flex-col items-center px-4"
    >
      <div className="nav-shell flex w-full max-w-4xl items-center justify-between gap-4 rounded-full border px-3 py-2 backdrop-blur-xl transition-colors duration-300 sm:gap-6">
        {/* "/" rather than "#top": on a case-study route there is no #top
            anchor, and the brand must still go home. */}
        <Link
          href="/"
          className="nav-brand flex min-w-0 items-center gap-2 pl-1 text-sm tracking-tight sm:pl-2"
        >
          <BrandMark className="size-5 shrink-0" />
          <span className="truncate font-medium">{site.name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
          {site.nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-full px-3 py-1.5 text-sm transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <a
            href={`mailto:${site.email}`}
            className="nav-cta group hidden items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-colors sm:flex"
          >
            Contact
            <span className="size-1.5 rounded-full bg-a1 transition-transform group-hover:scale-150" />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="nav-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="nav-toggle grid size-8 place-items-center rounded-full border border-line-strong text-fg-dim transition-colors hover:text-fg sm:hidden"
          >
            {menuOpen ? (
              <X className="size-4" aria-hidden />
            ) : (
              <Menu className="size-4" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu — a sheet under the pill. sm and up never see it. */}
      {menuOpen && (
        <nav
          id="nav-menu"
          aria-label="Primary"
          className="nav-shell mt-2 flex w-full max-w-4xl flex-col gap-1 rounded-3xl border p-3 backdrop-blur-xl sm:hidden"
        >
          {site.nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-2xl px-4 py-2.5 text-sm transition-colors"
            >
              {n.label}
            </a>
          ))}
          <a
            href={`mailto:${site.email}`}
            onClick={() => setMenuOpen(false)}
            className="mt-1 flex items-center justify-between rounded-2xl border border-line-strong px-4 py-2.5 text-sm"
          >
            Contact
            <span className="size-1.5 rounded-full bg-a1" />
          </a>
        </nav>
      )}
    </header>
  );
}
