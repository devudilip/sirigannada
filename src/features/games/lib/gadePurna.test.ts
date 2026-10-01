import { readFileSync } from "node:fs";
import type { ProverbsFile } from "@/lib/types";
import { gadeOutcome, gadePool, gadeTiles, keptSlots, rightPlaces, splitProverb, todaysGade } from "./gadePurna";
import { MAX_TRIES } from "./gadeState";

const proverbs = (JSON.parse(readFileSync("public/data/proverbs.json", "utf8")) as ProverbsFile).proverbs;

describe("splitProverb", () => {
  it("splits after a comma and strips the answer's edge punctuation", () => {
    const p = splitProverb({ text: "ಊರಿಗೆ ಬಂದವಳು, ನೀರಿಗೆ ಬಾರದೆ ಇರುವಳೇ?" })!;
    expect(p.first).toBe("ಊರಿಗೆ ಬಂದವಳು,");
    expect(p.answer).toEqual(["ನೀರಿಗೆ", "ಬಾರದೆ", "ಇರುವಳೇ"]);
  });

  it("splits at the middle word when there is no usable comma", () => {
    const p = splitProverb({ text: "ಕೈ ಕೆಸರಾದರೆ ಬಾಯಿ ಮೊಸರು." })!;
    expect(p.first).toBe("ಕೈ ಕೆಸರಾದರೆ");
    expect(p.answer).toEqual(["ಬಾಯಿ", "ಮೊಸರು"]);
  });

  it("rejects short, long, bracketed or numbered sayings", () => {
    expect(splitProverb({ text: "ಅತಿ ಆಸೆ ಗತಿ" })).toBeNull();
    expect(splitProverb({ text: "ಒಂದು ಎರಡು ಮೂರು ನಾಲ್ಕು ಐದು ಆರು ಏಳು ಎಂಟು ಒಂಬತ್ತು ಹತ್ತು ಹನ್ನೊಂದು" })).toBeNull();
    expect(splitProverb({ text: "(ಅವರು) ಚಾಪೆ ಕೆಳಗೆ ತೂರಿದರೆ ರಂಗೋಲಿ ಕೆಳಗೆ ತೂರು." })).toBeNull();
    expect(splitProverb({ text: "ಹತ್ತು ಕೈ ಸೇರಿದರೆ 1 ಕೆಲಸ" })).toBeNull();
  });
});

describe("the daily puzzle", () => {
  const pool = gadePool(proverbs);
  const date = new Date(2026, 9, 1);

  it("keeps most proverbs playable", () => {
    expect(pool.length).toBeGreaterThan(1000);
  });

  it("is the same proverb all day and a different one tomorrow", () => {
    expect(todaysGade(pool, new Date(2026, 9, 1, 8))).toBe(todaysGade(pool, new Date(2026, 9, 1, 23)));
    expect(todaysGade(pool, date)).not.toBe(todaysGade(pool, new Date(2026, 9, 2)));
  });

  it("deals the answer words plus exactly one decoy, the same way all day", () => {
    const puzzle = todaysGade(pool, date)!;
    const tiles = gadeTiles(puzzle, pool, date);
    expect(tiles).toHaveLength(puzzle.answer.length + 1);
    expect(tiles.filter((w) => !puzzle.answer.includes(w))).toHaveLength(1);
    expect(gadeTiles(puzzle, pool, new Date(2026, 9, 1, 22))).toEqual(tiles);
  });
});

describe("gadeOutcome and rightPlaces", () => {
  const answer = ["ಬಾಯಿ", "ಮೊಸರು"];

  it("wins on the right order, loses after the last miss", () => {
    expect(gadeOutcome({ date: "d", tries: [] }, answer)).toBe("playing");
    expect(gadeOutcome({ date: "d", tries: [["ಮೊಸರು", "ಬಾಯಿ"], answer] }, answer)).toBe("won");
    expect(gadeOutcome({ date: "d", tries: Array(MAX_TRIES).fill(["ಮೊಸರು", "ಬಾಯಿ"]) }, answer)).toBe("lost");
  });

  it("marks the words already in the right slot", () => {
    expect(rightPlaces(["ಬಾಯಿ", "ಕೈ"], answer)).toEqual([true, false]);
  });

  it("keeps right-place words on their tiles for the next try, one tile per repeated word", () => {
    expect(keptSlots(["ಬಾಯಿ", "ಕೈ"], answer, ["ಕೈ", "ಮೊಸರು", "ಬಾಯಿ"])).toEqual([2, null]);
    expect(keptSlots(["ಹೂ", "ಹೂ", "ಮುಡಿ"], ["ಹೂ", "ಹೂ", "ಮುಡಿ"], ["ಮುಡಿ", "ಹೂ", "ಹೂ"])).toEqual([1, 2, 0]);
  });
});
