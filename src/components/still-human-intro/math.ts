/** Small math helpers. No dependencies — safe to copy anywhere. */

export const clamp = (v: number, min = 0, max = 1) =>
  v < min ? min : v > max ? max : v;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Hermite ease between two edges. Returns 0 below `a`, 1 above `b`. */
export function smoothstep(a: number, b: number, x: number) {
  if (a === b) return x < a ? 0 : 1;
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

/** Opacity for an element that fades in over [a,b] and back out over [c,d]. */
export function windowOpacity(p: number, a: number, b: number, c = 2, d = 3) {
  return Math.min(smoothstep(a, b, p), 1 - smoothstep(c, d, p));
}

type RGB = [number, number, number];

export function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '');
  const n = parseInt(
    h.length === 3
      ? h.split('').map((c) => c + c).join('')
      : h,
    16,
  );
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export const rgbToCss = ([r, g, b]: RGB) =>
  `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;

/** Weighted average of several hex colours. Weights need not sum to 1. */
export function mixHex(entries: Array<{ hex: string; weight: number }>): string {
  let r = 0, g = 0, b = 0, total = 0;
  for (const { hex, weight } of entries) {
    if (weight <= 0) continue;
    const [cr, cg, cb] = hexToRgb(hex);
    r += cr * weight;
    g += cg * weight;
    b += cb * weight;
    total += weight;
  }
  if (total === 0) return '#ffffff';
  return rgbToCss([r / total, g / total, b / total]);
}
