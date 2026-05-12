import type { MetadataRoute } from "next";
import { getAllEpisodes } from "@/lib/episodes";
import { TOPICS } from "@/lib/topics";
import { getPodcastFeedEpisodes, buildEpisodePubDatesArray } from "@/lib/podcast-rss";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://oshenstudio.com");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const episodes = getAllEpisodes();
  const now = new Date();
  const spotifyEpisodes = await getPodcastFeedEpisodes();
  const episodePubDates = buildEpisodePubDatesArray(
    episodes.map((ep) => ({ title: ep.feedTitle ?? ep.title, guest: ep.guest })),
    spotifyEpisodes
  );

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/episode`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/topics`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/newsletter`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const episodeRoutes: MetadataRoute.Sitemap = episodes.map((ep, i) => {
    const iso = ep.publishDate || episodePubDates[i] || "";
    const lastModified = iso ? new Date(iso) : now;
    return {
      url: `${baseUrl}/episode/${ep.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    };
  });

  const topicRoutes: MetadataRoute.Sitemap = TOPICS.map((topic) => ({
    url: `${baseUrl}/topics/${topic.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...episodeRoutes, ...topicRoutes];
}
