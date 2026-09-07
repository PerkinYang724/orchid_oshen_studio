/**
 * renderer.ts — every pixel the intro draws.
 *
 * Kept out of the component so the drawing can be read (and tuned) without
 * wading through React refs and ScrollTrigger wiring. One entry point:
 * renderFrame(). No React, no DOM beyond the 2D context.
 *
 * Composition order, back to front:
 *   black ground → ghost echoes → mirrored wave → main wave
 *   → shatter particles → landing sweep
 *
 * Everything after the ground uses additive blending ('lighter'), which is
 * what makes overlapping strokes bleed light instead of painting over each
 * other. That is the whole bloom trick — no offscreen buffers, no shaders.
 */

import { lerp, smoothstep } from './math';
import { bloomSoftness, rgba, temperatureAt, type RGB } from './palette';
import {
  buildParticles,
  particleAt,
  particleCountFor,
  type Particle,
} from './particles';
import { GHOSTS, LANDING_SWEEP, SHATTER, shatterProgress } from './timing';
import {
  BEATS,
  beatWeights,
  blendField,
  ecgAt,
  machineShape,
  sampleWave,
  voiceShape,
  type ShapeContext,
  type Weights,
} from './wave-states';

export interface Geometry {
  /** Line extent and centreline, in CSS px. */
  x0: number;
  x1: number;
  yc: number;
  /** Amplitude scale in px (viewport height, shrinking as it lands). */
  ampPx: number;
}

export interface FrameState {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  progress: number;
  time: number;
  samples: Float32Array | null;
  underline: { x: number; y: number; w: number };
  /** Seconds since the landing sweep fired, or null when it has not. */
  sweepAge: number | null;
  /** Cheaper passes on small screens. */
  low: boolean;
}

const MACHINE_AMP = BEATS.find((b) => b.key === 'machine')!.amplitude;
const VOICE_AMP = BEATS.find((b) => b.key === 'voice')!.amplitude;

let cachedParticles: Particle[] = [];
let cachedCount = -1;

function particlesFor(width: number): Particle[] {
  const count = particleCountFor(width);
  if (count !== cachedCount) {
    cachedParticles = buildParticles(count);
    cachedCount = count;
  }
  return cachedParticles;
}

/* ------------------------------------------------------------------ *
 * Path building
 * ------------------------------------------------------------------ */

