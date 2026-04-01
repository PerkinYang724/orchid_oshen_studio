"use client";

import { m, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, Music2, Youtube } from "lucide-react";

export function NewsletterCta() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-20 sm:py-28 px-6 border-t border-white/[0.05]"
    >
      <div className="max-w-3xl mx-auto">
        <m.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0, 1] }}
          className="glass-strong rounded-3xl p-10 sm:p-14 noise relative overflow-hidden text-center"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-500/[0.07] to-transparent rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-blue-500/[0.05] to-transparent rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <p className="text-[11px] font-medium tracking-[0.35em] uppercase text-white/20 mb-4">
              Never miss an episode
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
              Stay Human
            </h2>
            <p className="text-white/35 text-base sm:text-lg leading-relaxed mb-10 max-w-md mx-auto">
              New episodes every two weeks. Subscribe on Substack for show notes,
              or follow on your platform of choice.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://substack.com/@perkin0909"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors duration-200"
              >
                Subscribe on Substack
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <div className="flex gap-3">
                <a
                  href="https://open.spotify.com/show/2JdDo1zeJ2fyO5wxxS7ikN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-full border border-white/[0.1] bg-white/[0.03] text-white/55 hover:text-white hover:bg-white/[0.07] text-sm font-medium transition-all duration-200"
                >
                  <Music2 className="w-4 h-4 text-[#1DB954]" />
                  Spotify
                </a>
                <a
                  href="https://youtube.com/@oshen.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-full border border-white/[0.1] bg-white/[0.03] text-white/55 hover:text-white hover:bg-white/[0.07] text-sm font-medium transition-all duration-200"
                >
                  <Youtube className="w-4 h-4 text-[#FF0000]" />
                  YouTube
                </a>
              </div>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}
