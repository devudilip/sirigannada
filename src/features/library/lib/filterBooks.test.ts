import { describe, expect, it } from "vitest";
import type { BookMeta } from "@/lib/types";
import { availableBookForms, filterBooks } from "./filterBooks";

function book(overrides: Partial<BookMeta>): BookMeta {
  return {
    slug: "akka-vachana",
    title: "ಅಕ್ಕಮಹಾದೇವಿಯ ವಚನಗಳು",
    titleEn: "Vachanas of Akka Mahadevi",
    author: "ಅಕ್ಕಮಹಾದೇವಿ",
    authorEn: "Akka Mahadevi",
    era: "12th century",
    form: "vachana",
    description: "",
    chapterCount: 1,
    blockCount: 10,
    provenance: {
      source: "https://example.com",
      license: "public-domain",
      licenseNote: "Public domain",
      author: "ಅಕ್ಕಮಹಾದೇವಿ",
      authorDied: 1160,
      retrieved: "2026-09-03",
    },
    ...overrides,
  };
}

const books = [
  book({}),
  book({
    slug: "panje-koti-chennaya",
    title: "ಕೋಟಿ ಚೆನ್ನಯ",
    titleEn: "Koti Chennaya",
    author: "ಪಂಜೆ ಮಂಗೇಶರಾಯ",
    authorEn: "Panje Mangesha Rao",
    form: "prose",
  }),
];

describe("filterBooks", () => {
  it("matches Kannada and English titles and authors", () => {
    expect(filterBooks(books, "ವಚನಗಳು", "all").map(({ slug }) => slug)).toEqual(["akka-vachana"]);
    expect(filterBooks(books, "Panje Rao", "all").map(({ slug }) => slug)).toEqual([
      "panje-koti-chennaya",
    ]);
  });

  it("normalizes case and surrounding whitespace", () => {
    expect(filterBooks(books, "  AKKA  ", "all").map(({ slug }) => slug)).toEqual(["akka-vachana"]);
  });

  it("combines query and literary-form filters", () => {
    expect(filterBooks(books, "ಅಕ್ಕ", "prose")).toEqual([]);
    expect(filterBooks(books, "koti", "prose").map(({ slug }) => slug)).toEqual([
      "panje-koti-chennaya",
    ]);
  });
});

describe("availableBookForms", () => {
  it("returns only represented forms in a stable literary order", () => {
    expect(availableBookForms(books)).toEqual(["vachana", "prose"]);
  });
});
