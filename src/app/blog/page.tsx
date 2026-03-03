import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — Writing on AI, Automation & the Future of Work",
  description:
    "Perkin writes about AI, automation, the future of work, and building a life you love. Essays and insights from Oshen Studio.",
};

interface Post {
  title: string;
  link: string;
  description: string;
  date: string;
}

async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch("https://perkin0909.substack.com/feed", {
      next: { revalidate: 3600 },
    });
    const xml = await res.text();

    const items = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];

    return items.map((item) => {
      const title =
        item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1]?.trim() ??
        item.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ??
        "Untitled";

      const link = item.match(/<link>(.*?)<\/link>/)?.[1]?.trim() ?? "#";

      const description =
        item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1]?.trim() ??
        item.match(/<description>([\s\S]*?)<\/description>/)?.[1]?.trim() ??
        "";

      const rawDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]?.trim() ?? "";
      const date = rawDate
        ? new Date(rawDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "";

      return { title, link, description, date };
    });
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="relative min-h-screen bg-[#050507]">
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(41,151,255,0.06) 0%, transparent 50%), #050507",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24">
        {/* Header */}
        <div className="mb-16">
          <a
            href="/"
            className="text-[13px] font-medium text-white/30 hover:text-white/60 transition-colors mb-8 inline-block"
          >
            ← Oshen Studio
          </a>
          <p className="text-[13px] font-medium tracking-[0.25em] uppercase text-white/25 mb-4">
            Writing
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6">
            From the{" "}
            <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-white/40 text-lg max-w-xl leading-relaxed">
            Essays on AI, automation, and building a life you love. Published on{" "}
            <a
              href="https://substack.com/@perkin0909"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white underline underline-offset-4 transition-colors"
            >
              Substack
            </a>
            .
          </p>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <p className="text-white/30">No posts found.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post, i) => (
              <a
                key={post.link}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group glass-card rounded-2xl p-7 sm:p-8 flex items-start justify-between gap-6 hover:bg-white/[0.04] transition-colors duration-300 noise"
              >
                <div className="flex-1 min-w-0">
                  {post.date && (
                    <p className="text-[12px] font-medium text-white/25 mb-3 tracking-wide">
                      {post.date}
                    </p>
                  )}
                  <h2 className="text-xl sm:text-2xl font-bold text-white/85 group-hover:text-white transition-colors mb-2 leading-snug">
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="text-sm text-white/35 leading-relaxed group-hover:text-white/50 transition-colors line-clamp-2">
                      {post.description}
                    </p>
                  )}
                </div>
                <div className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.06] group-hover:border-white/[0.2] transition-all duration-300 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white/70 transition-colors" />
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Substack CTA */}
        <div className="mt-12 pt-12 border-t border-white/[0.05] text-center">
          <p className="text-white/25 text-sm mb-4">
            Subscribe to get new posts directly in your inbox
          </p>
          <a
            href="https://substack.com/@perkin0909"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white/70 hover:text-white border border-white/[0.1] hover:border-white/[0.25] hover:bg-white/[0.05] transition-all duration-300"
          >
            Subscribe on Substack
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
