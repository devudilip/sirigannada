"use client";

import { useT } from "@/components/providers/AppProviders";
import { splitAksharas } from "@/lib/kannada";
import { MAX_GUESSES } from "../lib/wordGameSession";
import { scoreGuess, type AksharaStatus } from "../lib/wordGameScore";

/** Scored tiles: coral = right place, ink = in the word, neutral-400 = not in it. */
export const TILE_STATUS_CLASS: Record<AksharaStatus, string> = {
  correct: "border-accent bg-accent text-on-accent",
  present: "border-ink bg-ink text-surface",
  absent: "border-neutral bg-neutral text-ink",
};

type CellKind = "empty" | "draft" | "active";
const CELL_KIND_CLASS: Record<CellKind, string> = {
  empty: "border border-line text-ink",
  draft: "border-2 border-ink text-ink",
  active: "border-2 border-accent text-ink",
};

function Cell({ akshara, status, kind, label }: { akshara: string; status: AksharaStatus | null; kind: CellKind; label?: string }) {
  return (
    <div
      role={status ? "img" : undefined}
      aria-label={label}
      className={`flex size-16 shrink-0 items-center justify-center font-serif text-2xl font-bold ${
        status ? `border ${TILE_STATUS_CLASS[status]}` : CELL_KIND_CLASS[kind]
      }`}
    >
      <span lang="kn" aria-hidden={Boolean(status)}>
        {akshara}
      </span>
    </div>
  );
}

/**
 * Adaptive-width × 6-row akshara grid: one row per past guess (coloured by `scoreGuess`), one
 * row for the in-progress draft (2 px ink, next empty cell coral), the rest empty. Each cell
 * holds a whole akshara string (possibly several codepoints, e.g. "ನ್ನ"), not a single character.
 */
export function WordGameGrid({ target, guesses, draft }: { target: string; guesses: readonly string[]; draft: string }) {
  const t = useT();
  const targetAksharas = splitAksharas(target);
  const draftAksharas = splitAksharas(draft);
  const rows: { aksharas: string[]; statuses: AksharaStatus[] | null; isDraft: boolean }[] = [];

  for (const guess of guesses) {
    const aksharas = splitAksharas(guess);
    rows.push({ aksharas, statuses: scoreGuess(aksharas, targetAksharas), isDraft: false });
  }
  if (rows.length < MAX_GUESSES) rows.push({ aksharas: draftAksharas, statuses: null, isDraft: true });
  while (rows.length < MAX_GUESSES) rows.push({ aksharas: [], statuses: null, isDraft: false });

  const statusLabel = (status: AksharaStatus): string =>
    t(status === "correct" ? "wordGameStatusCorrect" : status === "present" ? "wordGameStatusPresent" : "wordGameStatusAbsent");

  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label={t("wordGameTitle")} className="flex flex-col gap-2">
        {rows.map((row, r) => (
          <div key={`row-${r}`} className="flex gap-2">
            {Array.from({ length: targetAksharas.length }, (_, c) => {
              const akshara = row.aksharas[c] ?? "";
              const status = row.statuses?.[c] ?? null;
              const kind: CellKind = row.isDraft ? (c === row.aksharas.length ? "active" : "draft") : "empty";
              const label = status ? t("wordGameCellLabel", { n: c + 1, status: statusLabel(status) }) : undefined;
              return <Cell key={`cell-${c}`} akshara={akshara} status={status} kind={kind} label={label} />;
            })}
          </div>
        ))}
      </div>
      <ul aria-label={t("wordGameLegend")} className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-secondary">
        {(["correct", "present", "absent"] as const).map((status) => (
          <li key={status} className="flex items-center gap-1.5">
            <span aria-hidden="true" className={`inline-block size-2.5 shrink-0 ${TILE_STATUS_CLASS[status]}`} />
            {statusLabel(status)}
          </li>
        ))}
      </ul>
    </div>
  );
}
