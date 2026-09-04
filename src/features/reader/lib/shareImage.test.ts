import { describe, expect, it } from "vitest";
import { attributionLines, truncateLines, truncateText, wrapParagraphs } from "./shareImage";

/** A fixed-width "font": every character is 10px wide, so widths are easy to reason about. */
const measure = (s: string) => s.length * 10;

describe("wrapParagraphs", () => {
  it("breaks only at word boundaries once a line would exceed the max width", () => {
    // "ಒಂದು ಎರಡು ಮೂರು" — each word is 4 chars (40px); a 45px line fits one word per line.
    const lines = wrapParagraphs(measure, "ಒಂದು ಎರಡು ಮೂರು", 45);
    expect(lines).toEqual(["ಒಂದು", "ಎರಡು", "ಮೂರು"]);
  });

  it("keeps words together while they fit the width", () => {
    const lines = wrapParagraphs(measure, "ಒಂದು ಎರಡು ಮೂರು", 200);
    expect(lines).toEqual(["ಒಂದು ಎರಡು ಮೂರು"]);
  });

  it("never splits a single word even if it alone exceeds the width", () => {
    const lines = wrapParagraphs(measure, "ಅತಿದೀರ್ಘಪದ ಸಣ್ಣ", 30);
    expect(lines[0]).toBe("ಅತಿದೀರ್ಘಪದ");
  });

  it("respects existing newlines as paragraph breaks", () => {
    const lines = wrapParagraphs(measure, "ಒಂದು\nಎರಡು", 200);
    expect(lines).toEqual(["ಒಂದು", "ಎರಡು"]);
  });
});

describe("truncateLines", () => {
  it("passes short line lists through unchanged", () => {
    expect(truncateLines(["a", "b"], 5)).toEqual(["a", "b"]);
  });

  it("cuts to maxLines and ellipsizes the last kept line", () => {
    expect(truncateLines(["a", "b", "c", "d"], 2)).toEqual(["a", "b…"]);
  });

  it("does not double up an ellipsis that was already there", () => {
    expect(truncateLines(["a", "b…", "c"], 2)).toEqual(["a", "b…"]);
  });
});

describe("truncateText", () => {
  it("returns short text unchanged", () => {
    expect(truncateText("ಸಣ್ಣ ಪದ್ಯ", 100)).toBe("ಸಣ್ಣ ಪದ್ಯ");
  });

  it("caps long text with a trailing ellipsis", () => {
    const long = "ಅ".repeat(500);
    const out = truncateText(long, 480);
    expect(out.length).toBe(481); // 480 chars + ellipsis
    expect(out.endsWith("…")).toBe(true);
  });
});

describe("attributionLines", () => {
  it("joins title and author with an em dash, keeping the licence line separate", () => {
    expect(attributionLines("ಸರ್ವಜ್ಞ ವಚನಗಳು", "ಸರ್ವಜ್ಞ", "ಸಾರ್ವಜನಿಕ ಸ್ವತ್ತು · sirigannada.in")).toEqual([
      "ಸರ್ವಜ್ಞ ವಚನಗಳು — ಸರ್ವಜ್ಞ",
      "ಸಾರ್ವಜನಿಕ ಸ್ವತ್ತು · sirigannada.in",
    ]);
  });
});
