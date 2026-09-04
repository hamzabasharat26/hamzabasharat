/* ============================================================
   Central audio manager — one source of truth for every sound on the site.

   Three independent systems, one module, so nothing scatters `new Audio()`
   through components and nothing ever double-plays:
     1. Landing ambience   — one-shot per page load, autoplay-safe
     2. Agent intro        — voice + music together, once per page load
     3. Click SFX          — every interactive element, unlimited, via one
                              delegated document-level listener

   "Per page load" is deliberate, not persisted: a reload or pasting the link
   in again is a fresh load, so both play again. Nothing is gated on
   localStorage having seen this visitor before — only in-memory state on the
   Store, which a reload throws away same as everything else in memory.

   SSR-safe: every `Audio`/`AudioContext`/`localStorage` touch is lazy,
   inside a function, guarded by `typeof window`. Nothing runs at module
   scope, so importing this file during a server render of a client
   component is inert.
   ============================================================ */

type Bed = "landing" | "agent" | null;

const SRC = {
  landing: "/sounds/portfolio-music.mp3",
  agentMusic: "/sounds/agent-music.mp3",
  agentVoice: "/sounds/agent-voice.mp3",
  click: "/sounds/button-press.mp3",
};

const LANDING_VOLUME = 0.26;
const AGENT_MUSIC_VOLUME = 0.22;
const AGENT_VOICE_VOLUME = 0.4;
const CLICK_VOLUME = 0.35;
const CLICK_POOL_SIZE = 4;

