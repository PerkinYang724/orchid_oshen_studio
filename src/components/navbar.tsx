"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

const navItems = [
  { label: "Projects", href: "#projects" },
  { label: "Podcast", href: "#podcast" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 150);
    setAtTop(latest < 10);
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 ${
        atTop ? "bg-transparent" : "glass-nav border-b border-white/[0.06]"
      } transition-colors duration-500`}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <a
          href="#"
          className="text-sm font-semibold tracking-tight text-white/90 hover:text-white transition-colors"
        >
          Oshen Studio
        </a>

        <div className="hidden sm:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[13px] font-medium text-white/50 hover:text-white transition-colors duration-300"
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="text-[13px] font-medium px-5 py-2 rounded-full bg-white/[0.07] text-white/80 hover:bg-white/[0.12] hover:text-white border border-white/[0.06] transition-all duration-300"
        >
          Let&apos;s Connect
        </a>
      </div>
    </motion.nav>
  );
}
