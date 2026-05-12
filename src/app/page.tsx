import { Navbar } from "../components/navbar";
import { PodcastHero } from "../components/podcast-hero";
import { RecentEpisodes } from "../components/recent-episodes";
import { Mission } from "../components/mission";
import { TopicsPreview } from "../components/topics-preview";
import { NewsletterCta } from "../components/newsletter-cta";
import { Footer } from "../components/footer";
import { getAllEpisodes } from "../lib/episodes";
import { TOPICS } from "../lib/topics";
import { getPodcastFeedEpisodes, buildEpisodeImagesArray } from "../lib/podcast-rss";
import { getMessages } from "../i18n/server";
import { localizeEpisodes, localizeTopics } from "../i18n/localize";

export default async function Home() {
  const messages = await getMessages();
  // Use English title/guest for Spotify matching, but display localized.
  const rawEpisodes = getAllEpisodes(); // sorted oldest → newest
  const spotifyEpisodes = await getPodcastFeedEpisodes();
  const episodeImages = buildEpisodeImagesArray(
    rawEpisodes.map((ep) => ({ title: ep.feedTitle ?? ep.title, guest: ep.guest })),
    spotifyEpisodes
  );

  const allEpisodes = localizeEpisodes(rawEpisodes, messages);
  const localizedTopics = localizeTopics(messages);

  // Latest episode = last in sorted array
  const latestEpisode = allEpisodes[allEpisodes.length - 1];
  const latestRawEpisode = rawEpisodes[rawEpisodes.length - 1];
  const latestIndex = parseInt(latestEpisode.number, 10) - 1;
  const latestImage = episodeImages[latestIndex] ?? "";

  // Spotify URL match needs the English title since Spotify titles are English.
  const latestSpotifyInfo = spotifyEpisodes.find((sp) =>
    latestRawEpisode.title
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 3)
      .some((w) => sp.title.toLowerCase().includes(w))
  );

  // All episodes, newest first
  const recentEpisodes = [...allEpisodes].reverse();

  // Episode counts per topic
  const episodeCounts: Record<string, number> = {};
  for (const topic of TOPICS) {
    episodeCounts[topic.slug] = allEpisodes.filter((ep) =>
      (ep.topics ?? []).includes(topic.slug)
    ).length;
  }

  return (
    <div className="relative min-h-screen">
      <Navbar />

      <PodcastHero
        episode={latestEpisode}
        spotifyImageUrl={latestImage}
        spotifyEpisodeUrl={latestSpotifyInfo?.spotifyUrl}
      />

      <RecentEpisodes
        episodes={recentEpisodes}
        topics={localizedTopics}
      />

      <Mission />

      <TopicsPreview topics={localizedTopics} episodeCounts={episodeCounts} />

      <NewsletterCta />

      <Footer />
    </div>
  );
}
