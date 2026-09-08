import { describe, expect, it } from "vitest";
import type { BookMeta } from "@/lib/types";
import { booksOnPath, isOldKannada, parseCentury, startHerePaths } from "./startHere";

function book(overrides: Partial<BookMeta>): BookMeta {
  return {
    slug: "x",
    title: "ಪುಸ್ತಕ",
    author: "ಲೇಖಕ",
    era: "12th century",
    form: "vachana",
    description: "",
    chapterCount: 1,
    blockCount: 10,
    provenance: { source: "https://example.com", license: "public-domain", licenseNote: "", retrieved: "2024-01-01" },
    ...overrides,
  };
}

/** Mirrors the shapes in public/data/books/manifest.json. */
const SHELF: BookMeta[] = [
  book({ slug: "panje-koti-chennaya", era: "1924", form: "prose" }),
  book({ slug: "shishunala", era: "19th century", form: "poem" }),
  book({ slug: "jaimini", era: "16th century", form: "shatpadi" }),
  book({ slug: "akka", era: "12th century", form: "vachana" }),
  book({ slug: "basava", era: "12th century", form: "vachana" }),
  book({ slug: "kumaravyasa", era: "15th century", form: "shatpadi" }),
  book({ slug: "sarvajna", era: "16th century", form: "tripadi" }),
];

describe("parseCentury", () => {
  it("reads English ordinal centuries", () => {
    expect(parseCentury("12th century")).toBe(12);
    expect(parseCentury("1st century")).toBe(1);
    expect(parseCentury("2nd Century")).toBe(2);
  });

  it("reads Kannada-digit and Kannada-worded centuries", () => {
    expect(parseCentury("೧೨ನೇ ಶತಮಾನ")).toBe(12);
    expect(parseCentury("16ನೇ ಶತಮಾನ")).toBe(16);
  });

  it("maps a plain year to its century", () => {
    expect(parseCentury("1924")).toBe(20);
    expect(parseCentury("1900")).toBe(19);
    expect(parseCentury("೧೯೨೪")).toBe(20);
  });

  it("returns null for unknown shapes", () => {
    expect(parseCentury("")).toBeNull();
    expect(parseCentury("medieval")).toBeNull();
  });
});

describe("isOldKannada", () => {
  it("is true before the 16th century unless the book is a vachana", () => {
    expect(isOldKannada({ era: "15th century", form: "shatpadi" })).toBe(true);
    expect(isOldKannada({ era: "12th century", form: "vachana" })).toBe(false);
    expect(isOldKannada({ era: "16th century", form: "shatpadi" })).toBe(false);
    expect(isOldKannada({ era: "1924", form: "prose" })).toBe(false);
    expect(isOldKannada({ era: "unknown", form: "poem" })).toBe(false);
  });
});

describe("booksOnPath / startHerePaths", () => {
  it("selects books per path in shelf order", () => {
    expect(booksOnPath(SHELF, "vachana").map((b) => b.slug)).toEqual(["akka", "basava"]);
    expect(booksOnPath(SHELF, "prose").map((b) => b.slug)).toEqual(["panje-koti-chennaya"]);
    expect(booksOnPath(SHELF, "old").map((b) => b.slug)).toEqual(["kumaravyasa"]);
  });

  it("drops paths with no books", () => {
    const noProse = SHELF.filter((b) => b.form !== "prose");
    expect(startHerePaths(noProse).map((p) => p.id)).toEqual(["vachana", "old"]);
    expect(startHerePaths([]).length).toBe(0);
  });

  it("carries the form for form-backed paths only", () => {
    const paths = startHerePaths(SHELF);
    expect(paths.find((p) => p.id === "vachana")?.form).toBe("vachana");
    expect(paths.find((p) => p.id === "old")?.form).toBeUndefined();
  });
});
