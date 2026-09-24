import { describe, expect, it } from "vitest";
import type { SearchIndex } from "../types";
import { buildSearchIndex, decodeShard, queryWords, searchCorpus, shardKey, shardKeysFor } from "./searchIndex";

const books = [
  {
    slug: "a",
    chapters: [
      { id: "1", title: "ಒಂದು", blocks: ["ಕೂಡಲಸಂಗಮದೇವಾ ಕೇಳಯ್ಯಾ", "ಮನೆಯಲ್ಲಿ ಇದ್ದೇನೆ"] },
      { id: "2", title: "ಎರಡು", blocks: ["ಮನೆ ಮನೆಗೆ ಹೋದೆ"] },
    ],
  },
  { slug: "b", chapters: [{ id: "1", title: "ಒಂದು", blocks: ["ಬಸವಣ್ಣನ ಮನೆ", "ಕೇಳು ಮಗನೆ", "ಮನೆ ಕೇಳಯ್ಯಾ"] }] },
];

/** Decode the build output with every shard loaded, as after "save all books offline". */
function loadAll(built: ReturnType<typeof buildSearchIndex>): SearchIndex & { words: string[] } {
  const shards = new Map(built.meta.shards.map((key) => [key, decodeShard(built.shards[key] ?? { words: "", refs: "" })]));
  const words = [...shards.values()].flatMap((shard) => shard.words);
  return { slugs: built.meta.slugs, starts: built.meta.starts, shards, words };
}

const built = buildSearchIndex(books);
const index = loadAll(built);

describe("search index", () => {
  it("round-trips the front-coded word list in sorted order", () => {
    expect(index.words).toContain("ಮನೆಯಲ್ಲಿ");
    expect(index.words).toContain("ಕೂಡಲಸಂಗಮದೇವಾ");
    expect([...index.words].sort()).toEqual(index.words);
    expect(new Set(index.words).size).toBe(index.words.length);
    expect(index.starts).toEqual([0, 3, 6]);
  });

  it("matches words by prefix, so a stem finds its inflected forms, grouped by book", () => {
    const hits = searchCorpus(index, "ಮನೆ");
    expect(hits).toEqual([
      { slug: "a", blocks: [1, 2] },
      { slug: "b", blocks: [0, 2] },
    ]);
  });

  it("puts the book with more hits first and uses each book's own block numbers", () => {
    expect(searchCorpus(index, "ಕೇಳ")).toEqual([
      { slug: "b", blocks: [1, 2] },
      { slug: "a", blocks: [0] },
    ]);
  });

  it("requires every query word in the same block", () => {
    expect(searchCorpus(index, "ಮನೆ ಕೇಳಯ್ಯಾ")).toEqual([{ slug: "b", blocks: [2] }]);
    expect(searchCorpus(index, "ಮನೆ ಬಸವ")).toEqual([{ slug: "b", blocks: [0] }]);
    expect(searchCorpus(index, "ಮನೆ ಕೂಡಲ")).toEqual([]);
  });

  it("returns nothing for empty or unmatched queries", () => {
    expect(searchCorpus(index, "   ")).toEqual([]);
    expect(searchCorpus(index, "ಗಿಳಿ")).toEqual([]);
  });

  it("reads a Latin-letter query as phonetic Kannada", () => {
    expect(queryWords("basava")).toEqual(["ಬಸವ"]);
    expect(searchCorpus(index, "basava")).toEqual([{ slug: "b", blocks: [0] }]);
  });

  it("ignores dandas, digits and zero-width joiners", () => {
    const idx = loadAll(
      buildSearchIndex([{ slug: "c", chapters: [{ id: "1", title: "", blocks: ["ಹರಿ॥೧॥ ಹರ‌ಿಯೆ ||"] }] }]),
    );
    expect(idx.words).toEqual(["ಹರಿ", "ಹರಿಯೆ"]);
  });

  it("shards words by first letter and lists every shard in the meta", () => {
    expect(built.meta.shards).toEqual(["c87", "c95", "cac", "cae", "cb9"]);
    for (const key of built.meta.shards) {
      for (const word of decodeShard(built.shards[key] ?? { words: "", refs: "" }).words) {
        expect(shardKey(word)).toBe(key);
      }
    }
  });

  it("names the shards a query needs and finds nothing in a shard that is not loaded", () => {
    expect(shardKeysFor("ಮನೆ ಕೇಳು ಮಗ")).toEqual(["c95", "cae"]);
    expect(shardKeysFor("basava")).toEqual(["cac"]);
    const onlyMa = { ...index, shards: new Map([["cae", index.shards.get("cae")!]]) };
    expect(searchCorpus(onlyMa, "ಮನೆ")).toHaveLength(2);
    expect(searchCorpus(onlyMa, "ಮನೆ ಕೇಳಯ್ಯಾ")).toEqual([]);
  });
});
