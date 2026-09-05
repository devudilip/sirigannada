import { describe, expect, it } from "vitest";
import { buildGrid } from "../../src/features/padabandha/lib/puzzle";
import { WORD_GAME_ANSWERS } from "./wordgame";
import { generatePuzzle, generatePuzzleSet, kannadaDigits, shortClue, type PadabandhaWord } from "./padabandha";

const WORDS: PadabandhaWord[] = WORD_GAME_ANSWERS.map((a) => ({
  word: a.word,
  clue: { kn: a.meaningKn, en: a.meaningEn ?? "" },
  clueSource: "original",
}));

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
