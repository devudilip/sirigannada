import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { ChildStory, StoryCollection } from "../types";

const root = join(process.cwd(), "data/children-src");

export function readCollections(): StoryCollection[] {
  return JSON.parse(readFileSync(join(root, "collections.json"), "utf8"));
}

/** Build-time only. No third-party requests or runtime filesystem dependency. */
export function readChildStories(): ChildStory[] {
  return readCollections().flatMap((collection) =>
    readdirSync(join(root, collection.slug), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry): ChildStory => JSON.parse(readFileSync(
        join(root, collection.slug, entry.name, "story.json"), "utf8",
      )))
  ).sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}

export function storyUrl(story: Pick<ChildStory, "collection" | "slug">): string {
  return `/children/${story.collection}/${story.slug}`;
}
