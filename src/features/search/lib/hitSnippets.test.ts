import { describe, expect, it } from "vitest";
import { hitSnippets } from "./hitSnippets";

const book = {
  chapters: [
    { id: "1", title: "ಮೊದಲ", blocks: ["ಒಂದು", "ಎರಡು ಮನೆಯಲ್ಲಿ"] },
    { id: "2", title: "ಎರಡನೆಯ", blocks: ["ಮೂರು ಮನೆ"] },
  ],
};

describe("hitSnippets", () => {
  it("maps book block numbers to their chapter and text", () => {
    expect(hitSnippets(book, [1, 2], ["ಮನೆ"])).toEqual([
      { block: 1, chapterTitle: "ಮೊದಲ", snippet: "ಎರಡು ಮನೆಯಲ್ಲಿ" },
      { block: 2, chapterTitle: "ಎರಡನೆಯ", snippet: "ಮೂರು ಮನೆ" },
    ]);
  });

  it("skips block numbers the book does not have", () => {
    expect(hitSnippets(book, [9], ["ಮನೆ"])).toEqual([]);
  });

  it("centres the snippet on the match in a long block", () => {
    const long = `${"ಅ ".repeat(80)}ಗುರು ${"ಬ ".repeat(80)}`;
    const [hit] = hitSnippets({ chapters: [{ id: "1", title: "", blocks: [long] }] }, [0], ["ಗುರು"]);
    expect(hit?.snippet.startsWith("…")).toBe(true);
    expect(hit?.snippet.endsWith("…")).toBe(true);
    expect(hit?.snippet).toContain("ಗುರು");
  });
});
