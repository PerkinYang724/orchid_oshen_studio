import { getAllEpisodes } from "@/lib/episodes";
import { getPodcastFeedEpisodes, buildEpisodeImagesArray, buildEpisodePubDatesArray } from "@/lib/podcast-rss";
import { youtubeThumb } from "@/lib/youtube";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://oshenstudio.com";
const showCoverFallback = `${siteUrl}/icon-512.png`;
const SHOW_TITLE = "Still Human Podcast";
const SHOW_DESC =
  "A podcast exploring identity, creativity, and what it means to be human at the intersection of AI. Hosted by Perkin Yang.";
const SHOW_AUTHOR = "Perkin Yang";
const SHOW_EMAIL = "hello@oshenstudio.com";
const SHOW_CATEGORY = "Technology";
const SHOW_SUBCATEGORY = "Society & Culture";
const SPOTIFY_URL = "https://open.spotify.com/show/2JdDo1zeJ2fyO5wxxS7ikN";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function durationToSeconds(duration: string): string | undefined {
  if (!duration || duration === "—") return undefined;
  const h = parseInt(duration.match(/(\d+)\s*h/i)?.[1] ?? "0", 10);
  const m = parseInt(duration.match(/(\d+)\s*(?:m|min)/i)?.[1] ?? "0", 10);
  const total = h * 3600 + m * 60;
  return total > 0 ? String(total) : undefined;
}

export async function GET(): Promise<Response> {
  const episodes = getAllEpisodes();
  const spotifyEpisodes = await getPodcastFeedEpisodes();
  const matchInputs = episodes.map((ep) => ({
    title: ep.feedTitle ?? ep.title,
    guest: ep.guest,
  }));
  const covers = buildEpisodeImagesArray(matchInputs, spotifyEpisodes);
  const pubDates = buildEpisodePubDatesArray(matchInputs, spotifyEpisodes);

  // Newest first per RSS convention
  const ordered = [...episodes].reverse();

  const items = ordered
    .map((ep) => {
      const idx = parseInt(ep.number, 10) - 1;
      const cover = covers[idx] || youtubeThumb(ep.youtubeId);
      const isoDate = ep.publishDate || pubDates[idx] || "";
      const rfc822 = isoDate ? new Date(isoDate).toUTCString() : "";
      const seconds = durationToSeconds(ep.duration);
      const url = `${siteUrl}/episode/${ep.slug}`;
      const youtubeUrl = `https://www.youtube.com/watch?v=${ep.youtubeId}`;

      return `    <item>
      <title>${escapeXml(ep.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      ${rfc822 ? `<pubDate>${escapeXml(rfc822)}</pubDate>` : ""}
      <description><![CDATA[${ep.description}]]></description>
      <itunes:summary><![CDATA[${ep.description}]]></itunes:summary>
      <itunes:author>${escapeXml(SHOW_AUTHOR)}</itunes:author>
      <itunes:episode>${escapeXml(ep.number.replace(/^0+/, ""))}</itunes:episode>
      <itunes:episodeType>full</itunes:episodeType>
      ${seconds ? `<itunes:duration>${seconds}</itunes:duration>` : ""}
      <itunes:image href="${escapeXml(cover)}" />
      <enclosure url="${escapeXml(youtubeUrl)}" type="video/mp4" length="0" />
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SHOW_TITLE)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <atom:link href="${escapeXml(`${siteUrl}/feed.xml`)}" rel="self" type="application/rss+xml" />
    <atom:link href="${escapeXml(SPOTIFY_URL)}" rel="alternate" type="text/html" title="Spotify" />
    <language>en-us</language>
    <description>${escapeXml(SHOW_DESC)}</description>
    <copyright>© ${new Date().getFullYear()} Oshen Studio</copyright>
    <itunes:author>${escapeXml(SHOW_AUTHOR)}</itunes:author>
    <itunes:summary>${escapeXml(SHOW_DESC)}</itunes:summary>
    <itunes:owner>
      <itunes:name>${escapeXml(SHOW_AUTHOR)}</itunes:name>
      <itunes:email>${escapeXml(SHOW_EMAIL)}</itunes:email>
    </itunes:owner>
    <itunes:image href="${escapeXml(showCoverFallback)}" />
    <itunes:category text="${escapeXml(SHOW_CATEGORY)}">
      <itunes:category text="${escapeXml(SHOW_SUBCATEGORY)}" />
    </itunes:category>
    <itunes:explicit>false</itunes:explicit>
    <itunes:type>episodic</itunes:type>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
