"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const timeline = [
  { year: "2026", label: "Launched Still Human Podcast" },
  { year: "2025", label: "Founded Oshen Studio" },
  { year: "2025", label: "VP of AI Collaborate" },
  { year: "2024", label: "Vibe Code my first app" },
];

export function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="relative py-32 sm:py-40 px-6">
      <div ref={ref} className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0, 1] }}
        >
          <p className="text-[13px] font-medium tracking-[0.25em] uppercase text-white/25 mb-4">
            About
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-8 max-w-2xl">
            Building at the edge of{" "}
            <span className="gradient-text">AI and humanity.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-16 mt-16">
          {/* Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.25, 0.4, 0, 1],
            }}
            className="lg:col-span-3 space-y-6"
          >
            <p className="text-white/45 leading-[1.8] text-base">
              I&apos;m a tech founder, cinematic creator, and systems thinker.
              My work sits at the intersection of artificial intelligence,
              automation, and storytelling &mdash; building tools and content
              that help people reclaim their time, clarity, and creativity.
            </p>
            <p className="text-white/45 leading-[1.8] text-base">
              Through Oshen Studio, I design AI-powered systems for creators and
              businesses. Through Still Human, I explore what it means to stay
              connected to our humanity as technology accelerates. Every project
              I build starts with one question: does this give time back?
            </p>
            <p className="text-white/45 leading-[1.8] text-base">
              My approach draws from minimalism and intentionality. Reduce
              complexity to reveal clarity. Automate the repetitive to amplify
              the meaningful. Build systems that serve humans, not the other way
              around.
            </p>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.25, 0.4, 0, 1],
            }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-3xl p-8 noise relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-sm font-semibold text-white/50 mb-8 tracking-wide">
                  Journey
                </h3>
                <div className="space-y-6">
                  {timeline.map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <span className="text-[13px] font-mono text-white/20 mt-0.5 w-10 flex-shrink-0">
                        {item.year}
                      </span>
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400/40 mt-1.5 flex-shrink-0" />
                        <span className="text-sm text-white/50 leading-relaxed">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
