import type { Metadata } from "next";
import Image from "next/image";
import { Music2, Youtube, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/home/site-footer";
import { getAllEpisodes } from "@/lib/episodes";
import { getMessages } from "@/i18n/server";
import { localizeEpisodes, localizeTopics } from "@/i18n/localize";

const ACCENT = "#E2603D";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMessages();
  return {
    title: m.meta.aboutTitle,
    description: m.meta.aboutDescription,
  };
}

const PLATFORMS = [
  {
    label: "Spotify",
    href: "https://open.spotify.com/show/2JdDo1zeJ2fyO5wxxS7ikN",
    Icon: Music2,
    iconColor: "#1DB954",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@oshen.studio",
    Icon: Youtube,
    iconColor: "#FF0000",
  },
  {
    label: "Substack",
    href: "https://substack.com/@perkin0909",
    Icon: ArrowUpRight,
  },
];

export default async function AboutPage() {
  const messages = await getMessages();
  const m = messages;

  // Nav data, identical to the home page so the menu behaves the same.
  const rawEpisodes = getAllEpisodes();
  const allEpisodes = localizeEpisodes(rawEpisodes, messages);
  const latestEpisode = allEpisodes[allEpisodes.length - 1];
  const navTopics = localizeTopics(messages).map((tp) => ({
    slug: tp.slug,
    name: tp.name,
  }));

  return (
    <div className="relative z-10 min-h-screen bg-[#FAF8F5]">
      <Navbar light topics={navTopics} latestEpisodeSlug={latestEpisode?.slug} />

      <main className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-20 sm:pb-24">
        {/* Hero */}
        <div className="mb-16 sm:mb-20">
          <p
            className="text-[12px] font-semibold tracking-[0.25em] uppercase mb-4"
            style={{ color: ACCENT }}
          >
            {m.about.label}
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#161310] leading-[1.05] mb-6">
            Still <span style={{ color: ACCENT }}>Human</span>
          </h1>
          <p className="text-[#161310]/55 text-xl leading-relaxed font-light max-w-xl">
            {m.about.tagline}
          </p>
        </div>

        <div className="space-y-14 sm:space-y-16">
          {/* The show */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#161310] mb-6">
              {m.about.showHeading}
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-2xl overflow-hidden border border-[#161310]/[0.08]">
                <Image
                  src="/icon-192.png"
                  alt={m.about.photoAltCover}
                  fill
                  sizes="(min-width: 640px) 160px, 128px"
                  className="object-cover"
                />
              </div>
              <div className="space-y-4 text-[#161310]/60 text-base leading-relaxed">
                <p>{m.about.showP1}</p>
                <p>{m.about.showP2}</p>
                <p>{m.about.showP3}</p>
              </div>
            </div>
          </section>

          <div className="border-t border-[#161310]/[0.08]" />

          {/* The host */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#161310] mb-6">
              {m.about.hostHeading}
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-2xl overflow-hidden border border-[#161310]/[0.08]">
                <Image
                  src="/profile-photo.jpg"
                  alt={m.about.photoAltHost}
                  fill
                  sizes="(min-width: 640px) 160px, 128px"
                  className="object-cover object-top"
                />
              </div>
              <div className="space-y-4 text-[#161310]/60 text-base leading-relaxed">
                <p>{m.about.hostP1}</p>
                <p>{m.about.hostP2}</p>
              </div>
            </div>
          </section>

          <div className="border-t border-[#161310]/[0.08]" />

          {/* Listen & watch */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#161310] mb-6">
              {m.about.listenWatch}
            </h2>
            <div className="flex flex-wrap gap-3">
              {PLATFORMS.map(({ label, href, Icon, iconColor }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full border border-[#161310]/[0.1] bg-[#161310]/[0.02] text-[#161310]/70 hover:text-[#161310] hover:bg-[#161310]/[0.05] text-sm font-medium transition-all duration-200"
                >
                  <Icon className="w-4 h-4" style={iconColor ? { color: iconColor } : undefined} />
                  {label}
                </a>
              ))}
            </div>
          </section>

          <div className="border-t border-[#161310]/[0.08]" />

          {/* Contact */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#161310] mb-5">
              {m.about.contactHeading}
            </h2>
            <p className="text-[#161310]/60 text-base leading-relaxed mb-5 max-w-xl">
              {m.about.contactBody}
            </p>
            <a
              href="mailto:p@oshenstudio.com"
              className="inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4 transition-colors hover:opacity-80"
              style={{ color: ACCENT }}
            >
              p@oshenstudio.com
            </a>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
