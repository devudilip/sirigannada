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

export interface StoryCollection {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
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
