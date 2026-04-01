export type Topic = {
  slug: string;
  name: string;
  description: string;
  icon: string;
};

export const TOPICS: Topic[] = [
  {
    slug: "ai-technology",
    name: "AI & Technology",
    description: "How artificial intelligence is reshaping industries, creativity, and what we build.",
    icon: "⚡",
  },
  {
    slug: "entrepreneurship",
    name: "Entrepreneurship",
    description: "Building companies under pressure. The psychology of making things that matter.",
    icon: "🚀",
  },
  {
    slug: "identity-humanity",
    name: "Identity & Humanity",
    description: "What it means to be human when machines can do almost everything.",
    icon: "🌊",
  },
  {
    slug: "science-engineering",
    name: "Science & Engineering",
    description: "Hard tech, research breakthroughs, and the people pushing the frontier.",
    icon: "🔬",
  },
  {
    slug: "mental-resilience",
    name: "Mental Resilience",
    description: "Pressure, performance, and the inner work behind extraordinary achievement.",
    icon: "🧠",
  },
  {
    slug: "space-future",
    name: "Space & Future",
    description: "Long-horizon thinking, space technology, and civilizational-scale challenges.",
    icon: "🌌",
  },
];

export function getTopicBySlug(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

// Full class strings — must be literals so Tailwind includes them in the build
export const TOPIC_STYLES: Record<string, { badge: string; card: string; glow: string }> = {
  "ai-technology": {
    badge: "text-blue-400/80 bg-blue-400/[0.08] border-blue-400/[0.15]",
    card: "border-blue-500/[0.14] bg-blue-500/[0.05] hover:border-blue-500/[0.22]",
    glow: "bg-blue-500",
  },
  "entrepreneurship": {
    badge: "text-purple-400/80 bg-purple-400/[0.08] border-purple-400/[0.15]",
    card: "border-purple-500/[0.14] bg-purple-500/[0.05] hover:border-purple-500/[0.22]",
    glow: "bg-purple-500",
  },
  "identity-humanity": {
    badge: "text-teal-400/80 bg-teal-400/[0.08] border-teal-400/[0.15]",
    card: "border-teal-500/[0.14] bg-teal-500/[0.05] hover:border-teal-500/[0.22]",
    glow: "bg-teal-500",
  },
  "science-engineering": {
    badge: "text-green-400/80 bg-green-400/[0.08] border-green-400/[0.15]",
    card: "border-green-500/[0.14] bg-green-500/[0.05] hover:border-green-500/[0.22]",
    glow: "bg-green-500",
  },
  "mental-resilience": {
    badge: "text-orange-400/80 bg-orange-400/[0.08] border-orange-400/[0.15]",
    card: "border-orange-500/[0.14] bg-orange-500/[0.05] hover:border-orange-500/[0.22]",
    glow: "bg-orange-500",
  },
  "space-future": {
    badge: "text-indigo-400/80 bg-indigo-400/[0.08] border-indigo-400/[0.15]",
    card: "border-indigo-500/[0.14] bg-indigo-500/[0.05] hover:border-indigo-500/[0.22]",
    glow: "bg-indigo-500",
  },
};

export function getTopicStyle(slug: string) {
  return TOPIC_STYLES[slug] ?? {
    badge: "text-white/50 bg-white/[0.06] border-white/[0.1]",
    card: "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14]",
    glow: "bg-white",
  };
}
