"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Youtube, Music2 } from "lucide-react";

type LatestEpisodeData = {
  title: string;
  description: string;
  duration: string;
  spotifyEpisodeId: string;
  spotifyUrl?: string;
  imageUrl?: string;
  youtubeUrl?: string;
};

// Fallback when API is not configured or fails (e.g. no Spotify env vars)
const fallbackLatestEpisode: LatestEpisodeData = {
  title: "What Makes Us Still Human?",
  description:
    "A deep exploration of identity, purpose, and connection in the age of AI. What parts of us remain untouched?",
  duration: "42 min",
  spotifyEpisodeId: "7K8kDxxSPCBB5HGxvuCRS3",
  youtubeUrl: "https://youtu.be/jq3PUmDQivk?si=PRFqzxZCEWAZ6Bhr",
};

// YouTube thumbnail: https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
// Add youtubeVideoId (from youtu.be/xxx or youtube.com/watch?v=xxx) for each episode for thumbnail + link
const episodes = [
  {
    number: "01",
    title: "From Varsity Wrestling To Winning At Nvidia, The Art of Being Cooked",
    description: "A conversation with Varsity Wrestling Champion, Sean Wu, about his journey from high school wrestling to winning at Nvidia, and the art of being cooked.",
    duration: "46 min",
    youtubeVideoId: "jq3PUmDQivk", // from youtu.be/jq3PUmDQivk
  },
  {
    number: "02",
    title: "Still Human? The Bioengineer Building the Technology of Tomorrow",
    description: "I wasted all my time. Michael Yoshimura didn't hold back. From a career-ending injury to the front lines of the AI revolution, Michael is rewriting the rules of human capability. He joins Perkins to discuss the \"Execution Culture\" gap and why most people's \"great ideas\" fail within two weeks. If you think AI is just about ChatGPT, you’re missing the bigger picture of 3D-printed healthcare and automated agriculture.",
    duration: "31 min",
    youtubeVideoId: "GkyO4MgQW1k", // paste video ID for thumbnail
  },
  {
    number: "03",
    title: "Creativity After AI",
    description: "What happens to art when machines can create?",
    duration: "45 min",
    youtubeVideoId: "",
  },
];

