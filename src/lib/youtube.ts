// Bump THUMB_VERSION whenever YouTube thumbnails are updated, so browsers
// and social-media OG caches re-fetch instead of serving the old image.
const THUMB_VERSION = 5;

type ThumbQuality = "maxres" | "mq";

export function youtubeThumb(videoId: string, quality: ThumbQuality = "maxres"): string {
  const file = quality === "mq" ? "mqdefault.jpg" : "maxresdefault.jpg";
  return `https://img.youtube.com/vi/${videoId}/${file}?v=${THUMB_VERSION}`;
}

/**
 * Server-side: returns the YouTube thumbnail when it actually exists, otherwise
 * the provided fallback cover. Used for OG/Twitter images, where a client-side
 * onError swap isn't possible. New / unlisted uploads have no YouTube thumbnail
 * yet, so this keeps social cards from 404-ing until the video goes public.
 */
export async function bestThumb(videoId: string, fallback: string): Promise<string> {
  const yt = youtubeThumb(videoId);
  if (!fallback) return yt;
  try {
    const res = await fetch(youtubeThumb(videoId), {
      method: "HEAD",
      next: { revalidate: 3600 },
    });
    return res.ok ? yt : fallback;
  } catch {
    return fallback;
  }
}
