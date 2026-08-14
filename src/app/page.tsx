import { Navbar } from "../components/navbar";
import { PodcastHero } from "../components/podcast-hero";
import { LatestVideo } from "../components/home/latest-video";
import { LatestEpisodes } from "../components/home/latest-episodes";
import { FeaturedEpisodes } from "../components/home/featured-episodes";
import { TopicsSearch } from "../components/home/topics-search";
import { AboutHost } from "../components/home/about-host";
import { ShowPromo } from "../components/home/show-promo";
import { NewsletterSignup } from "../components/home/newsletter-signup";
import { Testimonials } from "../components/home/testimonials";
import { SiteFooter } from "../components/home/site-footer";
import { getAllEpisodes } from "../lib/episodes";
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
  const latestThree = recentEpisodes.slice(0, 3);
  const featuredThree = recentEpisodes.slice(3, 6);

  // Spotify cover per episode slug — used as a fallback when a YouTube
  // thumbnail isn't available yet (new / unlisted upload).
  const coverImages: Record<string, string> = {};
  rawEpisodes.forEach((ep) => {
    const idx = parseInt(ep.number, 10) - 1;
    if (episodeImages[idx]) coverImages[ep.slug] = episodeImages[idx];
  });

  // Localized topic name per slug, for episode-card eyebrows.
  const topicNames: Record<string, string> = Object.fromEntries(
    localizedTopics.map((tp) => [tp.slug, tp.name])
  );
  const navTopics = localizedTopics.map((tp) => ({ slug: tp.slug, name: tp.name }));

  return (
    <div className="relative z-10 min-h-screen bg-[#FAF8F5]">
      <Navbar light topics={navTopics} latestEpisodeSlug={latestEpisode.slug} />

      <PodcastHero
        episode={latestEpisode}
        spotifyImageUrl={latestImage}
        spotifyEpisodeUrl={latestSpotifyInfo?.spotifyUrl}
      />

      <LatestVideo />

      <LatestEpisodes
        episodes={latestThree}
        covers={coverImages}
        topicNames={topicNames}
      />

      <FeaturedEpisodes
        episodes={featuredThree}
        covers={coverImages}
        topicNames={topicNames}
      />

      <TopicsSearch topics={navTopics} />

      <AboutHost />

      <ShowPromo coverImage={latestImage} />

      <NewsletterSignup />

      <Testimonials />

      <SiteFooter />
    </div>
  );
}
