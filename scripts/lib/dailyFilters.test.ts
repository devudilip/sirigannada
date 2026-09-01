import {
  hasHaCrossRef,
  isBareUStem,
  isDeniedHeadword,
  isJunkDefinition,
  isJunkHeadword,
  isOldPVerb,
  isPaNounWithHaTwin,
} from "./dailyFilters";
import { isDailyCandidate, pickStratified, familySizes, selectDaily } from "./daily";
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

describe("stem and gloss edge cases", () => {
  it("rejects combining prefixes, truncated aa, and old rda", () => {
    expect(isJunkHeadword("ಕ್ರಿ")).toBe(true);
    expect(isJunkHeadword("ತ್ರಿ")).toBe(true);
    expect(isJunkHeadword("ದ್ವಿ")).toBe(true);
    expect(isJunkHeadword("ದ್ಯು")).toBe(true);
    expect(isJunkHeadword("ಕೈಗಾ")).toBe(true);
    expect(isJunkHeadword("ಪರಮಾ")).toBe(true);
    expect(isJunkHeadword("ಎರ್ದೆ")).toBe(true);
    expect(isJunkHeadword("ಬರ್ದು")).toBe(true);
    expect(isJunkHeadword("ಅಮ್ಮಾ")).toBe(false);
  });

  it("rejects leading catalogue 'one of the' but keeps mid-sentence use", () => {
    expect(isJunkDefinition("one of the locks used in wrestling.")).toBe(true);
    expect(
      isJunkDefinition("space or ether, one of the five basic elements which form material reality."),
    ).toBe(false);
  });
});

describe("daily-word tail filters", () => {
  it("rejects rare tatsamas and Old-Kannada nouns on the deny-list", () => {
    expect(isDeniedHeadword("ವಾಜಿ")).toBe(true);
    expect(isDeniedHeadword("ಅಶ್ರು")).toBe(true);
    expect(isDeniedHeadword("ನಲ್ಮೆ")).toBe(true);
    expect(isDailyCandidate(entry(1, "ವಾಜಿ"))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಮನೆ"))).toBe(true);
  });

  it("flags 2-akshara ು-stems with a short first vowel", () => {
    expect(isBareUStem("ಕುಟು")).toBe(true);
    expect(isBareUStem("ಮದು")).toBe(true);
    expect(isBareUStem("ಚಿಟು")).toBe(true);
    expect(isBareUStem("ಕಂದು")).toBe(false);
    expect(isBareUStem("ಮನೆ")).toBe(false);
    expect(isBareUStem("ಊರು")).toBe(false);
    expect(isBareUStem("ಹೂವು")).toBe(false);
    expect(isDailyCandidate(entry(1, "ಕುಟು"))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಕುಟುಗಾರ"))).toBe(true);
  });

  it("counts a compound family for a ು-stem that is a real prefix", () => {
    expect(familySizes([entry(1, "ಕುಟು"), entry(2, "ಮನೆ")]).get(1)).toBe(0);
    expect(familySizes([entry(1, "ಕುಟು"), entry(2, "ಕುಟುಗಾರ")]).get(1)).toBe(1);
  });

  it("rejects ಪ- nouns that have a ಹ- twin or gloss", () => {
    const ha = new Set(["ಹಸು", "ಹೂವು"]);
    expect(isPaNounWithHaTwin("ಪಸು", "noun", ha)).toBe(true);
    expect(isPaNounWithHaTwin("ಪುಸ್ತಕ", "noun", ha)).toBe(false);
    expect(isPaNounWithHaTwin("ಪೇಳು", "verb", new Set(["ಹೇಳು"]))).toBe(false);
    expect(hasHaCrossRef("see ಹಸು.")).toBe(true);
    expect(isDailyCandidate(entry(1, "ಪಗೆ", { defs: [{ text: "see ಹನೆ.", pos: "noun" }] }))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಪುಸ್ತಕ"))).toBe(true);
  });

  it("lets the larger family beat a longer definition list in a window", () => {
    const byWord = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);
    const all = [
      entry(1, "ಹೂವು", { defs: [{ text: "a flower", pos: "noun" }] }),
      entry(2, "ಹೂವುಗಿಡ"),
      entry(3, "ಹೂವುಗಾರ"),
      entry(4, "ಹೂಣ", { defs: [{ text: "a", pos: "noun" }, { text: "b", pos: "noun" }, { text: "c", pos: "noun" }] }),
    ];
    const picked = pickStratified(all, byWord, familySizes(all), 1);
    expect(picked[0]!.word).toBe("ಹೂವು");
  });

  it("omits ು-stems and ಪ- nouns that have a ಹ- twin from the 366", () => {
    const compare = new Intl.Collator("kn").compare;
    const all = Array.from({ length: 1000 }, (_, i) =>
      entry(i, "ಅ" + [...i.toString().padStart(3, "0")].map((d) => String.fromCharCode(0x0ce6 + Number(d))).join("")),
    );
    all.push(entry(9000, "ಕುಟು"));
    all.push(entry(9001, "ಪಗೆ"));
    all.push(entry(9002, "ಹಗೆ"));
    const words = new Set(selectDaily(all, compare).map((e) => e.word));
    expect(words.has("ಕುಟು")).toBe(false);
    expect(words.has("ಪಗೆ")).toBe(false);
  });
});