function isBrowser() {
  return typeof window !== "undefined";
}
export function reducedMotion(): boolean {
  return isBrowser() && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** rAF-driven volume ramp — <audio> has no native fade. Cancel-safe: a new
 *  fade on the same element cancels whatever fade was already running on it. */
const fadeHandles = new WeakMap<HTMLAudioElement, number>();
function fadeTo(el: HTMLAudioElement, target: number, ms: number, onDone?: () => void) {
  const prev = fadeHandles.get(el);
  if (prev) cancelAnimationFrame(prev);
  const start = el.volume;
  const t0 = performance.now();
  const step = (t: number) => {
    // Clamp both ends — rAF's timestamp can land a hair before t0 on the
    // very first frame, which would otherwise send p negative and
    // extrapolate volume past 0 (HTMLMediaElement throws outside [0, 1]).
    const p = ms <= 0 ? 1 : Math.min(1, Math.max(0, (t - t0) / ms));
    el.volume = Math.min(1, Math.max(0, start + (target - start) * p));
    if (p < 1) {
      fadeHandles.set(el, requestAnimationFrame(step));
    } else {
      fadeHandles.delete(el);
      onDone?.();
    }
  };
  fadeHandles.set(el, requestAnimationFrame(step));
}
function fadeOutAndStop(el: HTMLAudioElement | null, ms: number) {
  if (!el || el.paused) return;
  fadeTo(el, 0, ms, () => {
    el.pause();
    el.currentTime = 0;
  });
}

// ---------------------------------------------------------------------------
// The store. Created lazily on first browser access, never at import time.
// ---------------------------------------------------------------------------
type Store = {
  landingEl: HTMLAudioElement;
  agentMusicEl: HTMLAudioElement;
  agentVoiceEl: HTMLAudioElement;
  clickPool: HTMLAudioElement[];
  clickIdx: number;
  currentBed: Bed;
  clickDelegateInstalled: boolean;
  visibilityInstalled: boolean;
  wasPlaying: Set<HTMLAudioElement>;
  // In-memory only — deliberately not persisted. A reload / re-pasted link is
  // a fresh Store, so the intro is fair game again; only re-opening the panel
  // within the *same* load is suppressed, so it doesn't replay the full clip
  // on every click.
  introPlayedThisLoad: boolean;
  // Web Audio graph for the analyser, built at most once — a media element
  // can only ever be routed through createMediaElementSource a single time.
  audioCtx: AudioContext | null;
  analyser: AnalyserNode | null;
};

let store: Store | null = null;

function getStore(): Store | null {
  if (!isBrowser()) return null;
  if (store) return store;

  const landingEl = new Audio(SRC.landing);
  landingEl.preload = "none";
  landingEl.volume = 0;

  const agentMusicEl = new Audio(SRC.agentMusic);
  agentMusicEl.preload = "none";
  agentMusicEl.volume = 0;

  const agentVoiceEl = new Audio(SRC.agentVoice);
  agentVoiceEl.preload = "none";
  agentVoiceEl.volume = AGENT_VOICE_VOLUME;

  const clickPool = Array.from({ length: CLICK_POOL_SIZE }, () => {
    const a = new Audio(SRC.click);
    a.preload = "auto";
    a.volume = CLICK_VOLUME;
    return a;
  });

  store = {
    landingEl,
    agentMusicEl,
    agentVoiceEl,
    clickPool,
    clickIdx: 0,
    currentBed: null,
    clickDelegateInstalled: false,
    visibilityInstalled: false,
    wasPlaying: new Set(),
    introPlayedThisLoad: false,
    audioCtx: null,
    analyser: null,
  };
  return store;
}

// ---------------------------------------------------------------------------
// System 1 — landing ambience. One-shot per page load, autoplay-safe.
// ---------------------------------------------------------------------------
export function armLandingMusic() {
  const s = getStore();
  if (!s) return;

  const el = s.landingEl;
  el.loop = false;

  const onPlaying = () => {
    s.currentBed = "landing";
    fadeTo(el, LANDING_VOLUME, 2000);
    // fade the last ~3s of a ~30s clip
    const dur = Number.isFinite(el.duration) && el.duration > 0 ? el.duration : 30;
    const toEnd = Math.max(0, (dur - 3) * 1000);
    window.setTimeout(() => {
      if (s.currentBed === "landing") fadeTo(el, 0, 3000, () => { s.currentBed = null; });
    }, toEnd);
  };
  el.addEventListener("playing", onPlaying, { once: true });

  const attempt = () => {
    el.currentTime = 0;
    el.volume = 0;
    el.play().catch(() => armFirstGesture(attempt));
  };

  window.setTimeout(attempt, 2000);
}

let gestureArmed = false;
function armFirstGesture(retry: () => void) {
  if (gestureArmed || !isBrowser()) return;
  gestureArmed = true;
  const events: (keyof WindowEventMap)[] = ["click", "scroll", "keydown", "touchstart"];
  const handler = () => {
    gestureArmed = false;
    events.forEach((e) => window.removeEventListener(e, handler));
    retry();
  };
  events.forEach((e) => window.addEventListener(e, handler, { once: true, passive: true }));
}

// ---------------------------------------------------------------------------
// System 2 — agent intro. Voice + music together, once per page load.
// A real click gated this call, so autoplay is never blocked here.
// ---------------------------------------------------------------------------
/** Returns true if the intro actually started (so the caller knows whether to
 *  wire up the "speaking" avatar state at all). `onEnd` fires once, when the
 *  music has genuinely finished fading out — the caller's cue to drop back
 *  to the idle avatar and detach the analyser. */
export function startAgentIntro(onEnd?: () => void): boolean {
  const s = getStore();
  if (!s) return false;
  if (reducedMotion()) return false; // skips intro audio + all audio-reactive animation together
  if (s.introPlayedThisLoad) return false; // silent — a re-open in the same load, not a fresh one

  // Never two beds at once: the agent wins over the landing ambience.
  if (s.currentBed === "landing") {
    fadeOutAndStop(s.landingEl, 600);
  }
  s.currentBed = "agent";

  const music = s.agentMusicEl;
  const voice = s.agentVoiceEl;
  music.currentTime = 0;
  music.volume = 0;
  music.play().catch(() => {});
  fadeTo(music, AGENT_MUSIC_VOLUME, 400);

  const onVoicePlaying = () => { s.introPlayedThisLoad = true; };
  voice.addEventListener("playing", onVoicePlaying, { once: true });

  window.setTimeout(() => {
    if (s.currentBed !== "agent") return;
    voice.currentTime = 0;
    voice.volume = AGENT_VOICE_VOLUME;
    voice.play().catch(() => {});
  }, 400);

  // Fade the music out over its final ~2s. Read the real duration once it's
  // known; fall back to the measured ~12.6s clip length. onEnd fires only on
  // this natural-completion path — a caller-initiated stop already knows to
  // reset its own state the moment it calls stopAgentIntro().
  const scheduleFadeOut = () => {
    const dur = Number.isFinite(music.duration) && music.duration > 0 ? music.duration : 12.6;
    window.setTimeout(() => {
      if (s.currentBed === "agent") {
        fadeTo(music, 0, 2000, () => {
          s.currentBed = null;
          onEnd?.();
        });
      }
    }, Math.max(0, (dur - 2) * 1000));
  };
  if (music.readyState >= 1) scheduleFadeOut();
  else music.addEventListener("loadedmetadata", scheduleFadeOut, { once: true });

  return true;
}

/** Panel closed — mid-intro or not. Stop immediately; a disembodied voice
 *  must never keep talking after the panel is gone. Marks the intro played
 *  for the rest of this load either way, so it never resumes or restarts on
 *  a later open — only a reload earns it a fresh shot. */
export function stopAgentIntro() {
  const s = getStore();
  if (!s) return;
  if (s.currentBed === "agent") {
    fadeOutAndStop(s.agentMusicEl, 300);
    fadeOutAndStop(s.agentVoiceEl, 300);
    s.currentBed = null;
  }
  s.introPlayedThisLoad = true;
}

// ---------------------------------------------------------------------------
// System 3 — click SFX. A pool of 4 rotating instances survives rapid clicks
// that would otherwise cut a still-playing instance off.
// ---------------------------------------------------------------------------
const CLICKABLE = "a, button, summary, [role='button'], input[type='submit']";
// Escape hatch for a control that plays its own distinctly-pitched click (the
// agent's open/close triggers) — stops the generic delegate from layering a
// second, default-pitch click on top of the same press.
const SKIP_ATTR = "data-audio-skip";
// A scroll and a tap both start as a touch on the same spot; only their
// endpoint tells them apart. Past this many px of movement it's a scroll.
const TAP_MOVE_TOLERANCE = 10;

export function playClick(rate = 1) {
  const s = getStore();
  if (!s) return;
  const el = s.clickPool[s.clickIdx];
  s.clickIdx = (s.clickIdx + 1) % s.clickPool.length;
  el.currentTime = 0;
  el.playbackRate = rate;
  el.play().catch(() => {});
}

function controlFor(target: EventTarget | null): Element | null {
  if (!(target instanceof Element)) return null;
  const control = target.closest(CLICKABLE);
  if (!control) return null;
  if (control.hasAttribute("disabled") || control.getAttribute("aria-disabled") === "true") return null;
  if (control.hasAttribute(SKIP_ATTR)) return null;
  return control;
}

function installClickDelegate() {
  const s = getStore();
  if (!s || s.clickDelegateInstalled || !isBrowser()) return;
  s.clickDelegateInstalled = true;

  // Mouse: mousedown is unambiguous — a wheel scroll is a different input
  // channel, so firing immediately here is safe and reads snappy.
  document.addEventListener(
    "mousedown",
    (e) => {
      if (controlFor(e.target)) playClick();
    },
    { capture: true, passive: true }
  );

  // Touch: touchstart alone can't tell a tap from the start of a scroll — a
  // swipe that happens to begin over a full-card link (a project card, a nav
  // link) was firing a click on every scroll. Arm on touchstart, disarm the
  // instant the finger moves past a small tolerance, only actually play on
  // touchend if it never did — a real tap, not a scroll that started there.
  let touchStart: { x: number; y: number } | null = null;
  let touchControl: Element | null = null;

  document.addEventListener(
    "touchstart",
    (e) => {
      const control = controlFor(e.target);
      const t = e.touches[0];
      if (control && t) {
        touchStart = { x: t.clientX, y: t.clientY };
        touchControl = control;
      } else {
        touchStart = null;
        touchControl = null;
      }
    },
    { capture: true, passive: true }
  );
  document.addEventListener(
    "touchmove",
    (e) => {
      if (!touchStart) return;
      const t = e.touches[0];
      if (!t) return;
      const dx = t.clientX - touchStart.x;
      const dy = t.clientY - touchStart.y;
      if (dx * dx + dy * dy > TAP_MOVE_TOLERANCE * TAP_MOVE_TOLERANCE) {
        touchStart = null;
        touchControl = null;
      }
    },
    { capture: true, passive: true }
  );
  document.addEventListener(
    "touchend",
    () => {
      if (touchControl) playClick();
      touchStart = null;
      touchControl = null;
    },
    { capture: true, passive: true }
  );
  document.addEventListener(
    "touchcancel",
    () => {
      touchStart = null;
      touchControl = null;
    },
    { capture: true, passive: true }
  );
}

// ---------------------------------------------------------------------------
// Tab visibility — pause everything while hidden, resume what was genuinely
// mid-play (and not muted) when the tab comes back.
// ---------------------------------------------------------------------------
function installVisibilityHandling() {
  const s = getStore();
  if (!s || s.visibilityInstalled || !isBrowser()) return;
  s.visibilityInstalled = true;
  document.addEventListener("visibilitychange", () => {
    const beds = [s.landingEl, s.agentMusicEl, s.agentVoiceEl];
    if (document.hidden) {
      beds.forEach((el) => {
        if (!el.paused) {
          s.wasPlaying.add(el);
          el.pause();
        }
      });
    } else {
      beds.forEach((el) => {
        if (s.wasPlaying.has(el)) {
          s.wasPlaying.delete(el);
          el.play().catch(() => {});
        }
      });
    }
  });
}

/** Call once, near the root, after mount. Idempotent. */
export function initAudio() {
  if (!isBrowser()) return;
  getStore();
  installClickDelegate();
  installVisibilityHandling();
}

// ---------------------------------------------------------------------------
// Audio-reactive level — for the agent avatar's glow while the intro plays.
// Web Audio API, wired once (a media element can only be routed through
// createMediaElementSource a single time, ever). Skipped entirely under
// reduced motion — the caller should fall back to a plain CSS pulse keyed off
// "is the intro playing", which needs none of this.
//
// The graph MUST terminate at ctx.destination or the routed element goes
// silent — routing agentVoiceEl through an AnalyserNode with no path to
// destination would mute the intro voice while still "playing" it.
// ---------------------------------------------------------------------------
export function attachAnalyser(onLevel: (level: number) => void): () => void {
  const s = getStore();
  if (!s || reducedMotion()) return () => {};

  try {
    if (!s.audioCtx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.75;
      // Route both the voice and the music bed through the same analyser, so
      // the glow reflects whichever is actually audible.
      const voiceSrc = ctx.createMediaElementSource(s.agentVoiceEl);
      const musicSrc = ctx.createMediaElementSource(s.agentMusicEl);
      voiceSrc.connect(analyser);
      musicSrc.connect(analyser);
      analyser.connect(ctx.destination); // <- the part that keeps it audible
      s.audioCtx = ctx;
      s.analyser = analyser;
    }
  } catch {
    return () => {};
  }

  const ctx = s.audioCtx;
  const analyser = s.analyser;
  if (!ctx || !analyser) return () => {};
  if (ctx.state === "suspended") ctx.resume().catch(() => {});

  const data = new Uint8Array(analyser.frequencyBinCount);
  let raf = 0;
  const loop = () => {
    analyser.getByteFrequencyData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) sum += data[i];
    onLevel(Math.min(1, sum / data.length / 90));
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    onLevel(0);
  };
}
