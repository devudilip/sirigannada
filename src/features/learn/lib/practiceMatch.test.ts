import type { DictEntry } from "@/lib/types";
import { buildMatchDeck, buildMatchQuestion, firstSense } from "./practiceMatch";

function entry(word: string, text: string, id = 1): DictEntry {
  return { id, word, key: word, defs: [{ text, pos: "noun" }] };
}

describe("firstSense", () => {
  it("takes the text before the first semicolon", () => {
    expect(firstSense(entry("ಅ", "a shop; ಅಂಗಡಿಮಂಡಿ (dial.) to spread wares"))).toBe("a shop");
  });

  it("truncates very long senses", () => {
    const long = "x".repeat(200);
    const sense = firstSense(entry("ಅ", long));
    expect(sense.length).toBeLessThanOrEqual(140);
    expect(sense.endsWith("…")).toBe(true);
  });

  it("returns empty string when there are no defs", () => {
    expect(firstSense({ id: 1, word: "ಅ", key: "ಅ", defs: [] })).toBe("");
  });
});

const POOL: DictEntry[] = [
  entry("ಅಂಗಡಿ", "a shop", 1),
  entry("ಅಂಚೆ", "post", 2),
  entry("ಮನೆ", "a house", 3),
  entry("ನೀರು", "water", 4),
  entry("ಹಣ", "money", 5),
];

describe("buildMatchQuestion", () => {
  it("includes the entry's own meaning among 4 unique choices", () => {
    const q = buildMatchQuestion(POOL[0]!, POOL, 1);
    expect(q.choices).toHaveLength(4);
    expect(new Set(q.choices).size).toBe(4);
    expect(q.choices[q.correctIndex]).toBe("a shop");
    expect(q.word).toBe("ಅಂಗಡಿ");
  });

  it("is deterministic for the same seed", () => {
    const a = buildMatchQuestion(POOL[0]!, POOL, 5);
    const b = buildMatchQuestion(POOL[0]!, POOL, 5);
    expect(a).toEqual(b);
  });
});

describe("buildMatchDeck", () => {
  it("builds a deck no larger than the eligible entry count", () => {
    const deck = buildMatchDeck(POOL, 1, 10);
    expect(deck.length).toBe(POOL.length);
    for (const q of deck) {
      expect(q.choices).toHaveLength(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
    }
  });

  it("returns an empty deck when fewer than 4 entries are eligible", () => {
    expect(buildMatchDeck(POOL.slice(0, 2), 1)).toEqual([]);
  });

  it("skips entries with no definitions", () => {
    const withEmpty = [...POOL, { id: 6, word: "ಖ", key: "ಖ", defs: [] }];
    const deck = buildMatchDeck(withEmpty, 1, 20);
    expect(deck.some((q) => q.word === "ಖ")).toBe(false);
  });

  it("is deterministic for the same seed", () => {
    expect(buildMatchDeck(POOL, 3, 5)).toEqual(buildMatchDeck(POOL, 3, 5));
  });
});
