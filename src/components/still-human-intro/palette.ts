/**
 * palette.ts — continuous colour temperature across the whole scroll.
 *
 * Deliberately NOT per-beat. The story is a temperature slide — cold machine,
 * through a white flash, into warm human — and the white waypoint sits at
 * 0.43, which is the middle of the shatter, not on any beat. Anchoring colour
 * to beats would put a hard swap where the drama is.
 */

export type RGB = [number, number, number];

/** Stops in scroll order. Edit these to retune the temperature slide. */
const STOPS: Array<{ at: number; rgb: RGB }> = [
  { at: 0.00, rgb: [46, 49, 52] },    // #2E3134 dead grey — the flat line
  { at: 0.30, rgb: [110, 143, 163] }, // #6E8FA3 cold steel blue — machine
  { at: 0.43, rgb: [242, 246, 248] }, // #F2F6F8 white — the shatter flash
  { at: 0.58, rgb: [227, 177, 105] }, // #E3B169 warm gold — human voice
  { at: 0.80, rgb: [217, 96, 63] },   // #D9603F warm ember — the heartbeat
  { at: 1.00, rgb: [239, 231, 218] }, // #EFE7DA bone — the underline
];

/** Linear blend between the two stops bracketing `p`. */
export function temperatureAt(p: number): RGB {
  const t = p < 0 ? 0 : p > 1 ? 1 : p;
  if (t <= STOPS[0].at) return [...STOPS[0].rgb];
  const last = STOPS[STOPS.length - 1];
  if (t >= last.at) return [...last.rgb];

  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i];
    const b = STOPS[i + 1];
    if (t >= a.at && t <= b.at) {
      const k = (t - a.at) / (b.at - a.at);
      return [
        a.rgb[0] + (b.rgb[0] - a.rgb[0]) * k,
        a.rgb[1] + (b.rgb[1] - a.rgb[1]) * k,
        a.rgb[2] + (b.rgb[2] - a.rgb[2]) * k,
      ];
    }
  }
  return [...last.rgb];
}

export const rgba = ([r, g, b]: RGB, a: number) =>
  `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a.toFixed(4)})`;

/**
 * Bloom character. The machine beat glows cold and tight; the human beat
 * glows warm and soft. `softness` 0 = sharp, 1 = wide halo.
 */
export function bloomSoftness(p: number): number {
  // Sharp through the machine beat, softening across the shatter into voice,
  // tightening again for the heartbeat so the spike stays legible.
  if (p < 0.30) return 0.15 + (p / 0.30) * 0.05;
  if (p < 0.58) return 0.20 + ((p - 0.30) / 0.28) * 0.80;
  if (p < 0.85) return 1.0 - ((p - 0.58) / 0.27) * 0.45;
  return 0.55 - ((p - 0.85) / 0.15) * 0.25;
}
