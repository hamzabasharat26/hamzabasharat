# CLAUDE.md — hamzabasharat.com

Standing instructions for every session in this repo. Read before acting.
When a request conflicts with this file, say so and ask; do not silently override it.

---

## 1. What this site is

A portfolio for **Hamza Basharat, AI & Computer Vision Engineer** (Lahore, Pakistan).
Two audiences, one spine:

| Audience | Arrives via | Needs to believe in 30 seconds |
|---|---|---|
| Technical recruiter / hiring manager | LinkedIn, CV link, referral | He has shipped vision systems to production, with numbers |
| Prospective client | Referral, cold search | He can take a problem from dataset to a monitored deployment |

**The spine is AI/CV engineering.** The evidence of skill is the shipped project
work — the case studies, the live sites, the numbers — never the site's chrome.
If a change makes the site read as "motion designer" or "full-stack web studio",
it is wrong regardless of how good it looks.

---

## 2. Content law

- `src/content/` is the **single source of truth**. No copy, metric, project title,
  or link is ever hardcoded in a component. If you need new copy, add a field to the
  data and render it.
- Every number on the site traces to `Hamza_BasharatCV.pdf`. **Never invent a metric,
  a client name, a date, or an outcome.** If a slot needs a number that does not exist,
  leave the slot out and tell Hamza what is missing.
- `src/content/testimonials.ts` is empty until Hamza pastes real LinkedIn
  recommendations. **Never write a testimonial.** Never generate a placeholder quote,
  even marked as fake — placeholder quotes get shipped by accident. If the array is
  empty, the section does not render.
- Fields marked `DRAFT:` are Hamza's to fill. Do not guess at them. Surface them in a
  checklist instead.
- No lorem ipsum, ever. If real content is missing, render the empty state.

---

## 3. Positioning rules for copy

- Lead with the **pain**, not the model. "Fabric defects are caught by eye" beats
  "YOLOv8 + PatchCore anomaly detection pipeline".
- Every project card must show at least one **measured outcome** above the fold of
  that card. A project with no metric goes below the fold or off the site.
- Write in first person, plain, declarative. No "passionate about", no "leveraging",
  no "cutting-edge", no "innovative solutions".
- British/American spelling: pick American and stay there.
- The word "AI" appears in the role, not in every sentence.

---

## 4. Motion budget — non-negotiable

There is **no WebGL**. The hero backdrop (`HeroBackdrop.tsx`) is CSS + a small
inline SVG — corner blooms, a faint detection dot-grid in the right gutter, a
slow scan sweep, two pulsing outline boxes. A 52k-point Three.js cloud lived
here until 2026-09 and was cut: it froze the main thread for 150-300 ms on
mount and starved scroll on weak GPUs. Do not bring a canvas hero back without
a very good reason and a profile.

- **First contentful paint is static DOM.** No hero element blocks paint.
- Every backdrop layer is `transform`/`opacity` only and **frozen under
  `prefers-reduced-motion`** (the `.hb-*` rules at the foot of `globals.css`).
- Always-on animation is deliberately small: the CSS marquees (stack ticker +
  project strip, paused on hover), the cursor rAF, the scan sweep. Nothing
  else loops.
- Total JS shipped to the home route: **at or under 250 KB gzipped**. The floor
  is React + Next + GSAP/ScrollTrigger + Lenis (~249 KB). If a change pushes
  past it, split ScrollTrigger or a component to a lazy chunk.
- Target 60fps scroll on an integrated GPU at 4× CPU throttle. Measure with a
  Chrome DevTools performance trace, don't assume.

Scroll animation is GSAP + ScrollTrigger. One `useGSAP` scope per component,
always cleaned up. Never animate `top`/`left`/`width` — transforms and opacity
only. `withMotion()` gates every tween on reduced motion.

---

## 5. Accessibility floor (WCAG 2.1 AA)

- Body text ≥ 4.5:1 against its actual background. The dark theme's muted grey on
  near-black is the usual failure — check it, don't eyeball it.
- Every interactive element has a visible `:focus-visible` state. The hero backdrop
  and the custom cursor layer are `aria-hidden` and not focusable.
- Headings are a real outline: one `h1` per page, no level skips.
- All project media has meaningful `alt` describing what the system is doing, not
  "screenshot".
- The FAQ accordion is a real disclosure widget (`button` + `aria-expanded`), not a
  div with a click handler.
- Colour is never the only carrier of meaning — status pills carry a label too.

---

## 6. Stack and conventions

- Next.js App Router, TypeScript strict, Tailwind, shadcn/ui for primitives.
- GSAP + `@gsap/react` for all timeline/scroll work; Lenis for smooth scroll.
  No Three.js, no r3f — removed 2026-09 (see §4).
- Server Components by default. `'use client'` only on components that need
  state, refs or effects — the nav, the accordion, the project grid, the
  agent, the cursor, the demos row.
- Files: `PascalCase.tsx` for components, `kebab-case.ts` for everything else.
- No new dependency without saying what it costs in bundle size and why the platform
  can't do it.

---

## 7. Forbidden

- Borrowed copy. The current build carries GetLayers/Vesper's own lines
  ("Motion instead of chrome", "It reads your presence"). All of it goes.
- Invented projects. `Northwind Atlas` and `Clinic Rota` are demo fiction and must be
  deleted, not adapted.
- Metrics about the website (particle count, frame budget) presented as career proof
  above the fold.
- Any client logo, name or footage not cleared. `magicqc`, `industrial-pose-suite`
  and `skyresq` carry `confidential` notes — respect them.
