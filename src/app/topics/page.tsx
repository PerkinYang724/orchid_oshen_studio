import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Cpu, Rocket, User, FlaskConical, Brain, Telescope } from "lucide-react";
import { TOPICS } from "@/lib/topics";
import { getAllEpisodes } from "@/lib/episodes";
import { getMessages } from "@/i18n/server";
import { localizeEpisodes, localizeTopic, localizeTopics } from "@/i18n/localize";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/home/site-footer";

const ACCENT = "#E2603D";

const TOPIC_ICONS: Record<string, React.ElementType> = {
  "ai-technology": Cpu,
  "entrepreneurship": Rocket,
  "identity-humanity": User,
  "science-engineering": FlaskConical,
  "mental-resilience": Brain,
  "space-future": Telescope,
};

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMessages();
  return {
    title: m.meta.topicsTitle,
    description: m.meta.topicsDescription,
  };
}

export default async function TopicsPage() {
  const m = await getMessages();
  const episodes = getAllEpisodes();

  // Nav data, identical to the home page so the menu behaves the same.
  const allEpisodes = localizeEpisodes(episodes, m);
  const latestSlug = allEpisodes[allEpisodes.length - 1]?.slug;
  const navTopics = localizeTopics(m).map((tp) => ({ slug: tp.slug, name: tp.name }));

  return (
    <div className="relative z-10 min-h-screen bg-[#FAF8F5]">
      <Navbar light topics={navTopics} latestEpisodeSlug={latestSlug} />

      <section className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 sm:pb-20">
        {/* Header */}
        <div className="mb-12 sm:mb-14">
          <p
            className="text-[12px] font-semibold tracking-[0.2em] uppercase mb-4"
            style={{ color: ACCENT }}
          >
            {m.topicsPage.sectionLabel}
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#161310] leading-[1.05] mb-5">
            {m.topicsPage.headingPre}{" "}
            <span style={{ color: ACCENT }}>{m.topicsPage.headingPost}</span>
          </h1>
          <p className="text-[#161310]/55 text-lg max-w-xl leading-relaxed">
            {m.topicsPage.intro}
          </p>
        </div>

        {/* Topics grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {TOPICS.map((rawTopic) => {
            const topic = localizeTopic(rawTopic, m);
            const Icon = TOPIC_ICONS[topic.slug] ?? Cpu;
            const count = episodes.filter((ep) =>
              (ep.topics ?? []).includes(topic.slug)
            ).length;
            const topicEpisodes = episodes
              .filter((ep) => (ep.topics ?? []).includes(topic.slug))
              .slice(-2)
              .reverse();

            return (
              <Link
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className="group relative rounded-2xl p-7 bg-[#F1EDE7] hover:bg-[#EAE4DB] border border-transparent hover:border-[#161310]/[0.08] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#161310]/[0.04] border border-[#161310]/[0.06]">
                    <Icon
                      className="w-5 h-5 text-[#161310]/70 group-hover:text-[#C9512F] transition-colors"
                      strokeWidth={1.5}
                    />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#161310]/25 group-hover:text-[#C9512F] transition-colors mt-1" />
                </div>

                <h2 className="text-xl font-bold mb-2 text-[#161310] tracking-tight">
                  {topic.name}
                </h2>
                <p className="text-[13px] text-[#161310]/55 leading-relaxed mb-5">
                  {topic.description}
                </p>

                <span className="text-[11px] text-[#161310]/40 font-mono">
                  {count} {count === 1 ? m.topicsPage.episode : m.topicsPage.episodes}
                </span>

                {/* Mini episode list */}
                {topicEpisodes.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-[#161310]/[0.08] space-y-2">
                    {topicEpisodes.map((ep) => (
                      <div key={ep.slug} className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#161310]/40 flex-shrink-0">
                          EP {ep.number}
                        </span>
                        <span className="text-[12px] text-[#161310]/60 line-clamp-1">
                          {ep.guest}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
