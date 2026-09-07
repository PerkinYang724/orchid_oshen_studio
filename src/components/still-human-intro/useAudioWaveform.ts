'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Decode an audio file into a fixed-length peak array for Beat 3.
 *
 * Degrades silently: a missing file, an unsupported codec, or a browser that
 * refuses to build an AudioContext all resolve to `null`, and the caller
 * falls back to the synthetic waveform. The intro must never fail to render
 * because audio is absent.
 *
 * Note we never play the audio, only decode it, so no user gesture is needed.
 */
export function useAudioWaveform(src: string | undefined, resolution = 1600) {
  const [samples, setSamples] = useState<Float32Array | null>(null);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;
    if (!src) return;

    (async () => {
      try {
        const res = await fetch(src);
        if (!res.ok) return; // no file dropped in yet — synthetic it is
        const buf = await res.arrayBuffer();

        const Ctx =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!Ctx) return;

        const ctx = new Ctx();
        const audio = await ctx.decodeAudioData(buf);
        const channel = audio.getChannelData(0);

        // Downsample to `resolution` signed peaks, keeping the loudest
        // excursion in each bucket so quiet passages stay visible.
        const bucket = Math.floor(channel.length / resolution) || 1;
        const out = new Float32Array(resolution);
        let max = 0;
        for (let i = 0; i < resolution; i++) {
          const start = i * bucket;
          let peak = 0;
          for (let j = 0; j < bucket; j++) {
            const v = channel[start + j] ?? 0;
            if (Math.abs(v) > Math.abs(peak)) peak = v;
          }
          out[i] = peak;
          if (Math.abs(peak) > max) max = Math.abs(peak);
        }
        // Normalise so quiet recordings still fill the frame.
        if (max > 0) for (let i = 0; i < resolution; i++) out[i] /= max;

        void ctx.close();
        if (!cancelled.current) setSamples(out);
      } catch {
        // Decode failed. Synthetic waveform covers it.
      }
    })();

    return () => {
      cancelled.current = true;
    };
  }, [src, resolution]);

  return samples;
}
