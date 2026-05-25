"use client";

import { m, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import { useLocale } from "@/i18n/client";
import { FlagLanguageSwitcher } from "./flag-language-switcher";

const THROTTLE_MS = 120;
const ACCENT = "#E2603D";

type NavTopic = { slug: string; name: string };

type Props = {
  light?: boolean;
  topics?: NavTopic[];
  latestEpisodeSlug?: string;
};

const PLATFORMS = [
  { label: "Spotify", href: "https://open.spotify.com/show/2JdDo1zeJ2fyO5wxxS7ikN" },
  { label: "YouTube", href: "https://youtube.com/@oshen.studio" },
  { label: "Substack", href: "https://substack.com/@perkin0909" },
];

function BoxedLogo({ light }: { light: boolean }) {
  return (
    <Link href="/" aria-label="Still Human — home" className="inline-flex">
      <span
        className="inline-flex items-center border-2 px-3 py-1.5 rounded-[6px] text-[13px] sm:text-sm font-extrabold tracking-[0.28em] uppercase transition-colors"
        style={{
          color: light ? ACCENT : "#FFFFFF",
          borderColor: light ? ACCENT : "rgba(255,255,255,0.9)",
        }}
      >
        Still&nbsp;Human
      </span>
    </Link>
  );
}

export function Navbar({ light = false, topics = [], latestEpisodeSlug }: Props) {
  const { m: t } = useLocale();
  const router = useRouter();

  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>("podcast");
  const [query, setQuery] = useState("");
  const { scrollY } = useScroll();
  const lastUpdate = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const now = Date.now();
    if (now - lastUpdate.current < THROTTLE_MS) return;
    lastUpdate.current = now;
    const previous = scrollY.getPrevious() ?? 0;
    if (!open) setHidden(latest > previous && latest > 150);
    setAtTop(latest < 10);
  });

  // Lock scroll + close on Escape while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = query.trim();
      setOpen(false);
      router.push(q ? `/episode?q=${encodeURIComponent(q)}` : "/episode");
    },
    [query, router]
  );

  // Theme tokens for the open overlay.
  const ov = light
    ? {
        bg: "#FAF8F5",
        ink: "#161310",
        muted: "rgba(22,19,16,0.55)",
        border: "rgba(22,19,16,0.10)",
        fieldBorder: "rgba(22,19,16,0.18)",
      }
    : {
        bg: "#0b0b0d",
        ink: "#f5f5f7",
        muted: "rgba(245,245,247,0.55)",
        border: "rgba(255,255,255,0.10)",
        fieldBorder: "rgba(255,255,255,0.18)",
      };

  const sections = [
    {
      key: "podcast",
      label: t.nav.podcast,
      links: [
        ...(latestEpisodeSlug
          ? [{ label: t.nav.latestEpisode, href: `/episode/${latestEpisodeSlug}` }]
          : []),
        { label: t.nav.allEpisodes, href: "/episode" },
        { label: t.nav.browseByTopic, href: "/topics" },
      ],
    },
    ...(topics.length
      ? [
          {
            key: "topics",
            label: t.nav.topics,
            links: topics.map((tp) => ({
              label: tp.name,
              href: `/topics/${tp.slug}`,
            })),
          },
        ]
      : []),
  ];

  const directLinks = [
    { label: t.nav.newsletter, href: "/newsletter" },
    { label: t.nav.about, href: "/about" },
  ];

  return (
    <>
      {/* ── Minimal header: boxed logo + Menu trigger ── */}
      <m.header
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={hidden && !open ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          atTop || open
            ? "bg-transparent"
            : light
            ? "bg-[#FAF8F5]/85 backdrop-blur-xl border-b border-[#161310]/[0.08]"
            : "glass-nav border-b border-white/[0.06]"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <BoxedLogo light={light} />
          <div className="flex items-center gap-3 sm:gap-4">
            <FlagLanguageSwitcher light={light} />
            <button
              onClick={() => setOpen(true)}
              className={`text-[15px] font-semibold tracking-tight transition-colors ${
                light
                  ? "text-[#161310]/80 hover:text-black"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {t.nav.menu}
            </button>
          </div>
        </div>
      </m.header>

      {/* ── Full-screen overlay menu ── */}
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] overflow-y-auto"
            style={{ backgroundColor: ov.bg }}
          >
            <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
              {/* Top row */}
              <div className="h-16 flex items-center justify-between">
                <BoxedLogo light={light} />
                <button
                  onClick={() => setOpen(false)}
                  className="text-[15px] font-semibold transition-colors"
                  style={{ color: ov.muted }}
                >
                  {t.nav.close}
                </button>
              </div>

              <m.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.4, 0, 1], delay: 0.05 }}
                className="pt-4 pb-16"
              >
                {/* Search */}
                <form onSubmit={onSearch} className="mb-4">
                  <div
                    className="flex items-center gap-3 rounded-full border px-6 h-14"
                    style={{ borderColor: ov.fieldBorder }}
                  >
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t.nav.searchPlaceholder}
                      className="flex-1 bg-transparent outline-none text-[17px] placeholder:opacity-60"
                      style={{ color: ov.ink }}
                      autoFocus
                    />
                    <button type="submit" aria-label="Search" style={{ color: ov.ink }}>
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </form>

                {/* Accordion sections */}
                {sections.map((section) => {
                  const isOpen = expanded === section.key;
                  return (
                    <div
                      key={section.key}
                      className="border-b"
                      style={{ borderColor: ov.border }}
                    >
                      <button
                        onClick={() =>
                          setExpanded(isOpen ? null : section.key)
                        }
                        className="w-full flex items-center justify-between py-4 text-left"
                      >
                        <span
                          className="text-lg font-bold tracking-tight"
                          style={{ color: ov.ink }}
                        >
                          {section.label}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          style={{ color: ov.muted }}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <m.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.25, 0.4, 0, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pb-4 flex flex-col gap-1">
                              {section.links.map((link) => (
                                <Link
                                  key={link.href + link.label}
                                  href={link.href}
                                  onClick={() => setOpen(false)}
                                  className="py-1.5 text-[17px] font-medium transition-colors hover:opacity-100"
                                  style={{ color: ov.muted }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.color = ov.ink)
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.color = ov.muted)
                                  }
                                >
                                  {link.label}
                                </Link>
                              ))}
                            </div>
                          </m.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Direct links */}
                {directLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-b py-4 text-lg font-bold tracking-tight transition-colors"
                    style={{ color: ov.ink, borderColor: ov.border }}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Footer: listen everywhere */}
                <div className="pt-12 flex flex-col items-center gap-4">
                  <span
                    className="text-[11px] font-semibold tracking-[0.25em] uppercase"
                    style={{ color: ov.muted }}
                  >
                    {t.nav.listenEverywhere}
                  </span>
                  <div className="flex items-center gap-6">
                    {PLATFORMS.map((p) => (
                      <a
                        key={p.label}
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium transition-opacity hover:opacity-100"
                        style={{ color: ov.ink, opacity: 0.7 }}
                      >
                        {p.label}
                      </a>
                    ))}
                  </div>
                </div>
              </m.div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
