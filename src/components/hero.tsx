"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + i * 0.15,
      duration: 0.9,
      ease: [0.25, 0.4, 0, 1],
    },
  }),
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-14 overflow-hidden">
      {/* Ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[900px] h-[500px] bg-gradient-to-b from-blue-500/[0.06] via-cyan-500/[0.03] to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-purple-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl text-center"
      >
        <motion.p
          custom={0}
          variants={fadeUp}
          className="text-[13px] font-medium tracking-[0.25em] uppercase text-white/30 mb-8"
        >
          AI &middot; Automation &middot; Storytelling
        </motion.p>

        <motion.h1
          custom={1}
          variants={fadeUp}
          className="text-5xl sm:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-[1.05] mb-8"
        >
          <span className="text-white">Building Systems</span>
          <br />
          <span className="text-white">That </span>
          <span className="gradient-text-ocean">Give Time Back.</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          className="text-lg sm:text-xl text-white/40 max-w-xl mx-auto leading-relaxed mb-14 font-light"
        >
          Designing with AI to reclaim clarity, creativity, and the things that
          matter. Technology should return us to ourselves.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="group relative px-8 py-3.5 rounded-full bg-white text-[#050507] text-sm font-semibold hover:bg-white/90 transition-all duration-300"
          >
            View Projects
          </a>
          <a
            href="#podcast"
            className="px-8 py-3.5 rounded-full text-sm font-medium text-white/60 hover:text-white border border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.04] transition-all duration-300"
          >
            Listen to Podcast
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/20">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-6 bg-gradient-to-b from-white/25 to-transparent"
        />
      </motion.div>
    </section>
  );
}
