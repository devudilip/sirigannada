import { describe, expect, it } from "vitest";
import { filterProverbs } from "./filter";
import type { Proverb } from "../types";

const ITEMS: Proverb[] = [
  { id: "p1", text: "ಅತ್ತೆಗೊಂದು ಕಾಲ, ಸೊಸೆಗೊಂದು ಕಾಲ" },
  { id: "p2", text: "ಉಪ್ಪು ತಿಂದವನು ನೀರು ಕುಡಿಯಲೇಬೇಕು" },
  { id: "p3", text: "ಮಳೆ ಬಂದರೆ ಕೇಡಲ್ಲ" },
];

describe("filterProverbs", () => {
  it("returns all items when the query is empty", () => {
    expect(filterProverbs(ITEMS, "  ")).toHaveLength(3);
  });

  it("matches a Kannada substring", () => {
    expect(filterProverbs(ITEMS, "ಉಪ್ಪು").map((p) => p.id)).toEqual(["p2"]);
  });

  it("matches a Latin query via transliteration", () => {
    const hits = filterProverbs(ITEMS, "uppu");
    expect(hits.map((p) => p.id)).toEqual(["p2"]);
  });
});
