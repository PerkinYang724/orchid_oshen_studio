"use client";

import Link from "next/link";

const ACCENT = "#E2603D";

export type EpisodeCardData = {
  href: string;
  cover: string;
  fallbackCover?: string;
  epNumber: string;
  eyebrow: string;
  title: string;
  guest?: string;
  description?: string;
};

/**
 * Presentational episode card used by the Latest and Featured sections.
 * Light theme: cream surface, ink text, terracotta eyebrow.
 */
export function EpisodeCard({
  data,
  size = "md",
}: {
  data: EpisodeCardData;
  size?: "md" | "lg";
}) {
  const { href, cover, fallbackCover, epNumber, eyebrow, title, guest, description } = data;
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#161310]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          onError={(e) => {
            if (fallbackCover && e.currentTarget.src !== fallbackCover) {
              e.currentTarget.src = fallbackCover;
            }
          }}
          alt={`${guest ?? title}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 text-[11px] font-mono text-white/90 bg-black/45 backdrop-blur-sm px-2 py-1 rounded">
          EP {epNumber}
        </span>
      </div>

      <p
        className="mt-4 text-[11px] font-semibold tracking-[0.18em] uppercase"
        style={{ color: ACCENT }}
      >
        {eyebrow}
      </p>
      <h3
        className={`mt-1.5 font-bold tracking-tight text-[#161310] leading-snug transition-colors group-hover:text-[#C9512F] ${
          size === "lg" ? "text-xl sm:text-2xl line-clamp-3" : "text-lg line-clamp-2"
        }`}
      >
        {title}
      </h3>
      {guest && (
        <p className="mt-1.5 text-[13px] font-medium text-[#161310]/45">{guest}</p>
      )}
      {description && (
        <p className="mt-2 text-sm leading-relaxed text-[#161310]/55 line-clamp-2">
          {description}
        </p>
      )}
    </Link>
  );
}
