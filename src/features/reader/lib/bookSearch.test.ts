import { describe, expect, it } from "vitest";
import { normaliseBookSearchText, searchBook } from "./bookSearch";

const book = {
  chapters: [
    { id: "one", title: "ಮೊದಲ ಅಧ್ಯಾಯ", blocks: ["ಕನ್ನಡ ನಾಡಿನ ಕತೆ", "Śrī Hari ಎಂಬ ಹೆಸರು"] },
    { id: "two", title: "ಎರಡನೆಯ ಅಧ್ಯಾಯ", blocks: ["ನಾಡು ನುಡಿಯ ನೆಲೆ", "ಕೊನೆಯ ಪದ್ಯ"] },
  ],
};

describe("normaliseBookSearchText", () => {
  it("normalises Kannada and removes invisible characters without dropping vowel signs", () => {
    expect(normaliseBookSearchText("  ನಾ\u200Bಡು  ")).toBe("ನಾಡು");
  });

  it("folds Latin case and diacritics", () => {
    expect(normaliseBookSearchText("ŚRĪ HARI")).toBe("sri hari");
  });
});

describe("searchBook", () => {
  it("returns global block positions and chapter identity in reading order", () => {
    expect(searchBook(book, "ನಾಡ")).toEqual([
      { block: 0, chapterIndex: 0, chapterTitle: "ಮೊದಲ ಅಧ್ಯಾಯ", snippet: "ಕನ್ನಡ ನಾಡಿನ ಕತೆ" },
      { block: 2, chapterIndex: 1, chapterTitle: "ಎರಡನೆಯ ಅಧ್ಯಾಯ", snippet: "ನಾಡು ನುಡಿಯ ನೆಲೆ" },
    ]);
  });

  it("matches Latin text without case or diacritics", () => {
    expect(searchBook(book, "sri hari").map((result) => result.block)).toEqual([1]);
  });

  it("returns no results for whitespace-only input", () => {
    expect(searchBook(book, " \n ")).toEqual([]);
  });

  it("keeps snippets concise for long blocks", () => {
    const longBook = { chapters: [{ id: "x", title: "ಅಧ್ಯಾಯ", blocks: [`${"ಅ".repeat(90)} ಗುರಿ ${"ಬ".repeat(90)}`] }] };
    const [result] = searchBook(longBook, "ಗುರಿ");
    expect(result?.snippet.startsWith("…")).toBe(true);
    expect(result?.snippet.endsWith("…")).toBe(true);
    expect(result?.snippet.length).toBeLessThan(120);
  });
});
