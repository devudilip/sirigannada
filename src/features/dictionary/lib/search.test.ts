import { beforeEach, describe, expect, it, vi } from "vitest";
import { phoneticKey } from "@/lib/kannada";
import type { DictEntry, DictShard, ReverseShard } from "@/lib/types";
import { lookupInflected, search } from "./search";

const MOCK_SHARDS = new Map<string, DictShard>();
const MOCK_REVERSE = new Map<string, ReverseShard>();

vi.mock("./data", () => ({
  loadShard: (akshara: string) => Promise.resolve(MOCK_SHARDS.get(akshara) ?? null),
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
});
