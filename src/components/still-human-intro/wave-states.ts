/**
 * wave-states.ts — THE FOUR WAVE SHAPES. This is the file to tune.
 *
 * Each beat is a pure shape function: given a normalised x along the line
 * (0..1) it returns a normalised y offset (roughly -1..1). Nothing here
 * touches the DOM, canvas, or scroll — so each shape can be edited, or
 * replaced entirely, without reading the renderer.
 *
 * WHY WEIGHTS INSTEAD OF ONE PARAMETER SET
 * A sine and a heartbeat are not the same curve with different numbers.
 * Lerping shared params (amplitude/frequency) between them makes the pulse
 * read as a squashed sine. Instead the renderer evaluates every beat and
 * sums them by weight, so a morph is a genuine cross-blend of two shapes and
 * each shape stays independently tunable.
 */

import { fbm, gaussian, valueNoise } from './noise';
import { clamp, smoothstep } from './math';

export type BeatKey = 'flat' | 'machine' | 'voice' | 'pulse' | 'land';

export interface ShapeContext {
  /** Seconds since mount. Lets a shape breathe while scroll is still. */
  t: number;
  /** Real decoded audio peaks in -1..1, or null to synthesise. */
  samples: Float32Array | null;
}

export interface BeatState {
  key: BeatKey;
  /** Where on scroll progress (0..1) this beat is fully itself. */
  at: number;
  /** Peak height as a fraction of viewport height. */
  amplitude: number;
  /** Polyline resolution. Higher = more detail, more CPU. */
  points: number;
  /** Stroke width in CSS px. */
  lineWidth: number;
  /**
   * Bloom energy at this beat — how much light the additive passes add.
   * Character (tight/cold vs wide/warm) comes from bloomSoftness() in
   * palette.ts; this is just how bright.
   */
  bloom: number;
  /** Mirror the wave across the centreline here? 0 = single line, 1 = full. */
  mirror: number;
  shape: (x: number, ctx: ShapeContext) => number;
}

/* ------------------------------------------------------------------ *
 * BEAT 1 — FLAT. Dead line. No motion, no error, no life.
 * ------------------------------------------------------------------ */
const flat = () => 0;

/* ------------------------------------------------------------------ *
 * BEAT 2 — MACHINE. A perfect sine. Periodic, cold, zero error.
 * Tune MACHINE_CYCLES for how many repeats span the screen.
 * ------------------------------------------------------------------ */
export const MACHINE_CYCLES = 9;
const MACHINE_DRIFT = 0.35; // radians/sec — slow phase crawl so it isn't frozen

const machine = (x: number, { t }: ShapeContext) =>
  Math.sin(x * Math.PI * 2 * MACHINE_CYCLES + t * MACHINE_DRIFT);

/* ------------------------------------------------------------------ *
 * BEAT 3 — VOICE. Real speech is not periodic: syllable bursts with
 * silence between them, and noise inside each burst.
 *
 * If real audio was decoded we draw its actual samples. Otherwise we
 * synthesise: an irregular syllable envelope times a noisy carrier.
 *
 * TODO(audio): drop a file at /public/audio/voice-sample.mp3 (or pass
 * `audioSrc`) to replace the synthetic waveform with real decoded speech.
 * ------------------------------------------------------------------ */
const SYLLABLES = [
  // { at, width, gain } — irregular on purpose. Edit freely.
  { at: 0.06, width: 0.035, gain: 0.55 },
  { at: 0.15, width: 0.026, gain: 0.85 },
  { at: 0.22, width: 0.018, gain: 0.40 },
  { at: 0.33, width: 0.042, gain: 1.00 },
  { at: 0.44, width: 0.022, gain: 0.62 },
  { at: 0.52, width: 0.030, gain: 0.78 },
  { at: 0.63, width: 0.020, gain: 0.45 },
  { at: 0.71, width: 0.038, gain: 0.92 },
  { at: 0.82, width: 0.024, gain: 0.58 },
  { at: 0.91, width: 0.030, gain: 0.70 },
];

function syllableEnvelope(x: number): number {
  let e = 0;
  for (const s of SYLLABLES) e += s.gain * gaussian(x, s.at, s.width);
  return clamp(e, 0, 1.15);
}

const voice = (x: number, { t, samples }: ShapeContext) => {
  if (samples && samples.length > 1) {
    // Real audio: index straight into the decoded peaks.
    const i = Math.min(samples.length - 1, Math.floor(x * samples.length));
    return samples[i];
  }
  // Synthetic: burst envelope * (carrier + noise), with a slow living wobble.
  const env = syllableEnvelope(x);
  const carrier = Math.sin(x * Math.PI * 2 * 62 + t * 1.1);
  const grit = fbm(x * 190 + t * 0.6, 4);
  const wobble = 1 + 0.12 * valueNoise(x * 7 + t * 0.35);
  return env * (carrier * 0.55 + grit * 0.75) * wobble;
};

