"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useSpring,
  useInView,
  useMotionValue,
  type MotionValue,
} from "framer-motion";
import { createContext, useRef, useEffect, useId, useContext, type ReactNode } from "react";
import { useReducedMotion } from "../hooks/use-reduced-motion";
import { useSceneBackground, type SceneTheme } from "./scene-background";

/* ── Spring config: single spring for all scroll-driven motion ───────────────── */

const SCROLL_SPRING = { stiffness: 42, damping: 36 };

/* ── Viewport gating: only animate when within ~1.5 viewport heights ─────────── */

const IN_VIEW_MARGIN = "100% 0px 100% 0px";

/* ── Sticky progress context ───────────────────────────────────────────────── */

type StickyProgressContextValue = {
  scrollProgress: MotionValue<number> | null;
};

const StickyProgressContext = createContext<StickyProgressContextValue>({
  scrollProgress: null,
});

export function useStickyProgress() {
  return useContext(StickyProgressContext);
}

/* ── Types ───────────────────────────────────────────────────────────────── */

type ParallaxLayer = {
  content: ReactNode;
  speed?: number;
  className?: string;
};

type CinematicSectionProps = {
  children: ReactNode;
  className?: string;
  theme?: SceneTheme;
  stickyHeight?: number;
  backgroundLayer?: ReactNode;
  backgroundSpeed?: number;
  parallaxLayers?: ParallaxLayer[];
  yRange?: [number, number, number];
  scaleRange?: [number, number, number];
  fadeOnExit?: boolean;
  chapterTransition?: boolean;
};

/* ── Component ──────────────────────────────────────────────────────────── */

export function CinematicSection({
  children,
  className = "",
  theme,
  stickyHeight,
  backgroundLayer,
  backgroundSpeed = 0.3,
  parallaxLayers,
  yRange = [60, 0, -20],
  scaleRange = [0.98, 1, 0.99],
  fadeOnExit = true,
  chapterTransition = false,
}: CinematicSectionProps) {
  const sectionId = useId();
  const reducedMotion = useReducedMotion();
  const { registerSection, setActiveSection } = useSceneBackground();
  const outerRef = useRef<HTMLDivElement>(null);

  const inView = useInView(outerRef, { margin: IN_VIEW_MARGIN, once: false });

  useEffect(() => {
    if (theme) {
      registerSection(sectionId, theme, { chapter: chapterTransition });
    }
  }, [sectionId, theme, chapterTransition, registerSection]);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!theme) return;
    if (stickyHeight) {
      const stickyP = stickyProgressFromP.get();
      setActiveSection(sectionId, v, { isSticky: true, stickyProgress: stickyP });
    } else {
      setActiveSection(sectionId, v);
    }
  });

  /* ── Single effective progress: only updated when in view ────────────────── */

  const effectiveProgress = useMotionValue(0.5);

  useEffect(() => {
    if (inView) {
      effectiveProgress.set(scrollYProgress.get());
    } else {
      effectiveProgress.set(0.5);
    }
  }, [inView, effectiveProgress, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (inView) effectiveProgress.set(v);
  });

  /* ── One spring, then all transforms derived from it ──────────────────────── */

  const p = useSpring(effectiveProgress, SCROLL_SPRING);

  const opacity = useTransform(
    p,
    fadeOnExit ? [0, 0.15, 0.45, 0.85, 1] : [0, 0.15, 0.45, 1],
    fadeOnExit
      ? reducedMotion ? [1, 1, 1, 1, 1] : [0, 1, 1, 1, 0.85]
      : reducedMotion ? [1, 1, 1, 1] : [0, 1, 1, 1]
  );

  const y = useTransform(
    p,
    [0, 0.2, 0.5, 0.85, 1],
    reducedMotion ? [0, 0, 0, 0, 0] : [yRange[0], yRange[1], yRange[1], yRange[2], yRange[2]]
  );

  const scale = useTransform(
    p,
    [0, 0.2, 0.5, 0.85, 1],
    reducedMotion
      ? [1, 1, 1, 1, 1]
      : [scaleRange[0], scaleRange[1], scaleRange[1], scaleRange[2], scaleRange[2]]
  );

  const bgY = useTransform(
    p,
    [0, 1],
    reducedMotion ? ["0%", "0%"] : [`${-backgroundSpeed * 15}%`, `${backgroundSpeed * 15}%`]
  );

  const stickyProgressFromP = useTransform(p, [0.1, 0.9], [0, 1]);

  /* ── No blur filter: entrance uses opacity + scale only (GPU-friendly) ─────── */

  const stickyContextValue: StickyProgressContextValue = stickyHeight
    ? { scrollProgress: stickyProgressFromP }
    : { scrollProgress: null };

  if (stickyHeight) {
    return (
      <StickyProgressContext.Provider value={stickyContextValue}>
        <div
          ref={outerRef}
          className="relative"
          style={{ height: `${stickyHeight}vh` }}
        >
          <div className="sticky top-0 h-screen overflow-hidden">
            {backgroundLayer && !reducedMotion && (
              <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
                {backgroundLayer}
              </motion.div>
            )}
            {parallaxLayers &&
              !reducedMotion &&
              parallaxLayers.map((layer, i) => (
                <ParallaxLayerEl
                  key={i}
                  layer={layer}
                  progress={p}
                  reducedMotion={reducedMotion}
                />
              ))}
            <motion.div
              className={`relative z-10 h-full ${className}`}
              style={{ opacity, scale, willChange: "transform, opacity" }}
            >
              {typeof children === "function"
                ? (children as (progress: MotionValue<number>) => ReactNode)(stickyProgressFromP)
                : children}
            </motion.div>
          </div>
        </div>
      </StickyProgressContext.Provider>
    );
  }

  return (
    <StickyProgressContext.Provider value={stickyContextValue}>
      <div ref={outerRef} className="relative">
        {backgroundLayer && !reducedMotion && (
          <motion.div
            className="absolute inset-0 z-0 overflow-hidden"
            style={{ y: bgY }}
          >
            {backgroundLayer}
          </motion.div>
        )}
        {parallaxLayers &&
          !reducedMotion &&
          parallaxLayers.map((layer, i) => (
            <ParallaxLayerEl
              key={i}
              layer={layer}
              progress={p}
              reducedMotion={reducedMotion}
            />
          ))}
        <motion.div
          className={`relative z-10 ${className}`}
          style={{
            opacity,
            y,
            scale,
            willChange: "transform, opacity",
          }}
        >
          {children}
        </motion.div>
      </div>
    </StickyProgressContext.Provider>
  );
}

function ParallaxLayerEl({
  layer,
  progress,
  reducedMotion,
}: {
  layer: ParallaxLayer;
  progress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const speed = layer.speed ?? 0.5;
  const y = useTransform(
    progress,
    [0, 1],
    reducedMotion ? ["0%", "0%"] : [`${-speed * 20}%`, `${speed * 20}%`]
  );

  return (
    <motion.div
      className={`absolute inset-0 z-0 pointer-events-none ${layer.className ?? ""}`}
      style={{ y }}
    >
      {layer.content}
    </motion.div>
  );
}
