# AUDIT — current build vs the AI/CV content model

Stage 0 of `BUILD-PROMPTS.md`, plus the `src/lib/content.ts` migration section
required by `CONTENT-ARCHITECTURE.md §1`. **No code was changed.**

Repo is a single-route Next.js 16 App Router site. Everything below describes the
Vesper-derived build being migrated away from.

---

## 1. Routes

| Route | File | Notes |
|---|---|---|
| `/` | `src/app/page.tsx` | The only page. Renders 8 sections plus fixed chrome. |
| `/_not-found` | framework default | Not customised. |

`src/app/layout.tsx` holds metadata and imports `identity` from the old layer.

**No `/lab`, no `/projects/[slug]`, no `/cv`.** HANDOFF §3 wants nine case-study
routes plus `/lab`; none exist yet.

---

## 2. Component inventory

`H` = copy hardcoded in JSX · `D` = from `src/lib/content.ts` · `B` = borrowed from
Vesper/GetLayers.

| Component | Copy source | Borrowed? | To make it render from `src/content/` |
|---|---|---|---|
| `Boot.tsx` | H | **B** — literal `VESPER` wordmark and `V—ORB / SYS.04` | Needs `site.name`. The sub-label has no equivalent; it is template dressing. Delete or re-derive. |
| `Nav.tsx` | D — `identity`, `nav` | no | `site.name` plus `site.nav`. |
| `Hero.tsx` | D — `identity` | **B** — renders `identity.tagline`, which is "Motion instead of chrome". `presenceNote`, `tags`, `blurb` are template furniture I authored. | `site.headline` plus `site.subhead`. Corner furniture has no equivalent — decision needed. |
| `Presence.tsx` | D — `presence` | **B** — "Built to be felt, not just seen" | Heading has no equivalent. **Stats strip becomes `site.proofStrip`** — CLAUDE §7 forbids the current website-metrics version. |
| `Approach.tsx` | D — `approach` | **B** — "Motion instead of chrome" again, "Reads presence, in motion", and both corner notes | **No home in the new model.** CONTENT-ARCHITECTURE §1 flags this as needing a decision. |
| `Services.tsx` | D — `services` | no | `site.services`. Shape differs. |
| `Projects.tsx` | D — `projects` | **B** — "Selected work"; the data is invented fiction | `projects` from `src/content/projects.ts`. Type is completely different — see §4. |
| `LightSections.tsx` | D plus H | **B** — "A living interface"; "Frequently asked" is hardcoded | `about` has no equivalent. **FAQ has no home in the new model.** |
| `Closing.tsx` | D — `identity`, `footerColumns` | **B** — "Let's talk." hardcoded | `site.email`, `site.links`. |
| `MorphStage.tsx` / `MorphField.tsx` | n/a | the *shapes* are borrowed | Orb to galaxy to brain is the Vesper sequence. CONTENT-ARCHITECTURE §0 replaces it with raw cloud to detections to pose skeleton. |
| `SmoothScroll.tsx` | n/a | no | — |

---

## 3. Complete borrowed and placeholder string list

Every one of these must go.

### In `src/lib/content.ts` — the whole file is being deleted

- "Motion instead of chrome" — Vesper's headline, used twice: `identity.tagline` and `approach.headingTop`
- "Reads presence, in motion" — `approach.headingBottom`
- "It reads your presence — pointer, scroll, dwell..." — `identity.presenceNote`
- "A living interface" — `about.heading`
- "Built to be felt, / not just seen" — `presence.heading`
- "Every interaction here is a reply to you..." — `presence.caption`
- "Point counts, tessellation and pixel ratio step down by device..." — `approach.noteLeft`
- "Reduced-motion honoured across the page..." — `approach.noteRight`
- **Invented projects**: "Ledgerline", "Northwind Atlas", "Clinic Rota". CLAUDE §7 — "demo fiction and must be deleted, not adapted."
- **Their fabricated metrics**: "Cut month-end reconciliation from 6 hours to 25 minutes"; "180k routes rendered in a single draw call, 8ms frame budget"; "Rota build time down 4.2s to 0.8s; 340 staff on it daily"
- `silent.axiss@gmail.com` — `identity.email`, rendered in Hero, Approach, Closing and the footer
- "Full-Stack Developer" — wrong role; the spine is AI/CV
- "Selected work", `identity.tags`, `identity.blurb`, `services`, `faq`, `about.points`

### Hardcoded in components

- `Boot.tsx` — `VESPER`, `V—ORB / SYS.04`
- `LightSections.tsx` — "Frequently asked"
- `Closing.tsx` — "Let's talk."
- `Projects.tsx` — "Selected work"
- `globals.css` — the `VESPER-IDIOM DESIGN TOKENS` comment

### In `src/app/layout.tsx`

- `metadataBase: new URL("https://example.com")` with `// TODO your domain`

### Generated placeholder media in `public/work/`

`ledgerline.svg`, `northwind-atlas.svg`, `clinic-rota.svg`, `portrait.svg` — all
abstract SVG I generated. None real.

> `"motion instead of chrome"` also matches inside `src/content/site.ts`, but only in
> a comment explaining what the new headline replaces. Not a violation.

---

## 4. `src/lib/content.ts` — the migration that blocks Stage 1

Required by `CONTENT-ARCHITECTURE.md §1`, not by `BUILD-PROMPTS.md`.

**Nine importers**, all from `@/lib/content`:

