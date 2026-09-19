import { LetterCell } from "./LetterCell";

/** Sub-group of a chart (a varga, the yogavāha…): small label over a 7-column tile grid. */
export function LetterGroup({ title, letters }: { title: string; letters: readonly string[] }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-sm font-medium text-secondary">{title}</h3>
      <div className="grid grid-cols-7 gap-1">
        {letters.map((glyph) => (
          <LetterCell key={glyph} glyph={glyph} />
        ))}
      </div>
    </section>
  );
}
