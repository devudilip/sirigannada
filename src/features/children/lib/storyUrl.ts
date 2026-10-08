import type { ChildStory } from "../types";
import { sectionUrl } from "./sections";

/** Client-safe: the catalogue module reads the filesystem, so components import this instead. */
export function storyUrl(story: Pick<ChildStory, "collection" | "slug">): string {
  return `${sectionUrl(story.collection)}/${story.slug}`;
}
