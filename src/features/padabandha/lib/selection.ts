import type { NumberedEntry, PadabandhaCell } from "../types";
import { cellKey } from "./puzzle";

/** Clue order for ◀ ▶ and the clue list: across by number, then down by number. */
export function orderedEntries(entries: readonly NumberedEntry[]): NumberedEntry[] {
  const byNumber = (a: NumberedEntry, b: NumberedEntry) => a.number - b.number;
  return [
    ...entries.filter((entry) => entry.direction === "across").sort(byNumber),
    ...entries.filter((entry) => entry.direction === "down").sort(byNumber),
  ];
}

/** The clue before (`step` -1) or after (+1) `currentId`, wrapping around. */
export function adjacentEntryId(ordered: readonly NumberedEntry[], currentId: string, step: 1 | -1): string {
  if (ordered.length === 0) return currentId;
  const index = ordered.findIndex((entry) => entry.id === currentId);
  const next = (Math.max(index, 0) + step + ordered.length) % ordered.length;
  return ordered[next]?.id ?? currentId;
}

/**
 * Which clue a tap on `cell` selects. Tapping the same cell again flips between its across and
 * down clues. Otherwise a clue that starts at the cell wins, then the current clue if it passes
 * through the cell, then the cell's first clue.
 */
export function entryIdForCellTap(
  entries: readonly NumberedEntry[],
  cell: PadabandhaCell,
  currentId: string,
  repeatTap: boolean,
): string {
  const ids = cell.entryIds;
  if (repeatTap && ids.length > 1 && ids.includes(currentId)) {
    return ids[(ids.indexOf(currentId) + 1) % ids.length] ?? currentId;
  }
  const key = cellKey(cell.row, cell.column);
  const starting = entries.filter((entry) => ids.includes(entry.id) && cellKey(entry.row, entry.column) === key);
  if (starting.some((entry) => entry.id === currentId)) return currentId;
  if (starting[0]) return starting[0].id;
  if (ids.includes(currentId)) return currentId;
  return ids[0] ?? currentId;
}
