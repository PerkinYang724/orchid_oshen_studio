import { NextResponse } from "next/server";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Cache at most 1 hour; new episodes appear without redeploy

type SpotifyTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

type SpotifyEpisode = {
  id: string;
  name: string;
  description: string;
  duration_ms: number;
  external_urls: { spotify: string };
  images?: Array<{ url: string; width: number; height: number }>;
};

type SpotifyEpisodesResponse = {
  items: SpotifyEpisode[];
};

async function getSpotifyAccessToken(): Promise<string | null> {
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
  const data = (await res.json()) as SpotifyTokenResponse;
  return data.access_token;
}

function formatDuration(ms: number): string {
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
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
    // Not a URL, use as-is (strip query if present)
  }
  return trimmed.split("?")[0].trim();
}

export async function GET() {
  const rawShowId = process.env.SPOTIFY_SHOW_ID;
  if (!rawShowId?.trim()) {
    return NextResponse.json(
      { error: "SPOTIFY_SHOW_ID not configured" },
      { status: 503 }
    );
  }

  const showId = normalizeShowId(rawShowId);
  const token = await getSpotifyAccessToken();
  if (!token) {
    return NextResponse.json(
      { error: "Spotify credentials not configured or invalid" },
      { status: 503 }
    );
  }

  const res = await fetch(
    `${SPOTIFY_API_BASE}/shows/${showId}/episodes?limit=1&market=US`,
    {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: "Failed to fetch episodes", details: text },
      { status: res.status === 401 ? 503 : res.status }
    );
  }

  const data = (await res.json()) as SpotifyEpisodesResponse;
  const episode = data.items?.[0];
  if (!episode) {
    return NextResponse.json(
      { error: "No episodes found" },
      { status: 404 }
    );
  }

  const youtubeUrl = process.env.LATEST_EPISODE_YOUTUBE_URL?.trim() || undefined;

  return NextResponse.json({
    title: episode.name,
    description: episode.description || "",
    duration: formatDuration(episode.duration_ms),
    spotifyEpisodeId: episode.id,
    spotifyUrl: episode.external_urls.spotify,
    imageUrl: episode.images?.[0]?.url,
    youtubeUrl: youtubeUrl || undefined,
  });
}
