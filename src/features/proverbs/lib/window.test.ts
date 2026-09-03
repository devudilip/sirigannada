import { describe, expect, it } from "vitest";
import type { Proverb } from "../types";
import {
  getNextVisibleCount,
  getVisibleProverbs,
  PROVERB_BATCH_SIZE,
} from "./window";

const ITEMS: Proverb[] = [
  { id: "p1", text: "ಮೊದಲ ಗಾದೆ" },
  { id: "p2", text: "ಎರಡನೆಯ ಗಾದೆ" },
  { id: "p3", text: "ಮೂರನೆಯ ಗಾದೆ" },
];

describe("proverb result window", () => {
  it("returns only the requested prefix without changing source order", () => {
    const visible = getVisibleProverbs(ITEMS, 2);

    expect(visible).toEqual([ITEMS[0], ITEMS[1]]);
    expect(ITEMS).toHaveLength(3);
  });

  it("keeps duplicate source rows rather than deduplicating them", () => {
    const duplicate = { id: "p4", text: ITEMS[0]!.text };

    expect(getVisibleProverbs([...ITEMS, duplicate], 4)).toEqual([
      ...ITEMS,
      duplicate,
    ]);
  });

  it("reveals one batch at a time and stops at the match count", () => {
    expect(getNextVisibleCount(40, 2194)).toBe(40 + PROVERB_BATCH_SIZE);
    expect(getNextVisibleCount(2180, 2194)).toBe(2194);
  });
});
