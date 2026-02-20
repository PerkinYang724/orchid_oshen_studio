"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";

const timeline = [
  {
    year: "2026",
    label: "Launched Still Human Podcast",
    image: "/journey/stillhumanpodcast.png",
  },
  {
    year: "2025",
    label: "Founded Oshen Studio",
    image: "/journey/oshenstudio.jpg",
  },
  {
    year: "2025",
    label: "VP of AI Collaborate",
    image: "/journey/aicollaborate.jpg",
  },
  {
    year: "2024",
    label: "Vibe Code my first app",
    image: "/journey/vibe-code.jpg",
  },
];

export function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
              I&apos;m a tech founder, cinematic creator, and systems thinker
              &mdash; but really, I&apos;m obsessed with one idea: that the best
              technology should feel like freedom.
            </p>
            <p className="text-white/45 leading-[1.8] text-base">
              Through Oshen Studio, I design AI-powered systems for creators and
              businesses. The work is rooted in minimalism &mdash; reduce
              complexity to reveal clarity, automate the repetitive to amplify
              the meaningful.
            </p>
            <p className="text-white/45 leading-[1.8] text-base">
              Through Still Human, my podcast, I explore the other side of that
              equation. Because building smarter systems is only worthwhile if we
              stay connected to what makes us human in the process. Each episode
              is a conversation about creativity, intentionality, and living with
              purpose as the world accelerates around us.
            </p>
            <p className="text-white/45 leading-[1.8] text-base">
              My north star hasn&apos;t changed: does this give time back? If
              yes, I build it. If not, I cut it.
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
              <AnimatePresence>
                {hoveredIndex !== null && (
                  <motion.div
                    key={hoveredIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute inset-0 z-0"
                  >
                    <Image
                      src={timeline[hoveredIndex].image}
                      alt={timeline[hoveredIndex].label}
                      fill
                      className="object-cover blur-[2px]"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="relative z-10">
                <h3 className="text-sm font-semibold text-white/50 mb-8 tracking-wide">
                  Journey
                </h3>
                <div className="space-y-6">
                  {timeline.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 cursor-pointer group"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <span className="text-[13px] font-mono text-white/20 mt-0.5 w-10 flex-shrink-0 transition-colors duration-300 group-hover:text-white/60">
                        {item.year}
                      </span>
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400/40 mt-1.5 flex-shrink-0 transition-colors duration-300 group-hover:bg-blue-400/80" />
                        <span className="text-sm text-white/50 leading-relaxed transition-colors duration-300 group-hover:text-white/90">
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
