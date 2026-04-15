import { Navbar } from "../components/navbar";
import { PodcastHero } from "../components/podcast-hero";
import { RecentEpisodes } from "../components/recent-episodes";
import { Mission } from "../components/mission";
import { TopicsPreview } from "../components/topics-preview";
import { NewsletterCta } from "../components/newsletter-cta";
import { Footer } from "../components/footer";
import { getAllEpisodes } from "../lib/episodes";
import { TOPICS } from "../lib/topics";
import { getSpotifyShowEpisodes, buildEpisodeImagesArray } from "../lib/spotify";

export default async function Home() {
  const allEpisodes = getAllEpisodes(); // sorted oldest → newest
  const spotifyEpisodes = await getSpotifyShowEpisodes();
  const episodeImages = buildEpisodeImagesArray(
    allEpisodes.map((ep) => ep.title),
    spotifyEpisodes
  );

  // Latest episode = last in sorted array
  const latestEpisode = allEpisodes[allEpisodes.length - 1];
  const latestIndex = parseInt(latestEpisode.number, 10) - 1;
  const latestImage = episodeImages[latestIndex] ?? "";

  // Spotify URL for latest episode (from matched spotify data)
  const latestSpotifyInfo = spotifyEpisodes.find((sp) =>
    latestEpisode.title
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
    <>
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(41,151,255,0.05) 0%, transparent 60%), #050507",
        }}
      />
      <div className="relative min-h-screen bg-[#050507]">
        <Navbar />

        <PodcastHero
          episode={latestEpisode}
          spotifyImageUrl={latestImage}
          spotifyEpisodeUrl={latestSpotifyInfo?.spotifyUrl}
        />

        <RecentEpisodes
          episodes={recentEpisodes}
          topics={TOPICS}
        />

        <Mission />

        <TopicsPreview topics={TOPICS} episodeCounts={episodeCounts} />

        <NewsletterCta />

        <Footer />
      </div>
    </>
  );
}
