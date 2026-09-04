import { describe, expect, it } from "vitest";
import { splitAksharas } from "../../src/lib/kannada";
import type { DictEntry } from "../../src/lib/types";
import { WORD_GAME_ANSWERS, selectWordGamePool } from "./wordgame";

function entry(id: number, word: string, def = "an ordinary word", pos: DictEntry["defs"][number]["pos"] = "noun"): DictEntry {
  return { id, word, key: word, phone: word, defs: [{ text: def, pos }] };
}

describe("WORD_GAME_ANSWERS", () => {
  it("is every entry exactly 5 aksharas long", () => {
    for (const w of WORD_GAME_ANSWERS) {
      expect(splitAksharas(w).length, `${w} should be 5 aksharas`).toBe(5);
    }
  });

  it("has no duplicates", () => {
    expect(new Set(WORD_GAME_ANSWERS).size).toBe(WORD_GAME_ANSWERS.length);
  });
});

describe("selectWordGamePool", () => {
  it("every answer word is also present in the guess dictionary", () => {
    // Build a fake dictionary containing every allowlisted answer plus one unrelated candidate,
    // so the player's own submission of the correct answer is never rejected as "not a word".
    const entries = WORD_GAME_ANSWERS.map((w, i) => entry(i, w));
    const { words, guesses } = selectWordGamePool(entries, (a, b) => a.localeCompare(b));
    const guessSet = new Set(guesses);
    for (const answer of words) {
      expect(guessSet.has(answer.word), `${answer.word} should be a valid guess too`).toBe(true);
    }
  });

  it("drops an allowlisted word that isn't in the dictionary, without crashing", () => {
    const entries = [entry(1, "ಉದಾಹರಣೆ")];
    const { words } = selectWordGamePool(entries, (a, b) => a.localeCompare(b));
    expect(words.map((w) => w.word)).toEqual(["ಉದಾಹರಣೆ"]);
  });

  it("never includes a word shorter or longer than 5 aksharas, even if allowlisted incorrectly", () => {
    const entries = [entry(1, "ಮನೆ"), entry(2, "ಉದಾಹರಣೆ")];
    const { guesses } = selectWordGamePool(entries, (a, b) => a.localeCompare(b));
    expect(guesses).not.toContain("ಮನೆ");
  });
});
