import type { Metadata } from "next";
import { ArrowUpRight, Music2, Youtube } from "lucide-react";

export const metadata: Metadata = {
  title: "Subscribe — Still Human Podcast",
  description:
    "Subscribe to Still Human — bi-weekly conversations about AI, humanity, and the spaces between. On Spotify, YouTube, and Substack.",
};

export default function NewsletterPage() {
  return (
    <div className="relative min-h-screen bg-[#050507] flex items-center">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(120,80,255,0.06) 0%, transparent 60%), #050507",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-32 text-center w-full">
        <a
          href="/"
          className="text-[13px] font-medium text-white/30 hover:text-white/60 transition-colors mb-12 inline-block"
        >
          ← Still Human
        </a>

        <p className="text-[12px] font-medium tracking-[0.3em] uppercase text-white/20 mb-5">
          Subscribe
        </p>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6">
          Stay <span className="gradient-text">Human</span>
        </h1>
        <p className="text-white/40 text-lg leading-relaxed mb-14 max-w-md mx-auto">
          New episodes every two weeks. Show notes, key ideas, and links from
          every conversation — in your inbox via Substack.
        </p>

        {/* Primary CTA */}
        <div className="glass-strong rounded-3xl p-8 sm:p-12 noise mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-500/[0.08] to-transparent rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10">
            <p className="text-sm font-medium text-white/40 mb-6">
              Subscribe on Substack for show notes delivered to your inbox
            </p>
            <a
              href="https://substack.com/@perkin0909"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-black text-sm font-bold hover:bg-white/90 transition-colors duration-200"
            >
              Subscribe on Substack
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Platform links */}
        <p className="text-[13px] text-white/25 mb-5">Or follow on your platform</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://open.spotify.com/show/2JdDo1zeJ2fyO5wxxS7ikN"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full border border-white/[0.1] bg-white/[0.03] text-white/55 hover:text-white hover:bg-white/[0.07] text-sm font-medium transition-all duration-200"
          >
            <Music2 className="w-4 h-4 text-[#1DB954]" />
            Spotify
          </a>
          <a
            href="https://youtube.com/@oshen.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full border border-white/[0.1] bg-white/[0.03] text-white/55 hover:text-white hover:bg-white/[0.07] text-sm font-medium transition-all duration-200"
          >
            <Youtube className="w-4 h-4 text-[#FF0000]" />
            YouTube
          </a>
          <a
            href="https://www.linkedin.com/in/perkin0909/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full border border-white/[0.1] bg-white/[0.03] text-white/55 hover:text-white hover:bg-white/[0.07] text-sm font-medium transition-all duration-200"
          >
            LinkedIn
          </a>
          <a
            href="https://www.instagram.com/oshen_studio/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full border border-white/[0.1] bg-white/[0.03] text-white/55 hover:text-white hover:bg-white/[0.07] text-sm font-medium transition-all duration-200"
          >
            Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
