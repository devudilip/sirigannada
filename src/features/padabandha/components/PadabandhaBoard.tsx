"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useApp, useT } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/Button";
import { readStorage, writeStorage } from "@/lib/storage";
import type { EntryGuesses, PadabandhaCell, PadabandhaPuzzle } from "../types";
import { localized } from "../types";
import { readAnswerInput } from "../lib/latinAnswer";
import {
  buildGrid,
  cellKey,
  entryById,
  entryValue,
  parseStoredValues,
  revealLetter,
  solvedCount,
  writeEntry,
} from "../lib/puzzle";
import { adjacentEntryId, entryIdForCellTap, orderedEntries } from "../lib/selection";
import { PadabandhaAnswerPanel } from "./PadabandhaAnswerPanel";
import { PadabandhaClues } from "./PadabandhaClues";
import { PadabandhaGridView } from "./PadabandhaGridView";

/**
 * One crossword board. Mount with `key={puzzle.id}` so switching puzzles resets local state;
 * answers persist per puzzle id in localStorage (Kannada only — Latin drafts live in memory).
 */
export function PadabandhaBoard({ puzzle }: { puzzle: PadabandhaPuzzle }) {
  const t = useT();
  const { locale } = useApp();
  const GRID = useMemo(() => buildGrid(puzzle), [puzzle]);
  const ORDERED = useMemo(() => orderedEntries(GRID.entries), [GRID]);
  const STORAGE_KEY = `padabandha:${puzzle.id}:v1`;
  const usesAlar = puzzle.entries.some((entry) => entry.clueSource === "alar");
  const [selectedId, setSelectedId] = useState(ORDERED[0]?.id ?? "");
  const [guesses, setGuesses] = useState<EntryGuesses>({});
  const [latinDrafts, setLatinDrafts] = useState<Readonly<Record<string, string>>>({});
  const [hydrated, setHydrated] = useState(false);
  const [checked, setChecked] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const lastTappedCell = useRef<string | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = useMemo(() => entryById(GRID.entries, selectedId), [GRID, selectedId]);
  const done = solvedCount(guesses, GRID.entries);
  const complete = done === GRID.entries.length;

  useEffect(() => {
    setGuesses(parseStoredValues(readStorage<unknown>(STORAGE_KEY, {})));
    setHydrated(true);
  }, [STORAGE_KEY]);

  useEffect(() => {
    if (hydrated) writeStorage(STORAGE_KEY, guesses);
  }, [guesses, hydrated, STORAGE_KEY]);

  const setLatin = (entryId: string, latin: string) => setLatinDrafts((current) => ({ ...current, [entryId]: latin }));

  const answer = (raw: string) => {
    const { latin, kannada } = readAnswerInput(raw);
    setLatin(selected.id, latin);
    setGuesses((current) => writeEntry(current, selected, kannada));
    setChecked(false);
  };

  /** Brings the clue + answer box into view; with the on-screen keyboard up, pins it to the top. */
  const revealAnswerArea = (focus: boolean) => {
    window.requestAnimationFrame(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      areaRef.current?.scrollIntoView({ block: keyboardOpen ? "start" : "nearest", behavior: reduce ? "auto" : "smooth" });
      if (focus) inputRef.current?.focus({ preventScroll: true });
    });
  };

  useEffect(() => {
    if (!keyboardOpen) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    areaRef.current?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
  }, [keyboardOpen]);

  /** Selects a clue, brings the answer area into view and puts the cursor in the answer box. */
  const select = (id: string) => {
    setSelectedId(id);
    setChecked(false);
    revealAnswerArea(true);
  };

  const selectFromList = (id: string) => {
    lastTappedCell.current = null;
    select(id);
  };

  const tapCell = (cell: PadabandhaCell) => {
    const key = cellKey(cell.row, cell.column);
    const id = entryIdForCellTap(GRID.entries, cell, selectedId, lastTappedCell.current === key);
    lastTappedCell.current = key;
    select(id);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className=" border border-line bg-paper p-4">
        <p className="text-base leading-relaxed text-secondary">{t("padabandhaInstructions")}</p>
        <p className="mt-2 text-base font-medium text-ink" aria-live="polite">
          {t("padabandhaProgress", { done, total: GRID.entries.length })}
        </p>
      </div>

      <PadabandhaGridView grid={GRID} guesses={guesses} selectedEntry={selected} checked={checked} onCellTap={tapCell} />

      <PadabandhaAnswerPanel
        entry={selected}
        kannada={entryValue(guesses, selected)}
        latin={latinDrafts[selected.id] ?? ""}
        locale={locale}
        keyboardOpen={keyboardOpen}
        areaRef={areaRef}
        inputRef={inputRef}
        onAnswer={answer}
        onPrev={() => selectFromList(adjacentEntryId(ORDERED, selectedId, -1))}
        onNext={() => selectFromList(adjacentEntryId(ORDERED, selectedId, 1))}
        onCheck={() => setChecked(true)}
        onHint={() => {
          setLatin(selected.id, "");
          setGuesses((current) => revealLetter(current, selected));
          setChecked(false);
        }}
        onClear={() => answer("")}
        onKeyboardOpen={setKeyboardOpen}
      />

      {checked && (
        <p role="status" className=" border border-line bg-paper p-3 text-base font-medium text-ink">
          {complete ? t("padabandhaComplete") : t("padabandhaTryAgain")}
          {complete && <span className="mt-1 block font-normal text-secondary">{t("padabandhaComeBackTomorrow")}</span>}
        </p>
      )}

      <PadabandhaClues entries={ORDERED} guesses={guesses} locale={locale} selectedId={selectedId} onSelect={selectFromList} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <a
          href="https://creativecommons.org/licenses/by-sa/4.0/"
          target="_blank"
          rel="noreferrer"
          className="text-base text-secondary underline decoration-line-strong underline-offset-4 hover:text-ink"
        >
          {t("padabandhaLicense")} · {localized(puzzle.provenance.creator, locale)}
        </a>
        {usesAlar && <p className="w-full text-sm text-muted">{t("padabandhaAlarCredit")}</p>}
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            if (!window.confirm(t("padabandhaResetConfirm"))) return;
            setGuesses({});
            setLatinDrafts({});
            setChecked(false);
          }}
        >
          {t("padabandhaReset")}
        </Button>
      </div>

      {/* Room for the fixed on-screen keyboard so the last rows can scroll above it. */}
      {keyboardOpen && <div aria-hidden="true" className="h-[45dvh] shrink-0" />}
    </div>
  );
}
