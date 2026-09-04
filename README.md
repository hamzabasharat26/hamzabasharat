# hamzabasharat.tech

The portfolio of **Hamza Basharat** — AI / ML Engineer (Computer Vision, RAG & LLM Agents, MLOps), Lahore, Pakistan.

Live at [hamzabasharat.tech](https://hamzabasharat.tech).

## What this is

A content-driven portfolio built to do two jobs at once: read as production-engineering
proof to a technical recruiter, and as a direct pitch to a prospective client or freelance
lead. Every project, metric and claim on the site traces back to a real, shipped system —
nothing is invented copy. The site includes:

- A project index with case studies, each carrying at least one measured outcome.
- A "Pixel" chat widget — a canned, pattern-matched Q&A knowledge base (no LLM in the
  loop, so nothing it says can be hallucinated), scoped to what Hamza actually builds,
  ships, charges and can't do.
- A small three-system audio layer: a one-shot landing ambience, a voice+music intro
  the first time the chat opens, and click feedback on every control — all gated per
  page load, never persisted, and fully skipped under `prefers-reduced-motion`.
- A CV route, an FAQ disclosure widget, and full OpenGraph/JSON-LD/sitemap coverage.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, React Server Components, React Compiler) |
| Language | TypeScript, strict mode |
| UI | React 19, Tailwind CSS v4 (`@theme` tokens) |
| Motion | [GSAP](https://gsap.com) + `@gsap/react` (scroll-triggered reveals), [Lenis](https://lenis.darkroom.engineering) (smooth scroll) |
| Icons | [lucide-react](https://lucide.dev) |
| Fonts | `next/font` — Geist Sans / Geist Mono |
| Audio | Native `HTMLAudioElement` + Web Audio API (`AnalyserNode`) — no audio library |
| Deployment | [Vercel](https://vercel.com) |
| Dev tooling | `sharp` (image/media processing), `puppeteer-core` (screenshot/QA scripts), ESLint 9 |

No CMS, no database, no auth — this is a static-first marketing site. The one API
route (`/api/agent`) is a scaffolded, rate-limited LLM fallback tier that ships
**off** (returns `503`) until an explicit cost decision turns it on.

## Content architecture

`src/content/` is the single source of truth for every string on the site — no copy,
metric, project title or link is ever hardcoded in a component. To change what the
site says, edit the data in `src/content/`, not the JSX.

```
src/content/
  site.ts          identity, services, FAQ, skills, experience, awards
  projects.ts      every case study — problem, approach, outcome, media
  agent.ts         the Pixel chat's knowledge base (topics, patterns, answers)
  lab.ts           the "In the lab" technique wall
  testimonials.ts  empty until real recommendations are pasted in — never a placeholder
  types.ts         shared content types
```

## Media

All static assets live under `public/media/` — images, video, the agent avatar, sound
effects, and the CV PDF, one folder, one immutable-cache rule in `next.config.ts`.
Raw source exports (unprocessed drive footage, alternate CV drafts) never ship; they
stay out of the repo and get built into `public/media/` by the scripts in `scripts/`.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm run start    # serve the production build locally
npm run lint     # ESLint
```

> Judge real performance against `npm run build && npm run start` — `next dev` is
> always slower and not representative of production.

## Deployment

Deployed on Vercel, zero extra configuration — it auto-detects Next.js. No
environment variables are required for the site to run; `ANTHROPIC_API_KEY` is
read by the (currently disabled) `/api/agent` route only if that tier is ever
turned on.

## Security

- Baseline hardening headers (`X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`) on every route — see `next.config.ts`.
- No cookies, sessions, or tokens anywhere in the app — there's nothing to
  authenticate, so nothing to secure there.
- `/api/agent` is IP-rate-limited and globally capped even while disabled, so
  turning it on later doesn't ship an open, unmetered endpoint by accident.
- Every external link (`target="_blank"`) carries `rel="noopener noreferrer"`.

## License

Personal portfolio — content and case-study material are Hamza Basharat's own.
Not licensed for reuse.
