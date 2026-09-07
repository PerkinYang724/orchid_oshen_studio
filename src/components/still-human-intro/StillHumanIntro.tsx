'use client';

import { useCallback, useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import styles from './intro.module.css';
import { clamp, smoothstep, windowOpacity } from './math';
import { CUE } from './timing';
import { useAudioWaveform } from './useAudioWaveform';
import { useIntroGate } from './useIntroGate';
import { renderFrame } from './renderer';
import { LANDING_SWEEP } from './timing';

export interface StillHumanIntroCopy {
  whisper: string;
  machine: string;
  voice: string;
  title: string;
  question: string;
  skip: string;
}

export const DEFAULT_COPY: StillHumanIntroCopy = {
  whisper: 'Listen',
  machine: 'Machines can write it. Score it. Cut it. Post it.',
  voice: 'This is the part they get wrong. The mess.',
  title: 'Still Human',
  question: 'where do you feel being still human matters most?',
  skip: 'Skip intro',
};

export interface StillHumanIntroProps {
  /** Overrides for any subset of the on-screen copy. */
  copy?: Partial<StillHumanIntroCopy>;
  /**
   * Audio to draw in Beat 3. Omit, or leave the file absent, and the
   * waveform is synthesised instead.
   */
  audioSrc?: string;
  /** Scroll length of the whole sequence, in viewport heights. 1.5–2 reads best. */
  pinViewports?: number;
  /** id of the element the Skip control jumps to. */
  contentId?: string;
  /** sessionStorage key for the once-per-session flag. */
  storageKey?: string;
  /** Fires once when the sequence reaches the end (or is skipped). */
  onComplete?: () => void;
  /**
   * Scroll container that drives the sequence. Omit to use the page itself,
   * which is the standalone behaviour. Supplied when the intro is mounted
   * inside a fixed overlay whose host page must not scroll.
   *
   * Integration plumbing only — affects nothing visual: no shape, timing,
   * colour, copy, grain or vignette changes with it set.
   */
  scroller?: RefObject<HTMLElement | null>;
}

export default function StillHumanIntro({
  copy,
  audioSrc = '/audio/voice-sample.mp3',
  pinViewports = 1.8,
  contentId = 'content',
  storageKey = 'still-human-intro-v1',
  onComplete,
  scroller,
}: StillHumanIntroProps) {
  const text = { ...DEFAULT_COPY, ...copy };

  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const slotRef = useRef<HTMLDivElement | null>(null);

  const whisperRef = useRef<HTMLParagraphElement | null>(null);
  const machineRef = useRef<HTMLParagraphElement | null>(null);
  const voiceRef = useRef<HTMLParagraphElement | null>(null);
  const titleWrapRef = useRef<HTMLDivElement | null>(null);
  const questionRef = useRef<HTMLParagraphElement | null>(null);

  /** Where scroll actually is. */
  const targetProgressRef = useRef(0);
  /** What we draw — chases the target, so scroll jitter never reaches the wave. */
  const progressRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  /** Geometry of the underline the line lands on, in CSS px within the stage. */
  const underlineRef = useRef({ x: 0, y: 0, w: 0 });
  const stRef = useRef<ScrollTrigger | null>(null);
  const completedRef = useRef(false);
  /** Time the landing ECG sweep fired, or null while it is unarmed. */
  const sweepStartRef = useRef<number | null>(null);
  /** Fewer bloom passes, ghosts and points on small screens. */
  const lowQualityRef = useRef(false);

  const { mode, markSeen } = useIntroGate(storageKey);
  const samples = useAudioWaveform(audioSrc);
  const samplesRef = useRef<Float32Array | null>(null);
  // Mirrored into a ref so the rAF draw loop can read it without re-subscribing.
  useEffect(() => {
    samplesRef.current = samples;
  }, [samples]);

  /* --- Measure canvas + underline target ------------------------------- */
  const measure = useCallback((): boolean => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return false;

    const rect = stage.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Assigning canvas.width CLEARS the canvas, and re-fitting the copy forces
    // a reflow. Both must happen only on a genuine size change, or every
    // observer callback flickers the frame.
    const changed =
      sizeRef.current.w !== rect.width || sizeRef.current.h !== rect.height;

    sizeRef.current = { w: rect.width, h: rect.height };
    // Fill rate, not device class, is what actually costs here — a small
    // stage on a 3x phone screen still pushes a lot of pixels.
    lowQualityRef.current = rect.width < 700 || rect.width * dpr > 2600;

    if (changed) {
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Single-line copy must also FIT: `white-space: nowrap` stops wrapping,
    // but the stage clips overflow, so an over-long line would be cut off on
    // a narrow phone. Measure the natural width and scale the type down only
    // if it would not fit. The CSS sizes stay the upper bound.
    const maxLineWidth = rect.width * 0.9;
    if (changed) for (const el of [
      whisperRef.current,
      machineRef.current,
      voiceRef.current,
      questionRef.current,
    ]) {
      if (!el) continue;
      el.style.fontSize = '';
      const natural = el.scrollWidth;
      if (natural > maxLineWidth && natural > 0) {
        const base = parseFloat(window.getComputedStyle(el).fontSize);
        el.style.fontSize = `${base * (maxLineWidth / natural)}px`;
      }
    }

    const title = titleRef.current;
    const slot = slotRef.current;
    if (title && slot) {
      const t = title.getBoundingClientRect();
      const s = slot.getBoundingClientRect();
      underlineRef.current = {
        x: t.left - rect.left,
        y: s.top - rect.top + s.height / 2,
        w: t.width,
      };
    } else {
      underlineRef.current = {
        x: rect.width * 0.3,
        y: rect.height * 0.62,
        w: rect.width * 0.4,
      };
    }

    return changed;
  }, []);

  /* --- One frame -------------------------------------------------------- */
  const draw = useCallback((time: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { w, h } = sizeRef.current;
    const p = progressRef.current;

    // Landing sweep is time-driven, not scroll-driven — it is a full stop,
    // not something to scrub. Arm it on the way in, re-arm on the way out so
    // scrubbing back and returning replays it.
    if (p >= LANDING_SWEEP.trigger && sweepStartRef.current === null) {
      sweepStartRef.current = time;
    } else if (p < LANDING_SWEEP.rearm && sweepStartRef.current !== null) {
      sweepStartRef.current = null;
    }
    const sweepAge =
      sweepStartRef.current === null ? null : time - sweepStartRef.current;

    renderFrame({
      ctx,
      w,
      h,
      progress: p,
      time,
      samples: samplesRef.current,
      underline: underlineRef.current,
      sweepAge,
      low: lowQualityRef.current,
    });

    // Copy opacity rides the same progress value.
    const set = (el: HTMLElement | null, v: number) => {
      if (el) el.style.opacity = String(clamp(v));
    };
    set(whisperRef.current, windowOpacity(p, ...CUE.whisper));
    set(machineRef.current, windowOpacity(p, ...CUE.machine));
    set(voiceRef.current, windowOpacity(p, ...CUE.voice));
    set(titleWrapRef.current, smoothstep(CUE.title[0], CUE.title[1], p));
    set(questionRef.current, smoothstep(CUE.question[0], CUE.question[1], p));
  }, []);

  /* --- Wiring ----------------------------------------------------------- */
  useEffect(() => {
    if (mode === 'pending') return;

    measure();

    const stage = stageRef.current;
    // Refresh ONLY on a genuine size change. Refreshing unconditionally from
    // an observer that watches an element ScrollTrigger itself mutates is a
    // feedback loop.
    const ro = new ResizeObserver(() => {
      if (!measure()) return;
      if (mode === 'skip') draw(0);
      ScrollTrigger.refresh();
    });
    if (stage) ro.observe(stage);

    // Reduced motion, or already seen: paint the landing frame and stop.
    if (mode === 'skip') {
      targetProgressRef.current = 1;
      progressRef.current = 1;
      // Two passes: fonts can settle between them and move the underline.
      draw(0);
      requestAnimationFrame(() => {
        measure();
        draw(0);
      });
      return () => ro.disconnect();
    }

    gsap.registerPlugin(ScrollTrigger);

    // ScrollTrigger REPORTS progress; it does not pin. The stage is held by
    // CSS `position: sticky`, which the browser composites at native scroll
    // speed. JS pinning inside a custom scroller falls back to transform
    // positioning, which is always a frame behind the scroll and visibly
    // shakes. `scrub` is omitted deliberately: it only smooths a tween
    // attached to the trigger, and there is none here — the damping in the
    // ticker below is what actually smooths this.
    const st = ScrollTrigger.create({
      // undefined = the page itself, which is ScrollTrigger's default.
      scroller: scroller?.current ?? undefined,
      trigger: sectionRef.current,
      start: 'top top',
      end: () => '+=' + window.innerHeight * pinViewports,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        targetProgressRef.current = self.progress;
        if (!completedRef.current && self.progress > 0.995) {
          completedRef.current = true;
          markSeen();
          onComplete?.();
        }
      },
    });
    stRef.current = st;

    // Exponential smoothing toward the scroll position, corrected for frame
    // time so it behaves the same at 60 and 120Hz. TAU is the time constant:
    // larger = smoother but laggier.
    const TAU = 0.09;
    const tick = (time: number, deltaMs: number) => {
      const k = 1 - Math.exp(-(deltaMs / 1000) / TAU);
      const cur = progressRef.current;
      const target = targetProgressRef.current;
      const next = cur + (target - cur) * k;
      // Settle exactly rather than crawling asymptotically forever.
      progressRef.current = Math.abs(target - next) < 0.0002 ? target : next;
      draw(time / 1000);
    };
    gsap.ticker.add(tick);

    // Fonts change the wordmark width, which moves the underline target.
    void document.fonts?.ready.then(() => {
      measure();
      ScrollTrigger.refresh();
    });

    return () => {
      gsap.ticker.remove(tick);
      st.kill();
      stRef.current = null;
      ro.disconnect();
    };
  }, [mode, measure, draw, pinViewports, markSeen, onComplete, scroller]);

  /* --- Skip ------------------------------------------------------------- */
  const handleSkip = useCallback(() => {
    markSeen();
    completedRef.current = true;
    onComplete?.();

    // Inside a host overlay, the host owns dismissal — onComplete above has
    // already told it. Scrolling the page here would move the site beneath.
    if (scroller?.current) return;

    const st = stRef.current;
    if (st) {
      window.scrollTo({ top: st.end, behavior: 'smooth' });
    } else {
      document
        .getElementById(contentId)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [markSeen, onComplete, contentId, scroller]);

  const initial = mode === 'skip' ? 1 : 0;

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      // Pin spacing used to create the scroll length. With CSS sticky holding
      // the stage instead, the section has to be tall enough itself: one
      // viewport for the stage plus `pinViewports` to scroll through.
      style={{
        height:
          mode === 'play' ? `${(1 + pinViewports) * 100}svh` : '100svh',
      }}
      aria-label="Introduction"
    >
      <div ref={stageRef} className={styles.stage}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

        <div className={styles.grain} aria-hidden="true" />
        <div className={styles.vignette} aria-hidden="true" />

        <button type="button" className={styles.skip} onClick={handleSkip}>
          {text.skip}
        </button>

        <div className={styles.copyLayer} aria-hidden="true">
          <p ref={whisperRef} className={`${styles.copyLine} ${styles.whisper}`} style={{ opacity: 0 }}>
            {text.whisper}
          </p>
        </div>

        <div className={styles.copyLayer} aria-hidden="true">
          <p ref={machineRef} className={`${styles.copyLine} ${styles.machineCopy}`} style={{ opacity: 0 }}>
            {text.machine}
          </p>
        </div>

        <div className={styles.copyLayer} aria-hidden="true">
          <p ref={voiceRef} className={`${styles.copyLine} ${styles.voiceCopy}`} style={{ opacity: 0 }}>
            {text.voice}
          </p>
        </div>

        <div
          ref={titleWrapRef}
          className={styles.titleWrap}
          style={{ opacity: initial }}
        >
          <h1 ref={titleRef} className={styles.title}>
            {text.title}
          </h1>
          <div ref={slotRef} className={styles.underlineSlot} aria-hidden="true" />
        </div>

        <p
          ref={questionRef}
          className={styles.question}
          style={{ opacity: initial }}
        >
          {text.question}
        </p>
      </div>
    </section>
  );
}
