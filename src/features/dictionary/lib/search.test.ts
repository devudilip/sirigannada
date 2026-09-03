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
    expect(results.some((r) => r.entry.word === "ಮನೆ")).toBe(true);
  });

  it("keeps transliteration lookup working for Latin queries", async () => {
    const results = await search("mane");
    expect(results[0]?.entry.word).toBe("ಮನೆ");
  });
});

describe("lookupInflected", () => {
  beforeEach(() => {
    MOCK_SHARDS.clear();
    MOCK_REVERSE.clear();
    MOCK_SHARDS.set("ಮ", { akshara: "ಮ", entries: [entry(1, "ಮನೆ"), entry(2, "ಮಳೆ")] });
  });

  it("resolves inflected forms in reader lookups", async () => {
    const hit = await lookupInflected("ಮನೆಯಲ್ಲಿ");
    expect(hit?.word).toBe("ಮನೆ");
  });
});
