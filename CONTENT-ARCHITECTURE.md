# Content architecture — mapping the build onto the CV

Companion to `CLAUDE.md` and `BUILD-PROMPTS.md`. Read all three before starting.

This file answers one question those two do not: **the repo already contains a
finished Vesper-derived visual build. How does the AI/CV content model land on it?**

---

## 0. The problem nobody has named yet

`CLAUDE.md §1` says:

> If a change makes the site read as "motion designer" or "full-stack web studio",
> it is wrong regardless of how good it looks.

The current hero is a particle cloud that morphs **orb → spiral galaxy → brain**.
That sequence was copied from a commercial template for a rendering engine. On an
AI/CV engineer's portfolio it does two bad things at once:

1. A glowing brain is the single most worn-out visual cliché in AI. It signals
   "bought a template", not "ships vision systems".
2. It is decoration. `CLAUDE.md` requires the hero to be *evidence of skill*, and
   evidence has to be about the work.

**Fix the meaning, keep the machinery.** The morph engine — one buffer, three target
shapes, scroll-driven interpolation, per-point lag — is well built and should not be
thrown away. Only the three shapes change:

| State | Now | Should be | What it says |
|---|---|---|---|
| 0 | Torus | **Raw point cloud** — unstructured depth capture, scattered | "This is what a sensor gives you" |
| 1 | Spiral galaxy | **Detections** — points collapse into clustered objects with box structure | "This is detection" |
| 2 | Brain | **Pose skeleton** — keypoints and limb segments resolve out of the clusters | "This is what I extract" |

That is literally the MagicQC / industrial-pose-suite pipeline: raw → detect → pose.
Same code path, same `aBrain`-style attribute slots, same shader. But now scrolling
the hero *is* the argument, the brain cliché is gone, and there is nothing borrowed
left in the most-looked-at element on the site.

It also kills the outstanding problem that a procedural brain never reads as a brain
without a real anatomical mesh. A pose skeleton is trivially generatable and reads
instantly, because a skeleton *is* points and lines.

Do this as its own stage, after the content migration. Do not let it block content.

---

## 1. Install order

`BUILD-PROMPTS.md` assumes a clean start. The repo is not clean — it has
`src/lib/content.ts` from the Vesper build. Run this **before Stage 0**:

```
Migrate the content layer. Report only at first — do not edit yet.

The kit adds src/content/{types,site,projects,testimonials,index}.ts.
The repo already has src/lib/content.ts holding the Vesper-era placeholder
data (identity, presence, approach, about, faq, services, footerColumns,
projects).

1. List every component importing from "@/lib/content" and which exports
   each one uses.
2. For each of those exports, name its replacement in src/content/, or say
   "no equivalent — needs a new field" and specify the field.
3. Flag anything in src/lib/content.ts with no home in the new model. I
   expect: `approach` (the corner-text band), `presence.caption`, and the
   FAQ. Those need decisions, not silent deletion.

Then stop. I will approve the mapping before you touch a file.
```

Only after that mapping is approved: delete `src/lib/content.ts`, and proceed to
Stage 0 of `BUILD-PROMPTS.md`.

---

## 2. Section mapping — existing shell → CV content

The visual language stays. The content model underneath changes completely.

| # | Component today | Renders now | Renders after | Source |
|---|---|---|---|---|
| 1 | `Hero.tsx` | "Motion instead of chrome" | `site.headline` + `site.subhead` | `site.ts` |
| 2 | `Presence.tsx` | "Built to be felt" + 91k/8.3/0.9/60 | `site.proofStrip` — 4 career metrics, each with its `context` line | `site.ts` |
| 3 | `Approach.tsx` | Corner text over the brain | **`site.services`** — 3 capabilities, each linking its `evidence` slugs | `site.ts` |
| 4 | `Projects.tsx` | 3 `TODO` cards | `featuredProjects` — MagicQC, Fabric Defect, SkyResQ, Dock Vision | `projects.ts` |
| 5 | `LightSections.tsx` (about) | "A living interface" | `experience` timeline + `skillGroups` | `site.ts` |
| 6 | `LightSections.tsx` (FAQ) | Motion-design questions | Rewritten for an AI/CV buyer + **`testimonials`, gated** | `testimonials.ts` |
| 7 | `Closing.tsx` (contact) | `silent.axiss@gmail.com` | `site.email` (`hamzabasharat2004@gmail.com`) | `site.ts` |
| 8 | `Closing.tsx` (footer) | Hardcoded columns | `site.links` + `site.nav` | `site.ts` |

