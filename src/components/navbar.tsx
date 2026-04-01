"use client";

import { m, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useRef } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Episodes", href: "/episode" },
  { label: "Topics", href: "/topics" },
  { label: "About", href: "/about" },
];

const THROTTLE_MS = 120;

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const lastUpdate = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const now = Date.now();
    if (now - lastUpdate.current < THROTTLE_MS) return;
    lastUpdate.current = now;
    const previous = scrollY.getPrevious() ?? 0;
    if (!mobileOpen) setHidden(latest > previous && latest > 150);
    setAtTop(latest < 10);
  });

  return (
    <>
      <m.nav
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          atTop && !mobileOpen
            ? "bg-transparent"
            : "glass-nav border-b border-white/[0.06]"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <img
              src="/favicon concept.png"
              alt="Still Human"
              className="w-7 h-7 rounded-lg object-contain"
            />
            <div className="leading-none">
              <span className="text-sm font-bold tracking-tight text-white/85 group-hover:text-white transition-colors block">
                Still Human
              </span>
              <span className="text-[9px] text-white/25 tracking-wide">
                by Oshen Studio
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[13px] font-medium text-white/45 hover:text-white transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Subscribe CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <a
              href="/newsletter"
              className="hidden sm:inline-flex items-center text-[13px] font-semibold px-4 py-2 rounded-full bg-white/[0.08] text-white/80 hover:bg-white/[0.14] hover:text-white border border-white/[0.08] transition-all duration-300"
            >
              Subscribe
            </a>
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="sm:hidden w-9 h-9 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </m.nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#050507]/97 backdrop-blur-xl flex flex-col pt-20 px-6 sm:hidden">
          <nav className="flex flex-col gap-1 mt-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-3xl font-bold text-white/60 hover:text-white py-4 border-b border-white/[0.06] transition-colors"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/newsletter"
              onClick={() => setMobileOpen(false)}
              className="text-3xl font-bold text-white/60 hover:text-white py-4 transition-colors"
            >
              Subscribe
            </a>
          </nav>

          {/* Platform links */}
          <div className="mt-auto pb-10 flex gap-6">
            <a
              href="https://open.spotify.com/show/2JdDo1zeJ2fyO5wxxS7ikN"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/25 hover:text-white/50 transition-colors"
            >
              Spotify
            </a>
            <a
              href="https://youtube.com/@oshen.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/25 hover:text-white/50 transition-colors"
            >
              YouTube
            </a>
            <a
              href="https://substack.com/@perkin0909"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/25 hover:text-white/50 transition-colors"
            >
              Substack
            </a>
          </div>
        </div>
      )}
    </>
  );
}
