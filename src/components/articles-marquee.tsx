"use client";

import { useState } from "react";
import type { SubstackPost } from "@/lib/substack";
import { ArticleCard } from "./article-card";

/**
 * Continuously scrolling row of article cards. Duplicates the list so the
 * translateX(-50%) loop is seamless; pauses on hover. Falls back to a static
 * wrapped row when there are too few posts to fill the track.
 */
export function ArticlesMarquee({ posts }: { posts: SubstackPost[] }) {
  const [paused, setPaused] = useState(false);
  if (posts.length === 0) return null;

  // One full set must overflow the viewport for the loop to look continuous.
  const track = posts.length >= 4 ? [...posts, ...posts] : posts;
  const animate = posts.length >= 4;

  return (
    <div
      className="w-full overflow-hidden"
      // Fade the edges so cards slide in/out instead of popping.
      style={{
        maskImage:
          "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
      }}
    >
      <div
        className={`flex ${animate ? "animate-scroll-left" : "flex-wrap justify-center"}`}
        style={
          animate
            ? { width: "max-content", animationPlayState: paused ? "paused" : "running" }
            : undefined
        }
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {track.map((post, i) => (
          <div
            key={`${post.link}-${i}`}
            className="w-[280px] sm:w-[320px] shrink-0 mr-5 sm:mr-6"
          >
            <ArticleCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}
