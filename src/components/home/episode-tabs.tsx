"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Timestamp } from "@/lib/episodes";
import { useLocale } from "@/i18n/client";

const ACCENT = "#E2603D";
const ACCENT_DEEP = "#C9512F";
const SUBSTACK = "https://substack.com/@perkin0909";

type Faq = { q: string; a: string };

type Props = {
  contentHtml: string;
  timestamps: Timestamp[];
  youtubeId: string;
  faqs?: Faq[];
};

export function EpisodeTabs({ contentHtml, timestamps, youtubeId, faqs }: Props) {
  const { m } = useLocale();

  const tabs = [
    { key: "notes", label: m.episodeDetail.showNotesTab },
    ...(timestamps.length > 0
      ? [{ key: "timestamps", label: m.episodeDetail.timestampsTab }]
      : []),
    { key: "transcript", label: m.episodeDetail.transcriptTab },
  ] as const;

  const [active, setActive] = useState<string>("notes");

  return (
    <div>
      {/* Tab bar */}
      <div className="sticky top-16 z-20 bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[#161310]/10 -mx-5 sm:-mx-6 lg:-mx-8 px-5 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-7">
          {tabs.map((tab) => {
            const isActive = active === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className="relative py-4 text-[15px] font-semibold transition-colors"
                style={{ color: isActive ? ACCENT_DEEP : "rgba(22,19,16,0.45)" }}
              >
                {tab.label}
                {isActive && (
                  <span
                    className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full"
                    style={{ backgroundColor: ACCENT }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Panels */}
      {active === "notes" && (
        <div>
          <article
            className="episode-prose-light"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {faqs && faqs.length > 0 && (
            <section className="mt-14 pt-12 border-t border-[#161310]/10">
              <h2 className="text-xl font-bold text-[#161310] mb-6">
                {m.episodeDetail.faqHeading}
              </h2>
              <div className="flex flex-col gap-3">
                {faqs.map((faq) => (
                  <details
                    key={faq.q}
                    className="group rounded-xl border border-[#161310]/10 bg-white px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                      <h3 className="text-base font-semibold text-[#161310] leading-snug">
                        {faq.q}
                      </h3>
                      <span
                        aria-hidden
                        className="mt-0.5 text-lg leading-none flex-shrink-0 group-open:rotate-45 transition-transform duration-200"
                        style={{ color: ACCENT }}
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-[15px] text-[#161310]/65 leading-relaxed">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {active === "timestamps" && (
        <div>
          <p className="text-[13px] text-[#161310]/45 italic mb-6">
            {m.episodeDetail.timestampsNote}
          </p>
          <ul className="flex flex-col gap-1">
            {timestamps.map((ts, i) => (
              <li key={i}>
                <a
                  href={`https://www.youtube.com/watch?v=${youtubeId}&t=${ts.seconds}s`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-baseline gap-3 py-2 rounded-lg hover:bg-[#161310]/[0.03] -mx-2 px-2 transition-colors"
                >
                  <span
                    className="font-mono text-sm font-semibold tabular-nums shrink-0 group-hover:underline"
                    style={{ color: ACCENT_DEEP }}
                  >
                    {ts.time}
                  </span>
                  <span className="text-[15px] text-[#161310]/80 leading-snug">
                    {ts.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {active === "transcript" && (
        <div className="rounded-3xl bg-[#161310] px-6 sm:px-12 py-14 sm:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug max-w-xl mx-auto mb-4">
            {m.episodeDetail.transcriptHeading}
          </h2>
          <p className="text-white/55 text-[15px] leading-relaxed max-w-md mx-auto mb-8">
            {m.episodeDetail.transcriptBody}
          </p>
          <a
            href={SUBSTACK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ backgroundColor: ACCENT }}
          >
            {m.episodeDetail.readTranscript}
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
}
