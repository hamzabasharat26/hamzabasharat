// ---------------------------------------------------------------------------
// Content contracts for hamzabasharat.com
//
// These types are the architecture. Every section of the site renders from
// this data — no copy is hardcoded in JSX. Change the site by changing data.
//
// The Project type deliberately forces the six-part case-study structure that
// technical recruiters scan for: pain first, live proof, justified stack,
// measured outcome, honest limits, and a way to run it.
// ---------------------------------------------------------------------------

export type Domain =
  | 'computer-vision'
  | 'edge-ai'
  | 'llm-agents'
  | 'mlops'
  | 'full-stack'

export type ProjectStatus =
  | 'production'    // running, serving real users or a real line
  | 'evaluation'    // deployed for a client pilot / under assessment
  | 'research'      // prototype, simulation, or academic
  | 'competition'   // built for and placed in a competition

export type LinkKind = 'demo' | 'code' | 'video' | 'writeup' | 'paper'

export interface ProjectLink {
  label: string
  href: string
  kind: LinkKind
}

export interface MediaItem {
  /** A still frame, or a short muted looping clip. */
  kind: 'image' | 'clip'
  /** kind:'image' — the still. kind:'clip' — its poster still. */
  src: string
  /** kind:'clip' only — the two encodes (webm first, mp4 fallback). */
  webm?: string
  mp4?: string
  /** One line: what the system is doing in this frame. Becomes the alt text. */
  caption: string
  /**
   * How this frame fills its box. Default 'cover' crops to fill — right for
   * anything already close to the card's 16:10 / video 16:9 shape. Set
   * 'contain' for a frame whose own aspect is far off that (a portrait phone
   * screenshot, an ultra-wide dashboard) so the whole frame stays visible,
   * letterboxed, instead of losing its edges to a crop.
   */
  fit?: 'cover' | 'contain'
}

export interface Metric {
  /** Short label. Keep under 22 chars — it sits under the number. */
  label: string
  /** The number itself. Keep it a number-first string: "500+", "0.81", "15 FPS". */
  value: string
  /** Optional one-line explanation shown on hover / in the case study. */
  note?: string
}

export interface Project {
  slug: string
  title: string
  /** Eyebrow above the title. Domain of application, not technology. */
  kicker: string
  year: string
  role: string
  org: string
  status: ProjectStatus
  domains: Domain[]

  /** ONE sentence. Lead with the pain, never with the model. */
  problem: string

  /** 3–5 bullets: what you actually built, in order of engineering weight. */
  approach: string[]

  /** Measured outcomes. Two minimum, four maximum. Empty array = do not ship. */
  outcome: Metric[]

  /** Where it breaks. This section is why senior reviewers trust the rest. */
  limitations: string[]

  /** Ordered by how load-bearing each choice was, not alphabetically. */
  stack: string[]

  links: ProjectLink[]

  media: {
    /** Static poster, always present. Used as the video poster and the OG image. */
    poster: string
    /**
     * Muted, looping clip. Two encodes because the browser picks the first it
     * supports and skips downloading the rest — webm (VP9) is usually smaller
     * and listed first; mp4 (H.264) is the universal fallback. A single
     * `video: string` field would force shipping only one, wasting whichever
     * encode is smaller.
     */
    video?: { webm: string; mp4: string }
    /**
     * Two or more stills that cross-fade in place — for a project with several
     * real screenshots but no video. `poster` should be `frames[0]`. Ignored
     * when `video` is set; under reduced motion only the first frame shows.
     */
    frames?: string[]
    /**
     * The rich case: an ordered mix of stills and short clips that the card and
     * the case-study page cycle through one by one — a mini gallery of the
     * system doing its job. Takes precedence over `video`/`frames`. `poster`
     * should still be set (it is the LCP/OG image and the reduced-motion frame).
     */
    gallery?: MediaItem[]
    alt: string
  }

  /** Featured projects appear on the home page, in array order. Cap at 4. */
  featured: boolean

  /** Set when an NDA or client agreement limits what can be shown. */
  confidential?: string
}

export interface Role {
  org: string
  title: string
  location: string
  start: string
  end: string
  /** Highlights, each tied to a project slug where one exists. */
  highlights: { text: string; projectSlug?: string }[]
}

export interface Testimonial {
  /** Verbatim. Never edited for meaning, never written on someone's behalf. */
  quote: string
  author: string
  authorTitle: string
  authorOrg: string
  /** ISO date the recommendation was given. */
  date: string
  /** Link to the source so a reader can verify it. Required. */
  source: string
  /** Optional local avatar path. Omit rather than use a stock photo. */
  avatar?: string
}

export interface Award {
  place: string
  title: string
  event: string
  year: string
  projectSlug?: string
}

export interface Certification {
  name: string
  issuer: string
  /** Credential URL if you have one — an unverifiable cert is worth less. */
  credential?: string
}

export interface Workshop {
  title: string
  /** Who ran it / where. */
  host: string
  venue: string
  dates: string
  /** Hamza's part in it. */
  role: string
  /** What was actually taught — verbatim from the source, never invented. */
  curriculum: string[]
  /** Local photo of the session. */
  image?: string
  imageAlt?: string
  /** Session photos + the signed credential, cycled in the teaching block. */
  photos?: Photo[]
}

export interface Photo {
  src: string
  /** Describe what is in the frame — never "photo". */
  alt: string
  /** Short chip shown on the image (event / place). */
  tag?: string
  /** Natural aspect ratio "w/h" so the layout never crops the frame. */
  aspect?: string
}

/** One tile in the "In the lab" wall — a technique shown working, no case
 *  study, no metrics. A clip if one exists, otherwise a single labelled still. */
export interface LabItem {
  slug: string
  /** Plain technique name — "Real-time OCR", not a product name. */
  label: string
  technique:
    | 'detection'
    | 'tracking'
    | 'segmentation'
    | 'ocr'
    | 'pose'
    | 'depth'
    | 'anomaly'
    | 'automation'
  /** Still shown first (poster for a clip, or the whole tile for a still). */
  poster: string
  /** Present when there is real footage; absent = still-only tile. */
  clip?: { webm: string; mp4: string }
  /** Alt text — what the technique is doing here. */
  alt: string
}
