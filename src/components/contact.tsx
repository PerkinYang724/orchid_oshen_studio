"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

const socialLinks = [
  { label: "Email", href: "mailto:p@oshenstudio.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/perkin0909/" },
  { label: "Instagram", href: "https://www.instagram.com/oshen_studio/" },
];

export function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" className="relative py-32 sm:py-40 px-6">
      <div ref={ref} className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0, 1] }}
          className="glass-strong rounded-[2rem] p-10 sm:p-16 lg:p-20 noise relative overflow-hidden text-center"
        >
          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-blue-500/[0.06] blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.4, 0, 1] }}
              className="text-[13px] font-medium tracking-[0.25em] uppercase text-white/20 mb-8"
            >
              Connect
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0, 1] }}
              className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            >
              Let&apos;s build something
              <br />
              <span className="gradient-text-ocean">intentional.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.4, 0, 1] }}
              className="text-white/35 text-base sm:text-lg max-w-md mx-auto mb-12 leading-relaxed font-light"
            >
              Whether it&apos;s a collaboration, a conversation, or a new idea
              &mdash; I&apos;d love to hear from you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.4, 0, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
            >
              <a
                href="mailto:p@oshenstudio.com"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#050507] text-sm font-semibold hover:bg-white/90 transition-all duration-300"
              >
                Get in Touch
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center justify-center gap-8"
            >
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[13px] text-white/25 hover:text-white/60 transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
