import { beforeEach, describe, expect, it, vi } from "vitest";
import { phoneticKey } from "@/lib/kannada";
import type { DictEntry, DictShard, ReverseShard } from "@/lib/types";
import { lookupInflected, search } from "./search";

const MOCK_SHARDS = new Map<string, DictShard>();
// Simulates a Q-08 split letter: keyed by the two-character compound ("ಬಂ", "ಬರ"...), checked
// before MOCK_SHARDS so a test can put different words for the same first letter in different
// sub-shards, exactly like a real split letter on disk.
const MOCK_SPLIT_SHARDS = new Map<string, DictShard>();
const MOCK_REVERSE = new Map<string, ReverseShard>();

function firstChar(word: string): string {
  return [...word][0] ?? "_";
}

function compoundKey(word: string): string {
  const chars = [...word];
  return (chars[0] ?? "_") + (chars[1] ?? "_");
}

vi.mock("./data", () => ({
  loadShardForWord: (word: string) =>
    Promise.resolve(MOCK_SPLIT_SHARDS.get(compoundKey(word)) ?? MOCK_SHARDS.get(firstChar(word)) ?? null),
  loadShardsForLetter: (letter: string) => {
    const splitMatches = [...MOCK_SPLIT_SHARDS.entries()]
      .filter(([k]) => k[0] === letter)
      .map(([, s]) => s);
    if (splitMatches.length > 0) return Promise.resolve(splitMatches);
    const s = MOCK_SHARDS.get(letter);
    return Promise.resolve(s ? [s] : []);
  },
  loadReverse: (letter: string) => Promise.resolve(MOCK_REVERSE.get(letter) ?? null),
}));

function entry(id: number, word: string, def = "test definition"): DictEntry {
  return {
    id,
    word,
    key: phoneticKey(word),
    defs: [{ text: def, pos: "noun" }],
  };
}

describe("search", () => {
  beforeEach(() => {
    MOCK_SHARDS.clear();
    MOCK_SPLIT_SHARDS.clear();
    MOCK_REVERSE.clear();
    MOCK_SHARDS.set("ಮ", { akshara: "ಮ", entries: [entry(1, "ಮನೆ"), entry(2, "ಮನೆತನ"), entry(3, "ಮಳೆ")] });
  });

  it("returns exact headword matches first", async () => {
    const results = await search("ಮನೆ");
    expect(results[0]?.entry.word).toBe("ಮನೆ");
    expect(results[0]?.match).toBe("exact");
  });

  it("falls back from common inflection suffixes to the base headword", async () => {
    const results = await search("ಮನೆಯಲ್ಲಿ");
    expect(results.find((r) => r.entry.word === "ಮನೆ")?.match).toBe("inflected");
    expect(results.find((r) => r.entry.word === "ಮನೆತನ")?.match).toBe("prefix");
  });

  it("keeps transliteration lookup working for Latin queries", async () => {
    const results = await search("mane");
    expect(results[0]?.entry.word).toBe("ಮನೆ");
  });
});

describe("search: verb conjugations", () => {
  beforeEach(() => {
    MOCK_SHARDS.clear();
    MOCK_SPLIT_SHARDS.clear();
    MOCK_REVERSE.clear();
    MOCK_SHARDS.set("ಹ", { akshara: "ಹ", entries: [entry(1, "ಹೋಗು", "to go")] });
    MOCK_SHARDS.set("ಮ", { akshara: "ಮ", entries: [entry(2, "ಮಾಡು", "to do")] });
    MOCK_SHARDS.set("ನ", { akshara: "ನ", entries: [entry(3, "ನೋಡು", "to see")] });
  });

  it("resolves the irregular past tense ಹೋದನು to its root ಹೋಗು", async () => {
    const results = await search("ಹೋದನು");
    expect(results.find((r) => r.entry.word === "ಹೋಗು")?.match).toBe("inflected");
  });

  it("resolves the regular past tense ಮಾಡಿದನು to its root ಮಾಡು", async () => {
    const results = await search("ಮಾಡಿದನು");
    expect(results.find((r) => r.entry.word === "ಮಾಡು")?.match).toBe("inflected");
  });

  it("resolves the regular present tense ನೋಡುತ್ತಾನೆ to its root ನೋಡು", async () => {
    const results = await search("ನೋಡುತ್ತಾನೆ");
    expect(results.find((r) => r.entry.word === "ನೋಡು")?.match).toBe("inflected");
  });

  it("resolves the regular future tense ಮಾಡುವನು to its root ಮಾಡು", async () => {
    const results = await search("ಮಾಡುವನು");
    expect(results.find((r) => r.entry.word === "ಮಾಡು")?.match).toBe("inflected");
  });

  it("resolves ಬರೆದನು to its ಎ-ending root ಬರೆ, not the bare truncated stem", async () => {
    MOCK_SHARDS.set("ಬ", { akshara: "ಬ", entries: [entry(4, "ಬರೆ", "to write")] });
    const results = await search("ಬರೆದನು");
    expect(results.find((r) => r.entry.word === "ಬರೆ")?.match).toBe("inflected");
  });
});

