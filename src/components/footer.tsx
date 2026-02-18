"use client";

const socialLinks = [
  { label: "LinkedIn", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "Email", href: "mailto:hello@oshenstudio.com" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.05] py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold text-white/40">
            Oshen Studio
          </span>
          <span className="text-xs text-white/15">
            &copy; {new Date().getFullYear()}
          </span>
        </div>

        <div className="flex items-center gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs text-white/25 hover:text-white/50 transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
