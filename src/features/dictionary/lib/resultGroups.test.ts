import { describe, expect, it } from "vitest";
import type { DictEntry } from "@/lib/types";
import type { SearchResult } from "./search";
import { groupSearchResults } from "./resultGroups";

function result(id: number, match: SearchResult["match"]): SearchResult {
  const entry: DictEntry = {
    id,
    word: `word-${id}`,
    key: `key-${id}`,
    defs: [{ text: "definition", pos: "noun" }],
  };
  return { entry, match };
}

describe("groupSearchResults", () => {
  it("separates exact and inflected answers from related matches", () => {
    const groups = groupSearchResults([
      result(1, "exact"),
      result(2, "prefix"),
      result(3, "inflected"),
      result(4, "phonetic"),
      result(5, "english"),
    ]);

    expect(groups.answers.map(({ entry }) => entry.id)).toEqual([1, 3]);
    expect(groups.related.map(({ entry }) => entry.id)).toEqual([2, 4, 5]);
  });

  it("does not discard or reorder any results", () => {
    const input = [result(1, "prefix"), result(2, "phonetic"), result(3, "english")];
    const groups = groupSearchResults(input);

    expect(groups.answers).toEqual([]);
    expect(groups.related).toEqual(input);
  });

  it("promotes the top-ranked English lookup when there is no direct Kannada answer", () => {
    const input = [result(1, "english"), result(2, "english"), result(3, "english")];

    expect(groupSearchResults(input)).toEqual({
      answers: [input[0]],
      related: [input[1], input[2]],
    });
  });
});
