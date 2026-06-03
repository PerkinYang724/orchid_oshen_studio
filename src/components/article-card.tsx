"use client";

import { ArrowUpRight, Mic } from "lucide-react";
import type { SubstackPost } from "@/lib/substack";
import { useLocale } from "@/i18n/client";

const ACCENT = "#E2603D";

/**
 * Presentational card for a single Substack article. Light theme, matches the
 * home page episode cards. Always links out to the post on Substack.
 */
export function ArticleCard({ post }: { post: SubstackPost }) {
  const { m, locale } = useLocale();

  const date = post.pubDate
    ? new Date(post.pubDate).toLocaleDateString(
        locale === "zh-TW" ? "zh-TW" : "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      )
    : "";

  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col h-full rounded-2xl overflow-hidden border border-[#161310]/[0.08] bg-white/60 hover:bg-white transition-colors duration-300 hover:shadow-[0_20px_50px_-24px_rgba(22,19,16,0.35)]"
    >
      <div className="relative aspect-video overflow-hidden bg-[#161310]">
        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a231d] to-[#161310] flex items-center justify-center">
            <span
              className="inline-flex items-center border-2 px-2.5 py-1 rounded-[5px] text-[10px] font-extrabold tracking-[0.24em] uppercase"
              style={{ color: ACCENT, borderColor: ACCENT }}
            >
              Still&nbsp;Human
            </span>
          </div>
        )}
        {post.type === "podcast" && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-white bg-black/55 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <Mic className="w-3 h-3" />
            {m.articlesPage.typePodcast}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 sm:p-6">
        {date && (
          <p
            className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-2.5"
            style={{ color: ACCENT }}
          >
            {date}
          </p>
        )}
        <h3 className="text-lg font-bold tracking-tight text-[#161310] leading-snug line-clamp-2 transition-colors group-hover:text-[#C9512F]">
          {post.title}
        </h3>
        {post.description && (
          <p className="mt-2 text-sm leading-relaxed text-[#161310]/55 line-clamp-3">
            {post.description}
          </p>
        )}

        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((t) => (
              <span
                key={t.slug}
                className="inline-flex items-center rounded-full bg-[#161310]/[0.05] px-2.5 py-1 text-[11px] font-medium text-[#161310]/55 capitalize"
              >
                {t.name}
              </span>
            ))}
          </div>
        )}

        <span
          className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold"
          style={{ color: ACCENT }}
        >
          {m.articlesPage.readOnSubstack}
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </a>
  );
}
