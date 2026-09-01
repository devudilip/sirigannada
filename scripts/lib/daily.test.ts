import type { DictEntry } from "../../src/lib/types";
import { DAILY_COUNT, isDailyCandidate, selectDaily } from "./daily";
import { buildReverseIndex, toReverseShard } from "./reverse";

function entry(id: number, word: string, over: Partial<DictEntry> = {}): DictEntry {
  return { id, word, phone: "x", key: word, defs: [{ text: "a house", pos: "noun" }], ...over };
}

describe("isDailyCandidate", () => {
  it("accepts short nouns with a phone field", () => {
    expect(isDailyCandidate(entry(1, "ಮನೆ"))).toBe(true);
  });

  it("rejects by length, phone, pos, defs count, markers and bad characters", () => {
    expect(isDailyCandidate(entry(1, "ಅ"))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಅಂಕಪರದೆಯಿಂದ"))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಮನೆ", { phone: undefined }))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಮನೆ", { defs: [{ text: "hey", pos: "interjection" }] }))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಮನೆ", { defs: [] }))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಮನೆ", { defs: Array(5).fill({ text: "x", pos: "noun" }) }))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಮನೆ", { defs: [{ text: "(obsolete) hut", pos: "noun" }] }))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಮನೆ", { defs: [{ text: "Archaic word", pos: "noun" }] }))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಮನೆ", { defs: [{ text: "= ಗೃಹ.", pos: "noun" }] }))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಮನೆ ಕೆಲಸ"))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಮನೆ-ಕೆಲಸ"))).toBe(false);
    expect(isDailyCandidate(entry(1, "ಮನೆ2"))).toBe(false);
  });
});

describe("selectDaily", () => {
  const compare = new Intl.Collator("kn").compare;

  it("returns exactly 366 sorted, evenly spaced entries", () => {
    const all = Array.from({ length: 1000 }, (_, i) => entry(i, "ಕ" + String.fromCodePoint(0x0c85 + (i % 20)) + "ನೆ"));
    const picked = selectDaily(all, compare);
    expect(picked).toHaveLength(DAILY_COUNT);
    expect(new Set(picked.map((e) => e.id)).size).toBe(DAILY_COUNT);
    for (let i = 1; i < picked.length; i++) {
      expect(compare(picked[i - 1]!.word, picked[i]!.word) <= 0).toBe(true);
    }
  });

  it("throws when there are too few candidates", () => {
    expect(() => selectDaily([entry(1, "ಮನೆ")], compare)).toThrow(/candidates/);
  });
});

describe("buildReverseIndex", () => {
  it("maps tokens to [id, word] pairs, one per entry, most relevant first", () => {
    const idx = buildReverseIndex([
      entry(1, "ಅಂಕಣ", { defs: [{ text: "a pillar or column supporting the roof of a house", pos: "noun" }] }),
      entry(2, "ಮನೆ", { defs: [{ text: "a building where people live; a house", pos: "noun" }, { text: "house", pos: "noun" }] }),
      entry(3, "ಗೃಹ"),
    ]);
    const shard = toReverseShard("h", idx.get("h")!);
    expect(shard.index["house"]).toEqual([[2, "ಮನೆ"], [3, "ಗೃಹ"], [1, "ಅಂಕಣ"]]);
  });
});
