import { describe, expect, it } from "vitest";
import { sentenceAt, sentenceStart, stripPunctuation, words } from "./sentences";

const timings = [0, 4, 8.5, 12];

describe("sentenceAt", () => {
  it("returns -1 with no timings or before the first start", () => {
    expect(sentenceAt([], 3)).toBe(-1);
    expect(sentenceAt([2, 5], 1.9)).toBe(-1);
  });

  it("maps a time to the sentence whose start is at or before it", () => {
    expect(sentenceAt(timings, 0)).toBe(0);
    expect(sentenceAt(timings, 3.99)).toBe(0);
    expect(sentenceAt(timings, 4)).toBe(1);
    expect(sentenceAt(timings, 8.5)).toBe(2);
    expect(sentenceAt(timings, 11.999)).toBe(2);
  });

  it("keeps the last sentence past the final start", () => {
    expect(sentenceAt(timings, 12)).toBe(3);
    expect(sentenceAt(timings, 500)).toBe(3);
  });
});

describe("sentenceStart", () => {
  it("clamps the index into range", () => {
    expect(sentenceStart(timings, -3)).toBe(0);
    expect(sentenceStart(timings, 2)).toBe(8.5);
    expect(sentenceStart(timings, 99)).toBe(12);
  });

  it("is 0 with no timings", () => {
    expect(sentenceStart([], 2)).toBe(0);
  });
});

describe("words", () => {
  it("splits on runs of whitespace and drops empties", () => {
    expect(words("  ಒಂದು   ಊರಿನಲ್ಲಿ\nಹಸು ")).toEqual(["ಒಂದು", "ಊರಿನಲ್ಲಿ", "ಹಸು"]);
    expect(words("")).toEqual([]);
  });
});

describe("stripPunctuation", () => {
  it("removes leading quotes/brackets and trailing sentence marks", () => {
    expect(stripPunctuation("“ನಿನ್ನನ್ನು")).toBe("ನಿನ್ನನ್ನು");
    expect(stripPunctuation("ತಿನ್ನುತ್ತೇನೆ”")).toBe("ತಿನ್ನುತ್ತೇನೆ");
    expect(stripPunctuation("(ಹಸು),")).toBe("ಹಸು");
    expect(stripPunctuation("ಎಂದಿತು।")).toBe("ಎಂದಿತು");
    expect(stripPunctuation("ಹೋಗುತ್ತಿದ್ದೀಯ?")).toBe("ಹೋಗುತ್ತಿದ್ದೀಯ");
  });

  it("leaves a clean word alone", () => {
    expect(stripPunctuation("ಕಾಗೆ")).toBe("ಕಾಗೆ");
  });
});
