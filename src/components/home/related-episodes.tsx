"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/i18n/client";

const ACCENT = "#E2603D";
const ACCENT_DEEP = "#C9512F";

export type RelatedItem = {
  href: string;
  cover: string;
  fallbackCover?: string;
  epNumber: string;
  eyebrow: string;
  title: string;
};

type Props = {
  items: RelatedItem[];
  findMore?: { label: string; href: string };
};

export function RelatedEpisodes({ items, findMore }: Props) {
  const { m } = useLocale();
  if (items.length === 0) return null;

  return (
    <section className="bg-[#FAF8F5] px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-[#161310]/[0.06]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#161310] mb-8">
          {m.episodeDetail.relatedEpisodes}
        </h2>

        <div className="flex flex-col divide-y divide-[#161310]/[0.08]">
          {items.map((it) => (
            <Link key={it.href} href={it.href} className="group flex items-center gap-5 py-5">
              <div className="relative w-32 sm:w-44 aspect-video shrink-0 overflow-hidden rounded-xl bg-[#161310]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.cover}
                  onError={(e) => {
                    if (it.fallbackCover && e.currentTarget.src !== it.fallbackCover) {
                      e.currentTarget.src = it.fallbackCover;
                    }
                  }}
                  alt={it.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 text-[10px] font-mono text-white/90 bg-black/45 backdrop-blur-sm px-1.5 py-0.5 rounded">
                  EP {it.epNumber}
                </span>
              </div>
              <div className="min-w-0">
                <p
                  className="text-[11px] font-semibold tracking-[0.16em] uppercase mb-1.5"
                  style={{ color: ACCENT }}
                >
                  {it.eyebrow}
                </p>
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-[#161310] leading-snug line-clamp-2 group-hover:text-[#C9512F] transition-colors">
                  {it.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Find more about this topic */}
        {findMore && (
          <Link
            href={findMore.href}
            className="group mt-8 flex items-center justify-between gap-4 rounded-2xl border border-[#161310]/12 bg-white px-6 py-5 hover:border-[#161310]/25 transition-colors"
          >
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-[#161310]/45">
                {m.episodeDetail.findMoreAbout}
              </p>
              <p className="text-base font-bold text-[#161310] truncate">{findMore.label}</p>
            </div>
            <span
              className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition-colors"
              style={{ backgroundColor: ACCENT_DEEP }}
            >
              <ArrowRight className="w-5 h-5 text-white" />
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}
