import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/home/site-footer";
import { getAllEpisodes } from "@/lib/episodes";
import { getMessages } from "@/i18n/server";
import { localizeEpisodes, localizeTopics } from "@/i18n/localize";

const ACCENT = "#E2603D";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMessages();
  return {
    title: m.privacy.title,
    description: m.privacy.intro.slice(0, 155),
    alternates: { canonical: "/privacy" },
    // A policy page has no business competing for search traffic, but it must
    // stay reachable: the consent banner links here.
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage() {
  const messages = await getMessages();

  // Nav data, identical to the home page so the menu behaves the same.
  const rawEpisodes = getAllEpisodes();
  const allEpisodes = localizeEpisodes(rawEpisodes, messages);
  const latestEpisode = allEpisodes[allEpisodes.length - 1];
  const navTopics = localizeTopics(messages).map((tp) => ({
    slug: tp.slug,
    name: tp.name,
  }));

  const m = messages.privacy;

  return (
    <div className="relative z-10 min-h-screen bg-[#FAF8F5]">
      <Navbar light topics={navTopics} latestEpisodeSlug={latestEpisode?.slug} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-20 sm:pb-24">
        <header className="mb-12 sm:mb-16">
          <p
            className="text-[12px] font-semibold tracking-[0.25em] uppercase mb-4"
            style={{ color: ACCENT }}
          >
            {m.updated}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#161310] leading-[1.08] mb-6">
            {m.title}
          </h1>
          <p className="text-lg leading-relaxed text-[#161310]/70">{m.intro}</p>
        </header>

        <div className="space-y-10 sm:space-y-12">
          {m.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#161310] mb-4">
                {section.heading}
              </h2>

              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-relaxed text-[#161310]/70 mb-4 last:mb-0"
                >
                  {paragraph}
                </p>
              ))}

              {section.bullets && (
                <ul className="mt-4 space-y-2.5">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-3 text-base leading-relaxed text-[#161310]/70"
                    >
                      <span
                        aria-hidden
                        className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: ACCENT }}
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section className="border-t border-[#161310]/10 pt-10">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#161310] mb-4">
              {m.contactHeading}
            </h2>
            <p className="text-base leading-relaxed text-[#161310]/70">
              {m.contactBody}
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
