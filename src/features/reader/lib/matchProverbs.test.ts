import { describe, expect, it } from "vitest";
import type { Proverb } from "@/features/proverbs/types";
import { matchProverbs } from "./matchProverbs";

const PROVERBS: Proverb[] = [
  { id: "1", text: "ಕೈ ಕೆಸರಾದರೆ ಬಾಯಿ ಮೊಸರು" },
  { id: "2", text: "ಹತ್ತು ಜನ ಕೂಡಿದರೆ ಎತ್ತು ಕೊಬ್ಬಿತು" },
  { id: "3", text: "ಆಡುವವರ ನಾಲಿಗೆ ಆಡಿಸಿದಂತೆ" },
];

describe("matchProverbs", () => {
  it("finds proverbs containing the exact word", () => {
    const hits = matchProverbs(PROVERBS, "ಕೈ");
    expect(hits.map((p) => p.id)).toEqual(["1"]);
  });

  it("is case/diacritic-insensitive via normaliseBookSearchText, matching Kannada as-is", () => {
    const hits = matchProverbs(PROVERBS, "ಎತ್ತು");
    expect(hits.map((p) => p.id)).toEqual(["2"]);
  });

  it("returns nothing for a word absent from every proverb", () => {
    expect(matchProverbs(PROVERBS, "ಅಸಂಬದ್ಧ")).toEqual([]);
  });

  it("returns nothing for an empty query", () => {
    expect(matchProverbs(PROVERBS, "")).toEqual([]);
  });

  it("caps matches at 5", () => {
    const many: Proverb[] = Array.from({ length: 10 }, (_, i) => ({ id: String(i), text: `ಪದ ${i}` }));
    expect(matchProverbs(many, "ಪದ")).toHaveLength(5);
  });
});
