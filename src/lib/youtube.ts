// Bump THUMB_VERSION whenever YouTube thumbnails are updated, so browsers
// and social-media OG caches re-fetch instead of serving the old image.
const THUMB_VERSION = 4;

type ThumbQuality = "maxres" | "mq";

export function youtubeThumb(videoId: string, quality: ThumbQuality = "maxres"): string {
  const file = quality === "mq" ? "mqdefault.jpg" : "maxresdefault.jpg";
  return `https://img.youtube.com/vi/${videoId}/${file}?v=${THUMB_VERSION}`;
}
