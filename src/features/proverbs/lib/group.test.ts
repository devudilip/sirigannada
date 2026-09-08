import { describe, expect, it } from "vitest";
import type { Proverb } from "../types";
import { groupLetter, groupProverbs, OTHER_GROUP } from "./group";

const ALL: Proverb[] = [
  { id: "a1", text: "ಅಂಕೆ ಇಲ್ಲದ ಕಪಿ" },
  { id: "a2", text: "ಆಸೆಯೇ ದುಃಖಕ್ಕೆ ಮೂಲ" },
  { id: "m1", text: "ಮನೆಗೆ ಮಾರಿ, ಊರಿಗೆ ಉಪಕಾರಿ" },
  { id: "m2", text: "ಮಾತು ಬೆಳ್ಳಿ, ಮೌನ ಬಂಗಾರ" },
  { id: "m3", text: "ಮಳೆ ಬಂದರೆ ಕೇಡಲ್ಲ" },
  { id: "k1", text: "ಕ್ಷೀರ ಸಾಗರ" },
];

describe("groupLetter", () => {
  it("strips vowel signs so ಮನೆ and ಮಾತು share a group", () => {
    expect(groupLetter("ಮನೆಗೆ ಮಾರಿ")).toBe("ಮ");
    expect(groupLetter("ಮಾತು ಬೆಳ್ಳಿ")).toBe("ಮ");
  });

  it("uses the base consonant of a conjunct first akshara", () => {
    expect(groupLetter("ಕ್ಷೀರ ಸಾಗರ")).toBe("ಕ");
  });

  it("skips leading punctuation and buckets non-Kannada text under the other group", () => {
    expect(groupLetter("(ಅವರು) ಚಾಪೆ")).toBe("ಅ");
    expect(groupLetter("proverb")).toBe(OTHER_GROUP);
  });
});

describe("groupProverbs", () => {
  it("groups the visible window in first-appearance order with totals from the full list", () => {
    const visible = ALL.slice(0, 4);
    const groups = groupProverbs(visible, ALL);

    expect(groups.map((g) => g.letter)).toEqual(["ಅ", "ಆ", "ಮ"]);
    expect(groups[2]?.items.map((p) => p.id)).toEqual(["m1", "m2"]);
    expect(groups[2]?.total).toBe(3);
  });

  it("returns no groups for an empty window", () => {
    expect(groupProverbs([], ALL)).toEqual([]);
  });
});

describe("sortByLetter / letterCounts / filterByLetter", () => {
  it("sorts alphabetically by base letter, keeps source order within a letter, other bucket last", async () => {
    const { sortByLetter, letterCounts, filterByLetter } = await import("./group");
    const mixed: Proverb[] = [
      { id: "m1", text: "ಮನೆಗೆ ಮಾರಿ" },
      { id: "x1", text: "proverb" },
      { id: "a1", text: "ಅಂಕೆ ಇಲ್ಲದ ಕಪಿ" },
      { id: "k1", text: "ಕ್ಷೀರ ಸಾಗರ" },
      { id: "a2", text: "(ಅವರು) ಚಾಪೆ" },
      { id: "m2", text: "ಮಾತು ಬೆಳ್ಳಿ" },
    ];
    expect(sortByLetter(mixed).map((p) => p.id)).toEqual(["a1", "a2", "k1", "m1", "m2", "x1"]);
    expect(letterCounts(mixed)).toEqual([
      { letter: "ಅ", count: 2 },
      { letter: "ಕ", count: 1 },
      { letter: "ಮ", count: 2 },
      { letter: OTHER_GROUP, count: 1 },
    ]);
    expect(filterByLetter(mixed, "ಮ").map((p) => p.id)).toEqual(["m1", "m2"]);
  });

  it("never repeats a letter group once the window is taken from the sorted list", async () => {
    const { sortByLetter } = await import("./group");
    const sorted = sortByLetter(ALL);
    const letters = groupProverbs(sorted.slice(0, 5), sorted).map((g) => g.letter);
    expect(new Set(letters).size).toBe(letters.length);
    expect(letters).toEqual(["ಅ", "ಆ", "ಕ", "ಮ"]);
  });
});
