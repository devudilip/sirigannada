"use client";

import { useEffect, useMemo, useState } from "react";
import { KeyboardIcon } from "@/components/icons";
import { useApp, useT } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/Button";
import { KannadaKeyboard } from "@/features/dictionary/components/KannadaKeyboard";
import { readStorage, writeStorage } from "@/lib/storage";
import { BEGINNER_PADABANDHA } from "../data/puzzles";
import type { EntryGuesses } from "../types";
import { localized } from "../types";
import {
  buildGrid,
  entryById,
  entryValue,
  parseStoredValues,
  revealLetter,
  solvedCount,
  writeEntry,
} from "../lib/puzzle";
import { PadabandhaClues } from "./PadabandhaClues";
import { PadabandhaGridView } from "./PadabandhaGridView";

const GRID = buildGrid(BEGINNER_PADABANDHA);
const STORAGE_KEY = `padabandha:${BEGINNER_PADABANDHA.id}:v1`;

export function PadabandhaGame() {
  const t = useT();
  const { locale } = useApp();
  const [selectedId, setSelectedId] = useState(GRID.entries[0]?.id ?? "");
  const [guesses, setGuesses] = useState<EntryGuesses>({});
  const [hydrated, setHydrated] = useState(false);
  const [checked, setChecked] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const selected = useMemo(() => entryById(GRID.entries, selectedId), [selectedId]);
  const done = solvedCount(guesses, GRID.entries);
  const complete = done === GRID.entries.length;
  const value = entryValue(guesses, selected);

  useEffect(() => {
    setGuesses(parseStoredValues(readStorage<unknown>(STORAGE_KEY, {})));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeStorage(STORAGE_KEY, guesses);
  }, [guesses, hydrated]);

  const updateGuess = (next: string) => {
    setGuesses((current) => writeEntry(current, selected, next));
    setChecked(false);
  };

  const clearSelected = () => updateGuess("");

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-line bg-paper p-4">
        <p className="text-base leading-relaxed text-secondary">{t("padabandhaInstructions")}</p>
        <p className="mt-2 text-base font-medium text-ink" aria-live="polite">
          {t("padabandhaProgress", { done, total: GRID.entries.length })}
        </p>
      </div>

      <PadabandhaGridView grid={GRID} guesses={guesses} selectedEntry={selected} checked={checked} />

      <form
        className="rounded-lg border border-line bg-elevated p-4"
        onSubmit={(event) => {
          event.preventDefault();
          setChecked(true);
        }}
      >
        <label htmlFor="padabandha-answer" className="block text-base font-semibold text-ink">
          {t("padabandhaAnswer", { number: selected.number })}
        </label>
        <p lang={locale} className="mt-1 text-base text-secondary">{localized(selected.clue, locale)}</p>
        <input
          id="padabandha-answer"
          lang="kn"
          value={value}
          onChange={(event) => updateGuess(event.target.value)}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          className="mt-3 h-12 w-full rounded-md border border-line bg-surface px-3 font-serif text-xl text-ink outline-none transition-colors focus:border-accent"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="submit" variant="primary">{t("padabandhaCheck")}</Button>
          <Button type="button" variant="secondary" onClick={() => { setGuesses((current) => revealLetter(current, selected)); setChecked(false); }}>
            {t("padabandhaHint")}
          </Button>
          <Button type="button" variant="secondary" onClick={clearSelected}>{t("padabandhaClear")}</Button>
          <Button
            type="button"
            variant="secondary"
            aria-expanded={keyboardOpen}
            onClick={() => setKeyboardOpen((open) => !open)}
          >
            <KeyboardIcon size={18} />
            {t("padabandhaKeyboard")}
          </Button>
        </div>
        <KannadaKeyboard
          open={keyboardOpen}
          onClose={() => setKeyboardOpen(false)}
          onInsert={(text) => updateGuess(value + text)}
          onBackspace={() => updateGuess(Array.from(value).slice(0, -1).join(""))}
        />
      </form>

      {checked && (
        <p role="status" className="rounded-md border border-line bg-paper p-3 text-base font-medium text-ink">
          {complete ? t("padabandhaComplete") : t("padabandhaTryAgain")}
        </p>
      )}

      <PadabandhaClues
        entries={GRID.entries}
        guesses={guesses}
        locale={locale}
        selectedId={selectedId}
        onSelect={(id) => { setSelectedId(id); setChecked(false); }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <a
          href="https://creativecommons.org/licenses/by-sa/4.0/"
          target="_blank"
          rel="noreferrer"
          className="text-base text-secondary underline decoration-line-strong underline-offset-4 hover:text-ink"
        >
          {t("padabandhaLicense")} · {localized(BEGINNER_PADABANDHA.provenance.creator, locale)}
        </a>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            if (!window.confirm(t("padabandhaResetConfirm"))) return;
            setGuesses({});
            setChecked(false);
          }}
        >
          {t("padabandhaReset")}
        </Button>
      </div>
    </div>
  );
}
