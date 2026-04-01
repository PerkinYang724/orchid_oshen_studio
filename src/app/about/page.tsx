import type { Metadata } from "next";
import { Music2, Youtube, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About — Still Human Podcast",
  description:
    "Still Human is a podcast about AI, humanity, and the spaces between. Hosted by Perkin of Oshen Studio.",
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#050507]">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(41,151,255,0.05) 0%, transparent 50%), #050507",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-32 pb-24">
        <a
          href="/"
          className="text-[13px] font-medium text-white/30 hover:text-white/60 transition-colors mb-12 inline-block"
        >
          ← Still Human
        </a>

        {/* Hero */}
        <div className="mb-20">
          <p className="text-[12px] font-medium tracking-[0.25em] uppercase text-white/20 mb-4">
            About
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6">
            Still <span className="gradient-text">Human</span>
          </h1>
          <p className="text-white/50 text-xl leading-relaxed font-light">
            A podcast for the people living on the edge of the AI era —
            and everyone trying to figure out where they stand.
          </p>
        </div>

        {/* The show */}
        <div className="space-y-12">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">The Show</h2>
            <div className="space-y-4 text-white/40 text-base leading-relaxed">
              <p>
                Still Human is a podcast exploring what it means to stay human as AI
                reshapes everything we know — work, creativity, identity, relationships,
                and the very definition of value.
              </p>
              <p>
                Each episode is a conversation with a builder, scientist, founder, or
                researcher who is navigating this moment from the inside. Not pundits.
                Not speculators. People actually doing the work.
              </p>
              <p>
                We talk about the technical, the personal, and everything between.
                We ask hard questions. We sit with uncomfortable answers.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.06]" />

          {/* The host */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">The Host</h2>
            <div className="space-y-4 text-white/40 text-base leading-relaxed">
              <p>
                Perkin is the founder of Oshen Studio — a studio at the intersection
                of AI, automation, and intentional storytelling. He builds AI-powered
                systems by day and tries to understand what they mean for us by night.
              </p>
              <p>
                Still Human started from a simple frustration: most conversations about
                AI were either naively optimistic or catastrophically pessimistic.
                Neither felt honest. The podcast is Perkin&apos;s attempt to find the
                more complicated, more human truth.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.06]" />

          {/* Listen */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Listen & Watch</h2>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://open.spotify.com/show/2JdDo1zeJ2fyO5wxxS7ikN"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full border border-white/[0.1] bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] text-sm font-medium transition-all duration-200"
              >
                <Music2 className="w-4 h-4 text-[#1DB954]" />
                Spotify
              </a>
              <a
                href="https://youtube.com/@oshen.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full border border-white/[0.1] bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] text-sm font-medium transition-all duration-200"
              >
                <Youtube className="w-4 h-4 text-[#FF0000]" />
                YouTube
              </a>
              <a
                href="https://substack.com/@perkin0909"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full border border-white/[0.1] bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] text-sm font-medium transition-all duration-200"
              >
                <ArrowUpRight className="w-4 h-4" />
                Substack
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.06]" />

          {/* Contact */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-white/40 text-base leading-relaxed mb-5">
              Guest pitches, partnerships, or just want to say something honest?
            </p>
            <a
              href="mailto:p@oshenstudio.com"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium underline underline-offset-4 transition-colors"
            >
              p@oshenstudio.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
