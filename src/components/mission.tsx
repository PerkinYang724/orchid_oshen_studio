"use client";

import { m, useInView } from "framer-motion";
import { useRef } from "react";

export function Mission() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-24 sm:py-36 px-6 border-t border-white/[0.05]"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-blue-500/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <m.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0, 1] }}
        >
          <p className="text-[11px] font-medium tracking-[0.35em] uppercase text-white/20 mb-6">
            Mission
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-8">
            <span className="text-white">Technology should not</span>
            <br />
            <span className="gradient-text">replace us.</span>
          </h2>
          <p className="text-white/40 text-base sm:text-lg leading-relaxed mb-5">
            We&apos;re living through the most accelerating period in human history.
            AI is reshaping every industry, every relationship, every definition
            of what it means to be useful, creative, or valuable.
          </p>
          <p className="text-white/30 text-sm sm:text-base leading-relaxed">
            Still Human goes to the people on the frontier — the founders, scientists,
            engineers, and researchers navigating this shift — and asks them one question:
            how do you stay whole?
          </p>
        </m.div>
      </div>
    </section>
  );
}
