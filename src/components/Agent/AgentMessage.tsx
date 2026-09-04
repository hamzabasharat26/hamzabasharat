import { agentFallback } from "@/content/agent";
import AgentAvatar from "./AgentAvatar";
import type { ChatMessage } from "./useAgent";

/** One message bubble. Labelled by sender so a screen reader announces who
 *  is speaking, not just the text.
 *
 *  Only agent messages carry an avatar. The asymmetry is what separates the
 *  two speakers at a glance — giving both an avatar would remove the signal. */
export default function AgentMessage({ m }: { m: ChatMessage }) {
  const isUser = m.role === "user";
  const sender = isUser ? "You" : "Pixel";

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <span className="sr-only">{sender}: </span>
      <div className="flex min-w-0 max-w-[92%] items-start gap-2">
        {!isUser && <AgentAvatar size={28} className="mt-0.5" />}
        <div
          className={`min-w-0 rounded-2xl px-4 py-2.5 text-sm leading-relaxed [overflow-wrap:anywhere] ${
            isUser
              ? "bg-fg text-ink"
              : "border border-line bg-surface/70 text-fg-dim"
          }`}
        >
          {m.text}
        </div>
      </div>

      {m.cta && (
        <a
          href={m.cta.href}
          className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-1.5 text-xs text-fg transition-colors hover:bg-surface"
        >
          {m.cta.label} →
        </a>
      )}

      {m.lead && (
        <a
          href={`mailto:${agentFallback.email}`}
          className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-fg px-3.5 py-1.5 text-xs font-medium text-ink transition-opacity hover:opacity-85"
        >
          Email {agentFallback.email} →
        </a>
      )}
    </div>
  );
}
