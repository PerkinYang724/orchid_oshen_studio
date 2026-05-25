"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useLocale } from "@/i18n/client";
import { setLocaleAction } from "@/i18n/setLocale";
import type { Locale } from "@/i18n/types";

const FLAGS: Record<Locale, string> = {
  en: "🇺🇸",
  "zh-TW": "🇹🇼",
};

export function FlagLanguageSwitcher({ light = false }: { light?: boolean }) {
  const { locale, m } = useLocale();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  const options: { code: Locale; label: string }[] = [
    { code: "en", label: m.languageSwitcher.english },
    { code: "zh-TW", label: m.languageSwitcher.traditionalMandarin },
  ];

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const select = (next: Locale) => {
    setOpen(false);
    if (next === locale || isPending) return;
    startTransition(() => {
      void setLocaleAction(next);
    });
  };

  const trigger = light
    ? "border-[#161310]/15 text-[#161310]/80 hover:border-[#161310]/30"
    : "border-white/15 text-white/80 hover:border-white/30";
  const panel = light
    ? "bg-[#FAF8F5] border-[#161310]/10"
    : "bg-[#1a1a1d] border-white/10";
  const rowText = light ? "text-[#161310]" : "text-white";
  const rowHover = light ? "hover:bg-[#161310]/[0.05]" : "hover:bg-white/[0.06]";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={m.languageSwitcher.ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`inline-flex items-center gap-1.5 rounded-full border pl-2.5 pr-2 py-1.5 transition-colors ${trigger}`}
      >
        <span className="text-base leading-none">{FLAGS[locale]}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={`absolute right-0 mt-2 min-w-[180px] rounded-xl border shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)] backdrop-blur-xl p-1.5 z-[70] ${panel}`}
        >
          {options.map((opt) => {
            const active = opt.code === locale;
            return (
              <button
                key={opt.code}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => select(opt.code)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-colors ${rowText} ${rowHover}`}
              >
                <span className="text-lg leading-none">{FLAGS[opt.code]}</span>
                <span className="flex-1">{opt.label}</span>
                {active && (
                  <Check className="w-4 h-4" style={{ color: "#E2603D" }} strokeWidth={2.5} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
