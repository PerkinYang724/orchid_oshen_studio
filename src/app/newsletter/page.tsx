import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/home/site-footer";
import { NewsletterContent } from "@/components/newsletter-content";
import { getAllEpisodes } from "@/lib/episodes";
import { getSubstackPosts } from "@/lib/substack";
import { getMessages } from "@/i18n/server";
import { localizeEpisodes, localizeTopics } from "@/i18n/localize";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMessages();
  return {
    title: m.meta.newsletterTitle,
    description: m.meta.newsletterDescription,
  };
}

export default async function NewsletterPage() {
  const messages = await getMessages();

  // Same nav data the home page feeds the Navbar, so the menu behaves identically.
  const rawEpisodes = getAllEpisodes(); // sorted oldest → newest
  const allEpisodes = localizeEpisodes(rawEpisodes, messages);
  const latestEpisode = allEpisodes[allEpisodes.length - 1];
  const navTopics = localizeTopics(messages).map((tp) => ({
    slug: tp.slug,
    name: tp.name,
  }));

  // Every article, fetched directly from the Substack feed, for the rolling preview.
  const posts = await getSubstackPosts();

  return (
    <div className="relative z-10 min-h-screen bg-[#FAF8F5]">
      <Navbar light topics={navTopics} latestEpisodeSlug={latestEpisode?.slug} />
      <NewsletterContent posts={posts} />
      <SiteFooter />
    </div>
  );
}
