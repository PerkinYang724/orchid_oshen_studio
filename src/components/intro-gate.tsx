"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import styles from "./intro-gate.module.css";
import { INTRO_SESSION_KEY } from "./intro-session";

/*
 * gsap + ScrollTrigger are ~45KB gzipped and only a first-time visitor in a
 * session ever needs them, so the intro is a client-only dynamic import.
 * The overlay shell itself IS server-rendered — it has to be, or a
 * first-time visitor would see the site flash before the intro mounts.
 */
const StillHumanIntro = dynamic(
  () => import("./still-human-intro").then((m) => m.StillHumanIntro),
  { ssr: false },
);

type Phase = "checking" | "playing" | "dissolving" | "done";

/** Decided once per page load and frozen — see the same pattern in useIntroGate. */
let cachedSkip: boolean | null = null;

function shouldSkip(): boolean {
  if (cachedSkip !== null) return cachedSkip;

  let seen = false;
  try {
    seen = window.sessionStorage.getItem(INTRO_SESSION_KEY) === "seen";
  } catch {
    /* storage blocked — treat as unseen */
  }

  let reduced = false;
  try {
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    /* matchMedia unavailable — assume motion is fine */
  }

  cachedSkip = seen || reduced;
  return cachedSkip;
}

/** Never notifies: the decision is intentionally immutable for this page load. */
const subscribe = () => () => {};
const getSnapshot = () => (shouldSkip() ? "skip" : "play");
const getServerSnapshot = () => "checking" as const;

export function IntroGate() {
  const decision = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const [dismissed, setDismissed] = useState(false);
  const [dissolving, setDissolving] = useState(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const phase: Phase =
    decision === "checking"
      ? "checking"
      : decision === "skip" || dismissed
        ? "done"
        : dissolving
          ? "dissolving"
          : "playing";

  // Lock the page behind the overlay. Clearing the inline style restores the
  // stylesheet's own `overflow-x: hidden` rather than overwriting it.
  useEffect(() => {
    if (phase !== "playing" && phase !== "dissolving") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);

  // Dissolve, then unmount so the overlay stops intercepting anything.
  useEffect(() => {
    if (!dissolving) return;
    const id = window.setTimeout(() => setDismissed(true), 700);
    return () => window.clearTimeout(id);
  }, [dissolving]);

  const handleComplete = useCallback(() => setDissolving(true), []);

  if (phase === "done") return null;

  return (
    <div
      id="intro-gate"
      className={`${styles.overlay} ${dissolving ? styles.dissolving : ""}`}
      aria-hidden={dissolving ? true : undefined}
    >
      <div ref={scrollerRef} className={styles.scroller}>
        {phase !== "checking" && (
          <StillHumanIntro
            scroller={scrollerRef}
            storageKey={INTRO_SESSION_KEY}
            onComplete={handleComplete}
          />
        )}
      </div>
    </div>
  );
}
