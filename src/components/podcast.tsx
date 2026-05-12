"use client";

import { m, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Youtube, Music2, List } from "lucide-react";
import { youtubeThumb } from "@/lib/youtube";

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
// Kept in sync with the latest episode in the gallery (episode 6)
const fallbackLatestEpisode: LatestEpisodeData = {
  title: "Building Traffic Lights for Space: Lilian Krengel on AI, Orbital Congestion, and Student Founding | Still Human",
  description: "A Santa Clara sophomore on building AI traffic lights for space, the Kessler Effect, and what it means when someone copies your startup in a weekend.",
  duration: "55 min",
  spotifyEpisodeId: "7xRi6S3deMo1PYP9LLTeJ0",
  youtubeUrl: "https://www.youtube.com/watch?v=I3lR2WbpVy8",
};

// YouTube thumbnail: https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
// Add youtubeVideoId (from youtu.be/xxx or youtube.com/watch?v=xxx) for each episode for thumbnail + link
const episodes = [
  {
    number: "01",
    title: "Sean Wu: Execution Culture, Raising $2M for Robotics, and Why Most Students Never Ship",
    description: "Sean Wu is a Santa Clara junior who raised over $2M for Synphony — a robotics startup tackling the sim-to-real gap — while finishing his degree. He joins Perkin to talk execution culture, the wrestling lesson behind founder loneliness, the NVIDIA hackathon that turned into a venture-backed company, and his honest answer on when to pivot vs. push through.",
    duration: "46 min",
    youtubeVideoId: "jq3PUmDQivk", // from youtu.be/jq3PUmDQivk
  },
  {
    number: "02",
    title: "Michael Iwashima: Why AI Can't Reason Over Time, Brain-Computer Interfaces, and Building From Nothing",
    description: "A career-ending soccer injury sent Michael Iwashima toward engineering. Now he's building brain-computer interfaces that let people with paralysis play Space Invaders, 3D-printable biosensors for AI in agriculture, and a mold-detection startup. He joins Perkin to talk about why current AI still can't reason over time, why community building is the most underrated skill in an AI-saturated world, and what accessibility tech teaches you about human capability.",
    duration: "31 min",
    youtubeVideoId: "GkyO4MgQW1k", // paste video ID for thumbnail
  },
  {
    number: "03",
    title: "We Are the Product: Krish Jajoo on Social Media, Silicon Valley Pressure, and Why Human Connection Still Wins",
    description: "Krish Jajoo grew up in Fremont — same high school as Y Combinator CEO Gary Tan. He joins Perkin to talk about the Silicon Valley pressure cooker, why the attention economy turned a generation into the product, financial literacy work for underserved kids, the Patelco Credit Union moment that almost killed it, and why he chose CS to fix his weakness, not sharpen his strength.",
    duration: "25 min",
    youtubeVideoId: "1jBZ1yflBgA",
  },
  {
    number: "04",
    title: "AI Is the Ultimate People Pleaser: Bailley Georgieva on Hypersonics, Critical Thinking, and What Stays Human at Mach 10",
    description: "Bailley Georgieva is 21 — a Rutgers junior, MIT hypersonic research affiliate working with NASA LAURA, and a former Defense Innovation Unit fellow. She joins Perkin to explain why she calls AI \"the ultimate people pleaser,\" why she trained her own ChatGPT to answer only in code and TXT files, and what stays human at Mach 10.",
    duration: "—",
    youtubeVideoId: "m3QzlKlb9uc",
  },
  {
    number: "05",
    title: "Build Before You're Ready: Andrey Marey on High-Agency, Discipline, and Refusing to Use AI With Friends",
    description: "Andrey Marey is 20 and a serial founder — NVIDIA hackathon win, fraud detection in London, three shipped startups, and a stint at Finland's FR8 hacker hotel. He joins Perkin to break down what high-agency actually means, why discipline beats motivation, the framework that runs his career — ideas matter, execution more, distribution most — and the one line he refuses to ever let AI cross.",
    duration: "44 min",
    youtubeVideoId: "ZWhkF8q3-g0",
  },
  {
    number: "06",
    title: "Building Traffic Lights for Space: Lilian Krengel on AI, Orbital Congestion, and Student Founding",
    description: "Lilian Krengel is 19 and the founder of OrbitGuard AI — air traffic control, but for space. She joins Perkin to talk about why she didn't try to build a rocket, the Kessler Effect, the Stanford team that nearly cloned her startup in a weekend, and what it teaches you about execution speed in the AI era.",
    duration: "55 min",
    youtubeVideoId: "I3lR2WbpVy8",
  },
];

type EpisodeItem = (typeof episodes)[number];

