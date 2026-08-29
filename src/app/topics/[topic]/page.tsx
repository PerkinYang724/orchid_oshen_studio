import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Clock, Music2, Cpu, Rocket, User, FlaskConical, Brain, Telescope } from "lucide-react";
import { TOPICS, getTopicBySlug } from "@/lib/topics";
import { getAllEpisodes } from "@/lib/episodes";
import { getPodcastFeedEpisodes, buildEpisodeImagesArray } from "@/lib/podcast-rss";
import { youtubeThumb } from "@/lib/youtube";
import { getMessages } from "@/i18n/server";
import { localizeEpisodes, localizeTopic, localizeTopics } from "@/i18n/localize";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/home/site-footer";

const ACCENT = "#E2603D";

const TOPIC_ICONS: Record<string, React.ElementType> = {
  "ai-technology": Cpu,
  "entrepreneurship": Rocket,
  "identity-humanity": User,
  "science-engineering": FlaskConical,
  "mental-resilience": Brain,
  "space-future": Telescope,
};

type Props = { params: Promise<{ topic: string }> };

export async function generateStaticParams() {
  return TOPICS.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: slug } = await params;
  const rawTopic = getTopicBySlug(slug);
  if (!rawTopic) return {};
  const m = await getMessages();
  const topic = localizeTopic(rawTopic, m);
  return {
    title: `${topic.name} — Still Human Podcast`,
    description: topic.description,
    alternates: { canonical: `/topics/${slug}` },
  };
}

export default async function TopicPage({ params }: Props) {
  const { topic: slug } = await params;
  const rawTopic = getTopicBySlug(slug);
  if (!rawTopic) notFound();

  const m = await getMessages();
  const topic = localizeTopic(rawTopic, m);

  const rawAllEpisodes = getAllEpisodes();
  const allEpisodes = localizeEpisodes(rawAllEpisodes, m);
  const filtered = allEpisodes.filter((ep) => (ep.topics ?? []).includes(slug));

  const spotifyEpisodes = await getPodcastFeedEpisodes();
  const episodeImages = buildEpisodeImagesArray(
    rawAllEpisodes.map((ep) => ({ title: ep.feedTitle ?? ep.title, guest: ep.guest })),
    spotifyEpisodes
  );

  const Icon = TOPIC_ICONS[topic.slug] ?? Cpu;
  const navTopics = localizeTopics(m).map((tp) => ({ slug: tp.slug, name: tp.name }));
  const latestSlug = allEpisodes[allEpisodes.length - 1]?.slug;

  return (
    <div className="relative z-10 min-h-screen bg-[#FAF8F5]">
      <Navbar light topics={navTopics} latestEpisodeSlug={latestSlug} />

      <section className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 sm:pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-10 text-[13px] font-medium">
          <Link href="/" className="text-[#161310]/40 hover:text-[#161310] transition-colors">
            {m.topicDetail.backHome}
          </Link>
          <span className="text-[#161310]/20">·</span>
          <Link href="/topics" className="text-[#161310]/40 hover:text-[#161310] transition-colors">
            {m.topicDetail.topicsBreadcrumb}
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12 sm:mb-14">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#161310]/[0.04] border border-[#161310]/[0.06] mb-4">
            <Icon className="w-5 h-5" style={{ color: ACCENT }} strokeWidth={1.5} />
          </div>
          <p
            className="text-[12px] font-semibold tracking-[0.2em] uppercase mb-3"
            style={{ color: ACCENT }}
          >
            {filtered.length} {filtered.length === 1 ? m.topicDetail.episode : m.topicDetail.episodes}
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#161310] leading-[1.05] mb-5">
            {topic.name}
          </h1>
          <p className="text-[#161310]/55 text-lg max-w-xl leading-relaxed">
            {topic.description}
          </p>
        </div>

        {/* Episodes */}
        <div className="flex flex-col gap-4">
          {[...filtered].reverse().map((ep) => {
            const epIndex = parseInt(ep.number, 10) - 1;
            const spotifyImg = episodeImages[epIndex];
            const imgSrc = spotifyImg || youtubeThumb(ep.youtubeId, "mq");

            return (
              <Link
                key={ep.slug}
                href={`/episode/${ep.slug}`}
                className="group rounded-2xl overflow-hidden flex flex-col sm:flex-row bg-white/60 hover:bg-white border border-[#161310]/[0.08] hover:shadow-[0_20px_50px_-24px_rgba(22,19,16,0.35)] transition-all duration-300"
              >
                {/* Always 1:1 — prefer Spotify cover; YouTube fallback cropped to fit */}
                <div className="relative w-full aspect-square sm:w-44 sm:aspect-square flex-shrink-0 bg-[#161310]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgSrc}
                    alt={`Episode ${ep.number} — ${ep.guest}: ${ep.title}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute top-2 left-2 text-[11px] font-mono text-white/90 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
                    EP {ep.number}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 items-start justify-between gap-4 p-6 sm:p-7">
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-[#161310]/45 mb-2 tracking-wide">
                      {ep.guest}
                    </p>
                    <h2 className="text-lg sm:text-xl font-bold text-[#161310] group-hover:text-[#C9512F] transition-colors mb-3 leading-snug line-clamp-2">
                      {ep.title}
                    </h2>
                    <p className="text-sm text-[#161310]/55 leading-relaxed line-clamp-2 mb-4">
                      {ep.description}
                    </p>
                    <div className="flex items-center gap-3">
                      {ep.duration !== "—" && (
                        <span className="flex items-center gap-1 text-[12px] text-[#161310]/40 font-mono">
                          <Clock className="w-3 h-3" />
                          {ep.duration}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[12px] text-[#161310]/40">
                        <Music2 className="w-3 h-3 text-[#1DB954]" />
                        Spotify
                      </span>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-full border border-[#161310]/[0.1] flex items-center justify-center flex-shrink-0 group-hover:bg-[#161310]/[0.04] group-hover:border-[#161310]/[0.2] transition-all duration-300 mt-1">
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#161310]/35 group-hover:text-[#C9512F] transition-colors" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
