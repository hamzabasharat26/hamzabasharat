"use client";

import { Volume2, VolumeX } from "lucide-react";
import { toggleMute, useMuted } from "@/lib/audio";

/**
 * One toggle silences all three audio systems — landing ambience, the agent
 * intro, and every click. Fixed bottom-left so it never competes with the
 * agent's bottom-right FAB (mobile) or right-edge tab (desktop). Always
 * visible, always reachable.
 */
export default function AudioMuteToggle() {
  const muted = useMuted();

  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-label={muted ? "Unmute site sound" : "Mute site sound"}
      aria-pressed={muted}
      className="fixed bottom-5 left-5 z-[95] grid size-11 place-items-center rounded-full border border-line-strong bg-ink-2/85 text-fg-dim shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-colors hover:text-fg"
    >
      {muted ? (
        <VolumeX className="size-4" aria-hidden />
      ) : (
        <Volume2 className="size-4" aria-hidden />
      )}
    </button>
  );
}
