import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock, Music2 } from "lucide-react";
import { getAllEpisodes } from "@/lib/episodes";
import { getSpotifyShowEpisodes, buildEpisodeImagesArray } from "@/lib/spotify";

export const metadata: Metadata = {
  title: "Episodes — Still Human Podcast",
  description:
    "Every episode of Still Human Podcast — honest conversations with builders, creators, and founders about AI, startups, and what it means to stay human.",
};

export default async function EpisodesPage() {
  const episodes = getAllEpisodes();
  const spotifyEpisodes = await getSpotifyShowEpisodes();
  const episodeImages = buildEpisodeImagesArray(
    episodes.map((ep) => ep.title),
    spotifyEpisodes
  );

  return (
    <div className="relative min-h-screen bg-[#050507]">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(41,151,255,0.06) 0%, transparent 50%), #050507",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24">
        {/* Header */}
        <div className="mb-16">
          <a
            href="/"
            className="text-[13px] font-medium text-white/30 hover:text-white/60 transition-colors mb-8 inline-block"
          >
            ← Still Human
          </a>
          <p className="text-[13px] font-medium tracking-[0.25em] uppercase text-white/25 mb-4">
            Still Human Podcast
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6">
            All{" "}
            <span className="gradient-text">Episodes</span>
          </h1>
          <p className="text-white/40 text-lg max-w-xl leading-relaxed">
            Honest conversations with builders, creators, and founders working with AI in real life.
          </p>
        </div>

        {/* Episode list */}
        <div className="flex flex-col gap-4">
          {episodes.map((ep) => {
            const epIndex = parseInt(ep.number, 10) - 1;
            const thumbnailSrc = `https://img.youtube.com/vi/${ep.youtubeId}/maxresdefault.jpg`;

            return (
              <Link
                key={ep.slug}
                href={`/episode/${ep.slug}`}
                className="group glass-card rounded-2xl overflow-hidden flex flex-col sm:flex-row gap-0 noise"
              >
                {/* Square Spotify thumbnail */}
                <div className="relative w-full aspect-video sm:w-48 sm:aspect-video flex-shrink-0">
                  <img
                    src={thumbnailSrc}
                    alt={`Episode ${ep.number}: ${ep.guest}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 text-[11px] font-mono text-white/90 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
                    EP {ep.number}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 items-start justify-between gap-4 p-6 sm:p-7">
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-white/30 mb-2 tracking-wide">
                      {ep.guest}
                    </p>
                    <h2 className="text-lg sm:text-xl font-bold text-white/85 group-hover:text-white transition-colors mb-3 leading-snug line-clamp-2">
                      {ep.title}
                    </h2>
                    <p className="text-sm text-white/35 leading-relaxed group-hover:text-white/50 transition-colors line-clamp-2">
                      {ep.description}
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      {ep.duration !== "—" && (
                        <span className="inline-flex items-center gap-1.5 text-[12px] text-white/30 font-mono">
                          <Clock className="w-3 h-3" />
                          {ep.duration}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 text-[12px] text-white/30">
                        <Music2 className="w-3 h-3 text-[#1DB954]/70" />
                        Spotify
                      </span>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.06] group-hover:border-white/[0.2] transition-all duration-300 mt-1">
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white/70 transition-colors" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 pt-12 border-t border-white/[0.05] text-center">
          <p className="text-white/25 text-sm mb-4">
            New episodes every two weeks
          </p>
          <a
            href="https://open.spotify.com/show/2JdDo1zeJ2fyO5wxxS7ikN"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white/70 hover:text-white border border-white/[0.1] hover:border-white/[0.25] hover:bg-white/[0.05] transition-all duration-300"
          >
            <Music2 className="w-4 h-4 text-[#1DB954]" />
            Listen on Spotify
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
