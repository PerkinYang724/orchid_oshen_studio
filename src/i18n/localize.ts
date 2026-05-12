import type { EpisodeMeta } from "@/lib/episodes";
import { TOPICS, type Topic } from "@/lib/topics";
import type { Messages } from "./types";

export function localizeEpisode<T extends EpisodeMeta>(ep: T, m: Messages): T {
  const t = m.episodes[ep.slug];
  if (!t) return ep;
  return {
    ...ep,
    title: t.title,
    description: t.description,
    metaTitle: t.metaTitle,
    metaDescription: t.metaDescription,
  };
}

export function localizeEpisodes<T extends EpisodeMeta>(eps: T[], m: Messages): T[] {
  return eps.map((ep) => localizeEpisode(ep, m));
}

export function localizeTopic(topic: Topic, m: Messages): Topic {
  const copy = m.topics[topic.slug];
  if (!copy) return topic;
  return { ...topic, name: copy.name, description: copy.description };
}

export function localizeTopics(m: Messages): Topic[] {
  return TOPICS.map((t) => localizeTopic(t, m));
}

export function getLocalizedTopicBySlug(slug: string, m: Messages): Topic | undefined {
  const t = TOPICS.find((x) => x.slug === slug);
  if (!t) return undefined;
  return localizeTopic(t, m);
}
