"use client";

import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { EpisodeMeta } from "@/lib/episodes";
import { youtubeThumb } from "@/lib/youtube";
import { useLocale } from "@/i18n/client";
import { EpisodeCard } from "./episode-card";

const ACCENT = "#E2603D";
const PAGE_SIZE = 12;

type NavTopic = { slug: string; name: string };

type Props = {
  episodes: EpisodeMeta[]; // localized
  covers: Record<string, string>;
  topics: NavTopic[];
  initialQuery?: string;
};

export function AllEpisodes({ episodes, covers, topics, initialQuery = "" }: Props) {
  const { m } = useLocale();
  const topicNames = useMemo(
    () => Object.fromEntries(topics.map((t) => [t.slug, t.name])),
    [topics]
  );

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);

  const toggleTopic = (slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = episodes.filter((ep) => {
      const matchesTopic =
        selected.size === 0 || (ep.topics ?? []).some((t) => selected.has(t));
      const matchesQuery =
        !q ||
        ep.title.toLowerCase().includes(q) ||
        ep.guest.toLowerCase().includes(q) ||
        (ep.topics ?? []).some((t) =>
          (topicNames[t] ?? "").toLowerCase().includes(q)
        );
      return matchesTopic && matchesQuery;
    });
    list.sort((a, b) =>
      sort === "newest" ? b.number.localeCompare(a.number) : a.number.localeCompare(b.number)
    );
    return list;
  }, [episodes, selected, query, sort, topicNames]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2.5 mb-6">
        {topics.map((topic) => {
          const active = selected.has(topic.slug);
          return (
            <button
              key={topic.slug}
              onClick={() => toggleTopic(topic.slug)}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all"
              style={
                active
                  ? { backgroundColor: ACCENT, borderColor: ACCENT, color: "#fff" }
                  : { borderColor: "rgba(22,19,16,0.15)", color: "rgba(22,19,16,0.7)" }
              }
            >
              <span
                className="flex items-center justify-center w-4 h-4 rounded-[4px] border"
                style={{
                  borderColor: active ? "rgba(255,255,255,0.7)" : "rgba(22,19,16,0.25)",
                  backgroundColor: active ? "rgba(255,255,255,0.2)" : "transparent",
                }}
              >
                {active && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </span>
              {topic.name}
            </button>
          );
        })}
      </div>

      {/* Sort + active query */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-2">
          {query.trim() && (
            <button
              onClick={() => {
                setQuery("");
                setPage(1);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#161310]/[0.06] px-3.5 py-1.5 text-[13px] font-medium text-[#161310]/70 hover:bg-[#161310]/[0.1] transition-colors"
            >
              {m.episodesPage.resultsFor}: <span className="font-semibold">{query.trim()}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <label className="inline-flex items-center gap-2 text-[13px] text-[#161310]/45">
          {m.episodesPage.sortLabel}
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as "newest" | "oldest");
              setPage(1);
            }}
            className="rounded-full border border-[#161310]/15 bg-white px-3.5 py-2 text-[13px] font-semibold text-[#161310] outline-none focus:border-[#161310]/35 transition-colors"
          >
            <option value="newest">{m.episodesPage.sortNewest}</option>
            <option value="oldest">{m.episodesPage.sortOldest}</option>
          </select>
        </label>
      </div>

      {/* Grid */}
      {paged.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {paged.map((ep) => (
            <EpisodeCard
              key={ep.slug}
              data={{
                href: `/episode/${ep.slug}`,
                cover: youtubeThumb(ep.youtubeId),
                fallbackCover: covers[ep.slug],
                epNumber: ep.number,
                eyebrow: topicNames[ep.topics?.[0] ?? ""] ?? m.nav.podcast,
                title: ep.title,
                guest: ep.guest,
              }}
            />
          ))}
        </div>
      ) : (
        <p className="text-[#161310]/45 text-center py-16">{m.recentEpisodes.noMatch}</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-14">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-[#161310]/15 text-[#161310]/60 disabled:opacity-30 hover:bg-[#161310]/[0.05] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className="flex items-center justify-center w-9 h-9 rounded-full text-[13px] font-semibold transition-colors"
              style={
                p === currentPage
                  ? { backgroundColor: ACCENT, color: "#fff" }
                  : { color: "rgba(22,19,16,0.6)" }
              }
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-[#161310]/15 text-[#161310]/60 disabled:opacity-30 hover:bg-[#161310]/[0.05] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
