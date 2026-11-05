import { describe, expect, it } from "vitest";
import { buildGrid } from "../../src/features/padabandha/lib/puzzle";
import { WORD_GAME_ANSWERS } from "./wordgame";
import {
  generatePuzzle,
  generatePuzzleSet,
  isPlayableWord,
  kannadaDigits,
  revealsEachOther,
  shortClue,
  type PadabandhaWord,
} from "./padabandha";
import { PADABANDHA_EXTRA_WORDS } from "./padabandhaWords";

const WORDS: PadabandhaWord[] = WORD_GAME_ANSWERS.map((a) => ({
  word: a.word,
  clue: { kn: a.meaningKn, en: a.meaningEn ?? "" },
  clueSource: "original",
}));

const ALL_WORDS: PadabandhaWord[] = [...WORD_GAME_ANSWERS, ...PADABANDHA_EXTRA_WORDS].map((a) => ({
  word: a.word,
  clue: { kn: a.meaningKn, en: a.meaningEn ?? "" },
  clueSource: "original",
}));

describe("crossword word list", () => {
  it("has each word once, playable, with both clues", () => {
    const words = ALL_WORDS.map((w) => w.word);
    expect(new Set(words).size).toBe(words.length);
    for (const w of ALL_WORDS) {
      expect(isPlayableWord(w.word), w.word).toBe(true);
      expect(w.clue.kn.length, w.word).toBeGreaterThan(0);
      expect(w.clue.en.length, w.word).toBeGreaterThan(0);
    }
  });

  it("never puts the answer inside its own Kannada clue", () => {
    for (const w of ALL_WORDS) expect(w.clue.kn.includes(w.word), w.word).toBe(false);
  });
});

describe("generatePuzzle", () => {
  it("is deterministic for a seed", () => {
    const a = generatePuzzle(WORDS, 7, 1);
    const b = generatePuzzle(WORDS, 7, 1);
    expect(a).toEqual(b);
  });

  it("produces a grid the game's own validator accepts, with every word crossing another", () => {
    const set = generatePuzzleSet(WORDS, 30);
    expect(set.length).toBe(30);
    for (const puzzle of set) {
      const grid = buildGrid(puzzle); // throws on overlap/out-of-bounds/uncrossed entries
      expect(grid.entries.length).toBeGreaterThanOrEqual(5);
      expect(puzzle.rows).toBeLessThanOrEqual(9);
      expect(puzzle.columns).toBeLessThanOrEqual(9);
      const words = puzzle.entries.map((e) => e.answer);
      expect(new Set(words).size).toBe(words.length);
    }
  });

  it("never lets two parallel words touch side by side", () => {
    for (const puzzle of generatePuzzleSet(WORDS, 40)) {
      const grid = buildGrid(puzzle);
      for (const entry of grid.entries) {
        for (let i = 0; i < entry.aksharas.length; i += 1) {
          const r = entry.row + (entry.direction === "down" ? i : 0);
          const c = entry.column + (entry.direction === "across" ? i : 0);
          const cell = grid.cells[r]?.[c];
          expect(cell).toBeTruthy();
          if (cell!.entryIds.length === 1) {
            // A cell used by only this word must not have filled perpendicular neighbours.
            const [n1, n2] = entry.direction === "across" ? [grid.cells[r - 1]?.[c], grid.cells[r + 1]?.[c]] : [grid.cells[r]?.[c - 1], grid.cells[r]?.[c + 1]];
            expect(n1 ?? null).toBeNull();
            expect(n2 ?? null).toBeNull();
          }
        }
      }
    }
  });

  it("gives distinct puzzles distinct word sets", () => {
    const set = generatePuzzleSet(WORDS, 20);
    const sigs = new Set(set.map((p) => p.entries.map((e) => e.answer).sort().join("|")));
    expect(sigs.size).toBe(20);
  });

  it("never shows a clue that contains another answer in the same grid", () => {
    for (const puzzle of generatePuzzleSet(ALL_WORDS, 60)) {
      const byWord = new Map(ALL_WORDS.map((w) => [w.word, w]));
      for (const a of puzzle.entries) {
        for (const b of puzzle.entries) {
          if (a !== b) expect(revealsEachOther(byWord.get(a.answer)!, byWord.get(b.answer)!), `${a.answer}/${b.answer}`).toBe(false);
        }
      }
    }
  });

  it("rotates through the word list instead of reusing a few favourites", () => {
    const set = generatePuzzleSet(ALL_WORDS, 120, 1, 120 * 50);
    expect(set.length).toBe(120);
    const counts = new Map<string, number>();
    for (const e of set.flatMap((p) => p.entries)) counts.set(e.answer, (counts.get(e.answer) ?? 0) + 1);
    expect(counts.size).toBeGreaterThan(ALL_WORDS.length * 0.8);
    expect(Math.max(...counts.values())).toBeLessThanOrEqual(8);
  });

  it("numbers titles in Kannada digits", () => {
    expect(kannadaDigits(12)).toBe("೧೨");
    expect(generatePuzzle(WORDS, 3, 12)?.title.kn).toBe("ಪದಬಂಧ · ೧೨");
  });

  it("trims dictionary definitions to one short sense", () => {
    expect(shortClue("to emit a loud sound; to roar.")).toBe("to emit a loud sound");
    expect(shortClue("(fig.) a building or a room where goods are sold; a shop; a mart.")).toBe("a building or a room where goods are sold");
    expect(shortClue("the condition of rest, that naturally and regularly recurs, during which the eyes are closed and the body relaxes").endsWith("…")).toBe(true);
    expect(shortClue("a shop.")).toBe("a shop");
    expect(shortClue("an irrigated, agricultural land, usu. where paddy is grown; a field.")).toBe("an irrigated, agricultural land, usu. where paddy is grown");
  });
});
