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
