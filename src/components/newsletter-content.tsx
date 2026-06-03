"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowRight, Music2, Youtube, Instagram, Linkedin } from "lucide-react";
import { useLocale } from "@/i18n/client";
import type { SubstackPost } from "@/lib/substack";
import { ArticlesMarquee } from "./articles-marquee";

const ACCENT = "#E2603D";

const SUBSTACK = "https://substack.com/@perkin0909";

const PLATFORMS = [
  {
    label: "Spotify",
    href: "https://open.spotify.com/show/2JdDo1zeJ2fyO5wxxS7ikN",
    Icon: Music2,
    iconColor: "#1DB954",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@oshen.studio",
    Icon: Youtube,
    iconColor: "#FF0000",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/perkin0909/",
    Icon: Linkedin,
    iconColor: "#0A66C2",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/oshen_studio/",
    Icon: Instagram,
    iconColor: "#E1306C",
  },
];

export function NewsletterContent({ posts }: { posts: SubstackPost[] }) {
  const { m } = useLocale();

  return (
    <main>
      {/* ── Hero ── */}
      <section className="px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-12 sm:pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-[12px] font-semibold tracking-[0.25em] uppercase mb-5"
            style={{ color: ACCENT }}
          >
            {m.newsletterPage.sectionLabel}
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#161310] leading-[1.05] mb-6">
            {m.newsletterPage.headingPre}{" "}
            <span style={{ color: ACCENT }}>{m.newsletterPage.headingPost}</span>
          </h1>
          <p className="text-[#161310]/55 text-lg leading-relaxed max-w-xl mx-auto">
            {m.newsletterPage.intro}
          </p>
        </div>
      </section>

      {/* ── Subscribe band (mirrors the home page newsletter section) ── */}
      <section className="bg-[#161310] px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[300px_1fr] lg:grid-cols-[340px_1fr] gap-10 sm:gap-16 items-center">
          {/* Lead-magnet card */}
          <div className="flex justify-center md:justify-start">
            <div className="w-56 sm:w-64 aspect-[3/4] rounded-2xl bg-gradient-to-br from-[#2a231d] to-[#161310] border border-white/[0.08] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)] flex flex-col justify-between p-7">
              <span
                className="inline-flex w-fit items-center border-2 px-2.5 py-1 rounded-[5px] text-[10px] font-extrabold tracking-[0.24em] uppercase"
                style={{ color: ACCENT, borderColor: ACCENT }}
              >
                Still&nbsp;Human
              </span>
              <div>
                <p className="text-white text-2xl font-bold leading-tight">
                  {m.home.newsletterHeading}
                </p>
                <p className="text-white/40 text-[13px] mt-3 font-mono tracking-wide uppercase">
                  {m.newsletterCta.label}
                </p>
              </div>
            </div>
          </div>

          {/* Copy + CTA */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.08] mb-5 max-w-xl">
              {m.home.newsletterHeading}
            </h2>
            <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              {m.newsletterPage.substackCardBody}
            </p>
            <a
              href={SUBSTACK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110"
              style={{ backgroundColor: ACCENT }}
            >
              {m.newsletterPage.subscribeSubstack}
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Rolling preview of every article, straight from the Substack feed ── */}
      <section className="pt-16 sm:pt-24 pb-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#161310] mb-2">
                {m.newsletterPage.previewHeading}
              </h2>
              <p className="text-[#161310]/55 text-[15px] leading-relaxed max-w-lg">
                {m.newsletterPage.previewSubtitle}
              </p>
            </div>
            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap transition-colors hover:opacity-80"
              style={{ color: ACCENT }}
            >
              {m.newsletterPage.previewViewAll}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {posts.length === 0 ? (
          <p className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-[#161310]/40 text-sm">
            {m.newsletterPage.previewEmpty}
          </p>
        ) : (
          <ArticlesMarquee posts={posts} />
        )}
      </section>

      {/* ── Follow elsewhere ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[#161310]/40 mb-7">
            {m.newsletterPage.orFollow}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {PLATFORMS.map(({ label, href, Icon, iconColor }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full border border-[#161310]/[0.1] bg-[#161310]/[0.02] text-[#161310]/70 hover:text-[#161310] hover:bg-[#161310]/[0.05] text-sm font-medium transition-all duration-200"
              >
                <Icon className="w-4 h-4" style={{ color: iconColor }} />
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
