"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { X } from "lucide-react";
import AgentAvatar, { type AvatarState } from "./AgentAvatar";
import { attachAnalyser, playClick, startAgentIntro, stopAgentIntro } from "@/lib/audio";

// The panel — its matcher, the knowledge base, the message UI, the speech
// button, its icons — is a separate chunk that only downloads when the visitor
// opens the widget. The trigger is all that ships up front.
const AgentPanel = dynamic(() => import("./AgentPanel"), { ssr: false });

// Matches the .agent-panel[data-closing] exit keyframe in globals.css — the
// panel stays mounted this long after close() so agent-out can actually play
// instead of the element just vanishing.
const CLOSE_ANIM_MS = 160;

/**
 * The site assistant, always reachable. Two triggers, one panel:
 *
 *  - desktop  a vertical "Ask AI" tab pinned to the right edge, mid-screen —
 *             visible the whole scroll, not just at the foot of the page.
 *  - mobile   a bottom-right FAB, thumb-reachable.
 *
 * Non-modal — no aria-modal, no focus trap; visitors keep reading with it open.
 * Escape closes. A one-line prompt bubble shows once on a first visit
 * (localStorage) so the trigger reads as a chat; never under reduced motion.
 *
 * Open and close are deliberately distinct: open plays a higher-pitched click
 * and (once per person, ever) the agent voice/music intro with the avatar
 * glowing in step with it; close plays a lower-pitched click, cuts the intro
 * dead if it's still running, and the panel plays a short exit transition
 * before it actually unmounts. Both triggers carry data-audio-skip so the
 * generic document-level click delegate doesn't layer a second, default-pitch
 * click on top of the one each already plays itself.
 */
export default function AgentLauncher() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [hint, setHint] = useState(false);
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const [avatarLevel, setAvatarLevel] = useState(0);
  const tabRef = useRef<HTMLButtonElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const detachAnalyserRef = useRef<(() => void) | null>(null);
  const panelId = useId();
  const titleId = useId();

  const detachAnalyser = useCallback(() => {
    detachAnalyserRef.current?.();
    detachAnalyserRef.current = null;
  }, []);

  // The intro's own natural-completion cue — fires once the music has
  // genuinely finished fading out, not when the panel is closed early.
  const onIntroEnd = useCallback(() => {
    setAvatarState("idle");
    setAvatarLevel(0);
    detachAnalyser();
  }, [detachAnalyser]);

  const close = useCallback(() => {
    playClick(0.82);
    // Mid-intro or not — stop it dead. A disembodied voice must never keep
    // talking after the panel is gone.
    stopAgentIntro();
    setAvatarState("idle");
    setAvatarLevel(0);
    detachAnalyser();
    setClosing(true);
    (tabRef.current ?? fabRef.current)?.focus();
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, CLOSE_ANIM_MS);
  }, [detachAnalyser]);

  const dismissHint = useCallback(() => {
    setHint(false);
    try {
      localStorage.setItem("agent-hint-seen", "1");
    } catch {}
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    let seen = true;
    try {
      seen = localStorage.getItem("agent-hint-seen") === "1";
    } catch {}
    if (seen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setHint(true), 4500);
    return () => clearTimeout(t);
  }, []);

  // Detach the analyser loop on unmount so nothing keeps sampling audio for a
  // widget that's no longer on the page.
  useEffect(() => () => detachAnalyser(), [detachAnalyser]);

  const openPanel = () => {
    dismissHint();
    playClick(1.18);
    setClosing(false);
    setOpen(true);

    const started = startAgentIntro(onIntroEnd);
    if (started) {
      setAvatarState("speaking");
      detachAnalyserRef.current = attachAnalyser(setAvatarLevel);
    }
  };

  return (
    <>
      {(open || closing) && (
        <div id={panelId}>
          <AgentPanel
            onCloseAction={close}
            titleId={titleId}
            closing={closing}
            avatarState={avatarState}
            avatarLevel={avatarLevel}
          />
        </div>
      )}

      {/* ---- First-visit hint ---- */}
      {hint && !open && !closing && (
        <div className="agent-hint fixed z-[94] flex max-w-[15rem] items-start gap-2 rounded-2xl border border-line-strong bg-ink-2/95 px-4 py-3 text-sm text-fg-dim shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur-xl max-md:bottom-[4.75rem] max-md:right-5 max-md:rounded-br-sm md:right-[3.25rem] md:top-1/2 md:-translate-y-1/2 md:rounded-tr-sm">
          <button
            type="button"
            onClick={openPanel}
            data-audio-skip="true"
            className="text-left transition-colors hover:text-fg"
          >
            Ask me anything about Hamza&apos;s work — projects, stack, cost, timeline.
          </button>
          <button
            type="button"
            onClick={dismissHint}
            aria-label="Dismiss"
            className="mt-0.5 shrink-0 text-fg-mute transition-colors hover:text-fg"
          >
            <X className="size-3.5" aria-hidden />
          </button>
        </div>
      )}

      {/* ---- Desktop: right-edge vertical tab, 3D avatar + label ---- */}
      {!open && !closing && (
        <button
          ref={tabRef}
          type="button"
          onClick={openPanel}
          aria-controls={panelId}
          aria-expanded={false}
          data-hint={hint ? "true" : undefined}
          data-audio-skip="true"
          className="agent-tab group fixed right-0 top-1/2 z-[95] hidden -translate-y-1/2 flex-col items-center gap-2.5 rounded-l-2xl border border-r-0 border-line-strong bg-ink-2/90 py-3.5 pl-3 pr-2.5 text-fg shadow-[0_10px_40px_-12px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-[padding] hover:pr-4 md:flex"
        >
          <AgentAvatar size={34} state="idle" />
          <span
            className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg-dim transition-colors group-hover:text-fg"
            style={{ writingMode: "vertical-rl" }}
          >
            Ask&nbsp;Pixel&nbsp;AI
          </span>
        </button>
      )}

      {/* ---- Mobile: bottom-right FAB ---- */}
      {!open && !closing && (
        <button
          ref={fabRef}
          type="button"
          onClick={openPanel}
          aria-controls={panelId}
          aria-expanded={false}
          aria-label="Ask Pixel AI about Hamza's work"
          data-hint={hint ? "true" : undefined}
          data-audio-skip="true"
          className="agent-launcher fixed bottom-5 right-5 z-[95] inline-flex h-14 items-center gap-2.5 rounded-full border border-line-strong bg-fg p-2 pr-2 text-sm font-medium text-ink shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] md:hidden"
        >
          <AgentAvatar size={40} state="idle" />
        </button>
      )}
    </>
  );
}
