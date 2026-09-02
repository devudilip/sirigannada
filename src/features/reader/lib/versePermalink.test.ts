import { describe, expect, it } from "vitest";
import type { Book } from "@/lib/types";
import {
  CANONICAL_ORIGIN,
  blockCount,
  blockFromHash,
  hashBlock,
  shareOrigin,
  versePermalinkPath,
  versePermalinkUrl,
} from "./versePermalink";

const book = {
  slug: "sarvajna-vachanagalu",
  chapters: [
    { id: "01", title: "ಒಂದು", blocks: ["ಅ", "ಬ", "ಕ"] },
    { id: "02", title: "ಎರಡು", blocks: ["ಡ", "ಇ"] },
  ],
} as unknown as Book;

describe("versePermalinkPath", () => {
  it("points at the book route with a #b hash", () => {
    expect(versePermalinkPath("sarvajna-vachanagalu", 42)).toBe("/library/sarvajna-vachanagalu#b42");
    expect(versePermalinkPath("basavanna-vachanagalu", 0)).toBe("/library/basavanna-vachanagalu#b0");
  });
});

describe("versePermalinkUrl", () => {
  it("joins origin without a double slash", () => {
    expect(versePermalinkUrl("sarvajna-vachanagalu", 7, "https://sirigannada.in")).toBe(
      "https://sirigannada.in/library/sarvajna-vachanagalu#b7",
    );
    expect(versePermalinkUrl("sarvajna-vachanagalu", 7, "https://sirigannada.in/")).toBe(
      "https://sirigannada.in/library/sarvajna-vachanagalu#b7",
    );
  });

  it("returns the path when origin is empty", () => {
    expect(versePermalinkUrl("sarvajna-vachanagalu", 7)).toBe(versePermalinkPath("sarvajna-vachanagalu", 7));
  });
});

describe("shareOrigin", () => {
  it("keeps http(s) page origins", () => {
    expect(shareOrigin("https://www.sirigannada.in")).toBe("https://www.sirigannada.in");
    expect(shareOrigin("http://localhost:3000")).toBe("http://localhost:3000");
  });

  it("falls back to the canonical site for missing or non-http origins", () => {
    expect(shareOrigin(null)).toBe(CANONICAL_ORIGIN);
    expect(shareOrigin("")).toBe(CANONICAL_ORIGIN);
    expect(shareOrigin("null")).toBe(CANONICAL_ORIGIN);
    expect(shareOrigin("file://")).toBe(CANONICAL_ORIGIN);
  });
});

describe("blockFromHash", () => {
  it("reads #b<index>", () => {
    expect(blockFromHash("#b0")).toBe(0);
    expect(blockFromHash("#b128")).toBe(128);
    expect(blockFromHash("b12")).toBe(12);
  });

  it("rejects anything else", () => {
    expect(blockFromHash("")).toBeNull();
    expect(blockFromHash("#")).toBeNull();
    expect(blockFromHash("#b")).toBeNull();
    expect(blockFromHash("#b-3")).toBeNull();
    expect(blockFromHash("#b1.5")).toBeNull();
    expect(blockFromHash("#chapter-2")).toBeNull();
    expect(blockFromHash("#b3x")).toBeNull();
  });
});

describe("blockCount", () => {
  it("sums blocks across chapters", () => {
    expect(blockCount(book)).toBe(5);
  });
});

describe("hashBlock", () => {
  it("accepts indices inside the book", () => {
    expect(hashBlock("#b0", blockCount(book))).toBe(0);
    expect(hashBlock("#b4", blockCount(book))).toBe(4);
  });

  it("rejects indices past the last block", () => {
    expect(hashBlock("#b5", blockCount(book))).toBeNull();
    expect(hashBlock("#b900", blockCount(book))).toBeNull();
  });

  it("rejects a hash that is not a verse link", () => {
    expect(hashBlock("#settings", blockCount(book))).toBeNull();
  });
});
