"use client";

import { m, useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import { Clock, ArrowUpRight, Search, X } from "lucide-react";
import type { EpisodeMeta } from "@/lib/episodes";
import type { Topic } from "@/lib/topics";
import { getTopicStyle } from "@/lib/topics";

type Props = {
  episodes: EpisodeMeta[];
  topics: Topic[];
};

export function RecentEpisodes({ episodes, topics }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const topicMap = useMemo(
    () => Object.fromEntries(topics.map((t) => [t.slug, t])),
    [topics]
  );

  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return episodes.filter((ep) => {
      const matchesQuery =
        !q ||
        ep.title.toLowerCase().includes(q) ||
        ep.guest.toLowerCase().includes(q) ||
        (ep.topics ?? []).some((s) =>
          (topicMap[s]?.name ?? s).toLowerCase().includes(q)
        );
      const matchesTopic =
        !activeTopic || (ep.topics ?? []).includes(activeTopic);
      return matchesQuery && matchesTopic;
    });
  }, [episodes, query, activeTopic, topicMap]);

  return (
    <section
      ref={ref}
      className="relative py-20 sm:py-28 px-6 border-t border-white/[0.05]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header row */}
        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8"
        >
          <div>
            <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-white/20 mb-3">
              Recent
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              More Episodes
            </h2>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-3 sm:ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
              <input
                type="text"
                placeholder="Search episodes…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full sm:w-56 bg-white/[0.05] border border-white/[0.1] rounded-full pl-9 pr-8 py-2 text-[13px] text-white placeholder:text-white/25 focus:outline-none focus:border-white/[0.25] focus:bg-white/[0.07] transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <a
              href="/episode"
              className="hidden sm:flex items-center gap-1.5 text-[13px] font-medium text-white/35 hover:text-white transition-colors flex-shrink-0"
            >
              All episodes
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </m.div>

        {/* Topic filter pills */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          <button
            onClick={() => setActiveTopic(null)}
            className={`text-[11px] font-medium px-3 py-1 rounded-full border transition-all ${
              activeTopic === null
                ? "bg-white/[0.1] border-white/[0.25] text-white"
                : "border-white/[0.1] text-white/40 hover:text-white/70 hover:border-white/[0.2]"
            }`}
          >
            All
          </button>
          {topics.map((topic) => {
            const style = getTopicStyle(topic.slug);
            const isActive = activeTopic === topic.slug;
            return (
              <button
                key={topic.slug}
                onClick={() =>
                  setActiveTopic(isActive ? null : topic.slug)
                }
                className={`text-[11px] font-medium px-3 py-1 rounded-full border transition-all ${
                  isActive
                    ? style.badge + " opacity-100"
                    : "border-white/[0.08] text-white/35 hover:text-white/60 hover:border-white/[0.18]"
                }`}
              >
                {topic.name}
              </button>
            );
          })}
        </m.div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((ep, i) => {
              const imgSrc = `https://img.youtube.com/vi/${ep.youtubeId}/maxresdefault.jpg`;
              const epTopics = (ep.topics ?? []).slice(0, 2);

              return (
                <m.a
                  key={ep.slug}
                  href={`/episode/${ep.slug}`}
                  initial={{ opacity: 0, y: 28 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.06 }}
                  className="group glass-card rounded-2xl overflow-hidden noise block"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={imgSrc}
                      alt={`EP ${ep.number}: ${ep.title}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute top-3 left-3 text-[11px] font-mono text-white/90 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
                      EP {ep.number}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <p className="text-[11px] font-medium text-white/30 mb-1.5 tracking-wide">
                      {ep.guest}
                    </p>
                    <h3 className="text-base font-bold text-white/80 group-hover:text-white transition-colors leading-snug line-clamp-2 mb-4">
                      {ep.title}
                    </h3>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5 min-w-0">
                        {epTopics.map((slug) => {
                          const style = getTopicStyle(slug);
                          return (
                            <button
                              key={slug}
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveTopic(activeTopic === slug ? null : slug);
                              }}
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border truncate cursor-pointer transition-opacity hover:opacity-80 ${style.badge}`}
                            >
                              {topicMap[slug]?.name ?? slug}
                            </button>
                          );
                        })}
                      </div>
                      {ep.duration !== "—" && (
                        <span className="flex items-center gap-1 text-[11px] text-white/25 font-mono flex-shrink-0">
                          <Clock className="w-2.5 h-2.5" />
                          {ep.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </m.a>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-white/25 text-sm">No episodes match your search.</p>
          </div>
        )}

        {/* Mobile all-episodes link */}
        <div className="mt-8 text-center sm:hidden">
          <a
            href="/episode"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/35 hover:text-white transition-colors"
          >
            View all episodes
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
