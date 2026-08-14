"use client";

import { useLocale } from "@/i18n/client";

const ACCENT = "#E2603D";
const SHOW_ID = "2JdDo1zeJ2fyO5wxxS7ikN";

// Show-level video embed: Spotify always renders the newest episode with video,
// so this stays current without a redeploy when a new episode drops.
const EMBED_SRC = `https://open.spotify.com/embed/show/${SHOW_ID}/video?utm_source=generator`;

export function LatestVideo() {
  const { m } = useLocale();

  return (
    <section className="bg-[#FAF8F5] px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-4 sm:pb-6">
      <div className="max-w-6xl mx-auto">
        <p
          className="text-[12px] font-semibold tracking-[0.18em] uppercase mb-2"
          style={{ color: ACCENT }}
        >
          {m.home.watchEyebrow}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#161310] mb-6 sm:mb-8">
          {m.home.watchHeading}
        </h2>

        <div className="max-w-[624px] overflow-hidden rounded-xl">
          <iframe
            title={m.home.watchHeading}
            src={EMBED_SRC}
            className="w-full aspect-[624/351] border-0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
