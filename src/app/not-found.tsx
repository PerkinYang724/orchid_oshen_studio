import Link from "next/link";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { getMessages } from "../i18n/server";

export default async function NotFound() {
  const m = await getMessages();
  return (
    <div className="relative min-h-screen text-white">
      <Navbar />
      <main className="flex flex-col items-center justify-center px-5 sm:px-6 lg:px-8 py-28 sm:py-40 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-white/35 mb-6">
          {m.notFound.fourOhFour}
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          {m.notFound.heading}
        </h1>
        <p className="text-lg text-white/50 max-w-md mb-10">
          {m.notFound.body}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/4 px-6 py-3 text-sm text-white/70 transition hover:bg-white/8 hover:text-white"
        >
          {m.notFound.backHome}
        </Link>
      </main>
      <Footer />
    </div>
  );
}