describe("lookupInflected", () => {
  beforeEach(() => {
    MOCK_SHARDS.clear();
    MOCK_SPLIT_SHARDS.clear();
    MOCK_REVERSE.clear();
    MOCK_SHARDS.set("ಮ", { akshara: "ಮ", entries: [entry(1, "ಮನೆ"), entry(2, "ಮಳೆ"), entry(4, "ಮಾಡು")] });
    MOCK_SHARDS.set("ಹ", { akshara: "ಹ", entries: [entry(3, "ಹೋಗು")] });
  });

  it("resolves inflected forms in reader lookups", async () => {
    const hit = await lookupInflected("ಮನೆಯಲ್ಲಿ");
    expect(hit?.word).toBe("ಮನೆ");
  });

  it("resolves the irregular past tense ಹೋದನು to ಹೋಗು in reader lookups", async () => {
    const hit = await lookupInflected("ಹೋದನು");
    expect(hit?.word).toBe("ಹೋಗು");
  });

  it("resolves the regular past tense ಮಾಡಿದನು to ಮಾಡು in reader lookups", async () => {
    const hit = await lookupInflected("ಮಾಡಿದನು");
    expect(hit?.word).toBe("ಮಾಡು");
  });

  it("prefers the verb root ಮಾಡು over an unrelated real headword ಮಾಡ that shares the bare stem", async () => {
    // Regression: Alar's real ಮ shard has both "ಮಾಡ" (a building/storey, unrelated noun) and
    // "ಮಾಡು" (to do). Stripping ಿದನು from ಮಾಡಿದನು naively yields the bare stem "ಮಾಡ" first,
    // which happens to be a real but wrong headword — verbStems must not offer it as a candidate.
    MOCK_SHARDS.set("ಮ", {
      akshara: "ಮ",
      entries: [entry(1, "ಮನೆ"), entry(2, "ಮಳೆ"), entry(4, "ಮಾಡು", "to do"), entry(5, "ಮಾಡ", "a storey")],
    });
    const hit = await lookupInflected("ಮಾಡಿದನು");
    expect(hit?.word).toBe("ಮಾಡು");
  });

  it("finds an irregular root that lives in a different split sub-shard than the query", async () => {
    // Regression (Q-08 x D-06 interaction): ಬ is a real split letter, and ಬಂದಳು ("she came")
    // and its irregular root ಬರು ("come") land in different sub-shards (ಬಂ vs ಬರ) because the
    // root isn't a prefix of the conjugated form. lookupInflected must fetch the root's own
    // sub-shard when a stem candidate doesn't share the query's, not silently miss it.
    MOCK_SPLIT_SHARDS.set("ಬಂ", { akshara: "ಬಂ", entries: [entry(6, "ಬಂಗಾರ", "gold")] });
    MOCK_SPLIT_SHARDS.set("ಬರ", { akshara: "ಬರ", entries: [entry(7, "ಬರು", "to come")] });
    const hit = await lookupInflected("ಬಂದಳು");
    expect(hit?.word).toBe("ಬರು");
  });
});
