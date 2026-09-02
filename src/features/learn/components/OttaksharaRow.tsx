"use client";

export function OttaksharaRow({
  conjunct,
  word,
  iso,
  gloss,
  speak,
  label,
}: {
  conjunct: string;
  word: string;
  iso: string;
  gloss: string;
  speak: ((text: string) => void) | null;
  label: string;
}) {
  const inner = (
    <>
      <span className="font-serif text-2xl text-ink" lang="kn">
        {conjunct}
      </span>
      <span className="font-serif text-lg text-ink" lang="kn">
        {word}
      </span>
      <span className="text-sm text-muted" lang="en">
        {iso}
      </span>
      <span className="text-sm text-secondary">{gloss}</span>
    </>
  );
  const className =
    "flex w-full flex-wrap items-baseline gap-x-3 gap-y-1 rounded-md border border-line bg-paper px-3 py-3 text-left";
  if (!speak) return <div className={className}>{inner}</div>;
  return (
    <button type="button" className={`${className} hover:border-accent`} aria-label={label} onClick={() => speak(word)}>
      {inner}
    </button>
  );
}
