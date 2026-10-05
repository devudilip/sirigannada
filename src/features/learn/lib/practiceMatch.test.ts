import type { DictEntry } from "@/lib/types";
import { buildMatchDeck, buildMatchQuestion, firstSense, type MatchPair } from "./practiceMatch";

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

const POOL: MatchPair[] = [
  { word: "ಅಂಗಡಿ", en: "shop" },
  { word: "ಅಂಚೆ", en: "post" },
  { word: "ಮನೆ", en: "house" },
  { word: "ನೀರು", en: "water" },
  { word: "ಹಣ", en: "money" },
];

describe("buildMatchQuestion", () => {
  it("includes the pair's own meaning among 4 unique choices", () => {
    const q = buildMatchQuestion(POOL[0]!, POOL, 1);
    expect(q.choices).toHaveLength(4);
    expect(new Set(q.choices).size).toBe(4);
    expect(q.choices[q.correctIndex]).toBe("shop");
    expect(q.word).toBe("ಅಂಗಡಿ");
  });

  it("never offers a word sharing the answer's meaning as a distractor", () => {
    const pool = [...POOL, { word: "ಅಂಗಡಿಮಳಿಗೆ", en: "shop" }];
    for (let seed = 0; seed < 50; seed++) {
      const q = buildMatchQuestion(POOL[0]!, pool, seed);
      expect(q.choices.filter((c) => c === "shop")).toHaveLength(1);
    }
  });

  it("is deterministic for the same seed", () => {
    expect(buildMatchQuestion(POOL[0]!, POOL, 5)).toEqual(buildMatchQuestion(POOL[0]!, POOL, 5));
  });
});

describe("buildMatchDeck", () => {
  it("builds a deck no larger than the pair count", () => {
    const deck = buildMatchDeck(POOL, 1, 10);
    expect(deck.length).toBe(POOL.length);
    for (const q of deck) {
      expect(q.choices).toHaveLength(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
    }
  });

  it("returns an empty deck when fewer than 4 distinct meanings exist", () => {
    expect(buildMatchDeck(POOL.slice(0, 3), 1)).toEqual([]);
  });

  it("is deterministic for the same seed", () => {
    expect(buildMatchDeck(POOL, 3, 5)).toEqual(buildMatchDeck(POOL, 3, 5));
  });
});
