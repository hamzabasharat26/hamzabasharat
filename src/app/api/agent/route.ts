import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Tier 3 — the LLM fallback. SCAFFOLDED AND OFF.
//
// The widget works fully without this route: tiers 1, 2 and 4 are all
// client-side and free. This exists so a grounded model answer can be turned
// on later by setting ANTHROPIC_API_KEY, without a rebuild of the client.
//
// It is deliberately inert until then. When wired, the guard rails below are
// not optional — an open, unmetered LLM endpoint on a public page is a bill,
// and a model that improvises about someone's career invents employers and
// rates. See the hard rules in src/content/agent.ts.
// ---------------------------------------------------------------------------

export const runtime = "nodejs";

// Per-IP sliding window. In-memory is fine for a single instance; move to a
// shared store (the Supabase MCP is connected) if this ever runs multi-region.
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const PER_IP = 10;
const GLOBAL_DAILY = 400;
const hits = new Map<string, number[]>();
let globalDay = { day: 0, count: 0 };

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const day = Math.floor(now / (24 * 60 * 60 * 1000));
  if (day !== globalDay.day) globalDay = { day, count: 0 };
  if (globalDay.count >= GLOBAL_DAILY) return true;

  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= PER_IP) return true;
  arr.push(now);
  hits.set(ip, arr);
  globalDay.count++;
  return false;
}

export async function POST(req: Request) {
  // Off unless a key is configured. The client treats 503 as "use the canned
  // fallback", so this degrades cleanly.
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Agent LLM tier is not enabled." },
      { status: 503 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Rate limit reached." }, { status: 429 });
  }

  let body: { message?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const message = typeof body.message === "string" ? body.message : "";
  if (!message || message.length > 500) {
    return NextResponse.json(
      { error: "Message must be 1–500 characters." },
      { status: 400 }
    );
  }

  // When enabled, stream a grounded answer here with a system prompt that:
  //   - answers ONLY from src/content/agent.ts + site content,
  //   - never invents employers, projects, metrics or dates,
  //   - never quotes a price outside $1,500 / $5,000–15,000,
  //   - hands off to email when the answer is not in the content.
  // Left unimplemented on purpose so no AI dependency ships until it is turned on.
  return NextResponse.json(
    { error: "Agent LLM tier is configured but not implemented." },
    { status: 501 }
  );
}
