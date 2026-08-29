import type { Metadata } from "next";
import { getAllEpisodes } from "@/lib/episodes";
import { getPodcastFeedEpisodes, buildEpisodeImagesArray } from "@/lib/podcast-rss";
import { getMessages } from "@/i18n/server";
import { localizeEpisodes, localizeTopics } from "@/i18n/localize";
import { Navbar } from "@/components/navbar";
import { AllEpisodes } from "@/components/home/all-episodes";
import { SiteFooter } from "@/components/home/site-footer";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMessages();
  return {
    title: m.meta.episodesTitle,
    description: m.meta.episodesDescription,
    alternates: { canonical: "/episode" },
  };
}

export default async function EpisodesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const m = await getMessages();
  const rawEpisodes = getAllEpisodes();
  const spotifyEpisodes = await getPodcastFeedEpisodes();
  const episodeImages = buildEpisodeImagesArray(
    rawEpisodes.map((ep) => ({ title: ep.feedTitle ?? ep.title, guest: ep.guest })),
    spotifyEpisodes
  );
  const episodes = localizeEpisodes(rawEpisodes, m);
  const localizedTopics = localizeTopics(m);
  const navTopics = localizedTopics.map((tp) => ({ slug: tp.slug, name: tp.name }));

  // Spotify cover per slug — used as the YouTube-thumbnail onError fallback.
  const covers: Record<string, string> = {};
  rawEpisodes.forEach((ep) => {
    const idx = parseInt(ep.number, 10) - 1;
    if (episodeImages[idx]) covers[ep.slug] = episodeImages[idx];
  });

  const latestSlug = episodes[episodes.length - 1]?.slug;

  return (
    <div className="relative z-10 min-h-screen bg-[#FAF8F5]">
      <Navbar light topics={navTopics} latestEpisodeSlug={latestSlug} />

      <section className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 sm:pb-20">
        {/* Header */}
        <div className="mb-10 sm:mb-12">
          <p
            className="text-[12px] font-semibold tracking-[0.2em] uppercase mb-4"
            style={{ color: "#E2603D" }}
          >
            {m.episodesPage.sectionLabel}
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#161310] leading-[1.05] mb-5">
            {m.episodesPage.headingPre} {m.episodesPage.headingPost}
          </h1>
          <p className="text-[#161310]/55 text-lg max-w-xl leading-relaxed">
            {m.episodesPage.intro}
          </p>
        </div>

        <AllEpisodes
          episodes={episodes}
          covers={covers}
          topics={navTopics}
          initialQuery={q ?? ""}
        />
      </section>

      <SiteFooter />
    </div>
  );
}
