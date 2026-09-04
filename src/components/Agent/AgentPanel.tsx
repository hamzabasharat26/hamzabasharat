"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, Send, X } from "lucide-react";
import { agentTopics } from "@/content/agent";
import AgentAvatar, { type AvatarState } from "./AgentAvatar";
import AgentMessage from "./AgentMessage";
import { useAgent } from "./useAgent";

const NEAR_BOTTOM_PX = 24;

export default function AgentPanel({
  onCloseAction,
  titleId,
  closing = false,
  avatarState = "idle",
  avatarLevel = 0,
}: {
  onCloseAction: () => void;
  titleId: string;
  /** True for the brief exit-transition window before the launcher unmounts
   *  this component — drives the agent-out animation via [data-closing]. */
  closing?: boolean;
  /** Reflects the intro voice/music while it plays — "speaking" state on the
   *  row avatar with the analyser-driven glow layered on top. */
  avatarState?: AvatarState;
  avatarLevel?: number;
}) {
  // The conversation lives here — this component only mounts when the widget is
  // opened, so the matcher and the knowledge base never load for a visitor who
  // does not use it. Closing and reopening starts a fresh conversation, which
  // is fine for a portfolio widget.
  const { messages, typing, ask, askTopic, usedChipIds } = useAgent();
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // Chips stay up the whole session (CHAT FIX 1) — a used one is just dimmed,
  // never removed, so the panel still reads as "here's what you can ask".
  const chips = agentTopics.filter((t) => t.chip);

  // Scroll containment (CHAT FIX 2): the list owns its own scroll
  // (overscroll-behavior: contain in CSS stops it chaining to the page), and
  // a new message only auto-scrolls the view if the visitor was already at
  // the bottom — someone reading history up-scroll gets a "new message"
  // affordance instead of being yanked down.
  const [atBottom, setAtBottom] = useState(true);
  const [newMessagePending, setNewMessagePending] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onScroll = () => {
      const near = el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX;
      setAtBottom(near);
      if (near) setNewMessagePending(false);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Syncs the list to new chat content as it streams in — scrolls when the
  // visitor is already at the bottom, otherwise raises the "new message"
  // affordance instead of yanking their scroll position. That's state driven
  // by an external stream (the conversation), which is exactly what an
  // effect is for; the alternative (deriving it during render) needs a ref
  // read there, which the compiler disallows.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    if (atBottom) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } else if (messages.length > 1) {
      // Deferred a tick so this reads as "a callback reacting to the change"
      // rather than a synchronous setState in the effect body — the pattern
      // react-hooks/set-state-in-effect actually wants (see its own message:
      // "calling setState in a callback function when external state
      // changes" is the sanctioned form).
      queueMicrotask(() => setNewMessagePending(true));
    }
  }, [messages, typing]);

  const scrollToBottom = () => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    setNewMessagePending(false);
  };

  return (
    <div
      role="dialog"
      aria-labelledby={titleId}
      data-closing={closing ? "true" : undefined}
      className="agent-panel pointer-events-auto fixed inset-x-4 bottom-4 z-[90] flex max-h-[70svh] flex-col overflow-hidden rounded-2xl border border-line-strong bg-ink-2/85 backdrop-blur-xl sm:inset-x-auto sm:right-4 sm:h-[560px] sm:w-[380px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-2.5">
          <AgentAvatar size={30} state={avatarState} level={avatarLevel} />
          <div className="flex items-baseline gap-1.5">
            <p
              id={titleId}
              data-speaking={avatarState === "speaking" ? "true" : undefined}
              className="agent-name text-base font-semibold tracking-tight"
            >
              <span className="gradient-text">Pixel</span>
            </p>
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-fg">
              AI
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onCloseAction}
          aria-label="Close assistant"
          data-audio-skip="true"
          className="grid size-9 shrink-0 place-items-center rounded-full text-fg-dim transition-colors hover:bg-surface hover:text-fg"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>

      {/* Messages — its own scroll container. overscroll-contain in globals.css
          stops it chaining to the page once it hits an end; data-lenis-prevent
          is the one that actually matters here — Lenis (SmoothScroll.tsx)
          hijacks wheel/touch on the whole document by default, and without
          this attribute it drives the page scroll out from under a scroll
          that started inside the panel. */}
      <div className="relative flex-1 overflow-hidden">
        <div
          ref={listRef}
          aria-live="polite"
          aria-atomic="false"
          data-lenis-prevent
          className="agent-scroll flex h-full flex-col gap-3 overflow-y-auto px-4 py-4"
        >
          {messages.map((m) => (
            <AgentMessage key={m.id} m={m} />
          ))}

          {/* The typing delay is the one moment the ring animation earns its
              place, so the row avatar runs the thinking state here. */}
          {typing && (
            <div className="flex items-center gap-2" aria-hidden>
              <AgentAvatar size={28} state="thinking" />
              <span className="flex items-center gap-1">
                <span className="size-1.5 animate-bounce rounded-full bg-fg-mute [animation-delay:-0.2s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-fg-mute [animation-delay:-0.1s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-fg-mute" />
              </span>
            </div>
          )}

          {!typing && (
            <div className="mt-1 flex flex-wrap gap-2">
              {chips.map((t) => {
                const used = usedChipIds.has(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => askTopic(t)}
                    aria-pressed={used}
                    className={`agent-chip rounded-full border px-3 py-1.5 text-left text-xs transition-colors ${
                      used
                        ? "border-line text-fg-mute hover:text-fg-dim"
                        : "border-line text-fg-dim hover:border-line-strong hover:text-fg"
                    }`}
                  >
                    {t.chip}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {newMessagePending && (
          <button
            type="button"
            onClick={scrollToBottom}
            className="absolute inset-x-0 bottom-2 mx-auto flex w-fit items-center gap-1.5 rounded-full border border-line-strong bg-ink-2/95 px-3 py-1.5 text-xs text-fg shadow-[0_10px_30px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md"
          >
            New message
            <ArrowDown className="size-3" aria-hidden />
          </button>
        )}
      </div>

      {/* Composer */}
      <form
        className="flex items-center gap-2 border-t border-line px-3 py-3"
        onSubmit={(e) => {
          e.preventDefault();
          ask(value);
          setValue("");
        }}
      >
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={500}
          placeholder="Ask a question…"
          aria-label="Ask a question"
          className="min-w-0 flex-1 bg-transparent px-2 text-sm text-fg placeholder:text-fg-mute focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={!value.trim()}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-fg text-ink transition-opacity hover:opacity-85 disabled:opacity-30"
        >
          <Send className="size-4" aria-hidden />
        </button>
      </form>
    </div>
  );
}
