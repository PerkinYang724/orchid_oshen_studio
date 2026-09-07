/**
 * particles.ts — the shatter field for the machine → human transition.
 *
 * The sine does not morph into the voice. It breaks into particles, hangs
 * scattered, then reassembles as the human waveform: the machine falls apart
 * and the human is built from the pieces.
 *
 * Everything is a pure function of scroll progress and a per-particle hash,
 * so scrubbing backwards reverses the shatter exactly. No simulation state,
 * no accumulated velocity — those would drift and could not be scrubbed.
 */

import { smoothstep, lerp } from './math';

function hash(n: number): number {
  const s = Math.sin(n * 78.233 + 12.9898) * 43758.5453123;
  return s - Math.floor(s);
}

export interface Particle {
  /** Position along the line, 0..1. */
  u: number;
  /** Scatter direction and distance, in fractions of viewport height. */
  ox: number;
  oy: number;
  /** Staggered start so they don't move in lockstep. */
  delay: number;
  /** Draw size multiplier. */
  size: number;
}

/**
 * Scatter distance range, in fractions of viewport height.
 *
 * MAX_SCATTER is a layout constraint, not a taste one: particles must stay
 * clear of the copy sitting at COPY_OFFSET below the centreline. Raising it
 * fails `npm run verify:waves`.
 */
export const MIN_SCATTER = 0.05;
export const MAX_SCATTER = 0.185;

/** Deterministic field. Rebuilt only when the count changes. */
export function buildParticles(count: number): Particle[] {
  const out: Particle[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const angle = hash(i) * Math.PI * 2;
    // Bias outward-and-vertical: a flat horizontal scatter reads as motion
    // blur rather than a break-up.
    // Bounded so scattered particles still clear the copy line beneath them.
    // verify-waves.mts asserts this; see MAX_SCATTER below.
    const radius = MIN_SCATTER + hash(i + 9973) * (MAX_SCATTER - MIN_SCATTER);
    out[i] = {
      u: i / (count - 1),
      ox: Math.cos(angle) * radius * 0.55,
      oy: Math.sin(angle) * radius,
      delay: hash(i + 555) * 0.16,
      size: 0.6 + hash(i + 4441) * 1.1,
    };
  }
  return out;
}

/**
 * Where one particle sits at shatter progress `s` (0..1 across the window).
 *
 * srcY/dstY are the sine and voice heights at this particle's x, already in
 * fractions of viewport height. Returns offsets in the same units.
 */
export function particleAt(
  particle: Particle,
  s: number,
  srcY: number,
  dstY: number,
): { x: number; y: number; heat: number } {
  const { u, ox, oy, delay } = particle;

  // Leave the sine, then arrive at the voice. The gap between the two ramps
  // is the hold — the moment the machine is genuinely in pieces.
  const out = smoothstep(0.00 + delay, 0.44 + delay, s);
  const back = smoothstep(0.58 + delay, 1.00, s);

  const scatterX = u + ox;
  const scatterY = oy;

  const x = lerp(lerp(u, scatterX, out), u, back);
  const y = lerp(lerp(srcY, scatterY, out), dstY, back);

  // Brightest mid-flight: the break-up flashes, the reformed line settles.
  const heat = out * (1 - back);

  return { x, y, heat };
}

/** Particle count for a viewport width. Capped hard for mobile fill rate. */
export function particleCountFor(width: number): number {
  return Math.max(140, Math.min(520, Math.round(width / 2.6)));
}
