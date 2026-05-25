"use client";

import Link from "next/link";
import type { EpisodeMeta } from "@/lib/episodes";
import { youtubeThumb } from "@/lib/youtube";
import { useLocale } from "@/i18n/client";
import { EpisodeCard } from "./episode-card";

const ACCENT = "#E2603D";

type Props = {
  episodes: EpisodeMeta[]; // localized, newest first
  covers: Record<string, string>;
  topicNames: Record<string, string>;
};

export function LatestEpisodes({ episodes, covers, topicNames }: Props) {
  const { m } = useLocale();
  if (episodes.length === 0) return null;

  const eyebrowFor = (ep: EpisodeMeta) =>
    topicNames[ep.topics?.[0] ?? ""] ?? m.nav.podcast;
  // Prefer the YouTube thumbnail; fall back to the Spotify cover when the
  // video has no thumbnail yet (new / unlisted upload).
  const thumbFor = (ep: EpisodeMeta) => youtubeThumb(ep.youtubeId);

  const [featured, ...rest] = episodes;
  const recent = rest.slice(0, 2);

  return (
    <section className="bg-[#FAF8F5] px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 sm:pb-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#161310] mb-8 sm:mb-10">
          {m.home.latestHeading}
        </h2>

        {/* Featured latest episode */}
        <Link
          href={`/episode/${featured.slug}`}
          className="group grid md:grid-cols-2 gap-6 sm:gap-10 items-center mb-12 sm:mb-16"
        >
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#161310]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbFor(featured)}
              onError={(e) => {
                const fb = covers[featured.slug];
                if (fb && e.currentTarget.src !== fb) e.currentTarget.src = fb;
              }}
              alt={`${featured.guest}: ${featured.title}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              fetchPriority="high"
            />
            <span className="absolute top-3 left-3 text-[11px] font-mono text-white/90 bg-black/45 backdrop-blur-sm px-2 py-1 rounded">
              EP {featured.number}
            </span>
          </div>

          <div>
            <p
              className="text-[12px] font-semibold tracking-[0.2em] uppercase mb-3"
              style={{ color: ACCENT }}
            >
              {eyebrowFor(featured)}
            </p>
            <h3 className="text-2xl sm:text-3xl lg:text-[2.4rem] font-bold tracking-tight leading-[1.1] text-[#161310] group-hover:text-[#C9512F] transition-colors mb-4">
              {featured.title}
            </h3>
            <p className="text-[13px] font-medium text-[#161310]/45 mb-3">
              {featured.guest}
            </p>
            <p className="text-[15px] leading-relaxed text-[#161310]/60 line-clamp-4 max-w-xl">
              {featured.description}
            </p>
          </div>
        </Link>

        {/* Recent grid */}
        {recent.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-10">
            {recent.map((ep) => (
              <EpisodeCard
                key={ep.slug}
                data={{
                  href: `/episode/${ep.slug}`,
                  cover: thumbFor(ep),
                  fallbackCover: covers[ep.slug],
                  epNumber: ep.number,
                  eyebrow: eyebrowFor(ep),
                  title: ep.title,
                  guest: ep.guest,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
