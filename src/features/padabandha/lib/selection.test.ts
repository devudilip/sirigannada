import { describe, expect, it } from "vitest";
import { BEGINNER_PADABANDHA } from "../data/puzzles";
import { buildGrid } from "./puzzle";
import { adjacentEntryId, entryIdForCellTap, orderedEntries } from "./selection";

const grid = buildGrid(BEGINNER_PADABANDHA);
const ordered = orderedEntries(grid.entries);
const cell = (row: number, column: number) => {
  const found = grid.cells[row]?.[column];
  if (!found) throw new Error(`no cell at ${row}:${column}`);
  return found;
};

describe("orderedEntries", () => {
  it("lists across clues by number, then down clues by number", () => {
    const directions = ordered.map((entry) => entry.direction);
    expect(directions.indexOf("down")).toBe(directions.lastIndexOf("across") + 1);
    const across = ordered.filter((entry) => entry.direction === "across").map((entry) => entry.number);
    expect(across).toEqual([...across].sort((a, b) => a - b));
  });
});

describe("adjacentEntryId", () => {
  it("steps forward and back, wrapping at both ends", () => {
    const first = ordered[0]!.id;
    const last = ordered[ordered.length - 1]!.id;
    expect(adjacentEntryId(ordered, first, 1)).toBe(ordered[1]!.id);
    expect(adjacentEntryId(ordered, first, -1)).toBe(last);
    expect(adjacentEntryId(ordered, last, 1)).toBe(first);
  });
});

describe("entryIdForCellTap", () => {
  it("prefers the clue that starts at the tapped cell", () => {
    expect(entryIdForCellTap(grid.entries, cell(4, 0), "nagara", false)).toBe("kannada");
  });

  it("keeps the current clue when it passes through the cell", () => {
    expect(entryIdForCellTap(grid.entries, cell(3, 4), "adige", false)).toBe("adige");
  });

  it("toggles across and down when the same cell is tapped again", () => {
    const start = cell(2, 4);
    const firstTap = entryIdForCellTap(grid.entries, start, "nagara", false);
    expect(firstTap).toBe("aramane");
    const secondTap = entryIdForCellTap(grid.entries, start, firstTap, true);
    expect(secondTap).toBe("adige");
    expect(entryIdForCellTap(grid.entries, start, secondTap, true)).toBe("aramane");
  });
});