export function Podcast() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [latestEpisode, setLatestEpisode] = useState<LatestEpisodeData | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/podcast/latest")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: LatestEpisodeData) => {
        if (!cancelled && data?.title && data?.spotifyEpisodeId) {
          // Embed only needs the ID part (no ?si=...)
          const cleanId = data.spotifyEpisodeId.split("?")[0];
          setLatestEpisode({ ...data, spotifyEpisodeId: cleanId });
        }
      })
      .catch(() => {
        if (!cancelled) setLatestEpisode(fallbackLatestEpisode);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const displayLatest = latestEpisode ?? fallbackLatestEpisode;

  return (
    <section id="podcast" className="relative py-32 sm:py-40 px-6">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div ref={ref} className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0, 1] }}
          className="mb-16 sm:mb-20"
        >
          <p className="text-[13px] font-medium tracking-[0.25em] uppercase text-white/25 mb-4">
            Podcast
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-2xl">
            Still Human{" "}
            <span className="gradient-text">Podcast</span>
          </h2>
          <p className="text-white/35 text-base sm:text-lg mt-6 max-w-lg leading-relaxed font-light">
            Conversations about AI, humanity, and the spaces between.
            What does it mean to stay human in an accelerating world?
          </p>

          {/* Where to listen - add your real URLs below */}
          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href="https://open.spotify.com/show/2JdDo1zeJ2fyO5wxxS7ikN?si=ddc85c925a434cb7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/[0.2] text-white/80 hover:text-white transition-all duration-300 text-sm font-medium"
            >
              <Music2 className="w-4 h-4 text-[#1DB954]" aria-hidden />
              Listen on Spotify
            </a>
            <a
              href="https://youtube.com/@oshen.studio?si=wcKSWeqN9QNJiEBh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/[0.2] text-white/80 hover:text-white transition-all duration-300 text-sm font-medium"
            >
              <Youtube className="w-4 h-4 text-[#FF0000]" aria-hidden />
              Watch on YouTube
            </a>
          </div>
        </motion.div>

        {/* Latest episode – update `latestEpisode` at top of file to change title/description and embed */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.4, 0, 1] }}
          className="glass-strong rounded-3xl p-8 sm:p-12 noise relative overflow-hidden mb-8"
        >
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-purple-500/[0.08] to-transparent rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10">
            <div className="mb-6">
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-medium tracking-wider uppercase text-purple-300/50 mb-2 block">
                  Latest Episode
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white/90 mb-2">
                  {displayLatest.title}
                </h3>
                <p className="text-white/35 text-sm leading-relaxed max-w-lg">
                  {displayLatest.description}
                </p>
                {(displayLatest.youtubeUrl || displayLatest.spotifyEpisodeId) && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {displayLatest.youtubeUrl && (
                      <a
                        href={displayLatest.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[13px] text-white/50 hover:text-white transition-colors"
                      >
                        <Youtube className="w-4 h-4 text-[#FF0000]" />
                        Watch on YouTube
                      </a>
                    )}
                    {displayLatest.spotifyEpisodeId && (
                      <a
                        href={displayLatest.spotifyUrl ?? `https://open.spotify.com/episode/${displayLatest.spotifyEpisodeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[13px] text-white/50 hover:text-white transition-colors"
                      >
                        <Music2 className="w-4 h-4 text-[#1DB954]" />
                        Open in Spotify
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* In-page player: auto-filled from Spotify when env is set, else fallback. */}
            {displayLatest.spotifyEpisodeId ? (
              <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-black/20">
                <iframe
                  title={`Play: ${displayLatest.title}`}
                  src={`https://open.spotify.com/embed/episode/${displayLatest.spotifyEpisodeId}?theme=0`}
                  width="100%"
                  height="232"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="border-0"
                />
              </div>
            ) : (
              <p className="text-[13px] text-white/30">
                Set <code className="text-white/50 px-1 rounded bg-white/10">SPOTIFY_CLIENT_ID</code>,{" "}
                <code className="text-white/50 px-1 rounded bg-white/10">SPOTIFY_CLIENT_SECRET</code>, and{" "}
                <code className="text-white/50 px-1 rounded bg-white/10">SPOTIFY_SHOW_ID</code> in your env to show the latest episode here automatically.
              </p>
            )}
          </div>
        </motion.div>

        {/* Episode list: thumbnail by default, hover shows full description */}
        <div className="grid sm:grid-cols-3 gap-4">
          {episodes.map((ep, i) => {
            const Wrapper = ep.youtubeVideoId ? motion.a : motion.div;
            const wrapperProps = ep.youtubeVideoId
              ? {
                  href: `https://www.youtube.com/watch?v=${ep.youtubeVideoId}`,
                  target: "_blank" as const,
                  rel: "noopener noreferrer",
                }
              : {};
            return (
              <Wrapper
                key={ep.number}
                {...wrapperProps}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + i * 0.1,
                  ease: [0.25, 0.4, 0, 1],
                }}
                className="block rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03] cursor-pointer group relative aspect-[16/10] min-h-[180px]"
              >
                {/* Default: YouTube thumbnail (or gradient placeholder) */}
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                  {ep.youtubeVideoId ? (
                    <img
                      src={`https://img.youtube.com/vi/${ep.youtubeVideoId}/maxresdefault.jpg`}
                      alt={`Episode ${ep.number}: ${ep.title}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${ep.youtubeVideoId}/hqdefault.jpg`;
                      }}
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-transparent" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-0 transition-opacity duration-400" />
                </div>

                {/* EP badge – always visible on thumbnail */}
                <span className="absolute top-3 left-3 z-10 text-[11px] font-mono text-white/90 bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
                  EP {ep.number}
                </span>

                {/* Hover overlay: full description */}
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h4 className="text-base font-semibold text-white mb-2 tracking-tight line-clamp-2">
                    {ep.title}
                  </h4>
                  <p className="text-[13px] text-white/70 leading-relaxed line-clamp-4 mb-2">
                    {ep.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[11px] text-white/50 font-mono">{ep.duration}</span>
                    {ep.youtubeVideoId && (
                      <span className="inline-flex items-center gap-1.5 text-[12px] text-white/80 group-hover:text-white">
                        <Youtube className="w-3.5 h-3.5 text-[#FF0000]" />
                        Watch
                      </span>
                    )}
                  </div>
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
