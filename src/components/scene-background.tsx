"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "../hooks/use-reduced-motion";
import { useIsMobile } from "../hooks/use-mobile";

/* ── Constants ──────────────────────────────────────────────────────────── */

const HYSTERESIS = 0.08;
const DWELL_MS = 150;
const STICKY_LOCK_UNTIL_PROGRESS = 0.7;
const CROSSFADE_DURATION_MS = 1000;
const SCENE_CUT_VIGNETTE_PEAK = 1.25;
const SCENE_CUT_EXPOSURE_PEAK = 1.04;
const SCENE_CUT_SETTLE_MS = 450;

/* ── Scene theme definition ─────────────────────────────────────────────── */

export type SceneTheme = {
  /** CSS gradient or solid color for background */
  gradient: string;
  /** Light bloom color (used for a large soft glow) */
  bloomColor?: string;
  /** Bloom position as [x%, y%] */
  bloomPosition?: [number, number];
  /** Bloom size in px */
  bloomSize?: number;
  /** Vignette intensity 0–1 */
  vignette?: number;
  /** Film grain opacity 0–1 */
  grain?: number;
};

/* ── Default / fallback theme ───────────────────────────────────────────── */

const defaultTheme: SceneTheme = {
  gradient:
    "radial-gradient(ellipse at 50% 0%, rgba(41,151,255,0.03) 0%, transparent 70%)",
  bloomColor: "rgba(41,151,255,0.03)",
  bloomPosition: [50, 30],
  bloomSize: 600,
  vignette: 0.4,
  grain: 0.03,
};

type SectionState = {
  progress: number;
  isSticky?: boolean;
  stickyProgress?: number;
  isChapter?: boolean;
};

/* ── Context ────────────────────────────────────────────────────────────── */

type SceneBackgroundContextValue = {
  registerSection: (id: string, theme: SceneTheme, opts?: { chapter?: boolean }) => void;
  setActiveSection: (
    id: string,
    progress: number,
    opts?: { isSticky?: boolean; stickyProgress?: number }
  ) => void;
};

const SceneBackgroundContext = createContext<SceneBackgroundContextValue>({
  registerSection: () => {},
  setActiveSection: () => {},
});

export function useSceneBackground() {
  return useContext(SceneBackgroundContext);
}

function centerednessScore(progress: number): number {
  return Math.max(0, 1 - Math.abs(progress - 0.5) * 2);
}

/* ── Provider component ─────────────────────────────────────────────────── */

type SceneBackgroundProviderProps = {
  children: ReactNode;
  /** Initial theme (e.g. hero) before any section wins. */
  initialTheme?: SceneTheme;
};