/* ------------------------------------------------------------------ *
 * BEAT 4 — PULSE. One heartbeat. An ECG complex built from gaussians:
 * P bump, Q dip, R spike, S dip, T bump. Baseline is silent.
 * Move PULSE_CENTER to slide the beat along the line.
 * ------------------------------------------------------------------ */
export const PULSE_CENTER = 0.5;

const ECG = [
  { offset: -0.075, sigma: 0.018, gain: 0.10 }, // P
  { offset: -0.014, sigma: 0.005, gain: -0.16 }, // Q
  { offset: 0.0, sigma: 0.006, gain: 1.0 }, // R
  { offset: 0.015, sigma: 0.007, gain: -0.38 }, // S
  { offset: 0.062, sigma: 0.024, gain: 0.20 }, // T
];

/**
 * One ECG complex centred anywhere on the line. Exported because the landing
 * sweep travels a copy of this shape left-to-right along the underline.
 */
export function ecgAt(x: number, center = PULSE_CENTER): number {
  let y = 0;
  for (const c of ECG) {
    y += c.gain * gaussian(x, center + c.offset, c.sigma);
  }
  return y;
}

const pulse = (x: number, { t }: ShapeContext) => {
  // Systole: the beat swells and relaxes about once a second.
  const beat = 0.88 + 0.12 * Math.sin(t * Math.PI * 2 * 1.05);
  return ecgAt(x) * beat;
};

/** Endpoints of the shatter: particles fly from the sine to the voice. */
export { machine as machineShape, voice as voiceShape };

/* ------------------------------------------------------------------ *
 * BEAT 5 — LAND. Flat again, but the renderer has by now shrunk the line
 * to title width and moved it under the wordmark. Shape contributes nothing.
 * ------------------------------------------------------------------ */
const land = () => 0;

/* ------------------------------------------------------------------ *
 * The states, in scroll order. `at` is where each is fully itself.
 * Adjust these to retime the sequence without touching the renderer.
 * ------------------------------------------------------------------ */
export const BEATS: BeatState[] = [
  { key: 'flat',    at: 0.00, amplitude: 0.000, points: 120,  lineWidth: 1.0, bloom: 0.25, mirror: 0, shape: flat },
  { key: 'machine', at: 0.30, amplitude: 0.085, points: 520,  lineWidth: 1.3, bloom: 0.85, mirror: 1, shape: machine },
  { key: 'voice',   at: 0.56, amplitude: 0.150, points: 1500, lineWidth: 1.5, bloom: 1.00, mirror: 1, shape: voice },
  { key: 'pulse',   at: 0.80, amplitude: 0.230, points: 900,  lineWidth: 2.0, bloom: 1.15, mirror: 0, shape: pulse },
  { key: 'land',    at: 1.00, amplitude: 0.000, points: 160,  lineWidth: 1.6, bloom: 0.55, mirror: 0, shape: land },
];

export type Weights = Record<BeatKey, number>;

/**
 * Blend weights for a scroll progress. Only the two beats bracketing
 * `p` are ever non-zero, and they always sum to 1 — so amplitude and
 * colour interpolate cleanly rather than piling up.
 */
export function beatWeights(p: number): Weights {
  const w = { flat: 0, machine: 0, voice: 0, pulse: 0, land: 0 } as Weights;
  const t = clamp(p);

  if (t <= BEATS[0].at) { w[BEATS[0].key] = 1; return w; }
  const last = BEATS[BEATS.length - 1];
  if (t >= last.at) { w[last.key] = 1; return w; }

  for (let i = 0; i < BEATS.length - 1; i++) {
    const a = BEATS[i];
    const b = BEATS[i + 1];
    if (t >= a.at && t <= b.at) {
      const k = smoothstep(a.at, b.at, t);
      w[a.key] = 1 - k;
      w[b.key] = k;
      return w;
    }
  }
  return w;
}

/** Blend any numeric field of the beat states. */
export type NumericBeatField = 'amplitude' | 'points' | 'lineWidth' | 'bloom' | 'mirror';

export const blendField = (w: Weights, field: NumericBeatField) =>
  BEATS.reduce((sum, b) => sum + w[b.key] * b[field], 0);

/**
 * Total y for one x, summed across every active beat and already scaled
 * by each beat's own amplitude (in fractions of viewport height).
 */
export function sampleWave(x: number, w: Weights, ctx: ShapeContext): number {
  let y = 0;
  for (const b of BEATS) {
    const weight = w[b.key];
    if (weight > 0.0001) y += weight * b.amplitude * b.shape(x, ctx);
  }
  return y;
}
