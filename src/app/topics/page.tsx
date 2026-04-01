import type { Metadata } from "next";
import { ArrowUpRight, Cpu, Rocket, User, FlaskConical, Brain, Telescope } from "lucide-react";

const TOPIC_ICONS: Record<string, React.ElementType> = {
  "ai-technology": Cpu,
  "entrepreneurship": Rocket,
  "identity-humanity": User,
  "science-engineering": FlaskConical,
  "mental-resilience": Brain,
  "space-future": Telescope,
};
import { TOPICS, getTopicStyle } from "@/lib/topics";
import { getAllEpisodes } from "@/lib/episodes";

export const metadata: Metadata = {
  title: "Topics — Still Human Podcast",
  description:
    "Browse Still Human episodes by topic — AI & Technology, Entrepreneurship, Identity & Humanity, Science, Mental Resilience, and Space.",
};

export default function TopicsPage() {
  const episodes = getAllEpisodes();

  return (
    <div className="relative min-h-screen bg-[#050507]">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(41,151,255,0.05) 0%, transparent 50%), #050507",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24">
        {/* Header */}
        <div className="mb-16">
          <a
            href="/"
            className="text-[13px] font-medium text-white/30 hover:text-white/60 transition-colors mb-8 inline-block"
          >
            ← Still Human
          </a>
          <p className="text-[12px] font-medium tracking-[0.25em] uppercase text-white/20 mb-4">
            Browse
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-5">
            All <span className="gradient-text">Topics</span>
          </h1>
          <p className="text-white/35 text-lg max-w-xl leading-relaxed">
            Every conversation on Still Human touches on one or more of these themes.
            Start with what pulls you most.
          </p>
        </div>

        {/* Topics grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {TOPICS.map((topic) => {
            const style = getTopicStyle(topic.slug);
            const count = episodes.filter((ep) =>
              (ep.topics ?? []).includes(topic.slug)
            ).length;
            const topicEpisodes = episodes
              .filter((ep) => (ep.topics ?? []).includes(topic.slug))
              .slice(-2)
              .reverse();

            return (
              <a
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className={`group relative rounded-2xl p-7 border transition-all duration-300 overflow-hidden noise ${style.card}`}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${style.badge} border`}>
                      {(() => { const Icon = TOPIC_ICONS[topic.slug] ?? Cpu; return <Icon className={`w-4 h-4 ${style.badge.split(" ")[0]}`} />; })()}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors mt-1" />
                  </div>

                  <h2 className={`text-xl font-bold mb-2 transition-colors duration-200 ${style.badge.split(" ")[0]} group-hover:text-white`}>
                    {topic.name}
                  </h2>
                  <p className="text-[13px] text-white/35 leading-relaxed mb-5">
                    {topic.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-white/20 font-mono">
                      {count} {count === 1 ? "episode" : "episodes"}
                    </span>
                  </div>

                  {/* Mini episode list */}
                  {topicEpisodes.length > 0 && (
                    <div className="mt-5 pt-5 border-t border-white/[0.06] space-y-2">
                      {topicEpisodes.map((ep) => (
                        <div key={ep.slug} className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-white/20 flex-shrink-0">
                            EP {ep.number}
                          </span>
                          <span className="text-[12px] text-white/40 line-clamp-1">
                            {ep.guest}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