| Importer | Exports used |
|---|---|
| `src/app/layout.tsx` | `identity` |
| `Nav.tsx` | `identity`, `nav` |
| `Hero.tsx` | `identity` |
| `Presence.tsx` | `presence` |
| `Approach.tsx` | `approach`, `identity` |
| `Services.tsx` | `services` |
| `Projects.tsx` | `projects` |
| `LightSections.tsx` | `about`, `faq` |
| `Closing.tsx` | `identity`, `footerColumns` |

### Export-by-export replacement

| Old export | Replacement in `src/content/` | Status |
|---|---|---|
| `identity.name` | `site.name` | direct |
| `identity.role` | `site.role` / `site.roleLong` | direct |
| `identity.tagline` | `site.headline` | direct — removes the borrowed line |
| `identity.intro` | `site.subhead` | direct |
| `identity.email` | `site.email` | direct |
| `identity.location` | `site.location`, plus `site.relocation` | direct |
| `identity.availability` | `site.availability` | direct |
| `identity.socials` | `site.links` | direct |
| `identity.presenceNote`, `.tags`, `.blurb` | — | **no equivalent.** Template furniture I authored. Recommend deleting alongside the hero reshape. |
| `nav` | `site.nav` | direct |
| `presence.stats` | `site.proofStrip` | direct, and required. Shape changes from `{value,label}` to `{value,label,context}`. |
| `presence.heading`, `.caption` | — | **no equivalent — needs a decision** |
| `approach.*` (five strings) | — | **no equivalent — needs a decision.** The entire corner-text band. |
| `about.heading`, `.points`, `.portrait` | — | **no equivalent.** Closest material is `site.subhead` plus `experience`. Needs a new field or a section rethink. |
| `faq` | — | **no equivalent — needs a decision** |
| `services` | `site.services` | shape differs: `{title,body}` becomes `{n,title,blurb}` |
| `footerColumns` | `site.links` plus `site.nav` | needs re-derivation, not a rename |
| `projects` | `projects` from `src/content/projects.ts` | **complete type replacement** — see below |
| `featuredProjects` | `projects.filter(p => p.featured)` | same idea; new model caps featured at four |

### The `Project` type is not a rename

`Projects.tsx` will not compile against the new data.

| Old field | New field |
|---|---|
| `summary: string` | `problem: string` — one sentence, pain first |
| `outcome?: string` | `outcome: Metric[]` — **two to four required**, each `{label,value,note?}` |
| `stack: string[]` | `stack: string[]` — kept |
| `cover: string` | `media: { poster, video?, alt }` |
| `liveUrl` / `repoUrl` | `links: ProjectLink[]`, each with a `kind` |
| `role`, `year` | `role`, `year`, plus new `org` and `kicker` |
| — | `approach: string[]` — three to five bullets |
| — | `limitations: string[]` — **14 `DRAFT:` fields across nine projects, Hamza's to fill** |
| — | `status`, `domains[]`, `confidential?` |

**Three projects carry `confidential` notes**: `magicqc`, `industrial-pose-suite`,
`skyresq`. CLAUDE §7 and HANDOFF §6.5 — CV-level detail only, no client footage or
logos.

### Recommendation

Do not silently port `Approach`, the FAQ, `presence.heading` or `about`. Those are
exactly the sections with no home in the new model, and CONTENT-ARCHITECTURE §1 calls
for a decision on each. Everything else is a mechanical swap.

---

## 5. What is already correct and should survive

- The three-layer WebGL split and the ref contract documented in `CLAUDE.md §9`. The
  machinery is sound; only the three *shapes* are borrowed.
- `scripts/shoot.mjs`, `scripts/measure.mjs`, `scripts/motion-diff.mjs` — real
  verification tooling, including a numeric colour and coverage gate.
- `src/lib/motion.ts` — the shared reveal vocabulary, reduced-motion gated.

---

## 6. Conflicts between the current build and `CLAUDE.md`

Found while auditing. Each is a real violation, not a preference.

| CLAUDE.md rule | Current state |
|---|---|
| §4 `dpr` capped at `[1, 1.5]` | `MorphField.tsx` uses `[1, 1.75]` |
| §4 point count scales **by viewport** — full ≥1280px, half <768px | tiers on `navigator.hardwareConcurrency` |
| §4 reduced motion → **static gradient poster, no rAF loop** | renders the canvas and holds it still; rAF still runs |
| §4 pause on `IntersectionObserver` and `visibilitychange` | neither implemented |
| §4 home route JS **under 250 KB gzipped** | ships Three.js plus a 1.4 MB `brain-points.bin` |
| §5 FAQ is a real disclosure widget — `button` plus `aria-expanded` | native `<details>`; closer than a div, still not the specified pattern |
| §5 one `h1` per page | `Hero` has the only `h1` — **OK** |
| §7 no website metrics as career proof | `Presence` stats strip shows 91k / 8.3 / 0.9 / 60 |
| §2 no invented metrics | three fabricated project outcomes |

---

## 7. Gaps needing Hamza, not code

- 14 `DRAFT:` limitation fields across nine projects
- `authorOrg` reads `'Client'` for two of the five testimonials
- No real media — `public/work/` holds only generated SVG
- `Hamza_Basharat_CV.pdf` is absent from `public/`; `site.links.cv` expects it
- `assets/drive/` not downloaded, so the media pipeline cannot run
