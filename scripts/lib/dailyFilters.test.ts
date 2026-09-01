import { isJunkHeadword, isOldPVerb } from "./dailyFilters";
import { isDailyCandidate } from "./daily";
import type { DictEntry } from "../../src/lib/types";

function entry(id: number, word: string, over: Partial<DictEntry> = {}): DictEntry {
  return { id, word, phone: "x", key: word, defs: [{ text: "a house", pos: "noun" }], ...over };
}

function verb(word: string): DictEntry {
  return entry(1, word, { defs: [{ text: "to do", pos: "verb" }] });
}

describe("Old-Kannada headword shapes", () => {
  it("rejects y-virama + consonant and l-virama + other consonant", () => {
    expect(isJunkHeadword("ಕೆಯ್ವಿಡು")).toBe(true);
    expect(isJunkHeadword("ಮೆಯ್ಗೂಡು")).toBe(true);
    expect(isJunkHeadword("ಕಯ್ಮರೆ")).toBe(true);
    expect(isJunkHeadword("ಕಳ್ದೋಡು")).toBe(true);
    expect(isJunkHeadword("ಒಳ್ವೊಗು")).toBe(true);
    expect(isDailyCandidate(entry(1, "ಮನೆ"))).toBe(true);
  });

  it("rejects old r/l + virama + ca causatives", () => {
    expect(isJunkHeadword("ಅಗಲ್ಚು")).toBe(true);
    expect(isJunkHeadword("ಬಿದಿರ್ಚು")).toBe(true);
  });

  it("rejects anusvara-sandhi compounds but keeps short common words", () => {
    expect(isJunkHeadword("ಆಹವಂಗೊಡು")).toBe(true);
    expect(isJunkHeadword("ಯಶಂಬಡೆ")).toBe(true);
    expect(isJunkHeadword("ರಜಂಬೊರೆ")).toBe(true);
    expect(isJunkHeadword("ಮರಂಬಡು")).toBe(true);
    expect(isJunkHeadword("ವರುಷಂಗರೆ")).toBe(true);
    expect(isJunkHeadword("ಅಂಗಡಿ")).toBe(false);
    expect(isJunkHeadword("ಸಂಬಳ")).toBe(false);
    expect(isJunkHeadword("ಕಂದು")).toBe(false);
    expect(isDailyCandidate(entry(1, "ಅಂಗಡಿ"))).toBe(true);
    expect(isDailyCandidate(entry(1, "ಸಂಬಳ"))).toBe(true);
    expect(isDailyCandidate(entry(1, "ಕಂದು"))).toBe(true);
  });

  it("rejects old compound-verb endings", () => {
    expect(isJunkHeadword("ಕುಡಿವಡೆ")).toBe(true);
    expect(isJunkHeadword("ಇಳಿವೋಗು")).toBe(true);
    expect(isJunkHeadword("ಪಟುವೆರು")).toBe(true);
    expect(isJunkHeadword("ಮೇಲುವರಿ")).toBe(true);
  });

  it("rejects Old-Kannada P- verbs but keeps P- nouns", () => {
    expect(isOldPVerb("ಪೇಳಿಸು", "verb")).toBe(true);
    expect(isOldPVerb("ಪೊಸಯಿಸು", "verb")).toBe(true);
    expect(isDailyCandidate(verb("ಪೇಳಿಸು"))).toBe(false);
    expect(isDailyCandidate(verb("ಪೊಸಯಿಸು"))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಪುಸ್ತಕ"))).toBe(true);
    expect(isDailyCandidate(entry(1, "ಪೂಜೆ"))).toBe(true);
    expect(isOldPVerb("ಪುಸ್ತಕ", "noun")).toBe(false);
  });
});
