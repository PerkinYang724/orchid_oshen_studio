/**
 * timing.ts — when each thing happens, on scroll progress 0..1.
 *
 * Single source of truth: the component reads these, and
 * scripts/verify-waves.mts asserts against them, so the layout invariant
 * below cannot silently rot.
 */

/** [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd] on scroll progress. */
export const CUE = {
  whisper:  [0.00, 0.01, 0.05, 0.13],
  machine:  [0.15, 0.27, 0.40, 0.50],
  voice:    [0.52, 0.62, 0.72, 0.79],
  /**
   * The wordmark deliberately arrives AFTER the pulse peak. At p=0.80 the
   * heartbeat spike is 0.23h tall and centred — exactly where the wordmark
   * sits — so fading the title in any earlier draws the spike straight
   * through the letterforms. It comes up as the line collapses.
   */
  title:    [0.87, 0.97],
  question: [0.94, 1.00],
} as const;

/** Where the line starts collapsing into the wordmark underline. */
export const LAND_START = 0.82;

/**
 * How far below the centreline the beat copy sits, as a fraction of
 * viewport height. Mirrored in intro.module.css as `27vh` on `.copyLine`.
 *
 * INVARIANT: this must clear the tallest wave visible while copy is on
 * screen. verify-waves.mts fails the build's tuning check if it does not.
 */
export const COPY_OFFSET = 0.27;

/** Minimum gap to keep between the wave and the copy, as a fraction of height. */
export const MIN_CLEARANCE = 0.03;

/* ------------------------------------------------------------------ *
 * SHATTER — the machine→human transition. Scroll range only; there is
 * no simulation state, so scrubbing back reverses it exactly.
 * ------------------------------------------------------------------ */
export const SHATTER = {
  /** Particles take over from the line here. */
  start: 0.34,
  /** Particles hand back to the line here. */
  end: 0.55,
  /** Crossfade length between line and particles at each edge. */
  fade: 0.035,
} as const;

/** Progress within the shatter window, 0..1. Outside the window: -1. */
export function shatterProgress(p: number): number {
  if (p < SHATTER.start || p > SHATTER.end) return -1;
  return (p - SHATTER.start) / (SHATTER.end - SHATTER.start);
}

/* ------------------------------------------------------------------ *
 * GHOST ECHOES — oscilloscope phosphor persistence. Each ghost redraws
 * the wave at an earlier `t`, so it is a genuine temporal lag rather
 * than a static offset copy.
 * ------------------------------------------------------------------ */
export const GHOSTS = [
  { lag: 0.10, alpha: 0.20, dy: 1.5 },
  { lag: 0.21, alpha: 0.11, dy: 3.0 },
  { lag: 0.34, alpha: 0.055, dy: 4.5 },
] as const;

/* ------------------------------------------------------------------ *
 * LANDING SWEEP — one ECG pulse travels the underline, then rests.
 * Time-driven, not scroll-driven: it is a full stop, not a scrub.
 * ------------------------------------------------------------------ */
export const LANDING_SWEEP = {
  /** Fires once progress passes this. */
  trigger: 0.96,
  /** Re-arms below this, so scrubbing back and returning replays it. */
  rearm: 0.93,
  /** Seconds for the pulse to cross the underline. */
  duration: 1.5,
  /** Height of the travelling beat, as a fraction of viewport height. */
  amplitude: 0.038,
} as const;
