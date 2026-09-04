import { describe, expect, it } from "vitest";
import { BEGINNER_PADABANDHA } from "../data/puzzles";
import { buildGrid, entryById, entryValue, guessAtCell, isEntrySolved, parseStoredValues, revealLetter, solvedCount, writeEntry } from "./puzzle";

const grid = buildGrid(BEGINNER_PADABANDHA);

describe("buildGrid", () => {
  it("numbers shared starts once and preserves authored crossings", () => {
    const aramane = entryById(grid.entries, "aramane");
    const adige = entryById(grid.entries, "adige");
    expect(aramane.number).toBe(adige.number);
    expect(grid.cells[2]?.[4]).toMatchObject({ answer: "ಅ", entryIds: ["aramane", "adige"] });
  });

  it("rejects conflicting answers", () => {
    const broken = { ...BEGINNER_PADABANDHA, entries: [...BEGINNER_PADABANDHA.entries, { ...BEGINNER_PADABANDHA.entries[0]!, id: "broken", answer: "ಬಿಸಿಲು", direction: "down" as const }] };
    expect(() => buildGrid(broken)).toThrow(/conflict/);
  });
});

describe("guess state", () => {
  it("writes one akshara per cell and recognises a solved entry", () => {
    const entry = entryById(grid.entries, "kannada");
    const values = writeEntry({}, entry, "ಕನ್ನಡ");
    expect(entryValue(values, entry)).toBe("ಕನ್ನಡ");
    expect(isEntrySolved(values, entry)).toBe(true);
    expect(solvedCount(values, grid.entries)).toBe(1);
  });

  it("uses the selected answer at an intersecting cell", () => {
    const aramane = entryById(grid.entries, "aramane");
    const adige = entryById(grid.entries, "adige");
    const guesses = writeEntry(writeEntry({}, aramane, "ಇರಮನೆ"), adige, "ಅಡಿಗೆ");
    const crossing = grid.cells[2]?.[4];
    expect(crossing && guessAtCell(guesses, grid.entries, crossing, aramane.id)).toBe("ಇ");
    expect(crossing && guessAtCell(guesses, grid.entries, crossing, adige.id)).toBe("ಅ");
  });

  it("reveals the first missing or incorrect letter", () => {
    const entry = entryById(grid.entries, "nagara");
    expect(entryValue(revealLetter({}, entry), entry)).toBe("ನ");
  });

  it("ignores malformed persisted values", () => {
    expect(parseStoredValues(null)).toEqual({});
    expect(parseStoredValues({ "0:0": "ಕ", bad: 3 })).toEqual({ "0:0": "ಕ" });
  });
});
