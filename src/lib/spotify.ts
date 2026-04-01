const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return (data.access_token as string) ?? null;
}

function normalizeShowId(raw: string): string {
  const trimmed = raw.trim();
  try {
    const toParse = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(toParse);
    if (url.hostname.includes("spotify.com") && url.pathname.startsWith("/show/")) {
      const id = url.pathname.replace(/^\/show\//, "").split("/")[0];
      if (id) return id;
    }
  } catch {
    // not a URL — use as-is
  }
  return trimmed.split("?")[0].trim();
}

export type SpotifyEpisodeInfo = {
  id: string;
  imageUrl: string;
  title: string;
  spotifyUrl: string;
};

/**
 * Fetches all episodes for the configured Spotify show.
 * Returns [] when Spotify credentials are not configured.
 */
export async function getSpotifyShowEpisodes(): Promise<SpotifyEpisodeInfo[]> {
  const rawShowId = process.env.SPOTIFY_SHOW_ID?.trim();
  if (!rawShowId) return [];

  const showId = normalizeShowId(rawShowId);
  const token = await getAccessToken();
  if (!token) return [];

  const res = await fetch(
    `${SPOTIFY_API_BASE}/shows/${showId}/episodes?limit=50`,
    {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    }
  );
  if (!res.ok) return [];

  const data = await res.json();
  const items: Array<{
    id: string;
    name: string;
    images?: Array<{ url: string }>;
    external_urls?: { spotify?: string };
  } | null> = data.items ?? [];

  return items
    .filter((ep): ep is NonNullable<typeof ep> => ep !== null)
    .map((ep) => ({
      id: ep.id,
      imageUrl: ep.images?.[0]?.url ?? "",
      title: ep.name ?? "",
      spotifyUrl: ep.external_urls?.spotify ?? "",
    }));
}

/** Normalise a title into a set of meaningful words for comparison. */
function titleWords(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
}

/**
 * Given a local episode title and the full list of Spotify episodes,
 * returns the Spotify episode whose title shares the most words with the local title.
 */
function matchEpisode(
  localTitle: string,
  spotifyEps: SpotifyEpisodeInfo[]
): SpotifyEpisodeInfo | undefined {
  const local = titleWords(localTitle);
  let best: SpotifyEpisodeInfo | undefined;
  let bestScore = 0;

  for (const ep of spotifyEps) {
    const remote = titleWords(ep.title);
    let score = 0;
    for (const word of local) {
      if (remote.has(word)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      best = ep;
    }
  }

  return bestScore > 0 ? best : undefined;
}

/**
 * Given an ordered list of local episode titles (index 0 = episode 01) and
 * the raw Spotify episodes list, returns a string[] of cover image URLs
 * matched by title similarity. Falls back to "" when no match is found.
 */
export function buildEpisodeImagesArray(
  localTitles: string[],
  spotifyEps: SpotifyEpisodeInfo[]
): string[] {
  return localTitles.map((title) => matchEpisode(title, spotifyEps)?.imageUrl ?? "");
}
