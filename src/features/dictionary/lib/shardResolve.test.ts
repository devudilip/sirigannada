import { describe, expect, it } from "vitest";
import type { DictManifest } from "@/lib/types";
import { refForWord, refsForLetter, shardFileFor } from "./shardResolve";

function manifestWith(shards: { akshara: string; file: string; count: number }[]): DictManifest {
  return {
    name: "test",
    entryCount: shards.reduce((n, s) => n + s.count, 0),
    shards,
    reverseShards: [],
    provenance: {
      source: "https://example.com",
      license: "ODbL-1.0",
      licenseNote: "test",
      retrieved: "2026-09-04",
    },
    builtAt: "2026-09-04T00:00:00Z",
  };
}

const SPLIT_MANIFEST = manifestWith([
  { akshara: "ಕಅ", file: "u0c95-u0c85.json", count: 10 },
  { akshara: "ಕಾ", file: "u0c95-u0cbe.json", count: 20 },
  { akshara: "ಕ_", file: "u0c95-other.json", count: 1 },
  { akshara: "ಅ", file: "u0c85.json", count: 5 },
]);

describe("shardFileFor", () => {
  it("mirrors the build script's unsplit filenames", () => {
    expect(shardFileFor("ಕ")).toBe("u0c95.json");
    expect(shardFileFor("_")).toBe("other.json");
  });
});

describe("refsForLetter", () => {
  it("returns every sub-shard ref for a split letter", () => {
    const refs = refsForLetter("ಕ", SPLIT_MANIFEST);
    expect(refs.map((r) => r.file).sort()).toEqual(
      ["u0c95-other.json", "u0c95-u0c85.json", "u0c95-u0cbe.json"].sort(),
    );
  });
  it("returns the single ref for an unsplit letter", () => {
    expect(refsForLetter("ಅ", SPLIT_MANIFEST)).toEqual([{ akshara: "ಅ", file: "u0c85.json", count: 5 }]);
  });
  it("falls back to the bare filename with no manifest", () => {
    expect(refsForLetter("ಮ", null)).toEqual([{ akshara: "ಮ", file: "u0cae.json" }]);
  });
  it("falls back to the bare filename when the letter isn't in the manifest", () => {
    expect(refsForLetter("ಹ", SPLIT_MANIFEST)).toEqual([{ akshara: "ಹ", file: "u0cb9.json" }]);
  });
});

describe("refForWord", () => {
  it("resolves a split letter's exact sub-shard from the word's second akshara", () => {
    expect(refForWord("ಕಾಗದ", SPLIT_MANIFEST)?.file).toBe("u0c95-u0cbe.json");
    expect(refForWord("ಕಅಂಕಣ", SPLIT_MANIFEST)?.file).toBe("u0c95-u0c85.json");
  });
  it("resolves an unsplit letter to its one file", () => {
    expect(refForWord("ಅಂಕ", SPLIT_MANIFEST)?.file).toBe("u0c85.json");
  });
  it("falls back to the bare filename with no manifest", () => {
    expect(refForWord("ಕನ್ನಡ", null)?.file).toBe("u0c95.json");
  });
});
