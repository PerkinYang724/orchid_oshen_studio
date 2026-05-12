"use client";

import { useTransition } from "react";
import { useLocale } from "@/i18n/client";
import { setLocaleAction } from "@/i18n/setLocale";
import type { Locale } from "@/i18n/types";

export function LanguageSwitcher() {
  const { locale, m } = useLocale();
  const [isPending, startTransition] = useTransition();

  const select = (next: Locale) => {
    if (next === locale || isPending) return;
    startTransition(() => {
      void setLocaleAction(next);
    });
  };

  return (
    <div
      role="group"
      aria-label={m.languageSwitcher.ariaLabel}
      className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] p-0.5 text-[11px]"
    >
      <button
        type="button"
        onClick={() => select("en")}
        aria-pressed={locale === "en"}
        className={`px-2.5 py-1 rounded-full transition-colors duration-200 ${
          locale === "en"
            ? "bg-white/[0.1] text-white"
            : "text-white/40 hover:text-white/70"
        }`}
      >
        {m.languageSwitcher.english}
      </button>
      <button
        type="button"
        onClick={() => select("zh-TW")}
        aria-pressed={locale === "zh-TW"}
        className={`px-2.5 py-1 rounded-full transition-colors duration-200 ${
          locale === "zh-TW"
            ? "bg-white/[0.1] text-white"
            : "text-white/40 hover:text-white/70"
        }`}
      >
        {m.languageSwitcher.traditionalMandarin}
      </button>
    </div>
  );
}
