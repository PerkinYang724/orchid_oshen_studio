"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/i18n/client";

const SUBSTACK = "https://substack.com/@perkin0909";

export function NewsletterBand() {
  const { m } = useLocale();
  const [email, setEmail] = useState("");

  // Subscription is handled by Substack — hand the visitor off to complete it.
  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const url = email.trim()
        ? `${SUBSTACK}?email=${encodeURIComponent(email.trim())}`
        : SUBSTACK;
      window.open(url, "_blank", "noopener,noreferrer");
    },
    [email]
  );

  return (
    <section
      className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
      style={{
        background: "linear-gradient(120deg, #C9512F 0%, #E2603D 55%, #E8884F 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-bold tracking-tight text-white leading-[1.12] mb-4">
          {m.home.newsletterHeading}
        </h2>
        <p className="text-white/85 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8">
          {m.home.newsletterBody}
        </p>

        <form
          onSubmit={onSubmit}
          className="max-w-xl mx-auto flex items-center gap-2 rounded-full bg-white p-1.5 pl-6 shadow-[0_20px_50px_-20px_rgba(60,15,0,0.5)]"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={m.hero.emailPlaceholder}
            className="flex-1 bg-transparent outline-none text-[15px] text-[#161310] placeholder:text-[#161310]/40"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-[#161310] px-6 py-3 text-sm font-semibold text-white hover:bg-black transition-colors"
          >
            {m.home.newsletterCta}
          </button>
        </form>
      </div>
    </section>
  );
}
