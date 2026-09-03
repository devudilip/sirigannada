import { describe, expect, it } from "vitest";
import type { DictManifest } from "@/lib/types";
import { dictionaryCacheUrls } from "./warmDictionaryCache";

describe("dictionaryCacheUrls", () => {
  it("includes manifest, Kannada shards, and reverse shards once each", () => {
    const manifest: DictManifest = {
      name: "test",
      entryCount: 2,
      shards: [
        { akshara: "ಅ", file: "u0c85.json", count: 1 },
        { akshara: "ಕ", file: "u0c95.json", count: 1 },
      ],
      reverseShards: [
        { letter: "a", file: "en-a.json" },
        { letter: "a", file: "en-a.json" },
      ],
      provenance: {
        source: "https://example.com",
        license: "ODbL-1.0",
        licenseNote: "test",
        retrieved: "2026-09-03",
      },
      builtAt: "2026-09-03T00:00:00Z",
    };
    const urls = dictionaryCacheUrls(manifest);
    expect(urls[0]).toBe("/data/dict/manifest.json");
    expect(urls).toContain("/data/dict/u0c85.json");
    expect(urls).toContain("/data/dict/u0c95.json");
    expect(urls).toContain("/data/dict/en-a.json");
    expect(urls.length).toBe(4);
  });
});
