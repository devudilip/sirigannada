import type { LocalizedText, Provenance } from "@/lib/types";

export interface StoryScene {
  id: string;
  title: string;
  paragraphs: string[];
  imageAlt: string;
  /** Row-major panel in a two-column, three-row storyboard. */
  panel: number;
  question?: string;
}

export interface ChildStory {
  slug: string;
  collection: string;
  order: number;
  title: LocalizedText;
  teaser: LocalizedText;
  age: string;
  language: "kn";
  image: string;
  scenes: StoryScene[];
  vocabulary: { word: string; meaning: string }[];
  questions: string[];
  provenance: Provenance;
  adaptation: {
    credit: LocalizedText;
    license: "CC-BY-SA-4.0";
    note: LocalizedText;
    changes: string[];
  };
  illustrations: { generator: string; promptFile: string; disclosure: LocalizedText };
  contentNote: LocalizedText;
}

interface CollectionBase {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
}

/**
 * One section of ಮಕ್ಕಳ ಕಥೆಗಳು, in `data/children-src/collections.json` order.
 * `stories` sections own a folder of illustrated retellings; `picturebooks` sections are a
 * view of the StoryWeaver shelf, split by whether a book has narration.
 */
export type StoryCollection =
  | (CollectionBase & { kind: "stories" })
  | (CollectionBase & { kind: "picturebooks"; narrated: boolean });

/** What the hub needs to draw one section card, resolved at build time. */
export interface HubSection {
  collection: StoryCollection;
  count: number;
  /** Up to three cover images for picture-book sections. */
  covers: string[];
  /** First story's art for story sections. */
  story?: { image: string; alt: string };
}

export interface StoryReview {
  status: "approved";
  reviewer: string;
  date: string;
  storySha256: string;
  imageSha256: string;
  text: string[];
  illustrations: string[];
  limitations: string[];
}
