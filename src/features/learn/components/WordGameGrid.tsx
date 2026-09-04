"use client";

import { useT } from "@/components/providers/AppProviders";
import { splitAksharas } from "@/lib/kannada";
import { MAX_GUESSES, WORD_GAME_LENGTH } from "../lib/wordGameSession";
import { scoreGuess, type AksharaStatus } from "../lib/wordGameScore";

const STATUS_CLASS: Record<AksharaStatus, string> = {
  correct: "border-accent bg-accent text-on-accent",
  present: "border-gold bg-gold-soft text-ink",
  absent: "border-line-strong bg-paper-edge text-secondary",
};

function Cell({ akshara, status, label }: { akshara: string; status: AksharaStatus | null; label?: string }) {
  return (
    <div
      role={status ? "img" : undefined}
      aria-label={label}
      className={`flex size-12 shrink-0 items-center justify-center rounded-md border font-serif text-xl font-semibold sm:size-14 sm:text-2xl ${
        status ? STATUS_CLASS[status] : "border-line bg-elevated text-ink"
      }`}
    >
      <span lang="kn" aria-hidden={Boolean(status)}>
        {akshara}
      </span>
    </div>
  );
}

/**
 * 5-column × 6-row akshara grid: one row per past guess (coloured by `scoreGuess`), one row for
 * the in-progress draft (no colour yet), the rest empty. Each cell holds a whole akshara string
 * (possibly several codepoints, e.g. "ನ್ನ"), not a single character.
 */
export function WordGameGrid({
  target,
  guesses,
  draft,
}: {
  target: string;
  guesses: readonly string[];
  draft: string;
}) {
  const t = useT();
  const targetAksharas = splitAksharas(target);
  const draftAksharas = splitAksharas(draft);
  const rows: { aksharas: string[]; statuses: AksharaStatus[] | null }[] = [];

  for (const guess of guesses) {
    const aksharas = splitAksharas(guess);
    rows.push({ aksharas, statuses: scoreGuess(aksharas, targetAksharas) });
  }
  if (rows.length < MAX_GUESSES) {
    rows.push({ aksharas: draftAksharas, statuses: null });
  }
  while (rows.length < MAX_GUESSES) {
    rows.push({ aksharas: [], statuses: null });
  }

  const statusLabel = (status: AksharaStatus): string =>
    t(status === "correct" ? "wordGameStatusCorrect" : status === "present" ? "wordGameStatusPresent" : "wordGameStatusAbsent");

  return (
    <div role="group" aria-label={t("wordGameTitle")} className="flex flex-col gap-2">
      {rows.map((row, r) => (
        <div key={`row-${r}`} className="flex gap-2">
          {Array.from({ length: WORD_GAME_LENGTH }, (_, c) => {
            const akshara = row.aksharas[c] ?? "";
            const status = row.statuses?.[c] ?? null;
            const label = status
              ? t("wordGameCellLabel", { n: c + 1, status: statusLabel(status) })
              : undefined;
            return <Cell key={`cell-${c}`} akshara={akshara} status={status} label={label} />;
          })}
        </div>
      ))}
    </div>
  );
}
