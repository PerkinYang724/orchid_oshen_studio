import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import type { Locale } from "@/i18n/types";

const showNotesDir = path.join(process.cwd(), "show-notes");
const localeDirs: Record<Locale, string> = {
  en: showNotesDir,
  "zh-TW": path.join(showNotesDir, "zh-TW"),
};

export type EpisodeMeta = {
  slug: string;
  number: string;
  title: string;
  guest: string;
  duration: string;
  youtubeId: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string;
  publishDate: string;
  topics?: string[];
  // The episode title as it appears in the public RSS / Spotify feed.
  // Used to match against feed entries when the on-site title has been
  // rewritten and no longer shares enough words for fuzzy matching.
  feedTitle?: string;
};

export type Timestamp = {
  time: string; // "HH:MM:SS" or "MM:SS" as written
  seconds: number;
  label: string;
};

export type Episode = EpisodeMeta & {
  contentHtml: string;
  timestamps: Timestamp[];
};

function toSeconds(t: string): number {
  const parts = t.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

/** Extract `- `[HH:MM:SS]` — Label` rows from the markdown's Timestamps section. */
function parseTimestamps(md: string): Timestamp[] {
  const section = md.match(/##\s*Timestamps([\s\S]*?)(?=\n##\s|\n*$)/i);
  if (!section) return [];
  const out: Timestamp[] = [];
  for (const raw of section[1].split("\n")) {
    const li = raw.match(/^\s*[-*]\s+(.*)$/);
    if (!li) continue;
    const item = li[1].replace(/`/g, "").trim();
    const tm = item.match(/^\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?\s*[—–-]\s*(.+)$/);
    if (tm) out.push({ time: tm[1], seconds: toSeconds(tm[1]), label: tm[2].trim() });
  }
  return out;
}

/** Remove the Timestamps section (and its leading divider) so it isn't duplicated. */
function stripTimestampsSection(md: string): string {
  return md.replace(/\n*-{3,}\s*\n+##\s*Timestamps[\s\S]*?(?=\n##\s|\n*$)/i, "\n\n");
}

export function getAllEpisodes(): EpisodeMeta[] {
  const files = fs
    .readdirSync(showNotesDir)
    .filter((f) => f.endsWith(".md") && !f.includes("TEMPLATE"));

  return files
    .map((filename) => {
      const raw = fs.readFileSync(path.join(showNotesDir, filename), "utf8");
      const { data } = matter(raw);
      return data as EpisodeMeta;
    })
    .filter((ep) => ep.slug)
    .sort((a, b) => a.number.localeCompare(b.number));
}

export function getEpisodeBySlug(slug: string, locale: Locale = "en"): Episode | null {
  const files = fs
    .readdirSync(showNotesDir)
    .filter((f) => f.endsWith(".md") && !f.includes("TEMPLATE"));

  for (const filename of files) {
    const raw = fs.readFileSync(path.join(showNotesDir, filename), "utf8");
    const { data, content: enBody } = matter(raw);
    if (data.slug !== slug) continue;

    let body = enBody;
    if (locale !== "en") {
      const localePath = path.join(localeDirs[locale], filename);
      if (fs.existsSync(localePath)) {
        const localeRaw = fs.readFileSync(localePath, "utf8");
        const { content: localeBody } = matter(localeRaw);
        if (localeBody.trim()) body = localeBody;
      }
    }

    // Timestamps render in their own tab — parse from the shown body, falling
    // back to the English body (the times are language-neutral).
    let timestamps = parseTimestamps(body);
    if (timestamps.length === 0 && body !== enBody) timestamps = parseTimestamps(enBody);

    const contentHtml = marked(stripTimestampsSection(body)) as string;
    return { ...(data as EpisodeMeta), contentHtml, timestamps };
  }
  return null;
}

export function getAllSlugs(): string[] {
  return getAllEpisodes().map((ep) => ep.slug);
}