export function SceneBackgroundProvider({ children, initialTheme }: SceneBackgroundProviderProps) {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const themes = useRef<Map<string, SceneTheme>>(new Map());
  const chapterSections = useRef<Set<string>>(new Set());
  const sectionState = useRef<Map<string, SectionState>>(new Map());

  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const activeSectionIdRef = useRef<string | null>(null);
  activeSectionIdRef.current = activeSectionId;
  const dwellCandidateRef = useRef<{ id: string; score: number } | null>(null);
  const dwellTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initial = initialTheme ?? defaultTheme;
  const prevThemeRef = useRef<SceneTheme>(initial);
  const [displayTheme, setDisplayTheme] = useState<SceneTheme>(initial);
  const crossfadeProgress = useMotionValue(1); // 0 = showing prev, 1 = showing next
  const crossfadeStartTimeRef = useRef<number>(0);
  const crossfadeFrameRef = useRef<number>(0);

  // Scene cut: brief swell then settle (MotionValues for smooth render without state)
  const vignetteSwell = useMotionValue(1);
  const exposureSwell = useMotionValue(1);
  const sceneCutStartRef = useRef<number>(0);
  const sceneCutFrameRef = useRef<number>(0);

  const registerSection = useCallback(
    (id: string, theme: SceneTheme, opts?: { chapter?: boolean }) => {
      themes.current.set(id, theme);
      if (opts?.chapter) chapterSections.current.add(id);
    },
    []
  );

  const setActiveSection = useCallback(
    (id: string, progress: number, opts?: { isSticky?: boolean; stickyProgress?: number }) => {
      sectionState.current.set(id, {
        progress,
        isSticky: opts?.isSticky,
        stickyProgress: opts?.stickyProgress,
        isChapter: chapterSections.current.has(id),
      });

      const score = centerednessScore(progress);
      const currentId = activeSectionIdRef.current ?? "";
      const currentState = currentId ? sectionState.current.get(currentId) : undefined;
      const currentScore = currentId ? centerednessScore(currentState?.progress ?? 0) : -1;

      // Sticky lock: don't leave current section if it's sticky and progress < 70%
      if (
        currentState?.isSticky &&
        typeof currentState.stickyProgress === "number" &&
        currentState.stickyProgress < STICKY_LOCK_UNTIL_PROGRESS
      ) {
        return;
      }

      // Find best candidate by score (among sections with meaningful visibility)
      let bestId = "";
      let bestScore = -1;
      sectionState.current.forEach((state, sId) => {
        const p = state.progress;
        if (p <= 0.02 || p >= 0.98) return;
        const s = centerednessScore(p);
        if (s > bestScore) {
          bestScore = s;
          bestId = sId;
        }
      });

      // Hysteresis: switch only if new score clearly beats current
      if (bestId && bestScore > currentScore + HYSTERESIS) {
        const candidate = { id: bestId, score: bestScore };

        if (dwellCandidateRef.current?.id === candidate.id) {
          // Same candidate: ensure dwell timer is set
          if (!dwellTimerRef.current) {
            dwellTimerRef.current = setTimeout(() => {
              dwellTimerRef.current = null;
              activeSectionIdRef.current = candidate.id;
              setActiveSectionId(candidate.id);
              dwellCandidateRef.current = null;
            }, DWELL_MS);
            // Note: we can't call setActiveSectionId in a ref callback; the timeout
            // reads the latest candidate from dwellCandidateRef, so we need to set
            // state in the timeout. But we need to trigger theme transition there.
            // So in the timeout we set activeSectionId, and in useEffect we react
            // to activeSectionId change and start crossfade + scene cut.
            return;
          }
        } else {
          // New candidate: reset dwell
          if (dwellTimerRef.current) {
            clearTimeout(dwellTimerRef.current);
            dwellTimerRef.current = null;
          }
          dwellCandidateRef.current = candidate;
          dwellTimerRef.current = setTimeout(() => {
            dwellTimerRef.current = null;
            activeSectionIdRef.current = candidate.id;
            setActiveSectionId(candidate.id);
            dwellCandidateRef.current = null;
          }, DWELL_MS);
        }
      } else {
        // No clear winner or hysteresis not met: clear dwell candidate
        if (dwellTimerRef.current) {
          clearTimeout(dwellTimerRef.current);
          dwellTimerRef.current = null;
        }
        dwellCandidateRef.current = null;
      }
    },
    []
  );

  // When activeSectionId changes: start double-layer crossfade + scene cut
  useEffect(() => {
    if (!activeSectionId || !themes.current.has(activeSectionId)) return;

    const nextTheme = themes.current.get(activeSectionId)!;
    const isChapter = chapterSections.current.has(activeSectionId);

    prevThemeRef.current = displayTheme;
    setDisplayTheme(nextTheme);

    crossfadeProgress.set(0);
    crossfadeStartTimeRef.current = performance.now();

    const vignettePeak = isChapter ? SCENE_CUT_VIGNETTE_PEAK * 1.1 : SCENE_CUT_VIGNETTE_PEAK;
    const exposurePeak = isChapter ? SCENE_CUT_EXPOSURE_PEAK * 1.02 : SCENE_CUT_EXPOSURE_PEAK;
    vignetteSwell.set(vignettePeak);
    exposureSwell.set(exposurePeak);
    sceneCutStartRef.current = performance.now();

    const runCrossfade = (t: number) => {
      const elapsed = t - crossfadeStartTimeRef.current;
      const p = Math.min(1, elapsed / CROSSFADE_DURATION_MS);
      const eased = 1 - (1 - p) * (1 - p); // ease-out quad
      crossfadeProgress.set(eased);
      if (p < 1) crossfadeFrameRef.current = requestAnimationFrame(runCrossfade);
    };
    const runSceneCut = (t: number) => {
      const elapsed = t - sceneCutStartRef.current;
      const p = Math.min(1, elapsed / SCENE_CUT_SETTLE_MS);
      const eased = 1 - (1 - p) * (1 - p);
      const v = 1 + (vignettePeak - 1) * (1 - eased);
      const e = 1 + (exposurePeak - 1) * (1 - eased);
      vignetteSwell.set(v);
      exposureSwell.set(e);
      if (p < 1) sceneCutFrameRef.current = requestAnimationFrame(runSceneCut);
    };

    const tick = (t: number) => {
      runCrossfade(t);
      runSceneCut(t);
    };
    crossfadeFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (crossfadeFrameRef.current) cancelAnimationFrame(crossfadeFrameRef.current);
      if (sceneCutFrameRef.current) cancelAnimationFrame(sceneCutFrameRef.current);
    };
  }, [activeSectionId]); // eslint-disable-line react-hooks/exhaustive-deps -- displayTheme intentionally not in deps to use previous value

  // Subscribe to crossfade and scene-cut MotionValues for rendering (no React state)
  const crossfadeSpring = useSpring(crossfadeProgress, { stiffness: 120, damping: 30 });
  const vignetteSpring = useSpring(vignetteSwell, { stiffness: 150, damping: 35 });
  const exposureSpring = useSpring(exposureSwell, { stiffness: 150, damping: 35 });

  const [crossfadeVal, setCrossfadeVal] = useState(1);
  const [vignetteSwellVal, setVignetteSwellVal] = useState(1);
  const [exposureVal, setExposureVal] = useState(1);

  useEffect(() => {
    const unsubC = crossfadeSpring.on("change", (v) => setCrossfadeVal(v));
    const unsubV = vignetteSpring.on("change", (v) => setVignetteSwellVal(v));
    const unsubE = exposureSpring.on("change", (v) => setExposureVal(v));
    return () => {
      unsubC();
      unsubV();
      unsubE();
    };
  }, [crossfadeSpring, vignetteSpring, exposureSpring]);

  const prevTheme = prevThemeRef.current;
  const showGrain = !reducedMotion && !isMobile;

  return (
    <SceneBackgroundContext.Provider value={{ registerSection, setActiveSection }}>
      {/* Fixed background: double-layer crossfade */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
        {/* Layer A: previous theme (fades out) */}
        <div
          className="absolute inset-0 transition-none"
          style={{
            background: prevTheme.gradient,
            opacity: 1 - crossfadeVal,
          }}
        />
        {/* Layer B: next theme (fades in) */}
        <div
          className="absolute inset-0 transition-none"
          style={{
            background: displayTheme.gradient,
            opacity: crossfadeVal,
          }}
        />

        {/* Bloom: double-layer */}
        {prevTheme.bloomColor && (
          <div
            className="absolute rounded-full pointer-events-none transition-none"
            style={{
              background: prevTheme.bloomColor,
              width: prevTheme.bloomSize ?? 600,
              height: ((prevTheme.bloomSize ?? 600) * 0.6),
              left: `${prevTheme.bloomPosition?.[0] ?? 50}%`,
              top: `${prevTheme.bloomPosition?.[1] ?? 30}%`,
              transform: "translate(-50%, -50%)",
              filter: `blur(${((prevTheme.bloomSize ?? 600) * 0.25)}px)`,
              opacity: 1 - crossfadeVal,
            }}
          />
        )}
        {displayTheme.bloomColor && (
          <div
            className="absolute rounded-full pointer-events-none transition-none"
            style={{
              background: displayTheme.bloomColor,
              width: displayTheme.bloomSize ?? 600,
              height: ((displayTheme.bloomSize ?? 600) * 0.6),
              left: `${displayTheme.bloomPosition?.[0] ?? 50}%`,
              top: `${displayTheme.bloomPosition?.[1] ?? 30}%`,
              transform: "translate(-50%, -50%)",
              filter: `blur(${((displayTheme.bloomSize ?? 600) * 0.25)}px)`,
              opacity: crossfadeVal,
            }}
          />
        )}

        {/* Vignette: double-layer with scene-cut swell */}
        <div
          className="absolute inset-0 transition-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)",
            opacity: (prevTheme.vignette ?? 0.4) * (1 - crossfadeVal) * vignetteSwellVal,
          }}
        />
        <div
          className="absolute inset-0 transition-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)",
            opacity: (displayTheme.vignette ?? 0.4) * crossfadeVal * vignetteSwellVal,
          }}
        />

        {/* Exposure (brightness) swell for scene cut */}
        <div
          className="absolute inset-0 transition-none mix-blend-screen pointer-events-none"
          style={{
            background: "white",
            opacity: (exposureVal - 1) * 0.15,
          }}
        />

        {/* Static grain overlay: desktop only, no animation, no reduced-motion */}
        {showGrain && (
          <div
            className="absolute inset-0 scene-grain-static"
            style={{
              opacity: (prevTheme.grain ?? 0.03) * (1 - crossfadeVal) + (displayTheme.grain ?? 0.03) * crossfadeVal,
            }}
          />
        )}
      </div>

      {children}
    </SceneBackgroundContext.Provider>
  );
}
