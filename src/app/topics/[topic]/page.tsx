import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, Clock, Music2 } from "lucide-react";
import { TOPICS, getTopicBySlug, getTopicStyle } from "@/lib/topics";
import { getAllEpisodes } from "@/lib/episodes";
import { getSpotifyShowEpisodes, buildEpisodeImagesArray } from "@/lib/spotify";

type Props = { params: Promise<{ topic: string }> };

export async function generateStaticParams() {
  return TOPICS.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return {};
  return {
    title: `${topic.name} — Still Human Podcast`,
    description: topic.description,
  };
}

export default async function TopicPage({ params }: Props) {
  const { topic: slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  const allEpisodes = getAllEpisodes();
  const filtered = allEpisodes.filter((ep) =>
    (ep.topics ?? []).includes(slug)
  );

  const spotifyEpisodes = await getSpotifyShowEpisodes();
  const episodeImages = buildEpisodeImagesArray(
    allEpisodes.map((ep) => ep.title),
    spotifyEpisodes
  );

  const style = getTopicStyle(slug);

  return (
    <div className="relative min-h-screen bg-[#050507]">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(41,151,255,0.05) 0%, transparent 50%), #050507",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24">
        {/* Back nav */}
        <div className="flex items-center gap-3 mb-12">
          <a
            href="/"
            className="text-[13px] font-medium text-white/30 hover:text-white/60 transition-colors"
          >
            ← Still Human
          </a>
          <span className="text-white/15">·</span>
          <a
            href="/topics"
            className="text-[13px] font-medium text-white/30 hover:text-white/60 transition-colors"
          >
            Topics
          </a>
        </div>

        {/* Header */}
        <div className="mb-14">
          <span className="text-4xl mb-4 block">{topic.icon}</span>
          <span className={`text-[11px] font-medium px-3 py-1 rounded-full border ${style.badge} mb-4 inline-block`}>
            {filtered.length} {filtered.length === 1 ? "episode" : "episodes"}
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mt-3 mb-5">
            {topic.name}
          </h1>
          <p className="text-white/40 text-lg max-w-lg leading-relaxed">
            {topic.description}
          </p>
        </div>

        {/* Episodes */}
        <div className="flex flex-col gap-4">
          {filtered.reverse().map((ep) => {
            const epIndex = parseInt(ep.number, 10) - 1;
            const imgSrc =
              episodeImages[epIndex] ||
              `https://img.youtube.com/vi/${ep.youtubeId}/mqdefault.jpg`;

            return (
              <a
                key={ep.slug}
                href={`/episode/${ep.slug}`}
                className="group glass-card rounded-2xl overflow-hidden flex flex-col sm:flex-row gap-0 noise"
              >
                {/* Square thumbnail */}
                <div className="relative w-full aspect-video sm:w-48 sm:aspect-video flex-shrink-0">
                  <img
                    src={imgSrc}
                    alt={`EP ${ep.number}: ${ep.guest}`}
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
                    <h2 className="text-lg sm:text-xl font-bold text-white/80 group-hover:text-white transition-colors mb-3 leading-snug line-clamp-2">
                      {ep.title}
                    </h2>
                    <p className="text-sm text-white/30 leading-relaxed line-clamp-2 mb-4">
                      {ep.description}
                    </p>
                    <div className="flex items-center gap-3">
                      {ep.duration !== "—" && (
                        <span className="flex items-center gap-1 text-[12px] text-white/25 font-mono">
                          <Clock className="w-3 h-3" />
                          {ep.duration}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[12px] text-white/25">
                        <Music2 className="w-3 h-3 text-[#1DB954]/60" />
                        Spotify
                      </span>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.06] group-hover:border-white/[0.2] transition-all duration-300 mt-1">
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white/70 transition-colors" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
