"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/i18n/client";

const ACCENT = "#E2603D";

export function NewsletterSignup() {
  const { m } = useLocale();

  return (
    <section className="bg-[#161310] px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[300px_1fr] lg:grid-cols-[340px_1fr] gap-10 sm:gap-16 items-center">
        {/* Lead-magnet card */}
        <div className="flex justify-center md:justify-start">
          <div className="w-56 sm:w-64 aspect-[3/4] rounded-2xl bg-gradient-to-br from-[#2a231d] to-[#161310] border border-white/[0.08] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)] flex flex-col justify-between p-7">
            <span
              className="inline-flex w-fit items-center border-2 px-2.5 py-1 rounded-[5px] text-[10px] font-extrabold tracking-[0.24em] uppercase"
              style={{ color: ACCENT, borderColor: ACCENT }}
            >
              Still&nbsp;Human
            </span>
            <div>
              <p className="text-white text-2xl font-bold leading-tight">
                {m.home.newsletterHeading}
              </p>
              <p className="text-white/40 text-[13px] mt-3 font-mono tracking-wide uppercase">
                {m.newsletterCta.label}
              </p>
            </div>
          </div>
        </div>

        {/* Copy + CTA */}
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.08] mb-5 max-w-xl">
            {m.home.newsletterHeading}
          </h2>
          <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
            {m.home.newsletterBody}
          </p>
          <Link
            href="/newsletter"
            className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ backgroundColor: ACCENT }}
          >
            {m.home.newsletterCta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
