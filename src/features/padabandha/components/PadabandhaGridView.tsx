import { useT } from "@/components/providers/AppProviders";
import type { EntryGuesses, NumberedEntry, PadabandhaCell, PadabandhaGrid } from "../types";
import { entryCellKeys, guessAtCell } from "../lib/puzzle";

/** The crossword grid. Letter squares are buttons: tapping one selects a clue through it. */
export function PadabandhaGridView({
  grid,
  guesses,
  selectedEntry,
  checked,
  onCellTap,
}: {
  grid: PadabandhaGrid;
  guesses: EntryGuesses;
  selectedEntry: NumberedEntry;
  checked: boolean;
  onCellTap: (cell: PadabandhaCell) => void;
}) {
  const t = useT();
  const selectedCells = new Set(entryCellKeys(selectedEntry));
  return (
    <div
      role="group"
      aria-label={t("padabandhaGridLabel")}
      className="grid w-full max-w-sm gap-px self-center overflow-hidden border border-line bg-line"
      style={{ gridTemplateColumns: `repeat(${grid.cells[0]?.length ?? 1}, minmax(0, 1fr))` }}
    >
      {grid.cells.flatMap((row, rowIndex) =>
        row.map((cell, columnIndex) => {
          if (!cell) return <span key={`${rowIndex}:${columnIndex}`} aria-hidden="true" className="aspect-square bg-surface" />;
          const key = `${rowIndex}:${columnIndex}`;
          const guess = guessAtCell(guesses, grid.entries, cell, selectedEntry.id);
          const correct = guess === cell.answer;
          const feedback = checked && guess ? (correct ? "bg-accent-soft" : "bg-paper-edge") : "bg-elevated";
          const selected = selectedCells.has(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => onCellTap(cell)}
              aria-current={selected ? "true" : undefined}
              aria-label={t("padabandhaCellLabel", {
                row: rowIndex + 1,
                column: columnIndex + 1,
                content: guess || t("padabandhaCellEmpty"),
              })}
              className={`relative flex aspect-square items-center justify-center ${feedback} ${selected ? "ring-2 ring-inset ring-accent" : ""}`}
            >
              {cell.number && <span aria-hidden="true" className="absolute left-0.5 top-0 text-xs leading-none text-muted">{cell.number}</span>}
              <span aria-hidden="true" lang="kn" className="text-base font-semibold text-ink sm:text-lg">{guess}</span>
            </button>
          );
        }),
      )}
    </div>
  );
}
