import { describe, expect, it } from "vitest";
import type { PictureBookMeta } from "@/lib/types";
import { availableFilters, filterBooks, filterByQuery, levelBucket } from "./filter";

function book(overrides: Partial<PictureBookMeta>): PictureBookMeta {
  return {
    slug: overrides.slug ?? "s",
    title: "ಮೊಲ",
    titleEn: "Rabbit",
    level: "1",
    description: "d",
    orientation: "portrait",
    cover: { src: "/c.jpg", width: 1, height: 1 },
    audio: null,
    wordCount: 1,
    pageCount: 1,
    provenance: {
      source: "s",
      license: "CC-BY-4.0",
      licenseNote: "n",
      storyweaverId: 1,
      authors: [],
      illustrators: [],
      translators: [],
      publisher: "p",
      publishedYear: "2020",
      attributionLine: "a",
      imageCredits: [],
      retrieved: "2026-09-15",
    },
    ...overrides,
  };
}

describe("levelBucket", () => {
  it("keeps 1-3 and merges 4/5 into 4plus", () => {
    expect(levelBucket("1")).toBe("1");
    expect(levelBucket("3")).toBe("3");
    expect(levelBucket("4")).toBe("4plus");
    expect(levelBucket("5")).toBe("4plus");
  });
});

describe("availableFilters", () => {
  it("lists only levels present, plus audio when any book has narration", () => {
    const books = [book({ slug: "a", level: "1" }), book({ slug: "b", level: "4" })];
    expect(availableFilters(books)).toEqual(["all", "1", "4plus"]);
    expect(availableFilters([book({ slug: "c", level: "2", audio: { src: "/a.mp3", durationSec: 10 } })])).toEqual(["all", "2", "audio"]);
  });
});

describe("filterBooks", () => {
  const books = [book({ slug: "a", level: "1" }), book({ slug: "b", level: "5" }), book({ slug: "c", level: "2", audio: { src: "/a.mp3", durationSec: 5 } })];
  it("filters by level bucket", () => {
    expect(filterBooks(books, "4plus").map((b) => b.slug)).toEqual(["b"]);
  });
  it("filters to audio books", () => {
    expect(filterBooks(books, "audio").map((b) => b.slug)).toEqual(["c"]);
  });
  it("all keeps everything", () => {
    expect(filterBooks(books, "all")).toHaveLength(3);
  });
});

describe("filterByQuery", () => {
  it("matches either language, case-insensitively", () => {
    const books = [book({ slug: "a", title: "ಮೊಲ", titleEn: "Rabbit" })];
    expect(filterByQuery(books, "rabbit")).toHaveLength(1);
    expect(filterByQuery(books, "ಮೊಲ")).toHaveLength(1);
    expect(filterByQuery(books, "fox")).toHaveLength(0);
    expect(filterByQuery(books, "")).toHaveLength(1);
  });
});
