import { describe, expect, it } from "vitest";
import type { PictureBookMeta } from "@/lib/types";
import { bookAsStory } from "./audio";

const book: PictureBookMeta = {
  slug: "13011-yaaradu",
  title: "ಯಾರದು?",
  titleEn: "Yaaradu",
  level: "1",
  description: "d",
  orientation: "portrait",
  cover: { src: "/data/picturebooks/13011-yaaradu/cover.jpg", width: 548, height: 539 },
  audio: { src: "/data/picturebooks/13011-yaaradu/audio.mp3", durationSec: 87 },
  wordCount: 59,
  pageCount: 8,
  provenance: {
    source: "https://storyweaver.org.in/en/stories/13011-yaaradu",
    license: "CC-BY-4.0",
    licenseNote: "n",
    storyweaverId: 13011,
    authors: ["Bhavya"],
    illustrators: ["Pratyush Gupta"],
    translators: [],
    publisher: "Pratham Books",
    publishedYear: "2017",
    attributionLine: "a",
    imageCredits: [],
    retrieved: "2026-09-15",
  },
};

describe("bookAsStory", () => {
  it("maps a picture book into the shared Story shape", () => {
    const story = bookAsStory(book);
    expect(story.slug).toBe("13011-yaaradu");
    expect(story.audio).toBe("/data/picturebooks/13011-yaaradu/audio.mp3");
    expect(story.durationSec).toBe(87);
    expect(story.art).toBe("/data/picturebooks/13011-yaaradu/cover.jpg");
    expect(story.provenance.license).toBe("CC-BY-4.0");
    expect(story.provenance.publisher).toBe("Pratham Books");
  });

  it("gives a book with no audio a null src and zero duration", () => {
    const story = bookAsStory({ ...book, audio: null });
    expect(story.audio).toBeNull();
    expect(story.durationSec).toBe(0);
  });
});
