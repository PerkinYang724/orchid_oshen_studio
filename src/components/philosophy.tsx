"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function Philosophy() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-32 sm:py-44 px-6 overflow-hidden">
      {/* Centered ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-500/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div ref={ref} className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.25, 0.4, 0, 1] }}
        >
          <p className="text-[13px] font-medium tracking-[0.25em] uppercase text-white/20 mb-10">
            Philosophy
          </p>
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.15, ease: [0.25, 0.4, 0, 1] }}
          className="relative"
        >
          <p className="text-3xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.15] text-white/80">
            Technology should not
            <br />
            replace us.
          </p>
          <p className="text-3xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.15] mt-4 gradient-text-ocean">
            It should return us
            <br />
            to ourselves.
          </p>
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-12 w-12 h-[1px] bg-white/10 mx-auto"
        />
      </div>
    </section>
  );
}
