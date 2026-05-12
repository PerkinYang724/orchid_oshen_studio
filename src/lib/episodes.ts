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

export type Episode = EpisodeMeta & {
  contentHtml: string;
};

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

    const contentHtml = marked(body) as string;
    return { ...(data as EpisodeMeta), contentHtml };
  }
  return null;
}

export function getAllSlugs(): string[] {
  return getAllEpisodes().map((ep) => ep.slug);
}
