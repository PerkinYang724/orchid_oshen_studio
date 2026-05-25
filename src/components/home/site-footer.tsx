"use client";

import Link from "next/link";
import { Youtube, Instagram, Linkedin, Music2, Mail } from "lucide-react";
import { useLocale } from "@/i18n/client";
import { LanguageSwitcher } from "../LanguageSwitcher";

const ACCENT = "#E2603D";

const SHOW_SPOTIFY = "https://open.spotify.com/show/2JdDo1zeJ2fyO5wxxS7ikN";
const APPLE = "https://podcasts.apple.com/us/podcast/still-human/id1795315498";
const YOUTUBE = "https://youtube.com/@oshen.studio";
const SUBSTACK = "https://substack.com/@perkin0909";
const INSTAGRAM = "https://www.instagram.com/oshen_studio/";
const LINKEDIN = "https://www.linkedin.com/in/perkin0909/";

export function SiteFooter() {
  const { m } = useLocale();

  const columns = [
    {
      title: m.footer.explore,
      links: [
        { label: m.nav.episodes, href: "/episode" },
        { label: m.nav.topics, href: "/topics" },
        { label: m.nav.about, href: "/about" },
        { label: m.nav.newsletter, href: "/newsletter" },
      ],
    },
    {
      title: m.footer.listen,
      links: [
        { label: "Spotify", href: SHOW_SPOTIFY, external: true },
        { label: "Apple Podcasts", href: APPLE, external: true },
        { label: "YouTube", href: YOUTUBE, external: true },
        { label: "Substack", href: SUBSTACK, external: true },
      ],
    },
    {
      title: m.footer.connect,
      links: [
        { label: m.footer.instagram, href: INSTAGRAM, external: true },
        { label: m.footer.linkedin, href: LINKEDIN, external: true },
        { label: m.footer.email, href: "mailto:hello@oshenstudio.com" },
      ],
    },
  ];

  const socials = [
    { Icon: Youtube, href: YOUTUBE, label: "YouTube" },
    { Icon: Instagram, href: INSTAGRAM, label: "Instagram" },
    { Icon: Music2, href: SHOW_SPOTIFY, label: "Spotify" },
    { Icon: Linkedin, href: LINKEDIN, label: "LinkedIn" },
    { Icon: Mail, href: "mailto:hello@oshenstudio.com", label: "Email" },
  ];

  return (
    <footer className="bg-[#FAF8F5] border-t border-[#161310]/[0.08] px-4 sm:px-6 lg:px-8 pt-16 pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" aria-label="Still Human — home" className="inline-flex">
              <span
                className="inline-flex items-center border-2 px-3 py-1.5 rounded-[6px] text-sm font-extrabold tracking-[0.28em] uppercase"
                style={{ color: ACCENT, borderColor: ACCENT }}
              >
                Still&nbsp;Human
              </span>
            </Link>
            <p className="mt-5 text-[13px] leading-relaxed text-[#161310]/50 max-w-xs">
              {m.about.tagline}
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[12px] font-semibold tracking-[0.16em] uppercase text-[#161310]/40 mb-4">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...("external" in link && link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-[15px] font-medium text-[#161310]/75 hover:text-[#C9512F] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="mt-14 pt-8 border-t border-[#161310]/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-[#161310]/40">
              &copy; {new Date().getFullYear()} Oshen Studio
            </span>
            <LanguageSwitcher />
          </div>

          <div className="flex items-center gap-5">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                {...(href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="text-[#161310]/45 hover:text-[#161310] transition-colors"
              >
                <Icon className="w-[18px] h-[18px]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
