"use client";

import { motion, useScroll, useTransform, useInView, useMotionValue, useMotionValueEvent, type MotionValue } from "framer-motion";
import { useRef, useEffect, type ReactNode } from "react";
import { useReducedMotion } from "../hooks/use-reduced-motion";
import { useStickyProgress } from "./cinematic-section";

/* ── Gate: only run reveal when within viewport ────────────────────────────── */

const IN_VIEW_MARGIN = "50% 0px 50% 0px";

/* ── RevealHeading ────────────────────────────────────────────────────────
   Opacity + y only (no clip-path). Gated by useInView; static when not in view.
   ────────────────────────────────────────────────────────────────────────── */

type RevealHeadingProps = {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
  offset?: [string, string];
};

export function RevealHeading({
  children,
  as: Tag = "h2",
  className = "",
  offset = ["start 85%", "start 40%"],
}: RevealHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollProgress: stickyProgress } = useStickyProgress();
  const inView = useInView(ref, { margin: IN_VIEW_MARGIN, once: false });

  const scrollFromSection = useScroll({
    target: ref,
    offset: offset as any,
  });

  const scrollYProgress = stickyProgress ?? scrollFromSection.scrollYProgress;
  const effectiveProgress = useMotionValue(1);

  useEffect(() => {
    if (inView) {
      effectiveProgress.set(scrollYProgress.get());
    } else {
      effectiveProgress.set(1);
    }
  }, [inView, effectiveProgress, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (inView) effectiveProgress.set(v);
  });

  const opacity = useTransform(
    effectiveProgress,
    [0, 0.35, 1],
    reducedMotion ? [1, 1, 1] : [0, 1, 1]
  );
  const y = useTransform(
    effectiveProgress,
    [0, 1],
    reducedMotion ? [0, 0] : [20, 0]
  );

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div style={{ opacity, y }}>
        <Tag className={className}>{children}</Tag>
      </motion.div>
    </div>
  );
}

/* ── StaggeredText ────────────────────────────────────────────────────────
   Gated by useInView; static (opacity 1, y 0) when not in view.
   ────────────────────────────────────────────────────────────────────────── */

type StaggeredTextProps = {
  children: ReactNode[];
  className?: string;
  stagger?: number;
  yOffset?: number;
};

export function StaggeredText({
  children,
  className = "",
  stagger = 0.08,
  yOffset = 16,
}: StaggeredTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollProgress: stickyProgress } = useStickyProgress();
  const inView = useInView(ref, { margin: IN_VIEW_MARGIN, once: false });

  const scrollFromSection = useScroll({
    target: ref,
    offset: ["start 85%", "start 50%"] as any,
  });

  const scrollYProgress = stickyProgress ?? scrollFromSection.scrollYProgress;
  const effectiveProgress = useMotionValue(1);

  useEffect(() => {
    if (inView) {
      effectiveProgress.set(scrollYProgress.get());
    } else {
      effectiveProgress.set(1);
    }
  }, [inView, effectiveProgress, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (inView) effectiveProgress.set(v);
  });

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => {
        const start = Math.min(i * stagger, 0.6);
        const end = Math.min(start + 0.4, 1);
        return (
          <StaggeredChild
            key={i}
            scrollProgress={effectiveProgress}
            start={start}
            end={end}
            yOffset={reducedMotion ? 0 : yOffset}
            reducedMotion={reducedMotion}
          >
            {child}
          </StaggeredChild>
        );
      })}
    </div>
  );
}

function StaggeredChild({
  children,
  scrollProgress,
  start,
  end,
  yOffset,
  reducedMotion,
}: {
  children: ReactNode;
  scrollProgress: MotionValue<number>;
  start: number;
  end: number;
  yOffset: number;
  reducedMotion: boolean;
}) {
  const opacity = useTransform(
    scrollProgress,
    [start, end],
    reducedMotion ? [1, 1] : [0, 1]
  );
  const y = useTransform(
    scrollProgress,
    [start, end],
    reducedMotion ? [0, 0] : [yOffset, 0]
  );

  return <motion.div style={{ opacity, y }}>{children}</motion.div>;
}

/* ── MicroCard ──────────────────────────────────────────────────────────── */

type MicroCardProps = {
  children: ReactNode;
  className?: string;
  glowColor?: string;
};

export function MicroCard({
  children,
  className = "",
  glowColor = "rgba(41,151,255,0.06)",
}: MicroCardProps) {
  return (
    <motion.div
      className={`micro-card ${className}`}
      whileHover={{
        y: -3,
        scale: 1.01,
        boxShadow: `0 20px 60px rgba(0,0,0,0.3), 0 0 40px ${glowColor}`,
      }}
      transition={{ duration: 0.35, ease: [0.25, 0.4, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}