function EpisodeCard({
  ep,
  inView,
  mobile = false,
  spotifyImageUrl,
}: {
  ep: EpisodeItem;
  inView: boolean;
  mobile?: boolean;
  spotifyImageUrl?: string;
}) {
  const Wrapper = ep.youtubeVideoId ? "a" : "div";
  const wrapperProps =
    ep.youtubeVideoId
      ? {
          href: `https://www.youtube.com/watch?v=${ep.youtubeVideoId}`,
          target: "_blank" as const,
          rel: "noopener noreferrer",
        }
      : {};

  const thumbnailSrc = spotifyImageUrl || (ep.youtubeVideoId
    ? youtubeThumb(ep.youtubeVideoId)
    : null);

  return (
    <Wrapper
      {...wrapperProps}
      className={`block rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03] cursor-pointer group relative aspect-video ${
        mobile
          ? "w-full flex-shrink-0"
          : "w-60 flex-shrink-0 mr-4"
      }`}
    >
      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt={`Episode ${ep.number}: ${ep.title}`}
            className="h-full w-full object-cover"
            width={640}
            height={640}
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-transparent" />
        )}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-400 ${mobile ? "opacity-80" : "opacity-60 group-hover:opacity-0"}`} />
      </div>
      <span className="absolute top-3 left-3 z-10 text-[11px] font-mono text-white/90 bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
        EP {ep.number}
      </span>
      <div className={`absolute inset-0 z-10 flex flex-col justify-end p-5 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 ${mobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        <h4 className="text-base font-semibold text-white mb-2 tracking-tight line-clamp-2">
          {ep.title}
        </h4>
        <p className="text-[13px] text-white/70 leading-relaxed line-clamp-3 mb-2">
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
}

function SpotifyFacade({ episodeId, title }: { episodeId: string; title: string }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-black/20" style={{ height: 232 }}>
      <iframe
        title={`Play: ${title}`}
        src={`https://open.spotify.com/embed/episode/${episodeId}?theme=0`}
        width="100%"
        height="232"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        className="border-0"
      />
    </div>
  );
}

export function Podcast({ episodeImages = [] }: { episodeImages?: string[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [latestEpisode, setLatestEpisode] = useState<LatestEpisodeData | null>(null);
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);

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
    <section id="podcast" className="relative py-20 sm:py-32 md:py-40 px-4 sm:px-6 overflow-x-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div ref={ref} className="max-w-6xl mx-auto px-1 sm:px-0">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0, 1] }}
          className="mb-10 sm:mb-16 md:mb-20"
        >
          <p className="text-[13px] font-medium tracking-[0.25em] uppercase text-white/25 mb-3 sm:mb-4">
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
            <Link
              href="/episode"
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/[0.2] text-white/80 hover:text-white transition-all duration-300 text-sm font-medium"
            >
              <List className="w-4 h-4" aria-hidden />
              All Episodes
            </Link>
          </div>
        </m.div>

        {/* Latest episode – update `latestEpisode` at top of file to change title/description and embed */}
        <m.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.4, 0, 1] }}
          className="glass-strong rounded-3xl p-5 sm:p-8 md:p-12 noise relative overflow-hidden mb-6 md:mb-8"
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
                <p className="text-white/35 text-sm leading-relaxed max-w-lg line-clamp-2">
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

            {/* In-page player: loads only on click to avoid Spotify JS blocking page load */}
            {displayLatest.spotifyEpisodeId ? (
              <SpotifyFacade episodeId={displayLatest.spotifyEpisodeId} title={displayLatest.title} />
            ) : (
              <p className="text-[13px] text-white/30">
                Set <code className="text-white/50 px-1 rounded bg-white/10">SPOTIFY_CLIENT_ID</code>,{" "}
                <code className="text-white/50 px-1 rounded bg-white/10">SPOTIFY_CLIENT_SECRET</code>, and{" "}
                <code className="text-white/50 px-1 rounded bg-white/10">SPOTIFY_SHOW_ID</code> in your env to show the latest episode here automatically.
              </p>
            )}
          </div>
        </m.div>

        {/* Episode gallery: on mobile = vertical stack (no horizontal scroll); on md+ = infinite scroll left */}
        {/* Mobile: single column, no scroll, with cushion */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.25, 0.4, 0, 1] }}
          className="md:hidden w-full space-y-4"
        >
          {episodes.map((ep, i) => (
            <EpisodeCard
              key={ep.number}
              ep={ep}
              inView={inView}
              mobile
              spotifyImageUrl={episodeImages[parseInt(ep.number, 10) - 1]}
            />
          ))}
        </m.div>

        {/* Desktop: infinite scroll gallery */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.4, 0, 1] }}
          className="hidden md:block w-full overflow-hidden"
        >
          <div
            className="flex animate-scroll-left"
            style={{ width: "max-content", animationPlayState: isGalleryHovered ? "paused" : "running" }}
            onMouseEnter={() => setIsGalleryHovered(true)}
            onMouseLeave={() => setIsGalleryHovered(false)}
          >
            {[...episodes, ...episodes].map((ep, i) => (
              <EpisodeCard
                key={i}
                ep={ep}
                inView={inView}
                spotifyImageUrl={episodeImages[parseInt(ep.number, 10) - 1]}
              />
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
}
