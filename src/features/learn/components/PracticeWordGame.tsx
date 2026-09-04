"use client";

import { useEffect, useMemo, useState, type SyntheticEvent } from "react";
import { useApp, useT } from "@/components/providers/AppProviders";
import { Button, IconButton } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Card";
import { KeyboardIcon } from "@/components/icons";
import { splitAksharas } from "@/lib/kannada";
import type { WordGamePool } from "@/lib/types";
import { backspaceAtCursor, insertAtCursor } from "@/features/dictionary/lib/insertAtCursor";
import { KannadaKeyboard } from "@/features/dictionary/components/KannadaKeyboard";
import { dailyPoolIndex, dateKey } from "../lib/wordGameDay";
import {
  MAX_GUESSES,
  loadWordGameState,
  saveWordGameState,
  submitGuess,
  type WordGameState,
} from "../lib/wordGameSession";
import { WordGameGrid } from "./WordGameGrid";

/**
 * Daily adaptive-length guess game (L-05/L-15): fourth practice mode. Fully offline — the pool is a static
 * JSON file shipped under public/data/dict/, and the puzzle for "today" is a pure function of
 * the player's local date, so it needs no network call and no account. Deliberately not promoted
 * anywhere outside this page (see PracticeHub's doc comment / AGENTS.md non-goals).
 */
export function PracticeWordGame() {
  const t = useT();
  const { locale } = useApp();
  const [pool, setPool] = useState<WordGamePool | null>(null);
  const [state, setState] = useState<WordGameState | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [cursor, setCursor] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/data/dict/wordgame.json")
      .then((res) => (res.ok ? (res.json() as Promise<WordGamePool>) : null))
      .then((data) => {
        if (!cancelled) setPool(data);
      })
      .catch(() => {
        if (!cancelled) setPool({ words: [], guesses: [], builtAt: "" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const today = useMemo(() => new Date(), []);
  const entry = useMemo(() => {
    if (!pool || pool.words.length === 0) return null;
    return pool.words[dailyPoolIndex(today, pool.words.length)] ?? null;
  }, [pool, today]);

  useEffect(() => {
    if (!entry) return;
    setState(loadWordGameState(dateKey(today), entry.word));
    setDraft("");
    setError(null);
  }, [entry, today]);

  const validGuesses = useMemo(() => new Set(pool?.guesses ?? []), [pool]);
  const targetLength = entry ? splitAksharas(entry.word).length : 0;
  const captureCursor = (event: SyntheticEvent<HTMLInputElement>) => {
    setCursor(event.currentTarget.selectionStart);
  };

  const insertText = (text: string) => {
    const result = insertAtCursor(draft, text, cursor);
    setDraft(result.text);
    setCursor(result.cursor);
  };
  const backspace = () => {
    const result = backspaceAtCursor(draft, cursor);
    setDraft(result.text);
    setCursor(result.cursor);
  };

  const submit = () => {
    if (!state || !entry) return;
    const guess = draft.normalize("NFC").trim();
    if (splitAksharas(guess).length !== targetLength) {
      setError(t("wordGameWrongLength", { count: targetLength }));
      return;
    }
    if (!validGuesses.has(guess)) {
      setError(t("wordGameNotInPool"));
      return;
    }
    setError(null);
    const next = submitGuess(state, guess);
    setState(next);
    saveWordGameState(next);
    setDraft("");
  };

  if (pool === null) {
    return <Skeleton className="h-64 w-full" />;
  }
  if (!entry || !state) {
    return <p className="text-base text-secondary">{t("wordGameLoadError")}</p>;
  }

  const done = state.outcome !== "playing";

  return (
    <div className="flex flex-col gap-4">
      <p className="text-base text-secondary">{t("wordGameInstructions", { count: targetLength })}</p>
      <p className="text-base text-muted">
        {t("wordGameGuessCount", { n: Math.min(state.guesses.length + (done ? 0 : 1), MAX_GUESSES), total: MAX_GUESSES })}
      </p>

      <WordGameGrid target={entry.word} guesses={state.guesses} draft={done ? "" : draft} />

      {error && (
        <p id="word-game-error" role="status" className="text-base font-medium text-accent">
          {error}
        </p>
      )}

      {done ? (
        <div className="flex flex-col gap-2 rounded-lg border border-line bg-elevated p-4">
          <p role="status" className="text-lg font-semibold text-ink">
            {state.outcome === "won" ? t("wordGameWon") : t("wordGameLost")}
          </p>
          <p lang="kn" className="font-serif text-xl text-ink">
            {t("wordGameAnswerWas", { word: entry.word })}
          </p>
          <p lang={locale} className="text-base text-secondary">
            {t("wordGameMeaning", { meaning: entry.meaning[locale] })}
          </p>
          <p className="text-base text-muted">{t("wordGameComeBackTomorrow")}</p>
        </div>
      ) : (
        <form
          className="flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <label htmlFor="word-game-guess" className="text-base font-semibold text-ink">
            {t("wordGameInputLabel", { count: targetLength })}
          </label>
          <input
            id="word-game-guess"
            lang="kn"
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              setCursor(event.target.selectionStart);
              setError(null);
            }}
            onSelect={captureCursor}
            onClick={captureCursor}
            onKeyUp={captureCursor}
            onFocus={captureCursor}
            aria-describedby={error ? "word-game-error" : undefined}
            autoComplete="off"
            autoCapitalize="none"
            enterKeyHint="done"
            spellCheck={false}
            className="h-12 w-full rounded-md border border-line bg-elevated px-3 font-serif text-xl text-ink outline-none transition-colors focus:border-accent"
          />
          <div className="flex items-center gap-2">
            <Button type="submit">
              {t("wordGameSubmit")}
            </Button>
            <IconButton
              onClick={() => setKeyboardOpen((v) => !v)}
              aria-label={keyboardOpen ? t("kbdCloseKeyboard") : t("kbdOpenKeyboard")}
              aria-pressed={keyboardOpen}
            >
              <KeyboardIcon size={20} />
            </IconButton>
          </div>
          <KannadaKeyboard
            open={keyboardOpen}
            onInsert={insertText}
            onBackspace={backspace}
            onClose={() => setKeyboardOpen(false)}
          />
        </form>
      )}
    </div>
  );
}
