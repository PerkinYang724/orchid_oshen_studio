"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { SubstackPost } from "@/lib/substack";
import { useLocale } from "@/i18n/client";
import { ArticleCard } from "./article-card";

const ACCENT = "#E2603D";

const ALL = "__all__";

export function ArticlesExplorer({ posts }: { posts: SubstackPost[] }) {
  const { m } = useLocale();
  const [activeTag, setActiveTag] = useState<string>(ALL); // tag slug, or ALL
  const [query, setQuery] = useState("");

  // Build the tag list from the posts themselves, so it always mirrors the
  // tags assigned on Substack. Sorted by frequency, then name.
  const tags = useMemo(() => {
    const bySlug = new Map<string, { name: string; slug: string; count: number }>();
    for (const p of posts) {
      for (const t of p.tags) {
        const entry = bySlug.get(t.slug);
        if (entry) entry.count++;
        else bySlug.set(t.slug, { name: t.name, slug: t.slug, count: 1 });
      }
    }
    return [...bySlug.values()].sort(
      (a, b) => b.count - a.count || a.name.localeCompare(b.name)
    );
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (activeTag !== ALL && !p.tags.some((t) => t.slug === activeTag)) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.name.toLowerCase().includes(q))
      );
    });
  }, [posts, activeTag, query]);

  const pill = (active: boolean) =>
    active
      ? { backgroundColor: ACCENT, borderColor: ACCENT, color: "#fff" }
      : {
          backgroundColor: "rgba(22,19,16,0.02)",
          borderColor: "rgba(22,19,16,0.12)",
          color: "rgba(22,19,16,0.65)",
        };

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-9">
        {/* Tag filter pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTag(ALL)}
            className="px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200"
            style={pill(activeTag === ALL)}
          >
            {m.articlesPage.filterAll}
          </button>
          {tags.map((t) => (
            <button
              key={t.slug}
              onClick={() => setActiveTag(t.slug)}
              className="px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 capitalize"
              style={pill(activeTag === t.slug)}
            >
              {t.name}
              <span className="ml-1.5 opacity-50 font-normal">{t.count}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-72 lg:shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#161310]/35" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={m.articlesPage.searchPlaceholder}
            className="w-full h-11 pl-11 pr-4 rounded-full bg-[#161310]/[0.02] border border-[#161310]/[0.12] text-[15px] text-[#161310] placeholder:text-[#161310]/40 outline-none focus:border-[#161310]/30 transition-colors"
          />
        </div>
      </div>

      {/* Count */}
      <p className="text-[13px] text-[#161310]/40 mb-6">
        {filtered.length} {m.articlesPage.countSuffix}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-[#161310]/45 text-sm py-12 text-center">
          {m.articlesPage.empty}
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((post) => (
            <ArticleCard key={post.link} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
