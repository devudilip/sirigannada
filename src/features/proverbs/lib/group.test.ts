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
