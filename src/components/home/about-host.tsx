"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/client";

const ACCENT = "#E2603D";

export function AboutHost() {
  const { m } = useLocale();
  return (
    <section className="bg-[#161310] px-4 sm:px-6 lg:px-8 py-0">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-stretch">
        {/* Text */}
        <div className="flex flex-col justify-center py-14 sm:py-20 md:pr-10 order-2 md:order-1">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-[1.1] mb-6">
            {m.home.aboutHeading}
          </h2>
          <p className="text-white/60 text-[15px] sm:text-base leading-relaxed mb-5 max-w-lg">
            {m.about.hostP1}
          </p>
          <p className="text-white/60 text-[15px] sm:text-base leading-relaxed mb-8 max-w-lg">
            {m.about.hostP2}
          </p>
          <Link
            href="/about"
            className="inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ backgroundColor: ACCENT }}
          >
            {m.home.aboutLearnMore}
          </Link>
        </div>

        {/* Photo */}
        <div className="relative order-1 md:order-2 min-h-[300px] md:min-h-[460px] overflow-hidden md:rounded-bl-[64px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/profile-photo.jpg"
            alt={m.about.photoAltHost}
            className="absolute inset-0 w-full h-full object-cover object-top grayscale-[15%]"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(22,19,16,0.85) 0%, rgba(22,19,16,0.15) 30%, rgba(22,19,16,0) 60%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
