import { describe, expect, it } from "vitest";
import { isEditDistance1, suggestHeadwords } from "./suggest";

/** Tiny stand-in for a dictionary shard; includes both acceptance pairs. */
const HEADWORDS = ["ಶಾಲೆ", "ಸಾಲೆ", "ಮನೆ", "ನೀರು", "ಕಾಡು", "ಹೂವು"];

describe("suggestHeadwords", () => {
  it("offers the phonetic sibling ಶಾಲೆ↔ಸಾಲೆ", () => {
    expect(suggestHeadwords("ಶಾಲೆ", HEADWORDS)).toContain("ಸಾಲೆ");
    expect(suggestHeadwords("ಸಾಲೆ", HEADWORDS)).toContain("ಶಾಲೆ");
  });

  it("offers edit-distance-1 ಮನಿ→ಮನೆ", () => {
    expect(suggestHeadwords("ಮನಿ", HEADWORDS)).toContain("ಮನೆ");
  });

  it("does not suggest the query itself or unrelated words", () => {
    const out = suggestHeadwords("ಶಾಲೆ", HEADWORDS);
    expect(out).not.toContain("ಶಾಲೆ");
    expect(out).not.toContain("ನೀರು");
    expect(suggestHeadwords("ಮನಿ", HEADWORDS)).not.toContain("ಕಾಡು");
  });

  it("lists phonetic siblings before edit-distance substitutions", () => {
    expect(suggestHeadwords("ಶಾಲೆ", HEADWORDS)[0]).toBe("ಸಾಲೆ");
  });

  it("returns nothing for an empty query", () => {
    expect(suggestHeadwords("  ", HEADWORDS)).toEqual([]);
  });
});

describe("isEditDistance1", () => {
  it("counts a single substitution", () => {
    expect(isEditDistance1("ಮನಿ", "ಮನೆ")).toBe(true);
    expect(isEditDistance1("ಶಾಲೆ", "ಸಾಲೆ")).toBe(true);
  });

  it("rejects exact and distant pairs", () => {
    expect(isEditDistance1("ಮನೆ", "ಮನೆ")).toBe(false);
    expect(isEditDistance1("ಮನಿ", "ನೀರು")).toBe(false);
  });
});
