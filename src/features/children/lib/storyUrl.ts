import type { ChildStory } from "../types";

/** Client-safe: the catalogue module reads the filesystem, so components import this instead. */
export function storyUrl(story: Pick<ChildStory, "collection" | "slug">): string {
  return `/children/${story.collection}/${story.slug}`;
}
