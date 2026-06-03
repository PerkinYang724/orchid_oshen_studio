import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "../components/navbar";
import { SiteFooter } from "../components/home/site-footer";
import { getAllEpisodes } from "../lib/episodes";
import { getMessages } from "../i18n/server";
import { localizeEpisodes, localizeTopics } from "../i18n/localize";

const ACCENT = "#E2603D";

export default async function NotFound() {
  const m = await getMessages();

  // Nav data, identical to the home page so the menu behaves the same.
  const allEpisodes = localizeEpisodes(getAllEpisodes(), m);
  const latestSlug = allEpisodes[allEpisodes.length - 1]?.slug;
  const navTopics = localizeTopics(m).map((tp) => ({ slug: tp.slug, name: tp.name }));

  return (
    <div className="relative z-10 min-h-screen bg-[#FAF8F5] flex flex-col">
      <Navbar light topics={navTopics} latestEpisodeSlug={latestSlug} />

      <main className="flex-1 flex flex-col items-center justify-center px-5 sm:px-6 lg:px-8 py-28 sm:py-40 text-center">
        <p
          className="text-[12px] font-semibold uppercase tracking-[0.25em] mb-6"
          style={{ color: ACCENT }}
        >
          {m.notFound.fourOhFour}
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#161310] mb-4">
          {m.notFound.heading}
        </h1>
        <p className="text-lg text-[#161310]/55 max-w-md mb-10 leading-relaxed">
          {m.notFound.body}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110"
          style={{ backgroundColor: ACCENT }}
        >
          {m.notFound.backHome}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </main>

      <SiteFooter />
    </div>
  );
}
