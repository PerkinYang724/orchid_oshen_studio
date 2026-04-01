"use client";

import { m, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, Cpu, Rocket, User, FlaskConical, Brain, Telescope } from "lucide-react";
import type { Topic } from "@/lib/topics";
import { getTopicStyle } from "@/lib/topics";

type Props = {
  topics: Topic[];
  episodeCounts: Record<string, number>;
};

const TOPIC_ICONS: Record<string, React.ElementType> = {
  "ai-technology": Cpu,
  "entrepreneurship": Rocket,
  "identity-humanity": User,
  "science-engineering": FlaskConical,
  "mental-resilience": Brain,
  "space-future": Telescope,
};

export function TopicsPreview({ topics, episodeCounts }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-20 sm:py-28 px-6 border-t border-white/[0.05]"
    >
      <div className="max-w-6xl mx-auto">
        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-white/20 mb-3">
            Explore
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Browse by Topic
          </h2>
        </m.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic, i) => {
            const style = getTopicStyle(topic.slug);
            const count = episodeCounts[topic.slug] ?? 0;
            const Icon = TOPIC_ICONS[topic.slug] ?? Cpu;
            const iconColor = style.badge.split(" ")[0]; // e.g. text-blue-400/80

            return (
              <m.a
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.08 + i * 0.07 }}
                className={`group relative rounded-2xl p-5 sm:p-6 border transition-all duration-300 overflow-hidden noise ${style.card}`}
              >
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-5 ${style.badge} border`}>
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                  </div>

                  <h3 className={`text-sm sm:text-base font-bold mb-2 transition-colors duration-200 ${iconColor} group-hover:text-white`}>
                    {topic.name}
                  </h3>
                  <p className="text-[12px] text-white/30 leading-relaxed line-clamp-2 mb-5 flex-1">
                    {topic.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-white/20 font-mono">
                      {count} {count === 1 ? "episode" : "episodes"}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
                  </div>
                </div>
              </m.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
