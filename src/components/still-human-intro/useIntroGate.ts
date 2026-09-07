'use client';

import { useCallback, useSyncExternalStore } from 'react';

export type IntroMode =
  /** Server render / first hydration pass. Paints the black stage, no flash. */
  | 'pending'
  /** Run the scroll-driven sequence. */
  | 'play'
  /** Show the landing state immediately: reduced motion, or already seen. */
  | 'skip';

/**
 * Decided once per page load and then frozen.
 *
 * Freezing matters: `markSeen()` writes the sessionStorage flag partway
 * through the sequence, and if the mode re-derived from storage the intro
 * would tear itself down mid-animation. The cache is what prevents that.
 */
const cache = new Map<string, IntroMode>();

function computeMode(storageKey: string): IntroMode {
  let reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    /* matchMedia unavailable — assume motion is fine */
  }

  let seen = false;
  try {
    seen = window.sessionStorage.getItem(storageKey) === 'seen';
  } catch {
    /* private mode / storage blocked — treat as unseen */
  }

  return reduced || seen ? 'skip' : 'play';
}

/** Never notifies: the decision is intentionally immutable for this page load. */
const subscribe = () => () => {};

/**
 * Decides whether the intro should run.
 *
 * useSyncExternalStore rather than useState+useEffect so the server renders
 * 'pending' and the client reads the real value on its first commit — no
 * hydration mismatch, and no setState inside an effect.
 */
export function useIntroGate(storageKey = 'still-human-intro-v1') {
  const getSnapshot = useCallback((): IntroMode => {
    const hit = cache.get(storageKey);
    if (hit) return hit;
    const next = computeMode(storageKey);
    cache.set(storageKey, next);
    return next;
  }, [storageKey]);

  const getServerSnapshot = useCallback((): IntroMode => 'pending', []);

  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const markSeen = useCallback(() => {
    try {
      window.sessionStorage.setItem(storageKey, 'seen');
    } catch {
      /* nothing to do; worst case the intro replays next navigation */
    }
  }, [storageKey]);

  return { mode, markSeen };
}
