"use client";

import { Navbar } from "../components/navbar";
import { Hero } from "../components/hero";
import { Projects } from "../components/projects";
import { Podcast } from "../components/podcast";
import { Philosophy } from "../components/philosophy";
import { About } from "../components/about";
import { Contact } from "../components/contact";
import { Footer } from "../components/footer";

/* ── Single static background: no scroll listeners, no theme switching ──────── */

const staticBackground = (
  <div
    className="fixed inset-0 pointer-events-none z-0"
    aria-hidden
    style={{
      background:
        "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(41,151,255,0.06) 0%, transparent 50%), #050507",
    }}
  />
);

/* ── Page: plain sections, no cinematic scroll effects ─────────────────────── */

export default function Home() {
  return (
    <>
      {staticBackground}
      <div className="relative min-h-screen bg-[#050507]">
        <Navbar />

        <section className="relative">
          <Hero />
        </section>

        <section className="relative">
          <Projects />
        </section>

        <section className="relative">
          <Podcast />
        </section>

        <section className="relative">
          <Philosophy />
        </section>

        <section className="relative">
          <About />
        </section>

        <section className="relative">
          <Contact />
        </section>

        <section className="relative">
          <Footer />
        </section>
      </div>
    </>
  );
}