function tracePath(
  ctx: CanvasRenderingContext2D,
  geo: Geometry,
  points: number,
  weights: Weights,
  shapeCtx: ShapeContext,
  flip: number,
  dy: number,
) {
  ctx.beginPath();
  for (let i = 0; i < points; i++) {
    const u = i / (points - 1);
    const x = lerp(geo.x0, geo.x1, u);
    const y = geo.yc + flip * sampleWave(u, weights, shapeCtx) * geo.ampPx + dy;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
}

/**
 * Stroke the current path several times with widening, dimming passes.
 * Under additive blending the overlaps accumulate into a bloom whose core
 * stays sharp. Cheaper and steadier than shadowBlur, which is per-stroke
 * expensive and blows out on mobile.
 */
function bloomStroke(
  ctx: CanvasRenderingContext2D,
  color: RGB,
  width: number,
  energy: number,
  softness: number,
  alpha: number,
  low: boolean,
) {
  // softness 0 → tight cold halo; 1 → wide warm halo.
  const spread = lerp(2.4, 9.0, softness);
  const passes = low
    ? [
        { w: width * spread * 0.7, a: 0.10 * energy },
        { w: width, a: 0.95 },
      ]
    : [
        { w: width * spread, a: 0.055 * energy },
        { w: width * spread * 0.45, a: 0.11 * energy },
        { w: width * 1.9, a: 0.20 * energy },
        { w: width, a: 0.95 },
      ];

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  for (const pass of passes) {
    ctx.lineWidth = pass.w;
    ctx.strokeStyle = rgba(color, pass.a * alpha);
    ctx.stroke();
  }
}

/* ------------------------------------------------------------------ *
 * Frame
 * ------------------------------------------------------------------ */

export function renderFrame(state: FrameState) {
  const { ctx, w, h, progress: p, time, samples, underline, sweepAge, low } = state;
  if (w === 0 || h === 0) return;

  const weights = beatWeights(p);
  const shapeCtx: ShapeContext = { t: time, samples };

  // Ground. Painted normally — additive blending onto black adds nothing.
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, w, h);

  // Collapse toward the wordmark underline over the last stretch.
  const land = smoothstep(0.82, 1, p);
  const geo: Geometry = {
    x0: lerp(0, underline.x, land),
    x1: lerp(w, underline.x + underline.w, land),
    yc: lerp(h / 2, underline.y, land),
    ampPx: h * (1 - land),
  };

  const color = temperatureAt(p);
  const softness = bloomSoftness(p);
  const energy = blendField(weights, 'bloom');
  const lineWidth = blendField(weights, 'lineWidth');
  const mirror = blendField(weights, 'mirror');
  const basePoints = Math.max(2, Math.round(blendField(weights, 'points')));
  const points = low ? Math.max(2, Math.round(basePoints * 0.6)) : basePoints;

  // Shatter crossfade: the line hands off to particles and back.
  const s = shatterProgress(p);
  const inShatter = s >= 0;
  const lineAlpha = inShatter
    ? Math.max(
        0,
        1 -
          Math.min(
            smoothstep(SHATTER.start, SHATTER.start + SHATTER.fade, p),
            1 - smoothstep(SHATTER.end - SHATTER.fade, SHATTER.end, p),
          ),
      )
    : 1;
  const particleAlpha = 1 - lineAlpha;

  ctx.globalCompositeOperation = 'lighter';

  if (lineAlpha > 0.01) {
    // --- Ghost echoes. Redrawn at an earlier `t`, so the lag is real. ---
    const ghosts = low ? GHOSTS.slice(0, 2) : GHOSTS;
    for (const g of ghosts) {
      const ghostCtx: ShapeContext = { t: time - g.lag, samples };
      tracePath(ctx, geo, Math.round(points * 0.6), weights, ghostCtx, 1, g.dy);
      bloomStroke(ctx, color, lineWidth, energy * 0.5, softness, g.alpha * lineAlpha, true);
      if (mirror > 0.01) {
        tracePath(ctx, geo, Math.round(points * 0.6), weights, ghostCtx, -1, -g.dy);
        bloomStroke(ctx, color, lineWidth, energy * 0.5, softness, g.alpha * mirror * lineAlpha, true);
      }
    }

    // --- Mirrored copy: full oscilloscope symmetry on machine and voice. ---
    if (mirror > 0.01) {
      tracePath(ctx, geo, points, weights, shapeCtx, -1, 0);
      bloomStroke(ctx, color, lineWidth, energy, softness, mirror * lineAlpha, low);
    }

    // --- Main line. ---
    tracePath(ctx, geo, points, weights, shapeCtx, 1, 0);
    bloomStroke(ctx, color, lineWidth, energy, softness, lineAlpha, low);
  }

  // --- Shatter particles. ---
  if (particleAlpha > 0.01 && inShatter) {
    const field = particlesFor(w);
    const mirrored = mirror > 0.01;

    for (const particle of field) {
      const srcY = machineShape(particle.u, shapeCtx) * MACHINE_AMP;
      const dstY = voiceShape(particle.u, shapeCtx) * VOICE_AMP;
      const at = particleAt(particle, s, srcY, dstY);

      const px = lerp(geo.x0, geo.x1, at.x);
      const py = geo.yc + at.y * geo.ampPx;
      // Mid-flight particles burn brighter and bigger.
      const r = particle.size * (1 + at.heat * 1.6) * (low ? 0.85 : 1);
      const a = particleAlpha * (0.35 + at.heat * 0.65);

      ctx.fillStyle = rgba(color, a * 0.5);
      ctx.beginPath();
      ctx.arc(px, py, r * 2.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = rgba(color, a);
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();

      if (mirrored) {
        const my = geo.yc - at.y * geo.ampPx;
        ctx.fillStyle = rgba(color, a * 0.55);
        ctx.beginPath();
        ctx.arc(px, my, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // --- Landing sweep: one ECG pulse crosses the underline, then rests. ---
  if (sweepAge !== null && sweepAge <= LANDING_SWEEP.duration) {
    const k = sweepAge / LANDING_SWEEP.duration;
    // Fade the beat in and out at the ends so it does not pop at the edges.
    const edge = Math.min(smoothstep(0, 0.12, k), 1 - smoothstep(0.85, 1, k));
    const head = k;
    const amp = LANDING_SWEEP.amplitude * h * edge;
    const n = 420;

    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1);
      const x = lerp(geo.x0, geo.x1, u);
      const y = geo.yc - ecgAt(u, head) * amp;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    bloomStroke(ctx, color, lineWidth, 1.2, 0.35, edge, low);
  }

  ctx.globalCompositeOperation = 'source-over';
}