**Section 3 is the most important repurpose.** The brain band is currently the
prettiest thing on the site and says nothing. It becomes the capabilities section —
the one that answers "what can you do for me" — with each claim sitting next to the
project that proves it. That is the single highest-converting block for the client
audience, and right now it is decoration.

**Routes the shell does not have yet.** `/work/[slug]`, `/about`, `/cv`. Stages 4
and 7 of `BUILD-PROMPTS.md` cover them. Nine case studies is the difference between a
landing page and a portfolio — a recruiter who reads one case study is the one who
replies.

---

## 3. Ordering

Do not run `BUILD-PROMPTS.md` end to end. This order front-loads the things that
change what a visitor believes:

```
Migration mapping (§1 above)     ← blocks everything
Stage 0   Audit
Stage 1   Wire the content layer
Stage 3   Real project cards      ← moved up: highest signal per hour
Stage 2   Hero rewrite + motion budget
Stage 4   Case study pages
Stage 5   Capabilities / experience / credentials
Stage 7   Contact, /cv, footer
HERO RESHAPE (§0 above)          ← after content is real, not before
Stage 6   Testimonials            ← blocked on Hamza pasting real ones
Stage 8   SEO + structured data
Stage 9   Verify
```

Stage 3 before Stage 2 because four real project cards convince someone the site is
real; a rewritten headline over `TODO` cards does not.

---

## 4. What blocks on Hamza, not on Claude Code

These cannot be generated. The build will render empty states until they exist,
and that is correct behaviour, not a bug.

**Media** — every project references `/media/*-poster.jpg` and some `*.mp4`. None
exist. Export from the Drive folder: H.264 `.mp4` **and** `.webm`, max 8s, muted,
under 2 MB. Poster stills at 1200×750. Without these, cards render a flat surface.

**`DRAFT:` limitations** — 14 of them across 9 projects. `CLAUDE.md §2` forbids
guessing. A senior reviewer reads the limitations block first, because it is the only
part of a portfolio that cannot be faked. An empty one reads as inexperience; a
specific one ("PatchCore false-positive rate tripled under mixed fluorescent and
daylight") reads as someone who has actually shipped.

**Testimonials** — `testimonials.ts` is empty and stays empty until real LinkedIn
recommendations are pasted in verbatim. **No one writes these — not Claude Code, not
me, not a "realistic-looking" draft.** A fabricated recommendation attributed to a
named person at a named company is the one mistake on this list that cannot be
walked back: it is trivially checkable against their LinkedIn, and being caught
costs more than having no testimonials at all. Paste the real ones or ship the
section absent. Format:

```ts
{
  quote: '…verbatim, exactly as written on LinkedIn…',
  author: 'Full Name',
  title: 'Their title',
  org: 'Their company',
  date: '2025-11',
  source: 'https://www.linkedin.com/in/…',
}
```

**Two facts to fix at source, not in code:**
- The CV's "Code" link for CV Recruiter RAG Agent points at
  `CV-Projects/tree/main/assets/images` — an image folder, not the project.
- Location is inconsistent: CV header says Lahore, GitHub says Islamabad, all three
  roles are Islamabad. Pick one. A recruiter filtering by city will act on it.

---

## 5. Things I could not access

- **The Drive folder.** Requires Google auth. Nothing in it has been read; every
  reference to its contents in this repo is an assumption until someone checks.
- **LinkedIn recommendations.** Same — behind login. Must be pasted manually.

Do not let any part of the build depend on an assumption about what is in either.
