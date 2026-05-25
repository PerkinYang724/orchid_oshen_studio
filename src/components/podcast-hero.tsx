"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Youtube, Music2 } from "lucide-react";
import type { EpisodeMeta } from "@/lib/episodes";
import { youtubeThumb } from "@/lib/youtube";
import { useLocale } from "@/i18n/client";

type Props = {
  episode: EpisodeMeta;
  spotifyImageUrl: string;
  spotifyEpisodeUrl?: string;
};

const ACCENT = "#E2603D"; // terracotta — warm "human" accent
const AUTO_MS = 7000;

export function PodcastHero({ episode, spotifyImageUrl, spotifyEpisodeUrl }: Props) {
  const { m: t } = useLocale();
  // Latest slide shows the 16:9 YouTube thumbnail, falling back to the square
  // Spotify cover when the video has no thumbnail yet (new / unlisted upload).
  const youtubeImage = youtubeThumb(episode.youtubeId);
  const coverFallback = spotifyImageUrl;
  const spotifyUrl =
    spotifyEpisodeUrl ?? "https://open.spotify.com/show/2JdDo1zeJ2fyO5wxxS7ikN";

  const slides = ["brand", "latest", "newsletter"] as const;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const paused = useRef(false);

  const go = useCallback(
    (next: number) => {
      setDir(next > index || (index === slides.length - 1 && next === 0) ? 1 : -1);
      setIndex((next + slides.length) % slides.length);
    },
    [index, slides.length]
  );

  // Auto-advance, paused on hover/focus.
  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) {
        setDir(1);
        setIndex((i) => (i + 1) % slides.length);
      }
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [slides.length]);

  const current = slides[index];

  return (
    <section className="relative z-10 bg-[#FAF8F5] pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative w-full overflow-hidden rounded-[24px] sm:rounded-[32px] bg-[#161310] shadow-[0_30px_80px_-20px_rgba(40,20,10,0.35)]"
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
          onFocusCapture={() => (paused.current = true)}
          onBlurCapture={() => (paused.current = false)}
        >
          {/* Aspect frame — taller on mobile, cinematic on desktop */}
          <div className="relative w-full min-h-[540px] sm:min-h-[480px] md:min-h-[560px] aspect-auto md:aspect-[1280/600]">
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <m.div
                key={current}
                custom={dir}
                initial={{ opacity: 0, x: dir * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -40 }}
                transition={{ duration: 0.55, ease: [0.25, 0.4, 0, 1] }}
                className="absolute inset-0"
              >
                {current === "brand" && (
                  <BrandSlide t={t} />
                )}
                {current === "latest" && (
                  <LatestSlide
                    t={t}
                    episode={episode}
                    youtubeImage={youtubeImage}
                    coverFallback={coverFallback}
                    spotifyUrl={spotifyUrl}
                  />
                )}
                {current === "newsletter" && <NewsletterSlide t={t} />}
              </m.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 px-5 sm:px-8 flex items-center justify-between pointer-events-none">
            {/* Dots */}
            <div className="flex items-center gap-2 pointer-events-auto">
              {slides.map((s, i) => (
                <button
                  key={s}
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-6 bg-white"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2.5 pointer-events-auto">
              <button
                onClick={() => go(index - 1)}
                aria-label="Previous slide"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => go(index + 1)}
                aria-label="Next slide"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Slides ─────────────────────────── */

type SlideText = ReturnType<typeof useLocale>["m"];

function SlideShell({
  children,
  image,
  imageAlt,
  overlay,
  fallbackImage,
}: {
  children: React.ReactNode;
  image?: string;
  imageAlt?: string;
  overlay: string;
  fallbackImage?: string;
}) {
  return (
    <div className="relative h-full w-full">
      {image && (
        <img
          src={image}
          onError={(e) => {
            if (fallbackImage && e.currentTarget.src !== fallbackImage) {
              e.currentTarget.src = fallbackImage;
            }
          }}
          alt={imageAlt ?? ""}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      )}
      <div className="absolute inset-0" style={{ background: overlay }} />
      <div className="relative h-full flex items-center">
        <div className="w-full px-6 sm:px-10 lg:px-14 max-w-2xl pb-20 sm:pb-16 pt-12">
          {children}
        </div>
      </div>
    </div>
  );
}

function PillLink({
  href,
  children,
  external,
  variant = "solid",
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  variant?: "solid" | "ghost";
}) {
  const base =
    "inline-flex items-center gap-2 rounded-full text-sm font-semibold transition-all duration-200";
  const styles =
    variant === "solid"
      ? "px-6 py-3 text-white hover:brightness-110"
      : "px-5 py-3 text-white/85 border border-white/20 bg-white/5 hover:bg-white/12 hover:text-white";
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${base} ${styles}`}
      style={variant === "solid" ? { backgroundColor: ACCENT } : undefined}
    >
      {children}
    </a>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[11px] sm:text-[12px] font-semibold tracking-[0.22em] uppercase mb-5"
      style={{ color: ACCENT }}
    >
      {children}
    </p>
  );
}

function BrandSlide({ t }: { t: SlideText }) {
  return (
    <SlideShell
      image="/profile-photo.jpg"
      imageAlt="Perkin Yang, host of Still Human"
      overlay="linear-gradient(90deg, rgba(22,19,16,0.96) 0%, rgba(22,19,16,0.82) 42%, rgba(22,19,16,0.25) 78%, rgba(22,19,16,0.1) 100%)"
    >
      <Eyebrow>{t.hero.tagline}</Eyebrow>
      <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-bold tracking-tight text-white leading-[1.05] mb-5 max-w-xl">
        {t.hero.brandHeadline}
      </h1>
      <p className="text-white/65 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
        {t.hero.subtitle}
      </p>
      <PillLink href="/episode">
        {t.hero.exploreEpisodes}
        <ArrowRight className="w-4 h-4" />
      </PillLink>
    </SlideShell>
  );
}

function LatestSlide({
  t,
  episode,
  youtubeImage,
  coverFallback,
  spotifyUrl,
}: {
  t: SlideText;
  episode: EpisodeMeta;
  youtubeImage: string;
  coverFallback: string;
  spotifyUrl: string;
}) {
  return (
    <SlideShell
      image={youtubeImage}
      fallbackImage={coverFallback}
      imageAlt={`${episode.guest}: ${episode.title}`}
      overlay="linear-gradient(90deg, rgba(22,19,16,0.97) 0%, rgba(22,19,16,0.85) 45%, rgba(22,19,16,0.4) 75%, rgba(22,19,16,0.15) 100%)"
    >
      <Eyebrow>
        {t.hero.latestEpisode} · EP {episode.number}
      </Eyebrow>
      <h2 className="text-2xl sm:text-3xl lg:text-[2.6rem] font-bold tracking-tight text-white leading-[1.08] mb-3 max-w-xl line-clamp-3">
        {episode.title}
      </h2>
      <p className="text-white/55 text-sm sm:text-base mb-1 font-medium">
        {episode.guest}
      </p>
      <p className="text-white/55 text-sm sm:text-base leading-relaxed mb-7 max-w-md line-clamp-2">
        {episode.description}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <PillLink href={`/episode/${episode.slug}`}>
          {t.hero.listenNow}
          <ArrowRight className="w-4 h-4" />
        </PillLink>
        <PillLink
          href={`https://www.youtube.com/watch?v=${episode.youtubeId}`}
          external
          variant="ghost"
        >
          <Youtube className="w-4 h-4" />
          {t.hero.watchYoutube}
        </PillLink>
        <a
          href={spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Spotify"
          className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/20 bg-white/5 hover:bg-white/12 transition-colors"
        >
          <Music2 className="w-4 h-4 text-[#1DB954]" />
        </a>
      </div>
    </SlideShell>
  );
}

function NewsletterSlide({ t }: { t: SlideText }) {
  return (
    <SlideShell overlay="linear-gradient(120deg, #C9512F 0%, #E2603D 45%, #E8884F 100%)">
      <Eyebrow>
        <span className="text-white/80">{t.nav.subscribe}</span>
      </Eyebrow>
      <h2 className="text-3xl sm:text-4xl lg:text-[3rem] font-bold tracking-tight text-white leading-[1.06] mb-4 max-w-lg">
        {t.hero.newsletterTitle}
      </h2>
      <p className="text-white/85 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
        {t.hero.newsletterSubtitle}
      </p>
      <a
        href="/newsletter"
        className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#C9512F] hover:bg-white/90 transition-colors"
      >
        {t.hero.newsletterCta}
        <ArrowRight className="w-4 h-4" />
      </a>
    </SlideShell>
  );
}
