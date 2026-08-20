import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Youtube, Music2, Podcast, Clock } from "lucide-react";
import { getAllSlugs, getEpisodeBySlug, getAllEpisodes } from "@/lib/episodes";
import { getPodcastFeedEpisodes, buildEpisodeImagesArray, buildEpisodePubDatesArray } from "@/lib/podcast-rss";
import { youtubeThumb, bestThumb } from "@/lib/youtube";
import { getLocale, getMessages } from "@/i18n/server";
import {
  localizeEpisode,
  localizeEpisodes,
  localizeTopics,
  getLocalizedTopicBySlug,
} from "@/i18n/localize";
import { Navbar } from "@/components/navbar";
import { EpisodeTabs } from "@/components/home/episode-tabs";
import { NewsletterBand } from "@/components/home/newsletter-band";
import { RelatedEpisodes } from "@/components/home/related-episodes";
import { SiteFooter } from "@/components/home/site-footer";

const APPLE_PODCASTS = "https://podcasts.apple.com/us/podcast/still-human/id1795315498";
const SHOW_SPOTIFY = "https://open.spotify.com/show/2JdDo1zeJ2fyO5wxxS7ikN";
const ACCENT = "#E2603D";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://oshenstudio.com";

function durationToIso8601(duration: string): string | undefined {
  // "46 min" → "PT46M", "1h 12m" → "PT1H12M", "—" → undefined
  if (!duration || duration === "—") return undefined;
  const h = duration.match(/(\d+)\s*h/i)?.[1];
  const m = duration.match(/(\d+)\s*(?:m|min)/i)?.[1];
  if (!h && !m) return undefined;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}`;
}

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const rawEpisode = getEpisodeBySlug(slug);
  if (!rawEpisode) return {};
  const m = await getMessages();
  const episode = localizeEpisode(rawEpisode, m);
  const keywords = [
    rawEpisode.primaryKeyword,
    ...(rawEpisode.secondaryKeywords?.split(",") ?? []),
  ]
    .map((k) => k.trim())
    .filter(Boolean);

  // Prefer the YouTube frame, but fall back to the Spotify cover when the video
  // has no thumbnail yet (new / unlisted upload) so social cards don't 404.
  const rawAllEpisodes = getAllEpisodes();
  const spotifyEpisodes = await getPodcastFeedEpisodes();
  const episodeImages = buildEpisodeImagesArray(
    rawAllEpisodes.map((ep) => ({ title: ep.feedTitle ?? ep.title, guest: ep.guest })),
    spotifyEpisodes
  );
  const coverFallback = episodeImages[parseInt(rawEpisode.number, 10) - 1] ?? "";
  const ogImage = await bestThumb(episode.youtubeId, coverFallback);

  return {
    title: episode.metaTitle,
    description: episode.metaDescription,
    keywords,
    openGraph: {
      title: episode.metaTitle,
      description: episode.metaDescription,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: episode.metaTitle,
      description: episode.metaDescription,
      images: [ogImage],
    },
  };
}

export default async function EpisodePage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const rawEpisode = getEpisodeBySlug(slug, locale);
  if (!rawEpisode) notFound();

  const m = await getMessages();
  const episode = localizeEpisode(rawEpisode, m);

  const rawAllEpisodes = getAllEpisodes();
  const allEpisodes = localizeEpisodes(rawAllEpisodes, m);
  const spotifyEpisodes = await getPodcastFeedEpisodes();
  const matchInputs = rawAllEpisodes.map((ep) => ({ title: ep.feedTitle ?? ep.title, guest: ep.guest }));
  const episodeImages = buildEpisodeImagesArray(matchInputs, spotifyEpisodes);
  const episodePubDates = buildEpisodePubDatesArray(matchInputs, spotifyEpisodes);

  const epIndex = parseInt(episode.number, 10) - 1;
  const coverImageUrl = episodeImages[epIndex] ?? "";
  const datePublished = episode.publishDate || episodePubDates[epIndex] || "";

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

  const canonicalUrl = `${siteUrl}/episode/${episode.slug}`;
  const isoDuration = durationToIso8601(episode.duration);
  const coverForSchema = coverImageUrl || youtubeThumb(episode.youtubeId);

  const episodeSchema = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    "@id": `${canonicalUrl}#episode`,
    name: episode.title,
    description: episode.metaDescription || episode.description,
    url: canonicalUrl,
    thumbnailUrl: coverForSchema,
    inLanguage: locale === "zh-TW" ? "zh-Hant-TW" : "en-US",
    ...(datePublished ? { datePublished } : {}),
    ...(isoDuration ? { timeRequired: isoDuration } : {}),
    partOfSeries: { "@id": `${siteUrl}/#podcast` },
    author: { "@id": `${siteUrl}/#person` },
    associatedMedia: {
      "@type": "VideoObject",
      name: episode.title,
      description: episode.metaDescription || episode.description,
      thumbnailUrl: coverForSchema,
      uploadDate: datePublished || undefined,
      ...(isoDuration ? { duration: isoDuration } : {}),
      contentUrl: `https://www.youtube.com/watch?v=${episode.youtubeId}`,
      embedUrl: `https://www.youtube.com/embed/${episode.youtubeId}`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Still Human", item: siteUrl },
      { "@type": "ListItem", position: 2, name: m.episodeDetail.allEpisodes, item: `${siteUrl}/episode` },
      { "@type": "ListItem", position: 3, name: episode.title, item: canonicalUrl },
    ],
  };

  // FAQs may not be translated yet for non-default locales; fall back to EN.
  const faqs =
    m.episodes[episode.slug]?.faqs ??
    (locale !== "en"
      ? // Avoid duplicate import; access via re-fetch of default messages.
        (await import("@/i18n/messages/en")).en.episodes[episode.slug]?.faqs
      : undefined);

  const faqSchema = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } : null;

  const navTopics = localizeTopics(m).map((tp) => ({ slug: tp.slug, name: tp.name }));
  const latestSlug = allEpisodes[allEpisodes.length - 1]?.slug;
  const primaryTopicName = episodeTopics[0]
    ? getLocalizedTopicBySlug(episodeTopics[0], m)?.name ?? null
    : null;
  const dateLabel = datePublished
    ? new Date(datePublished).toLocaleDateString(
        locale === "zh-TW" ? "zh-TW" : "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      )
    : "";

  const relatedItems = related.map((ep) => {
    const idx = parseInt(ep.number, 10) - 1;
    return {
      href: `/episode/${ep.slug}`,
      cover: youtubeThumb(ep.youtubeId),
      fallbackCover: episodeImages[idx],
      epNumber: ep.number,
      eyebrow: getLocalizedTopicBySlug(ep.topics?.[0] ?? "", m)?.name ?? m.nav.podcast,
      title: ep.title,
    };
  });
  const findMore =
    episodeTopics[0] && primaryTopicName
      ? { label: primaryTopicName, href: `/topics/${episodeTopics[0]}` }
      : undefined;

  return (
    <div className="relative z-10 min-h-screen bg-[#FAF8F5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(episodeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <Navbar light topics={navTopics} latestEpisodeSlug={latestSlug} />

      <article className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 sm:pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-8 text-[13px] font-medium">
          <Link href="/" className="text-[#161310]/40 hover:text-[#161310] transition-colors">
            Still Human
          </Link>
          <span className="text-[#161310]/20">·</span>
          <Link
            href="/episode"
            className="text-[#161310]/40 hover:text-[#161310] transition-colors"
          >
            {m.episodeDetail.allEpisodes}
          </Link>
        </div>

        {/* Eyebrow: topic · date */}
        <p
          className="text-[12px] font-semibold tracking-[0.18em] uppercase mb-4"
          style={{ color: ACCENT }}
        >
          {[primaryTopicName ?? m.nav.podcast, dateLabel].filter(Boolean).join("  ·  ")}
        </p>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-[#161310] leading-[1.08] mb-5">
          {episode.title}
        </h1>

        {/* Meta + topic tags */}
        <div className="flex flex-wrap items-center gap-2.5 mb-8">
          <span className="text-[13px] font-medium text-[#161310]/45">{episode.guest}</span>
          {episode.duration !== "—" && (
            <>
              <span className="text-[#161310]/20">·</span>
              <span className="inline-flex items-center gap-1.5 text-[13px] text-[#161310]/45 font-mono">
                <Clock className="w-3.5 h-3.5" />
                {episode.duration}
              </span>
            </>
          )}
          {episodeTopics.map((topicSlug) => {
            const topic = getLocalizedTopicBySlug(topicSlug, m);
            return (
              <a
                key={topicSlug}
                href={`/topics/${topicSlug}`}
                className="text-[12px] font-medium px-2.5 py-1 rounded-full border border-[#161310]/15 text-[#161310]/60 hover:border-[#161310]/30 hover:text-[#161310] transition-colors"
              >
                {topic?.name ?? topicSlug}
              </a>
            );
          })}
        </div>

        {/* Video */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#161310]/10 mb-5 bg-[#161310]">
          {/* enablejsapi=1 is what lets GA4 enhanced measurement see this
              player. Without it the Video engagement toggle is on in the data
              stream but collects nothing: no starts, progress or completions.
              The VideoObject embedUrl in the schema above stays clean. */}
          <iframe
            src={`https://www.youtube.com/embed/${episode.youtubeId}?enablejsapi=1`}
            title={episode.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Platform links */}
        <div className="flex flex-wrap gap-3 mb-12">
          <a
            href={`https://www.youtube.com/watch?v=${episode.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#161310]/10 hover:border-[#161310]/25 text-[#161310]/75 hover:text-[#161310] text-[13px] font-semibold transition-all"
          >
            <Youtube className="w-4 h-4 text-[#FF0000]" />
            {m.episodeDetail.watchYoutube}
          </a>
          <a
            href={APPLE_PODCASTS}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#161310]/10 hover:border-[#161310]/25 text-[#161310]/75 hover:text-[#161310] text-[13px] font-semibold transition-all"
          >
            <Podcast className="w-4 h-4 text-[#9933CC]" />
            {m.episodeDetail.listenApple}
          </a>
          <a
            href={SHOW_SPOTIFY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#161310]/10 hover:border-[#161310]/25 text-[#161310]/75 hover:text-[#161310] text-[13px] font-semibold transition-all"
          >
            <Music2 className="w-4 h-4 text-[#1DB954]" />
            {m.episodeDetail.listenSpotify}
          </a>
        </div>

        {/* Tabbed content: Show Notes / Timestamps / Transcript */}
        <EpisodeTabs
          contentHtml={episode.contentHtml}
          timestamps={episode.timestamps}
          youtubeId={episode.youtubeId}
          faqs={faqs}
        />

      </article>

      {/* 1 — Newsletter band */}
      <NewsletterBand />

      {/* 2 — Related episodes */}
      <RelatedEpisodes items={relatedItems} findMore={findMore} />

      {/* 3 — Footer */}
      <SiteFooter />
    </div>
  );
}
