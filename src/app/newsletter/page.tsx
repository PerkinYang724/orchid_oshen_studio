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

  // Written articles only for the rolling preview — podcast episodes already
  // live in the site's dedicated podcast section. Exclude both audio cross-posts
  // and anything tagged "still human podcast".
  const posts = (await getSubstackPosts()).filter(
    (p) =>
      p.type !== "podcast" &&
      !p.tags.some((t) => t.slug === "still-human-podcast")
  );

  return (
    <div className="relative z-10 min-h-screen bg-[#FAF8F5]">
      <Navbar light topics={navTopics} latestEpisodeSlug={latestEpisode?.slug} />
      <NewsletterContent posts={posts} />
      <SiteFooter />
    </div>
  );
}
