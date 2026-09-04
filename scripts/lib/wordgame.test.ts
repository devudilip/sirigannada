import { describe, expect, it } from "vitest";
import { splitAksharas } from "../../src/lib/kannada";
import type { DictEntry } from "../../src/lib/types";
import {
  MAX_WORD_GAME_LENGTH,
  MIN_WORD_GAME_LENGTH,
  WORD_GAME_ANSWERS,
  isWordGameCandidate,
  selectWordGamePool,
} from "./wordgame";

function entry(id: number, word: string, def = "an ordinary word", pos: DictEntry["defs"][number]["pos"] = "noun"): DictEntry {
  return { id, word, key: word, phone: word, defs: [{ text: def, pos }] };
}

describe("WORD_GAME_ANSWERS", () => {
  it("contains only playable-length familiar words with Kannada meanings", () => {
    for (const answer of WORD_GAME_ANSWERS) {
      const length = splitAksharas(answer.word).length;
      expect(length, `${answer.word} is too short`).toBeGreaterThanOrEqual(MIN_WORD_GAME_LENGTH);
      expect(length, `${answer.word} is too long`).toBeLessThanOrEqual(MAX_WORD_GAME_LENGTH);
      expect(answer.meaningKn.length).toBeGreaterThan(8);
      expect(answer.meaningEn.length).toBeGreaterThan(8);
    }
  });

  it("has at least two months of unique answers", () => {
    const words = WORD_GAME_ANSWERS.map((answer) => answer.word);
    expect(new Set(words).size).toBe(words.length);
    expect(words.length).toBeGreaterThanOrEqual(120);
  });
});

describe("selectWordGamePool", () => {
  it("every answer word is also present in the guess dictionary", () => {
    // Build a fake dictionary containing every allowlisted answer plus one unrelated candidate,
    // so the player's own submission of the correct answer is never rejected as "not a word".
    const entries = WORD_GAME_ANSWERS.map((answer, i) => entry(i, answer.word));
    const { words, guesses } = selectWordGamePool(entries, (a, b) => a.localeCompare(b));
    const guessSet = new Set(guesses);
    for (const answer of words) {
      expect(guessSet.has(answer.word), `${answer.word} should be a valid guess too`).toBe(true);
    }
  });

  it("fails the build when a curated answer is absent", () => {
    const entries = WORD_GAME_ANSWERS
      .filter((answer) => answer.word !== "ಪುಸ್ತಕ")
      .map((answer, index) => entry(index, answer.word));
    expect(() => selectWordGamePool(entries, (a, b) => a.localeCompare(b))).toThrow(/ಪುಸ್ತಕ/);
  });

  it("never includes a word outside the 2–4-akshara range", () => {
    expect(isWordGameCandidate(entry(1, "ಅ"), new Set())).toBe(false);
    expect(isWordGameCandidate(entry(2, "ಪುಸ್ತಕ"), new Set())).toBe(true);
    expect(isWordGameCandidate(entry(3, "ಮಾವಿನಹಣ್ಣು"), new Set())).toBe(false);
  });
});
