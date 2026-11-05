import { describe, expect, it } from "vitest";
import type { Proverb } from "../types";
import { proverbVariants } from "./variants";

describe("source proverb variants", () => {
  it("never merges different word boundaries", () => {
    const result = proverbVariants([{ id: "a", text: "ಅಬ" }, { id: "b", text: "ಅ ಬ" }] as Proverb[]);
    expect(result.primary).toHaveLength(2);
  });
  it("groups punctuation-only changes while preserving distinct wording and original IDs", () => {
    const items = [{ id: "a", text: "ಅಕ್ಕಿ ಮೇಲೆ ಆಸೆ." }, { id: "b", text: "ಅಕ್ಕಿ ಮೇಲೆ ಆಸೆ" }, { id: "c", text: "ಅಕ್ಕಿ ಮೇಲೆ ಪ್ರೀತಿ" }] as Proverb[];
    const result = proverbVariants(items);
    expect(result.primary.map((p) => p.id)).toEqual(["a", "c"]);
    expect(result.variants.get("a")).toEqual([items[1]]);
  });
});
