import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Youtube, ArrowUpRight, Clock, Music2 } from "lucide-react";
import { getAllSlugs, getEpisodeBySlug, getAllEpisodes } from "@/lib/episodes";
import { getSpotifyShowEpisodes, buildEpisodeImagesArray } from "@/lib/spotify";
import { getTopicBySlug, getTopicStyle } from "@/lib/topics";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);
  if (!episode) return {};
  return {
    title: episode.metaTitle,
    description: episode.metaDescription,
    openGraph: {
      title: episode.metaTitle,
      description: episode.metaDescription,
      images: [`https://img.youtube.com/vi/${episode.youtubeId}/maxresdefault.jpg`],
    },
  };
}

export default async function EpisodePage({ params }: Props) {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);
  if (!episode) notFound();

  const allEpisodes = getAllEpisodes();
  const spotifyEpisodes = await getSpotifyShowEpisodes();
  const episodeImages = buildEpisodeImagesArray(
    allEpisodes.map((ep) => ep.title),
    spotifyEpisodes
  );

  const epIndex = parseInt(episode.number, 10) - 1;
  const coverImageUrl = episodeImages[epIndex] ?? "";

  // Related episodes: same topics, excluding current
  const episodeTopics = episode.topics ?? [];
  const related = allEpisodes
    .filter(
      (ep) =>
        ep.slug !== episode.slug &&
        (ep.topics ?? []).some((t) => episodeTopics.includes(t))
    )
    .slice(-3)
    .reverse();

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

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-28 pb-24">
        {/* Back nav */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/"
            className="text-[13px] font-medium text-white/30 hover:text-white/60 transition-colors"
          >
            ← Still Human
          </Link>
          <span className="text-white/15">·</span>
          <Link
            href="/episode"
            className="text-[13px] font-medium text-white/30 hover:text-white/60 transition-colors"
          >
            All Episodes
          </Link>
        </div>

        {/* Episode header: cover art + info */}
        <div className="flex items-start gap-6 mb-6">
          {coverImageUrl && (
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border border-white/[0.08] flex-shrink-0 shadow-2xl">
              <img
                src={coverImageUrl}
                alt={`${episode.title} cover`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0 pt-1">
            <p className="text-[11px] font-mono text-white/25 tracking-widest uppercase mb-3">
              Episode {episode.number} · {episode.guest}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              {episode.title}
            </h1>
          </div>
        </div>

        {/* Meta + topic tags */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          {episode.duration !== "—" && (
            <span className="inline-flex items-center gap-1.5 text-[12px] text-white/30 font-mono">
              <Clock className="w-3.5 h-3.5" />
              {episode.duration}
            </span>
          )}
          {episodeTopics.map((topicSlug) => {
            const topic = getTopicBySlug(topicSlug);
            const style = getTopicStyle(topicSlug);
            return (
              <a
                key={topicSlug}
                href={`/topics/${topicSlug}`}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-opacity hover:opacity-80 ${style.badge}`}
              >
                {topic?.name ?? topicSlug}
              </a>
            );
          })}
        </div>

        {/* YouTube embed */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/[0.08] mb-5">
          <iframe
            src={`https://www.youtube.com/embed/${episode.youtubeId}`}
            title={episode.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Platform links */}
        <div className="flex flex-wrap gap-3 mb-16">
          <a
            href={`https://www.youtube.com/watch?v=${episode.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.07] text-white/60 hover:text-white text-[13px] font-medium transition-all duration-200"
          >
            <Youtube className="w-4 h-4 text-[#FF0000]" />
            Watch on YouTube
          </a>
          <a
            href="https://open.spotify.com/show/2JdDo1zeJ2fyO5wxxS7ikN"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.07] text-white/60 hover:text-white text-[13px] font-medium transition-all duration-200"
          >
            <Music2 className="w-4 h-4 text-[#1DB954]" />
            Listen on Spotify
          </a>
        </div>

        {/* Show notes */}
        <article
          className="episode-prose"
          dangerouslySetInnerHTML={{ __html: episode.contentHtml }}
        />

        {/* Related episodes */}
        {related.length > 0 && (
          <div className="mt-16 pt-14 border-t border-white/[0.06]">
            <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-white/20 mb-3">
              Keep Listening
            </p>
            <h3 className="text-2xl font-bold text-white mb-8">Related Episodes</h3>
            <div className="flex flex-col gap-4">
              {related.map((ep) => {
                const idx = parseInt(ep.number, 10) - 1;
                const img = episodeImages[idx] || `https://img.youtube.com/vi/${ep.youtubeId}/mqdefault.jpg`;
                return (
                  <Link
                    key={ep.slug}
                    href={`/episode/${ep.slug}`}
                    className="group glass-card rounded-xl overflow-hidden flex gap-0 noise"
                  >
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                      <img
                        src={img}
                        alt={ep.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute top-1.5 left-1.5 text-[9px] font-mono text-white/90 bg-black/50 px-1.5 py-0.5 rounded">
                        {ep.number}
                      </span>
                    </div>
                    <div className="flex flex-1 items-center justify-between px-4 py-3 gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] text-white/30 mb-1">{ep.guest}</p>
                        <p className="text-sm font-semibold text-white/75 group-hover:text-white transition-colors line-clamp-2 leading-snug">
                          {ep.title}
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-white/25 group-hover:text-white/60 transition-colors flex-shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-14 glass-strong rounded-3xl p-8 sm:p-10 noise relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/[0.06] to-transparent rounded-full blur-[60px] pointer-events-none" />
          <div className="relative z-10">
            <p className="text-[11px] font-medium tracking-wider uppercase text-white/20 mb-3">
              Never miss an episode
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-white/90 mb-2">
              Stay Human
            </h3>
            <p className="text-white/35 text-sm leading-relaxed mb-6 max-w-sm">
              New episodes every two weeks. Subscribe on Substack for show notes
              delivered straight to your inbox.
            </p>
            <a
              href="https://substack.com/@perkin0909"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white/80 hover:text-white border border-white/[0.15] hover:border-white/[0.3] hover:bg-white/[0.05] transition-all duration-300"
            >
              Subscribe on Substack
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/episode"
            className="inline-flex items-center gap-2 text-[13px] text-white/30 hover:text-white/60 transition-colors"
          >
            ← View all episodes
          </Link>
        </div>
      </div>
    </div>
  );
}
