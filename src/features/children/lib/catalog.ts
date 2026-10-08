import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { readPicturebooksManifest } from "@/features/picturebooks/lib/readManifest";
import type { ChildStory, HubSection, StoryCollection } from "../types";

export { storyUrl } from "./storyUrl";

const root = join(process.cwd(), "data/children-src");

export function readCollections(): StoryCollection[] {
  return JSON.parse(readFileSync(join(root, "collections.json"), "utf8"));
}

const isAdults = (c: StoryCollection) => c.kind === "stories" && c.audience === "adults";

/** Sections shown in ಮಕ್ಕಳ ಕಥೆಗಳು: every collection except the adults-only library section. */
export function readChildCollections(): StoryCollection[] {
  return readCollections().filter((c) => !isAdults(c));
}

function readStories(collections: StoryCollection[]): ChildStory[] {
  return collections.filter((c) => c.kind === "stories").flatMap((collection) =>
    readdirSync(join(root, collection.slug), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry): ChildStory => JSON.parse(readFileSync(
        join(root, collection.slug, entry.name, "story.json"), "utf8",
      )))
  ).sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}

/** Build-time only. No third-party requests or runtime filesystem dependency. Children's sections only. */
export function readChildStories(): ChildStory[] {
  return readStories(readChildCollections());
}

/** The adults-only library section (16+), kept out of every children's surface and count. */
export function readAdultStories(): ChildStory[] {
  return readStories(readCollections().filter(isAdults));
}

export function readAdultCollection(): StoryCollection | undefined {
  return readCollections().find(isAdults);
}

/** Every hub card with its count and preview art, in collections.json order. */
export function readHubSections(): HubSection[] {
  const stories = readChildStories();
  const books = readPicturebooksManifest().books;
  return readChildCollections().map((collection): HubSection => {
    if (collection.kind === "stories") {
      const own = stories.filter((s) => s.collection === collection.slug);
      const first = own[0];
      return {
        collection,
        count: own.length,
        covers: [],
        story: first ? { image: first.image, alt: first.scenes[0]?.imageAlt ?? first.title.kn } : undefined,
      };
    }
    const own = books.filter((b) => (b.audio !== null) === collection.narrated);
    return { collection, count: own.length, covers: own.slice(0, 3).map((b) => b.cover.src) };
  });
}
