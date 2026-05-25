"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Cpu,
  Rocket,
  User,
  FlaskConical,
  Brain,
  Telescope,
  ArrowRight,
} from "lucide-react";
import { useLocale } from "@/i18n/client";

const ACCENT = "#E2603D";

const TOPIC_ICONS: Record<string, React.ElementType> = {
  "ai-technology": Cpu,
  entrepreneurship: Rocket,
  "identity-humanity": User,
  "science-engineering": FlaskConical,
  "mental-resilience": Brain,
  "space-future": Telescope,
};

type Props = {
  topics: { slug: string; name: string }[];
};

export function TopicsSearch({ topics }: Props) {
  const { m } = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const onSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = query.trim();
      router.push(q ? `/episode?q=${encodeURIComponent(q)}` : "/episode");
    },
    [query, router]
  );

  return (
    <section className="bg-[#FAF8F5] px-4 sm:px-6 lg:px-8 py-20 sm:py-28 border-t border-[#161310]/[0.06]">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#161310] mb-4">
            {m.home.searchHeading}
          </h2>
          <p className="text-[#161310]/55 text-base sm:text-lg">
            {m.home.searchSubtitle}
          </p>
        </div>

        {/* Search */}
        <form onSubmit={onSearch} className="max-w-2xl mx-auto mb-12 sm:mb-14">
          <div className="flex items-center gap-3 rounded-full border border-[#161310]/15 bg-white px-6 h-14 focus-within:border-[#161310]/35 transition-colors">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={m.nav.searchPlaceholder}
              className="flex-1 bg-transparent outline-none text-[16px] text-[#161310] placeholder:text-[#161310]/40"
            />
            <button
              type="submit"
              aria-label="Search"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-[#161310]/[0.06] hover:bg-[#161310]/[0.12] text-[#161310] transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Topic grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {topics.map((topic) => {
            const Icon = TOPIC_ICONS[topic.slug] ?? Cpu;
            return (
              <Link
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className="group flex flex-col items-center justify-center text-center gap-4 rounded-2xl bg-[#F1EDE7] hover:bg-[#EAE4DB] border border-transparent hover:border-[#161310]/[0.08] px-5 py-10 sm:py-12 transition-all"
              >
                <Icon
                  className="w-7 h-7 text-[#161310]/70 group-hover:text-[#C9512F] transition-colors"
                  strokeWidth={1.5}
                />
                <span className="text-[15px] sm:text-base font-semibold text-[#161310] leading-snug">
                  {topic.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12 sm:mt-14">
          <Link
            href="/topics"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ backgroundColor: ACCENT }}
          >
            {m.home.exploreAllTopics}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
