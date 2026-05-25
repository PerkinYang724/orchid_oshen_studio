"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { EpisodeMeta } from "@/lib/episodes";
import { youtubeThumb } from "@/lib/youtube";
import { useLocale } from "@/i18n/client";
import { EpisodeCard } from "./episode-card";

const ACCENT = "#E2603D";

type Props = {
  episodes: EpisodeMeta[]; // curated subset, localized
  covers: Record<string, string>;
  topicNames: Record<string, string>;
};

export function FeaturedEpisodes({ episodes, covers, topicNames }: Props) {
  const { m } = useLocale();
  if (episodes.length === 0) return null;

  const eyebrowFor = (ep: EpisodeMeta) =>
    topicNames[ep.topics?.[0] ?? ""] ?? m.nav.podcast;

  return (
    <section className="bg-[#FAF8F5] px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-[#161310]/[0.06]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#161310] mb-8 sm:mb-10">
          {m.home.featuredHeading}
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {episodes.map((ep) => (
            <EpisodeCard
              key={ep.slug}
              data={{
                href: `/episode/${ep.slug}`,
                cover: youtubeThumb(ep.youtubeId),
                fallbackCover: covers[ep.slug],
                epNumber: ep.number,
                eyebrow: eyebrowFor(ep),
                title: ep.title,
                description: ep.description,
              }}
            />
          ))}
        </div>

        <div className="flex justify-center mt-12 sm:mt-14">
          <Link
            href="/episode"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ backgroundColor: ACCENT }}
          >
            {m.home.exploreAllEpisodes}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