- `localStorage` for anything that matters. Theme preference only.

---

## 8. Definition of done for any section

1. Renders from `src/content/`, no hardcoded strings.
2. Reads correctly at 360px, 768px, 1280px, 1920px.
3. Passes `prefers-reduced-motion`.
4. Keyboard-navigable, focus visible, contrast checked.
5. Lighthouse: Performance ≥ 90 mobile, Accessibility 100.
6. Screenshotted via Chrome DevTools MCP and actually looked at before you say it works.

---


## 9. Current build architecture

Re-verified against the working tree after the 2026-09 completion passes. This is
now a description of how the build works, not a migration snapshot. Sections 1–8
still win any conflict.

### The hero backdrop — `HeroBackdrop.tsx`, pure CSS/SVG

A fixed `-z-10` full-viewport layer: ambient corner blooms + a faint starfield
(both `background:` gradients carried over from the old build), a detection
dot-grid masked to the right gutter, one slow CSS scan sweep, two pulsing SVG
outline boxes. No canvas, no rAF loop, no scroll wiring. Frozen entirely under
`prefers-reduced-motion` by the `.hb-*` block at the foot of `globals.css`.

The 52k-point Three.js cloud (`MorphField` / `MorphStage` / `lib/shapes.ts`)
was **removed 2026-09** — it froze the main thread on mount and starved scroll
on weak GPUs. `three`, `@react-three/*` and the bake script are gone from
`package.json`.

### The project surfaces — strip + grid + `/work`

- **`ProjectStrip.tsx`** — server component, a horizontal CSS-marquee ticker of
  every project thumbnail plus a curated handful of `/lab` technique cards
  (`.marquee`, list rendered twice, `translateX(-50%)` loop), right after the
  hero. `StripItem` is `{id,title,poster,tag,href}` — project cards deep-link
  to `/work/<slug>`, lab cards to `#lab`. Pause on hover; reduced motion →
  `overflow-x` scroll.
- **`Projects.tsx`** — one uniform 3-col grid (no more featured/compact split).
  Each `Card` overlays a category chip + a metric chip (`chipMetric()` prefers
  a numeric outcome) on the media, then title/year/problem/tags; the whole
  cell links to `/work/[slug]` via an `::after` overlay. Client component only
  because of the domain filter + the stagger reveal. Takes `showAll` — false
  caps at `HOME_LIMIT` (6) with a "View all" link; `/work` passes it true.
- **`src/app/work/page.tsx`** — the full grid index, reuses `<Projects showAll>`.
- **`CardMedia`** picks video → `frames` cross-fade slideshow → image →
  branded-SVG fallback.

### `Demos.tsx` — "In the lab"

Five short technique clips (`public/media/demos/*`, Hamza's own, ~60 KB each).
Poster-first; `<video>` only mounts via `IntersectionObserver` and only on a
hover-capable pointer; plays on hover; poster-only under reduced motion.

### Anchor ids are load-bearing

`#top`, `#work`, `#proof`, `#capabilities`, `#about`, `#faq`, `#testimonials`,
`#contact`, plus `#light-band` (the inset white-card wrapper — `Nav` observes
it to invert the pill). ScrollTrigger and the nav target these; renaming one
silently breaks scroll choreography.

### Accent ramp — single source

`globals.css` `@theme` owns `--color-a1..a4`. The hero backdrop and the branded
SVG posters read these; change them there only.

### Route transition

`src/app/template.tsx` remounts on every client navigation, so its children
replay the `.route-in` entry animation — a page transition with no library.

### The site agent

`src/components/Agent/*` is a **canned** widget, named **Pixel** in its own
copy (the greeting and "who are you" answer in `agent.ts` self-identify; the
Hamza-voice answers do not — those stay Hamza's own first-person words,
unnamed). `useAgent.ts` scores a question against the patterns in
`src/content/agent.ts` and returns that topic's fixed string. No model in the
loop, so nothing can be hallucinated; every line still traces to
`projects.ts` / `site.ts` / the CV (§2). `src/app/api/agent/route.ts`
scaffolds an LLM tier but is **off** (503) and needs an explicit cost decision
before it is wired.

### The audio system

`src/lib/audio.ts` is the single source of truth for every sound: a landing
ambience bed, an agent voice+music intro, and click SFX on every control —
see the file's own header comment for the full design. All three are gated
per page load (not persisted across visits): a reload or re-pasted link is a
fresh shot, in-memory state only stops the intro replaying on every re-open
within the *same* load. `AgentPanel`'s message list carries
`data-lenis-prevent` — without it, Lenis (`SmoothScroll.tsx`) hijacks
wheel/touch on the whole document and a scroll started inside the panel
drives the page behind it instead.

### Dev tooling

- `scripts/shoot.mjs` / `scripts/audit-case-studies.mjs` — puppeteer-core drives
  the installed Chrome, scrolls each section for real, retries unpainted frames.
- `scripts/measure.mjs` / `scripts/motion-diff.mjs` — numeric colour/coverage
  gate and a scroll-pacing timeline.
- `scripts/draft-fields.mjs` — regenerates `docs/DRAFT-FIELDS.md`.

Harness gotchas: a headless warm-up must **execute JS** or the lazy `MorphField`
chunk never compiles and the shot is blank; never `next build` against the
`.next` a dev server is using — it corrupts `.next/dev/types` and fails the type
check with phantom errors in `validator.ts`; headless software-GL renders
additive blending unreliably, so judge the field's exact brightness and pacing
in a real browser, not a screenshot.
