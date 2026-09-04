# Build prompts — paste one stage at a time

**How to use this.** Open a terminal in the portfolio repo, run `claude`, and paste
Stage 0 first. Do not paste two stages at once. After each stage, check the
acceptance criteria yourself before moving on — the whole point of staging is that
you catch a wrong turn at stage 3 instead of discovering it at stage 9.

Each stage below is written to be pasted **verbatim**, including the constraints.
The constraints are the part that does the work.

Before you start, copy into the repo root:

```
CLAUDE.md
src/content/types.ts
src/content/site.ts
src/content/projects.ts
src/content/testimonials.ts
src/content/index.ts
```

---

## Stage 0 — Orient, don't build

> Read `CLAUDE.md` and everything in `src/content/`. Then read the existing codebase
> and produce, as a markdown file at `docs/AUDIT.md`, an inventory of what currently
> exists: every route, every component, and for each component (a) whether its copy is
> hardcoded or data-driven, (b) whether the copy is borrowed from the GetLayers/Vesper
> template, and (c) what it would take to make it render from `src/content/`.
>
> Also list every string in the codebase that is placeholder or borrowed — I want to
> delete all of it and I need the complete list.
>
> Build nothing this turn. No code changes. Just the audit.

**Acceptance:** `docs/AUDIT.md` exists, names every route and component, and the
borrowed-copy list includes at minimum "Motion instead of chrome", the "reads your
presence" line, `Northwind Atlas`, `Clinic Rota`, and the footer email
`silent.axiss@gmail.com`.

---

## Stage 1 — Wire the content layer

> Using `docs/AUDIT.md` as the plan, refactor every existing component so that all
> copy, links, metrics and project data come from `src/content/`. Do not change any
> visual design in this stage — same layout, same spacing, same motion, same colors.
> Only the data source changes.
>
> Where a component currently shows borrowed or invented content and there is no
> matching field in `src/content/`, leave the component rendering nothing and add the
> gap to a new file `docs/CONTENT-GAPS.md` with the exact field it needs.
>
> Type-check strictly. `npm run build` must pass with zero TypeScript errors.

**Acceptance:** `grep -ri "northwind\|clinic rota\|silent.axiss\|motion instead of chrome" src/`
returns nothing. Build passes. The site still looks identical apart from missing content.

---

## Stage 2 — Rewrite the hero

> Replace the hero copy with `site.headline` and `site.subhead` from
> `src/content/site.ts`. Then restructure the hero so the text is server-rendered
> static DOM that paints before the WebGL canvas mounts — the canvas is a dynamic
> import with `ssr: false` layered behind the text, not a wrapper around it.
>
> Replace the stats strip below the hero. It currently shows website metrics
> (91k particles, 8.3ms frame budget, 60fps). Render `site.proofStrip` instead —
> career metrics, each with its `context` line as a smaller second line.
>
> Apply the motion budget in `CLAUDE.md` section 4 to the particle hero: dpr cap,
> viewport-scaled point count, `prefers-reduced-motion` static fallback,
> IntersectionObserver pause, visibilitychange pause. Show me the diff for the
> render loop specifically.

**Acceptance:** With JS disabled the headline and proof strip still render. With
`prefers-reduced-motion: reduce` set in DevTools, no rAF loop runs — verify in the
Performance panel, not by eye.

---

## Stage 3 — Real project cards

> Rebuild the "Selected work" section to render `featuredProjects` from
> `src/content/projects.ts` — four cards: MagicQC, Fabric Defect Detection, SkyResQ,
> Dock Vision AI.
>
> Each card shows, in this order: kicker, title, `problem` (the one-sentence pain),
> the first two `outcome` metrics as large numbers with labels, the `stack` as small
> pills, a `status` pill, and the `links`. Cards with a `confidential` note show a
> small lock affordance with that note as the tooltip.
>
> `media.video` autoplays muted and looping **only** on hover and only when
> `matchMedia('(hover: hover)')` and the connection is not `save-data`. Otherwise the
> `poster` shows. Every card links to `/work/[slug]`.
>
> Keep the existing card visual language — the dark surface, the alternating
> left/right layout, the accent gradient. I like it. Change the content model, not
> the look.

**Acceptance:** Four cards, real projects, at least two metrics visible per card
without interaction. No video autoplays on a touch device.

---

## Stage 4 — Case study pages

> Create the route `/work/[slug]` generating a static page per project via
> `generateStaticParams`. The page is the six-part structure that technical
> reviewers scan for, in this exact order:
>
> 1. Header — kicker, title, org, role, year, status pill
> 2. **The problem** — `problem`, set large. This is the first thing read.
> 3. **Proof** — all `outcome` metrics as a row, `note` shown beneath each
> 4. **What I built** — `approach` as a numbered list
> 5. **Stack** — `stack`, with a one-line justification field I will fill in later
> 6. **Where it breaks** — `limitations`, in a visually quieter but not hidden block
> 7. Links, then previous/next project
>
> Any project whose `limitations` still start with `DRAFT:` renders that block with a
> visible dev-only warning banner in development and **omits the block entirely in
> production** — I do not want draft text shipping.
>
> Per-page metadata: title, description built from `problem`, and an OG image at
> `/og/[slug].jpg` falling back to `media.poster`.

**Acceptance:** Nine static pages build. `next build` output lists them. A page with
DRAFT limitations shows the warning in dev and omits the block in `NODE_ENV=production`.

---

## Stage 5 — Capabilities, experience, credentials

