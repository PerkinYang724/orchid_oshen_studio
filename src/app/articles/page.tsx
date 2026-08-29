import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/home/site-footer";
import { ArticlesExplorer } from "@/components/articles-explorer";
import { getAllEpisodes } from "@/lib/episodes";
import { getSubstackPosts } from "@/lib/substack";
import { getMessages } from "@/i18n/server";
import { localizeEpisodes, localizeTopics } from "@/i18n/localize";

const ACCENT = "#E2603D";
const SUBSTACK = "https://substack.com/@perkin0909";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMessages();
  return {
    title: m.meta.newsletterTitle,
    description: m.meta.newsletterDescription,
    alternates: { canonical: "/articles" },
  };
}

export default async function ArticlesPage() {
  const messages = await getMessages();

  // Nav data, identical to the home page so the menu behaves the same.
  const rawEpisodes = getAllEpisodes();
  const allEpisodes = localizeEpisodes(rawEpisodes, messages);
  const latestEpisode = allEpisodes[allEpisodes.length - 1];
  const navTopics = localizeTopics(messages).map((tp) => ({
    slug: tp.slug,
    name: tp.name,
  }));

  // Every written article. Podcast episodes live in the site's podcast section,
  // so exclude audio cross-posts and anything tagged "still human podcast".
  const posts = (await getSubstackPosts()).filter(
    (p) =>
      p.type !== "podcast" &&
      !p.tags.some((t) => t.slug === "still-human-podcast")
  );

  return (
    <div className="relative z-10 min-h-screen bg-[#FAF8F5]">
      <Navbar light topics={navTopics} latestEpisodeSlug={latestEpisode?.slug} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-20 sm:pb-24">
        {/* Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <p
            className="text-[12px] font-semibold tracking-[0.25em] uppercase mb-4"
            style={{ color: ACCENT }}
          >
            {messages.articlesPage.sectionLabel}
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#161310] leading-[1.05] mb-5">
            {messages.articlesPage.headingPre}{" "}
            <span style={{ color: ACCENT }}>{messages.articlesPage.headingPost}</span>
          </h1>
          <p className="text-[#161310]/55 text-lg leading-relaxed">
            {messages.articlesPage.intro}
          </p>
        </div>

        <ArticlesExplorer posts={posts} />

        {/* Subscribe CTA */}
        <div className="mt-16 sm:mt-20 pt-12 border-t border-[#161310]/[0.08] text-center">
          <p className="text-[#161310]/55 text-base mb-5">
            {messages.articlesPage.ctaBody}
          </p>
          <a
            href={SUBSTACK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ backgroundColor: ACCENT }}
          >
            {messages.articlesPage.ctaButton}
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
