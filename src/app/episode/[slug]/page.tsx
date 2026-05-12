import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Youtube, ArrowUpRight, Clock, Music2 } from "lucide-react";
import { getAllSlugs, getEpisodeBySlug, getAllEpisodes } from "@/lib/episodes";
import { getPodcastFeedEpisodes, buildEpisodeImagesArray, buildEpisodePubDatesArray } from "@/lib/podcast-rss";
import { getTopicStyle } from "@/lib/topics";
import { youtubeThumb } from "@/lib/youtube";
import { getLocale, getMessages } from "@/i18n/server";
import { localizeEpisode, localizeEpisodes, getLocalizedTopicBySlug } from "@/i18n/localize";

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
  return {
    title: episode.metaTitle,
    description: episode.metaDescription,
    keywords,
    openGraph: {
      title: episode.metaTitle,
      description: episode.metaDescription,
      images: [youtubeThumb(episode.youtubeId)],
    },
    twitter: {
      card: "summary_large_image",
      title: episode.metaTitle,
      description: episode.metaDescription,
      images: [youtubeThumb(episode.youtubeId)],
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

  return (
    <div className="relative min-h-screen">
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
      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-28 pb-24">
        {/* Back nav */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/"
            className="text-[13px] font-medium text-white/30 hover:text-white/60 transition-colors"
          >
            {m.episodeDetail.backHome}
          </Link>
          <span className="text-white/15">·</span>
          <Link
            href="/episode"
            className="text-[13px] font-medium text-white/30 hover:text-white/60 transition-colors"
          >
            {m.episodeDetail.allEpisodes}
          </Link>
        </div>

        {/* Episode header: cover art + info */}
        <div className="flex items-start gap-6 mb-6">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border border-white/[0.08] flex-shrink-0 shadow-2xl">
            <img
              src={coverImageUrl || youtubeThumb(episode.youtubeId)}
              alt={`${m.episodeDetail.episodeNumberPrefix}${episode.number}${m.episodeDetail.episodeNumberSuffix} — ${episode.guest}: ${episode.title} cover art`}
              className="w-full h-full object-cover"
              fetchPriority="high"
              loading="eager"
            />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <p className="text-[11px] font-mono text-white/25 tracking-widest uppercase mb-3">
              {m.episodeDetail.episodeNumberPrefix}{episode.number}{m.episodeDetail.episodeNumberSuffix} · {episode.guest}
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
            const topic = getLocalizedTopicBySlug(topicSlug, m);
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
            {m.episodeDetail.watchYoutube}
          </a>
          <a
            href="https://open.spotify.com/show/2JdDo1zeJ2fyO5wxxS7ikN"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.07] text-white/60 hover:text-white text-[13px] font-medium transition-all duration-200"
          >
            <Music2 className="w-4 h-4 text-[#1DB954]" />
            {m.episodeDetail.listenSpotify}
          </a>
        </div>

        {/* Show notes */}
        <article
          className="episode-prose"
          dangerouslySetInnerHTML={{ __html: episode.contentHtml }}
        />

        {/* FAQ */}
        {faqs && faqs.length > 0 && (
          <section className="mt-16 pt-14 border-t border-white/[0.06]">
            <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-white/30 mb-3">
              FAQ
            </p>
            <h3 className="text-2xl font-bold text-white mb-8">
              {m.episodeDetail.faqHeading}
            </h3>
            <div className="flex flex-col gap-3">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group glass-card rounded-xl noise px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                    <h4 className="text-base font-semibold text-white/90 group-open:text-white transition-colors leading-snug">
                      {faq.q}
                    </h4>
                    <span
                      aria-hidden
                      className="mt-1 text-white/40 group-open:rotate-45 transition-transform duration-200 text-lg leading-none flex-shrink-0"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-white/65 leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related episodes */}
        {related.length > 0 && (
          <div className="mt-16 pt-14 border-t border-white/[0.06]">
            <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-white/20 mb-3">
              {m.episodeDetail.keepListening}
            </p>
            <h3 className="text-2xl font-bold text-white mb-8">{m.episodeDetail.relatedEpisodes}</h3>
            <div className="flex flex-col gap-4">
              {related.map((ep) => {
                const idx = parseInt(ep.number, 10) - 1;
                const spotifyImg = episodeImages[idx];
                const img = spotifyImg || youtubeThumb(ep.youtubeId, "mq");
                return (
                  <Link
                    key={ep.slug}
                    href={`/episode/${ep.slug}`}
                    className="group glass-card rounded-xl overflow-hidden flex gap-0 noise"
                  >
                    <div className="relative w-20 sm:w-24 aspect-square flex-shrink-0">
                      <img
                        src={img}
                        alt={`${m.episodeDetail.episodeNumberPrefix}${ep.number}${m.episodeDetail.episodeNumberSuffix} — ${ep.guest}: ${ep.title}`}
                        className="absolute inset-0 w-full h-full object-cover"
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
              {m.episodeDetail.neverMiss}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-white/90 mb-2">
              {m.episodeDetail.stayHumanHeading}
            </h3>
            <p className="text-white/35 text-sm leading-relaxed mb-6 max-w-sm">
              {m.episodeDetail.newsletterCopy}
            </p>
            <a
              href="https://substack.com/@perkin0909"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white/80 hover:text-white border border-white/[0.15] hover:border-white/[0.3] hover:bg-white/[0.05] transition-all duration-300"
            >
              {m.episodeDetail.subscribeSubstack}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/episode"
            className="inline-flex items-center gap-2 text-[13px] text-white/30 hover:text-white/60 transition-colors"
          >
            {m.episodeDetail.viewAllEpisodes}
          </Link>
        </div>
      </div>
    </div>
  );
}
