/**
 * Deterministic value noise.
 *
 * Deterministic matters here: ScrollTrigger scrubs backwards as well as
 * forwards, so the same scroll position must always draw the same shape.
 * Math.random() would make the waveform boil and re-roll on every frame.
 */

function hash(n: number): number {
  const s = Math.sin(n * 127.1) * 43758.5453123;
  return s - Math.floor(s);
}

/** Smooth 1D value noise in [-1, 1]. */
export function valueNoise(x: number): number {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return (hash(i) * (1 - u) + hash(i + 1) * u) * 2 - 1;
}

/** Fractal brownian motion — stacked octaves of value noise, in roughly [-1, 1]. */
export function fbm(x: number, octaves = 4): number {
  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  for (let o = 0; o < octaves; o++) {
    sum += amp * valueNoise(x * freq);
    freq *= 2.07;
    amp *= 0.5;
  }
  return sum;
}

/** Gaussian bump centred at `mu` with width `sigma`. Used to build the ECG spike. */
export function gaussian(x: number, mu: number, sigma: number): number {
  const d = (x - mu) / sigma;
  return Math.exp(-0.5 * d * d);
}
