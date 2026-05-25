"use client";

import Link from "next/link";
import { Quote } from "lucide-react";
import { useLocale } from "@/i18n/client";

const ACCENT = "#E2603D";

// Real, attributable lines pulled from the show notes (EN + zh-TW). Add more as
// episodes get their quote sections filled in.
const MOMENTS = [
  {
    quote:
      "I testified under oath that those Solar Roof tiles were never connected to the grid. That's the moment you find out what you're actually made of.",
    quoteZh:
      "我在宣誓下作證：那些太陽能屋頂瓦片從未真正連上電網。那一刻，你會發現自己到底是用什麼材質做成的。",
    guest: "Toby Corey",
    ep: "07",
    slug: "zentrepreneurship-toby-corey-brandcapsule-ai-trust",
  },
  {
    quote:
      "You can hold consciousness and execution at the same time. Most people think you have to choose. You don't.",
    quoteZh:
      "你可以同時握住「覺察」與「執行」。多數人以為你必須二選一。其實不必。",
    guest: "Toby Corey",
    ep: "07",
    slug: "zentrepreneurship-toby-corey-brandcapsule-ai-trust",
  },
  {
    quote:
      "AI's biggest blind spot isn't intelligence — it's trust. And trust is a human problem.",
    quoteZh: "AI 最大的盲點不是智慧，而是信任。而信任，是一個人類問題。",
    guest: "Toby Corey",
    ep: "07",
    slug: "zentrepreneurship-toby-corey-brandcapsule-ai-trust",
  },
];

export function Testimonials() {
  const { m, locale } = useLocale();

  return (
    <section className="bg-[#FAF8F5] px-4 sm:px-6 lg:px-8 py-20 sm:py-28 border-t border-[#161310]/[0.06]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[0.85fr_1.15fr] gap-12 md:gap-16">
        {/* Intro */}
        <div className="md:sticky md:top-28 self-start">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#161310] leading-[1.1] mb-5">
            {m.home.quotesHeading}
          </h2>
          <p className="text-[#161310]/55 text-base leading-relaxed mb-4">
            {m.home.quotesSubtitle}
          </p>
          <p className="text-[#161310]/55 text-base leading-relaxed max-w-sm">
            {m.mission.paragraph2}
          </p>
        </div>

        {/* Quote cards */}
        <div className="flex flex-col gap-5">
          {MOMENTS.map((mo, i) => (
            <Link
              key={i}
              href={`/episode/${mo.slug}`}
              className="group rounded-2xl border border-[#161310]/[0.1] bg-white p-7 sm:p-8 transition-all hover:border-[#161310]/20 hover:shadow-[0_20px_50px_-20px_rgba(40,20,10,0.2)]"
            >
              <Quote
                className="w-7 h-7 mb-4"
                style={{ color: ACCENT }}
                fill={ACCENT}
                strokeWidth={0}
              />
              <p className="text-[#161310] text-lg sm:text-xl leading-relaxed font-medium mb-5">
                {locale === "zh-TW" ? mo.quoteZh : mo.quote}
              </p>
              <div className="flex items-center gap-2 text-[13px]">
                <span className="font-semibold text-[#161310]">{mo.guest}</span>
                <span className="text-[#161310]/30">·</span>
                <span
                  className="font-medium group-hover:underline"
                  style={{ color: ACCENT }}
                >
                  {m.episodeDetail.episodeNumberPrefix}
                  {mo.ep}
                  {m.episodeDetail.episodeNumberSuffix}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
