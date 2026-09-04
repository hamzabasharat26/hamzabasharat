"use client";

import { useCallback, useRef, useState } from "react";
import {
  agentTopics,
  agentFallback,
  agentGreeting,
  type AgentTopic,
} from "@/content/agent";

export type ChatMessage = {
  id: number;
  role: "user" | "agent";
  text: string;
  cta?: { label: string; href: string };
  /** Fallback message that offers the email handoff. */
  lead?: boolean;
};

/**
 * Canned matcher. A chip is an exact topic lookup; free text is scored against
 * each topic's patterns — a verbatim phrase hit is weighted far above a stray
 * keyword, so "do you deploy on jetson" lands on the edge answer rather than a
 * generic pitch. There is no model in the loop: every reply is a string from
 * agent.ts, so nothing can be hallucinated. The scaffolded LLM route is off.
 */
function matchTopic(input: string): AgentTopic | null {
  const q = input.toLowerCase();
  const qWords = q.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 3);
  let best: AgentTopic | null = null;
  let bestScore = 0;

  for (const t of agentTopics) {
    let score = 0;
    for (const p of t.patterns) {
      const multi = p.includes(" ");
      if (q.includes(p)) {
        score += multi ? p.length + 25 : p.length;
      } else if (multi) {
        // Not verbatim, but every content word of the phrase is somewhere
        // in the question — counts, at a discount.
        const pw = p.split(" ").filter((w) => w.length > 3);
        if (pw.length >= 2 && pw.every((w) => qWords.includes(w))) score += p.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = t;
    }
  }

  // A single 3-letter coincidence should not fire an answer.
  return bestScore >= 5 ? best : null;
}

export function useAgent() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, role: "agent", text: agentGreeting },
  ]);
  const [typing, setTyping] = useState(false);
  // Chips stay visible and clickable for the whole session (a fresh one every
  // reopen, since the panel remounts) — a chip already asked is just
  // de-emphasised so the panel still reads as "here's what you can ask",
  // not a one-shot menu that vanishes after the first question.
  const [usedChipIds, setUsedChipIds] = useState<Set<string>>(new Set());
  const nextId = useRef(1);
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const push = useCallback((m: Omit<ChatMessage, "id">) => {
    setMessages((prev) => [...prev, { ...m, id: nextId.current++ }]);
  }, []);

  const replyWith = useCallback(
    (topic: AgentTopic | null) => {
      setTyping(true);
      // A beat before the reply — longer for a longer answer, so it does not
      // snap back the instant the question lands. Instant under reduced motion.
      const answer = topic ? topic.answer : agentFallback.answer;
      const delay = reduce ? 0 : Math.min(1100, 320 + answer.length * 2.2);
      window.setTimeout(() => {
        setTyping(false);
        if (topic) push({ role: "agent", text: topic.answer, cta: topic.cta });
        else push({ role: "agent", text: agentFallback.answer, lead: true });
      }, delay);
    },
    [push, reduce]
  );

  /** A suggestion chip was pressed. */
  const askTopic = useCallback(
    (topic: AgentTopic) => {
      push({ role: "user", text: topic.chip ?? topic.id });
      replyWith(topic);
      setUsedChipIds((prev) => (prev.has(topic.id) ? prev : new Set(prev).add(topic.id)));
    },
    [push, replyWith]
  );

  /** Free-text submit. */
  const ask = useCallback(
    (text: string) => {
      const trimmed = text.trim().slice(0, 500);
      if (!trimmed) return;
      push({ role: "user", text: trimmed });
      replyWith(matchTopic(trimmed));
    },
    [push, replyWith]
  );

  return { messages, typing, ask, askTopic, usedChipIds };
}
