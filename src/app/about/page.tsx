import type { Metadata } from "next";
import Image from "next/image";
import { Music2, Youtube, ArrowUpRight } from "lucide-react";
import { getMessages } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMessages();
  return {
    title: m.meta.aboutTitle,
    description: m.meta.aboutDescription,
  };
}

export default async function AboutPage() {
  const m = await getMessages();
  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-32 pb-24">
        <a
          href="/"
          className="text-[13px] font-medium text-white/30 hover:text-white/60 transition-colors mb-12 inline-block"
        >
          {m.about.backToHome}
        </a>

        {/* Hero */}
        <div className="mb-20">
          <p className="text-[12px] font-medium tracking-[0.25em] uppercase text-white/20 mb-4">
            {m.about.label}
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6">
            Still <span className="gradient-text">Human</span>
          </h1>
          <p className="text-white/50 text-xl leading-relaxed font-light">
            {m.about.tagline}
          </p>
        </div>

        {/* The show */}
        <div className="space-y-12">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">{m.about.showHeading}</h2>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-2xl overflow-hidden border border-white/[0.08]">
                <Image
                  src="/icon-192.png"
                  alt={m.about.photoAltCover}
                  fill
                  sizes="(min-width: 640px) 160px, 128px"
                  className="object-cover"
                />
              </div>
              <div className="space-y-4 text-white/40 text-base leading-relaxed">
                <p>{m.about.showP1}</p>
                <p>{m.about.showP2}</p>
                <p>{m.about.showP3}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.06]" />

          {/* The host */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">{m.about.hostHeading}</h2>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-2xl overflow-hidden border border-white/[0.08]">
                <Image
                  src="/profile-photo.jpg"
                  alt={m.about.photoAltHost}
                  fill
                  sizes="(min-width: 640px) 160px, 128px"
                  className="object-cover"
                />
              </div>
              <div className="space-y-4 text-white/40 text-base leading-relaxed">
                <p>{m.about.hostP1}</p>
                <p>{m.about.hostP2}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.06]" />

          {/* Listen */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6">{m.about.listenWatch}</h2>
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
            <h2 className="text-xl font-bold text-white mb-4">{m.about.contactHeading}</h2>
            <p className="text-white/40 text-base leading-relaxed mb-5">
              {m.about.contactBody}
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
