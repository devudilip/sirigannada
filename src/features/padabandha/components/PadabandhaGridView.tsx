import type { EntryGuesses, NumberedEntry, PadabandhaGrid } from "../types";
import { entryCellKeys, guessAtCell } from "../lib/puzzle";

export function PadabandhaGridView({
  grid,
  guesses,
  selectedEntry,
  checked,
}: {
  grid: PadabandhaGrid;
  guesses: EntryGuesses;
  selectedEntry: NumberedEntry;
  checked: boolean;
}) {
  const selectedCells = new Set(entryCellKeys(selectedEntry));
  return (
    <div
      aria-hidden="true"
      className="grid w-full max-w-sm gap-px self-center overflow-hidden rounded-md border border-line bg-line"
      style={{ gridTemplateColumns: `repeat(${grid.cells[0]?.length ?? 1}, minmax(0, 1fr))` }}
    >
      {grid.cells.flatMap((row, rowIndex) =>
        row.map((cell, columnIndex) => {
          if (!cell) return <span key={`${rowIndex}:${columnIndex}`} className="aspect-square bg-surface" />;
          const key = `${rowIndex}:${columnIndex}`;
          const guess = guessAtCell(guesses, grid.entries, cell, selectedEntry.id);
          const correct = guess === cell.answer;
          const feedback = checked && guess ? (correct ? "bg-accent-soft" : "bg-paper-edge") : "bg-elevated";
          return (
            <span
              key={key}
              className={`relative flex aspect-square items-center justify-center ${feedback} ${selectedCells.has(key) ? "ring-2 ring-inset ring-accent" : ""}`}
            >
              {cell.number && <span className="absolute left-0.5 top-0 text-xs leading-none text-muted">{cell.number}</span>}
              <span lang="kn" className="text-base font-semibold text-ink sm:text-lg">{guess}</span>
            </span>
          );
        }),
      )}
    </div>
  );
}
