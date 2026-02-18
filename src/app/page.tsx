"use client";

import { Navbar } from "../components/navbar";
import { Hero } from "../components/hero";
import { Projects } from "../components/projects";
import { Podcast } from "../components/podcast";
import { Philosophy } from "../components/philosophy";
import { About } from "../components/about";
import { Contact } from "../components/contact";
import { Footer } from "../components/footer";
import { CinematicSection } from "../components/cinematic-section";
import {
  SceneBackgroundProvider,
  type SceneTheme,
} from "../components/scene-background";

/* ── Scene themes per section ───────────────────────────────────────────── */

const themes: Record<string, SceneTheme> = {
  hero: {
    gradient:
      "radial-gradient(ellipse at 50% 20%, rgba(41,151,255,0.04) 0%, transparent 55%)",
    bloomColor: "rgba(41,151,255,0.03)",
    bloomPosition: [50, 25],
    bloomSize: 700,
    vignette: 0.35,
    grain: 0.02,
  },
  projects: {
    gradient:
      "radial-gradient(ellipse at 30% 20%, rgba(41,151,255,0.04) 0%, transparent 60%)",
    bloomColor: "rgba(41,151,255,0.04)",
    bloomPosition: [30, 25],
    bloomSize: 700,
    vignette: 0.45,
    grain: 0.025,
  },
  podcast: {
    gradient:
      "radial-gradient(ellipse at 60% 40%, rgba(168,85,247,0.04) 0%, transparent 60%)",
    bloomColor: "rgba(168,85,247,0.035)",
    bloomPosition: [60, 45],
    bloomSize: 600,
    vignette: 0.4,
    grain: 0.03,
  },
  philosophy: {
    gradient:
      "radial-gradient(ellipse at 50% 50%, rgba(56,189,248,0.05) 0%, transparent 55%)",
    bloomColor: "rgba(56,189,248,0.04)",
    bloomPosition: [50, 50],
    bloomSize: 500,
    vignette: 0.55,
    grain: 0.04,
  },
  about: {
    gradient:
      "radial-gradient(ellipse at 40% 60%, rgba(41,151,255,0.03) 0%, transparent 60%)",
    bloomColor: "rgba(41,151,255,0.025)",
    bloomPosition: [40, 55],
    bloomSize: 550,
    vignette: 0.4,
    grain: 0.02,
  },
  contact: {
    gradient:
      "radial-gradient(ellipse at 50% 30%, rgba(99,102,241,0.04) 0%, transparent 55%)",
    bloomColor: "rgba(99,102,241,0.035)",
    bloomPosition: [50, 35],
    bloomSize: 500,
    vignette: 0.5,
    grain: 0.03,
  },
};

/* ── Decorative parallax layer content ─────────────────────────────────── */

const projectsParallax = [
  {
    speed: 0.2,
    content: (
      <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-500/[0.025] blur-[140px]" />
    ),
  },
  {
    speed: 0.6,
    content: (
      <div className="absolute bottom-[20%] right-[-8%] w-[300px] h-[300px] rounded-full bg-cyan-500/[0.02] blur-[100px]" />
    ),
  },
];

const philosophyParallax = [
  {
    speed: 0.15,
    content: (
      <div className="absolute top-[30%] left-[20%] w-[400px] h-[250px] rounded-full bg-sky-500/[0.03] blur-[120px]" />
    ),
  },
  {
    speed: 0.4,
    content: (
      <div className="absolute top-[50%] right-[15%] w-[200px] h-[200px] rounded-full bg-blue-400/[0.025] blur-[80px]" />
    ),
  },
];

const podcastParallax = [
  {
    speed: 0.25,
    content: (
      <div className="absolute top-[15%] right-[5%] w-[400px] h-[400px] rounded-full bg-purple-500/[0.025] blur-[130px]" />
    ),
  },
];

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <SceneBackgroundProvider initialTheme={themes.hero}>
      <div className="relative min-h-screen bg-[#050507]">
        <Navbar />

        {/* Hero — cinematic section: fades/parallax out as Projects sticky begins */}
        <CinematicSection
          theme={themes.hero}
          yRange={[0, 0, -35]}
          scaleRange={[1, 1, 0.98]}
          fadeOnExit={true}
        >
          <Hero />
        </CinematicSection>

        {/* Projects — sticky scene, chapter transition */}
        <CinematicSection
          theme={themes.projects}
          stickyHeight={120}
          parallaxLayers={projectsParallax}
          scaleRange={[0.97, 1, 0.99]}
          chapterTransition
        >
          <Projects />
        </CinematicSection>

        {/* Podcast — standard scroll-progress */}
        <CinematicSection
          theme={themes.podcast}
          parallaxLayers={podcastParallax}
          yRange={[50, 0, -15]}
        >
          <Podcast />
        </CinematicSection>

        {/* Philosophy — sticky scene, chapter transition */}
        <CinematicSection
          theme={themes.philosophy}
          stickyHeight={100}
          parallaxLayers={philosophyParallax}
          scaleRange={[0.97, 1, 0.98]}
          chapterTransition
        >
          <Philosophy />
        </CinematicSection>

        {/* About — standard scroll-progress */}
        <CinematicSection
          theme={themes.about}
          yRange={[48, 0, -12]}
          scaleRange={[0.98, 1, 0.995]}
        >
          <About />
        </CinematicSection>

        {/* Contact — standard scroll-progress */}
        <CinematicSection
          theme={themes.contact}
          yRange={[40, 0, -10]}
        >
          <Contact />
        </CinematicSection>

        {/* Footer — gentle reveal, no exit fade */}
        <CinematicSection
          yRange={[24, 0, 0]}
          scaleRange={[1, 1, 1]}
          fadeOnExit={false}
        >
          <Footer />
        </CinematicSection>
      </div>
    </SceneBackgroundProvider>
  );
}