> Replace the three "Services" entries with `site.services`. Each service lists its
> `evidence` project slugs as links — the claim and its proof next to each other.
> This is the section that answers "what can you do for me".
>
> Below it add three new sections rendering from `src/content/site.ts`:
> `experience` as a vertical timeline where each highlight with a `projectSlug` links
> to that case study; `skillGroups` as grouped lists — no logo walls, no progress bars,
> no percentage-proficiency nonsense; and `awards` + `certifications` as a compact
> two-column credential block.
>
> Keep all four sections scannable in under 20 seconds. If a section needs a "show
> more", build it as a real disclosure widget.

**Acceptance:** No skill is shown as a percentage or a five-star rating. Every
experience highlight that maps to a project is a working link.

---

## Stage 6 — Testimonials, gated

> Build a `Testimonials` section rendering `testimonials` from
> `src/content/testimonials.ts`. It renders **only** when `hasTestimonials` is true —
> when the array is empty, the section returns `null` and leaves no gap in the layout.
>
> Each testimonial shows the verbatim quote, the author's name, title and org, the
> date, and a "View on LinkedIn" link built from `source`. Do not add avatars unless
> a local `avatar` path is present — no stock photos, no generated faces, no initials
> circles that imply a photo exists.
>
> **Do not write, draft, paraphrase, or placeholder any testimonial text.** If you
> think the section looks empty, that is correct and intended.

**Acceptance:** With the array empty, the section is absent from the DOM entirely.
No invented quote appears anywhere in the repo.

---

## Stage 7 — Contact, CV route, and the footer

> Fix the footer: the email is currently `silent.axiss@gmail.com`. Use `site.email`.
> Rebuild the footer links from `site.links` and `site.nav`.
>
> Rewrite the FAQ. The current questions are about motion design and low-end hardware.
> Replace them with the four questions an AI/CV hiring manager or client actually
> asks. Draft them, show me the drafts, and do not ship until I approve the wording.
>
> Add a `/cv` route that renders the full CV from `src/content/` as accessible HTML —
> not an embedded PDF viewer — with a download link to the PDF at `site.links.cv`.
> This is what gets indexed and what a screen reader can read.
>
> The contact section: replace the email-capture input with a `mailto:` primary
> action and secondary LinkedIn/GitHub links. A form that posts nowhere is worse
> than no form. If I later want a real form, we will add one with a backend.

**Acceptance:** `grep -r "silent.axiss" .` returns nothing. `/cv` is real HTML,
indexable, and passes heading-order checks.

---

## Stage 8 — SEO, structured data, social

> Implement metadata from `site.seo`: a root `metadata` export with title template,
> canonical URL, and OpenGraph/Twitter cards. Generate `app/sitemap.ts` and
> `app/robots.ts` covering the home page, `/about`, `/cv`, and all nine `/work/[slug]`
> routes.
>
> Add JSON-LD: a `Person` schema on the home page carrying name, jobTitle, address,
> email, `sameAs` for LinkedIn and GitHub, `alumniOf` NUTECH, and `knowsAbout` from
> the skill group titles. Add a `CreativeWork` schema on each case study.
>
> Build OG images at `/og/[slug]` using `next/og` — project title, the first outcome
> metric, and my name. One template, generated at build time.
>
> Then run a real check: fetch the built pages and confirm every route has a unique
> title and description, and that no page description is the default.

**Acceptance:** `sitemap.xml` lists 12+ URLs. JSON-LD validates. No two routes share
a meta description.

---

## Stage 9 — Verify, don't assume

> Using the Chrome DevTools MCP, do the following and report actual numbers, not
> impressions:
>
> 1. Screenshot the home page at 360px, 768px, 1280px and 1920px. Look at each one
>    and tell me what is broken.
> 2. Record a performance trace of a full scroll of the home page. Report the frame
>    budget, the longest task, and any layout shift.
> 3. Run Lighthouse on `/` and on one `/work/[slug]`. Report Performance,
>    Accessibility, Best Practices and SEO for both.
> 4. Check color contrast on every text/background pair in both themes. List every
>    pair below 4.5:1 with the measured ratio.
> 5. Tab through the entire home page and list any element that receives focus
>    without a visible indicator, and any interactive element that cannot be reached.
>
> Then fix everything you found, in order of severity, and re-run 3–5 to prove it.

**Acceptance:** Performance ≥ 90 on mobile, Accessibility 100, zero contrast failures,
zero unreachable interactive elements. If you cannot hit those, tell me which and why
rather than adjusting the target.

---

## Stage 10 — The things only you can do

Not a prompt. A checklist for Hamza:

- [ ] Fill every `DRAFT:` limitation in `src/content/projects.ts`. Three sentences each.
- [ ] Export the videos from your Drive "Portfolio _ Vedios" folder to `public/media/`
      as `.mp4` (H.264) **and** `.webm`, max 8s, muted, under 2 MB each.
- [ ] Make a poster frame for every project — a still from the video, 1200×750.
- [ ] Paste your real LinkedIn recommendations into `src/content/testimonials.ts`.
- [ ] Fix the CV: the "Code" link on the CV Recruiter RAG Agent points at an image
      folder (`CV-Projects/tree/main/assets/images`), not the project.
- [ ] Resolve the location mismatch — the CV header says Lahore, your GitHub says
      Islamabad, and all three roles are Islamabad. Pick one and make it consistent.
- [ ] Add a one-line stack justification per project ("FastAPI because the client's
      backend was already Python and we needed async inference under load").
- [ ] Point the domain at it. `hamzabasharat.vercel.app` is fine, `hamzabasharat.com`
      is better for a CV link.
