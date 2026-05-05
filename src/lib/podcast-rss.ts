// Source-of-truth for episode cover art is the public Anchor / Spotify-for-Podcasters
// RSS feed. We parse <item> blocks for title, episode link, and <itunes:image href>.
//
// Replaces a previous Spotify Web API integration that required the show owner's
// account to maintain Premium for the /v1/shows/{id}/episodes endpoint.

const DEFAULT_FEED_URL = "https://anchor.fm/s/10e790338/podcast/rss";

export type PodcastEpisodeInfo = {
  id: string;
  imageUrl: string;
  title: string;
  spotifyUrl: string;
};

export async function getPodcastFeedEpisodes(): Promise<PodcastEpisodeInfo[]> {
  const url = process.env.PODCAST_RSS_URL?.trim() || DEFAULT_FEED_URL;

  let xml: string;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    xml = await res.text();
  } catch {
    return [];
  }

  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];

  return items.map((item, index) => {
    const title =
      item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1]?.trim() ??
      item.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ??
      "";

    const imageUrl =
      item.match(/<itunes:image[^>]*href="([^"]+)"/)?.[1]?.trim() ?? "";

    const spotifyUrl =
      item.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() ?? "";

    const id =
      item.match(/<guid[^>]*>([\s\S]*?)<\/guid>/)?.[1]?.trim() ??
      `rss-${index}`;

    return { id, imageUrl, title, spotifyUrl };
  });
}

type LocalMatchInput = { title: string; guest?: string };

/**
 * Given an ordered list of local episodes (index 0 = episode 01) and the
 * parsed feed episodes, returns a string[] of cover image URLs matched by
 * title similarity, with a guest-name bonus that beats spurious stop-word
 * overlap. Each feed episode is matched at most once. Pass an empty title
 * for episodes that should be excluded (e.g. not published to the feed).
 */
export function buildEpisodeImagesArray(
  locals: ReadonlyArray<string | LocalMatchInput>,
  feedEps: PodcastEpisodeInfo[]
): string[] {
  const normalized: LocalMatchInput[] = locals.map((l) =>
    typeof l === "string" ? { title: l } : l
  );

  const candidates: { localIdx: number; feedIdx: number; score: number }[] = [];

  for (let li = 0; li < normalized.length; li++) {
    const local = normalized[li];
    if (!local.title) continue; // explicit opt-out
    for (let fi = 0; fi < feedEps.length; fi++) {
      const score = titleMatchScore(local, feedEps[fi].title);
      if (score > 0) candidates.push({ localIdx: li, feedIdx: fi, score });
    }
  }

  candidates.sort((a, b) => b.score - a.score);

  const result: string[] = new Array(normalized.length).fill("");
  const usedLocal = new Set<number>();
  const usedFeed = new Set<number>();

  for (const { localIdx, feedIdx, score } of candidates) {
    if (usedLocal.has(localIdx) || usedFeed.has(feedIdx)) continue;
    if (score < 0.15) break;
    result[localIdx] = feedEps[feedIdx].imageUrl;
    usedLocal.add(localIdx);
    usedFeed.add(feedIdx);
  }

  return result;
}

function titleWords(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
}

function titleMatchScore(local: LocalMatchInput, feedTitle: string): number {
  const localSet = titleWords(local.title);
  const remoteSet = titleWords(feedTitle);
  if (localSet.size === 0 || remoteSet.size === 0) return 0;

  let shared = 0;
  for (const word of localSet) {
    if (remoteSet.has(word)) shared++;
  }
  const base = shared / Math.min(localSet.size, remoteSet.size);

  // Guest-name bonus: if any token of the guest's name appears in the feed
  // title, that's a very high-confidence signal — beat spurious overlap from
  // stop-words like "still", "human" (the show title itself).
  if (local.guest) {
    const guestTokens = local.guest
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length > 2);
    const lowerFeed = feedTitle.toLowerCase();
    if (guestTokens.some((t) => lowerFeed.includes(t))) {
      return base + 1; // anything > 1 will outrank pure-overlap matches
    }
  }

  return base;
}
