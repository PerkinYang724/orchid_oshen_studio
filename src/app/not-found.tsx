import Link from "next/link";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#050507] text-white">
      <Navbar />
      <main className="flex flex-col items-center justify-center px-6 py-40 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-white/35 mb-6">
          404
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Page not found
        </h1>
        <p className="text-lg text-white/50 max-w-md mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/4 px-6 py-3 text-sm text-white/70 transition hover:bg-white/8 hover:text-white"
        >
          Back to home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
