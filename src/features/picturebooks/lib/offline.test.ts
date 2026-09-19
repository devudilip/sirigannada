import { describe, expect, it } from "vitest";
import type { PictureBook } from "@/lib/types";
import { bookCacheUrls, bookPageUrls } from "./offline";

const book: PictureBook = {
  slug: "13011-yaaradu",
  title: "ಯಾರದು?",
  level: "1",
  description: "d",
  orientation: "portrait",
  cover: { src: "/data/picturebooks/13011-yaaradu/cover.jpg", width: 548, height: 539 },
  audio: { src: "/data/picturebooks/13011-yaaradu/audio.mp3", durationSec: 87 },
  wordCount: 59,
  pages: [
    { n: 1, image: null, text: ["a"] },
    { n: 2, image: { src: "/data/picturebooks/13011-yaaradu/p02.jpg", width: 708, height: 522 }, text: ["b"] },
  ],
  provenance: {
    source: "https://storyweaver.org.in/en/stories/13011-yaaradu",
    license: "CC-BY-4.0",
    licenseNote: "n",
    storyweaverId: 13011,
    authors: [],
    illustrators: [],
    translators: [],
    publisher: "Pratham Books",
    publishedYear: "2017",
    attributionLine: "a",
    imageCredits: [],
    retrieved: "2026-09-15",
  },
};

describe("picturebook offline urls", () => {
  it("lists the book JSON, cover, page images and audio", () => {
    expect(bookCacheUrls(book)).toEqual([
      "/data/picturebooks/13011-yaaradu.json",
      "/data/picturebooks/13011-yaaradu/cover.jpg",
      "/data/picturebooks/13011-yaaradu/p02.jpg",
      "/data/picturebooks/13011-yaaradu/audio.mp3",
    ]);
  });

  it("omits audio when the book has none", () => {
    expect(bookCacheUrls({ ...book, audio: null })).not.toContain("/data/picturebooks/13011-yaaradu/audio.mp3");
  });

  it("names the reader page", () => {
    expect(bookPageUrls("13011-yaaradu")).toEqual(["/picturebooks/13011-yaaradu"]);
  });
});
