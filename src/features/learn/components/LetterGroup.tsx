import { LetterCell } from "./LetterCell";

const COLS = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  5: "grid-cols-5",
} as const;

export function LetterGroup({
  title,
  letters,
  columns = 5,
}: {
  title: string;
  letters: readonly string[];
  columns?: keyof typeof COLS;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-base font-medium text-ink">{title}</h3>
      <div className={`grid ${COLS[columns]} gap-2`}>
        {letters.map((glyph) => (
          <LetterCell key={glyph} glyph={glyph} />
        ))}
      </div>
    </section>
  );
}
