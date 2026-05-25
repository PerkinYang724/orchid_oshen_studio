"use client";

import { Music2 } from "lucide-react";
import { useLocale } from "@/i18n/client";

const SHOW_SPOTIFY = "https://open.spotify.com/show/2JdDo1zeJ2fyO5wxxS7ikN";

type Props = {
  coverImage?: string;
};

export function ShowPromo({ coverImage }: Props) {
  const { m } = useLocale();
  const cover = coverImage || "/journey/stillhumanpodcast.png";

  return (
    <section
      className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
      style={{
        background:
          "linear-gradient(120deg, #B8421F 0%, #D4542C 45%, #E8884F 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 sm:gap-14 items-center">
        {/* Text */}
        <div className="order-2 md:order-1">
          <p className="text-[12px] font-semibold tracking-[0.25em] uppercase text-white/70 mb-4">
            {m.home.promoEyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.08] mb-5">
            {m.home.promoHeading}
          </h2>
          <p className="text-white/85 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
            {m.home.promoBody}
          </p>
          <a
            href={SHOW_SPOTIFY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#B8421F] hover:bg-white/90 transition-colors"
          >
            <Music2 className="w-4 h-4 text-[#1DB954]" />
            {m.home.promoCta}
          </a>
        </div>

        {/* Cover art */}
        <div className="order-1 md:order-2 flex justify-center md:justify-end">
          <div className="w-56 sm:w-72 aspect-square rounded-2xl overflow-hidden shadow-[0_40px_80px_-20px_rgba(60,15,0,0.55)] rotate-[-2deg]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt={m.about.photoAltCover}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
