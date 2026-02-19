"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Newsletter",
    description:
      "A newsletter about the future of work and how to build a life you love.",
    tag: "Newsletter",
    gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
    accent: "bg-blue-400",
    href: "https://substack.com/@perkin0909", // ← put the project link here
  },
  {
    title: "Still Human Podcast",
    description:
      "Exploring the intersection of AI and humanity. Conversations about staying human in an accelerating world.",
    tag: "Podcast",
    gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
    accent: "bg-purple-400",
    href: "#podcast", // scrolls to podcast section on this page
  },
  {
    title: "AI Collaborate",
    description:
      "A student-led organization empowering the next generation to build responsibly with artificial intelligence.",
    tag: "Community",
    gradient: "from-orange-500/15 via-amber-500/10 to-transparent",
    accent: "bg-orange-400",
    href: "https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.scuaiclub.com/&ved=2ahUKEwiI1L6ekeGSAxVgFjQIHff5EeQQFnoECA0QAQ&usg=AOvVaw3V52hj8ubYOsqwXiRb10zl",
  },
  {
    title: "Automation Systems",
    description:
      "Custom workflows with n8n, Supabase, and AI agents. Turning repetitive processes into effortless systems. (coming soon)",
    tag: "Automation",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    accent: "bg-cyan-400",
    href: "",
  },
];

export function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" className="relative py-32 sm:py-40 px-6">
      <div ref={ref} className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-16 sm:mb-20"
        >
          <p className="text-[13px] font-medium tracking-[0.25em] uppercase text-white/25 mb-4">
            Selected Work
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Featured{" "}
            <span className="gradient-text">Projects</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 pb-12">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const cardContent = (
    <div className="group relative glass-card rounded-3xl p-8 sm:p-10 overflow-hidden cursor-pointer noise min-h-[220px] flex flex-col justify-between">
      {/* Hover gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full ${project.accent} opacity-60`}
            />
            <span className="text-[11px] font-medium tracking-wider uppercase text-white/30">
              {project.tag}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center group-hover:bg-white/[0.06] group-hover:border-white/[0.15] transition-all duration-300">
            <ArrowUpRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white/70 transition-colors" />
          </div>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white/90 group-hover:text-white transition-colors mb-3">
          {project.title}
        </h3>
        <p className="text-sm text-white/35 leading-relaxed max-w-md group-hover:text-white/50 transition-colors duration-500">
          {project.description}
        </p>
      </div>
    </div>
  );

  const wrapperClass = index === 0 ? "md:col-span-2" : "";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.35,
        delay: index * 0.04,
        ease: "easeOut",
      }}
      className={wrapperClass}
    >
      {project.href ? (
        project.href.startsWith("http") ? (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            {cardContent}
          </a>
        ) : (
          <Link href={project.href} className="block">
            {cardContent}
          </Link>
        )
      ) : (
        cardContent
      )}
    </motion.div>
  );
}
