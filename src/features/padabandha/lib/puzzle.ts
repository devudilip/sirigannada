import type {
  EntryGuesses,
  NumberedEntry,
  PadabandhaCell,
  PadabandhaEntry,
  PadabandhaGrid,
  PadabandhaPuzzle,
} from "../types";
import { splitAksharas } from "@/lib/kannada";
import { cleanKannadaGuess } from "./aksharas";

export function cellKey(row: number, column: number): string {
  return `${row}:${column}`;
}

function parseCellKey(key: string): readonly [number, number] {
  const separator = key.indexOf(":");
  return [Number(key.slice(0, separator)), Number(key.slice(separator + 1))];
}

export function entryCellKeys(entry: Pick<NumberedEntry, "row" | "column" | "direction" | "aksharas">): string[] {
  return entry.aksharas.map((_, index) =>
    cellKey(entry.row + (entry.direction === "down" ? index : 0), entry.column + (entry.direction === "across" ? index : 0)),
  );
}

/** Builds and validates the authored grid. Invalid content fails loudly during tests/build. */
export function buildGrid(puzzle: PadabandhaPuzzle): PadabandhaGrid {
  const cells = Array.from({ length: puzzle.rows }, () => Array<PadabandhaCell | null>(puzzle.columns).fill(null));
  const starts = new Set(puzzle.entries.map((entry) => cellKey(entry.row, entry.column)));
  const numberedStarts = [...starts].sort((a, b) => {
    const [ar, ac] = parseCellKey(a);
    const [br, bc] = parseCellKey(b);
    return ar - br || ac - bc;
  });
  const numberByStart = new Map(numberedStarts.map((key, index) => [key, index + 1]));

  const entries: NumberedEntry[] = puzzle.entries.map((entry) => {
    const aksharas = splitAksharas(entry.answer);
    if (aksharas.length < 2) throw new Error(`Padabandha answer is too short: ${entry.id}`);
    const numbered: NumberedEntry = { ...entry, aksharas, number: numberByStart.get(cellKey(entry.row, entry.column)) ?? 0 };
    entryCellKeys(numbered).forEach((key, index) => {
      const [row, column] = parseCellKey(key);
      if (row < 0 || column < 0 || row >= puzzle.rows || column >= puzzle.columns) throw new Error(`Padabandha entry is outside grid: ${entry.id}`);
      const answer = aksharas[index] ?? "";
      const existing = cells[row]?.[column];
      if (existing && existing.answer !== answer) throw new Error(`Padabandha entries conflict at ${key}`);
      if (existing) existing.entryIds.push(entry.id);
      else cells[row]![column] = { row, column, answer, entryIds: [entry.id], number: numberByStart.get(key) };
    });
    return numbered;
  });

  if (entries.some((entry) => entryCellKeys(entry).every((key) => {
    const [row, column] = parseCellKey(key);
    return cells[row]?.[column]?.entryIds.length === 1;
  }))) {
    throw new Error("Every Padabandha entry must cross another entry");
  }
  return { cells, entries };
}

export function entryValue(guesses: EntryGuesses, entry: NumberedEntry): string {
  return guesses[entry.id] ?? "";
}

export function writeEntry(guesses: EntryGuesses, entry: NumberedEntry, rawValue: string): EntryGuesses {
  const guess = splitAksharas(cleanKannadaGuess(rawValue)).slice(0, entry.aksharas.length).join("");
  return { ...guesses, [entry.id]: guess };
}

export function isEntrySolved(guesses: EntryGuesses, entry: NumberedEntry): boolean {
  return entryValue(guesses, entry) === entry.answer.normalize("NFC");
}

export function solvedCount(guesses: EntryGuesses, entries: readonly NumberedEntry[]): number {
  return entries.filter((entry) => isEntrySolved(guesses, entry)).length;
}

export function revealLetter(guesses: EntryGuesses, entry: NumberedEntry): EntryGuesses {
  const current = splitAksharas(entryValue(guesses, entry));
  const index = entry.aksharas.findIndex((answer, i) => current[i] !== answer);
  if (index < 0) return guesses;
  current[index] = entry.aksharas[index] ?? "";
  return { ...guesses, [entry.id]: current.slice(0, entry.aksharas.length).join("") };
}

export function parseStoredValues(value: unknown): EntryGuesses {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
}

/** Chooses the selected entry's letter at a crossing, falling back to another entered answer. */
export function guessAtCell(
  guesses: EntryGuesses,
  entries: readonly NumberedEntry[],
  cell: PadabandhaCell,
  selectedEntryId: string,
): string {
  const orderedIds = [selectedEntryId, ...cell.entryIds.filter((id) => id !== selectedEntryId)];
  for (const id of orderedIds) {
    if (!cell.entryIds.includes(id)) continue;
    const entry = entryById(entries, id);
    const index = entryCellKeys(entry).indexOf(cellKey(cell.row, cell.column));
    const guess = splitAksharas(entryValue(guesses, entry))[index];
    if (guess) return guess;
  }
  return "";
}

export function entryById(entries: readonly NumberedEntry[], id: string): NumberedEntry {
  const entry = entries.find((candidate) => candidate.id === id);
  if (!entry) throw new Error(`Unknown Padabandha entry: ${id}`);
  return entry;
}
