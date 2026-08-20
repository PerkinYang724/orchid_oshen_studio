"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/i18n/client";

const STORAGE_KEY = "oshen-consent-v1";

type Choice = "granted" | "denied";
type GtagWindow = Window & { gtag?: (...args: unknown[]) => void };

/** Tell Consent Mode what the visitor decided. No-op before gtag exists
 *  (development, or an ad blocker that ate the script). */
function applyChoice(choice: Choice) {
  (window as GtagWindow).gtag?.("consent", "update", {
    analytics_storage: choice,
  });
}

export function ConsentBanner() {
  const { m } = useLocale();
  // Starts hidden so the server HTML and the first client render agree; the
  // stored choice is only readable after mount.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Safari private mode throws on localStorage. Treat it as no choice
      // recorded rather than breaking the page.
    }

    if (stored === "granted" || stored === "denied") {
      // The EEA default is denied, so a returning visitor's grant has to be
      // replayed on every load or their consent quietly stops applying.
      applyChoice(stored);
      return;
    }
    setVisible(true);
  }, []);

  const choose = (choice: Choice) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // Honour it for this page view even when it cannot persist.
    }
    applyChoice(choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={m.consent.ariaLabel}
      className="fixed inset-x-0 bottom-0 z-[90] flex justify-center p-4 pointer-events-none"
    >
      <div className="pointer-events-auto w-full max-w-[560px] rounded-2xl border border-white/10 bg-[#1a1a1d]/95 backdrop-blur-xl p-4 sm:p-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]">
        <p className="text-sm leading-relaxed text-white/75">{m.consent.body}</p>
        <div className="mt-4 flex gap-2.5">
          <button
            type="button"
            onClick={() => choose("granted")}
            className="flex-1 rounded-full px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#E2603D" }}
          >
            {m.consent.accept}
          </button>
          <button
            type="button"
            onClick={() => choose("denied")}
            className="flex-1 rounded-full border border-white/15 px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:text-white"
          >
            {m.consent.decline}
          </button>
        </div>
      </div>
    </div>
  );
}
