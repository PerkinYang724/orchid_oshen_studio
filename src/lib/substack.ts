// Fetches posts from the public Substack archive JSON API. Unlike the RSS feed
// (capped at ~20 items and tagless), the archive exposes every post, the
// publication tags the author assigned, the cover image, and the post type.
// Shared by the /blog and /articles pages and the newsletter-page preview.

const DEFAULT_BASE_URL = "https://perkin0909.substack.com";
const PAGE_SIZE = 50;
const MAX_POSTS = 300; // safety cap on pagination

export type SubstackPostType = "podcast" | "post";

export interface SubstackTag {
  name: string;
  slug: string;
}

export interface SubstackPost {
  title: string;
  link: string;
  description: string; // plain text, HTML stripped
  pubDate: string; // ISO 8601, "" if unparseable
  image: string; // cover image URL, "" if none
  type: SubstackPostType; // "podcast" for audio posts, else "post"
  tags: SubstackTag[]; // author-assigned Substack tags
}

// Shape of the bits we read from each archive entry (the API returns much more).
interface ArchiveEntry {
  title?: string;
  canonical_url?: string;
  post_date?: string;
  cover_image?: string;
  description?: string;
  subtitle?: string;
  type?: string;
  postTags?: { name?: string; slug?: string; hidden?: boolean }[];
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&hellip;/g, "…")
    .replace(/\s+/g, " ")
    .trim();
}

// Walk the archive endpoint page by page until it runs dry. Any failed request
// stops pagination and returns whatever was gathered so far (possibly none).
async function fetchArchive(base: string): Promise<ArchiveEntry[]> {
  const all: ArchiveEntry[] = [];
  for (let offset = 0; offset < MAX_POSTS; offset += PAGE_SIZE) {
    const url = `${base}/api/v1/archive?sort=new&limit=${PAGE_SIZE}&offset=${offset}`;
    let batch: ArchiveEntry[];
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) break;
      batch = (await res.json()) as ArchiveEntry[];
    } catch {
      break;
    }
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < PAGE_SIZE) break;
  }
  return all;
}

/**
 * Returns Substack posts, newest first. Pass `limit` to cap the result — handy
 * for a small preview. Returns [] on any failure so callers can render an empty
 * state instead of throwing.
 */
export async function getSubstackPosts(limit?: number): Promise<SubstackPost[]> {
  const base = (process.env.SUBSTACK_URL?.trim() || DEFAULT_BASE_URL).replace(/\/+$/, "");

  const entries = await fetchArchive(base);

  const posts: SubstackPost[] = entries.map((e) => {
    let pubDate = "";
    if (e.post_date) {
      const d = new Date(e.post_date);
      if (!isNaN(d.getTime())) pubDate = d.toISOString();
    }

    const tags: SubstackTag[] = (e.postTags ?? [])
      .filter((t): t is { name: string; slug: string } => !!t?.name && !!t?.slug && !t.hidden)
      .map((t) => ({ name: t.name, slug: t.slug }));

    const type: SubstackPostType = e.type === "podcast" ? "podcast" : "post";

    return {
      title: e.title?.trim() || "Untitled",
      link: e.canonical_url || "#",
      description: stripHtml(e.description || e.subtitle || ""),
      pubDate,
      image: e.cover_image || "",
      type,
      tags,
    };
  });

  return typeof limit === "number" ? posts.slice(0, limit) : posts;
}
