"use client";

import { m } from "framer-motion";
import { Youtube, Music2, Clock, ArrowRight } from "lucide-react";
import type { EpisodeMeta } from "@/lib/episodes";
import { getTopicStyle, getTopicBySlug } from "@/lib/topics";

type Props = {
  episode: EpisodeMeta;
  spotifyImageUrl: string;
  spotifyEpisodeUrl?: string;
};

export function PodcastHero({ episode, spotifyImageUrl, spotifyEpisodeUrl }: Props) {
  const topics = (episode.topics ?? []).slice(0, 2);

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-24 pb-20 overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[500px] bg-purple-500/[0.05] rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-blue-500/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Show identity */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0, 1] }}
          className="mb-14 sm:mb-20"
        >
          <p className="text-[11px] font-medium tracking-[0.35em] uppercase text-white/20 mb-4">
            A podcast by Oshen Studio
          </p>
          <h1 className="text-6xl sm:text-8xl lg:text-[9rem] font-bold tracking-tight text-white leading-none">
            Still Human
          </h1>
          <p className="text-white/35 text-base sm:text-xl mt-5 max-w-lg font-light leading-relaxed">
            What does it mean to stay human as AI reshapes everything we know?
          </p>
        </m.div>

        {/* Latest episode card */}
        <m.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease: [0.25, 0.4, 0, 1] }}
        >
          <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-white/20 mb-6">
            Latest Episode
          </p>

          <div className="grid md:grid-cols-[260px_1fr] lg:grid-cols-[300px_1fr] gap-8 lg:gap-16 items-start">
            {/* Square cover art */}
            <a href={`/episode/${episode.slug}`} className="group flex-shrink-0">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
                <img
                  src={`https://img.youtube.com/vi/${episode.youtubeId}/maxresdefault.jpg`}
                  alt={episode.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute top-3 left-3 text-[11px] font-mono text-white/90 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded">
                  EP {episode.number}
                </span>
              </div>
            </a>

            {/* Episode details */}
            <div className="flex flex-col justify-center py-2">
              <p className="text-[12px] font-medium text-white/30 mb-3 tracking-wide uppercase">
                {episode.guest}
              </p>

              <a href={`/episode/${episode.slug}`} className="group mb-5">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white/85 group-hover:text-white transition-colors leading-snug line-clamp-3">
                  {episode.title}
                </h2>
              </a>

              <p className="text-white/35 text-sm sm:text-base leading-relaxed mb-6 max-w-lg line-clamp-3">
                {episode.description}
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                {episode.duration !== "—" && (
                  <span className="flex items-center gap-1.5 text-[12px] text-white/25 font-mono">
                    <Clock className="w-3 h-3" />
                    {episode.duration}
                  </span>
                )}
                {topics.map((slug) => {
                  const style = getTopicStyle(slug);
                  const topic = getTopicBySlug(slug);
                  return (
                    <span
                      key={slug}
                      className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${style.badge}`}
                    >
                      {topic?.name ?? slug}
                    </span>
                  );
                })}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://www.youtube.com/watch?v=${episode.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors duration-200"
                >
                  <Youtube className="w-4 h-4" />
                  Watch on YouTube
                </a>
                <a
                  href={spotifyEpisodeUrl ?? "https://open.spotify.com/show/2JdDo1zeJ2fyO5wxxS7ikN"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full border border-white/[0.12] bg-white/[0.04] text-white/75 hover:bg-white/[0.08] hover:text-white text-sm font-semibold transition-all duration-200"
                >
                  <Music2 className="w-4 h-4 text-[#1DB954]" />
                  Spotify
                </a>
                <a
                  href={`/episode/${episode.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full text-sm font-medium text-white/35 hover:text-white/70 transition-colors"
                >
                  Show Notes
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}
