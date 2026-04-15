import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const showNotesDir = path.join(process.cwd(), "show-notes");

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

export function getEpisodeBySlug(slug: string): Episode | null {
  const files = fs
    .readdirSync(showNotesDir)
    .filter((f) => f.endsWith(".md") && !f.includes("TEMPLATE"));

  for (const filename of files) {
    const raw = fs.readFileSync(path.join(showNotesDir, filename), "utf8");
    const { data, content } = matter(raw);
    if (data.slug === slug) {
      const contentHtml = marked(content) as string;
      return { ...(data as EpisodeMeta), contentHtml };
    }
  }
  return null;
}

export function getAllSlugs(): string[] {
  return getAllEpisodes().map((ep) => ep.slug);
}
