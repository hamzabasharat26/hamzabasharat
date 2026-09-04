"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { armLandingMusic, initAudio } from "@/lib/audio";

/**
 * Mounted once near the root. Renders nothing — it just starts the audio
 * manager (the click-SFX delegate, tab-visibility handling) and arms the
 * landing-ambience one-shot. Kept out of layout.tsx's own body so that file
 * stays a plain server component wrapper.
 *
 * The ambience is scoped to the landing page and the work section: it plays
 * on a fresh load/reload of "/" or anything under "/work", not on "/cv" or
 * any other route. Root layout stays mounted across client-side navigation
 * in the App Router, so this only runs once per real page load — reading
 * `pathname` once, at that moment, is deliberate: clicking from "/" into
 * "/work" afterwards must not replay it, only a reload of either earns a
 * fresh shot (armLandingMusic already handles the "once per load" part).
 */
export default function AudioBoot() {
  const pathname = usePathname();

  useEffect(() => {
    initAudio();
    if (pathname === "/" || pathname.startsWith("/work")) armLandingMusic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
