"use client";

import { useEffect, useMemo, useState } from "react";
import { useT } from "@/components/providers/AppProviders";
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
  WORD_GAME_LENGTH,
  loadWordGameState,
  saveWordGameState,
  submitGuess,
  type WordGameState,
} from "../lib/wordGameSession";
import { WordGameGrid } from "./WordGameGrid";

/**
 * Daily 5-akshara guess game (L-05): fourth practice mode. Fully offline — the pool is a static
 * JSON file shipped under public/data/dict/, and the puzzle for "today" is a pure function of
 * the player's local date, so it needs no network call and no account. Deliberately not promoted
 * anywhere outside this page (see PracticeHub's doc comment / AGENTS.md non-goals).
 */
export function PracticeWordGame() {
  const t = useT();
  const [pool, setPool] = useState<WordGamePool | null>(null);
  const [state, setState] = useState<WordGameState | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [keyboardOpen, setKeyboardOpen] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/data/dict/wordgame-5.json")
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

  const insertText = (text: string) => setDraft((d) => insertAtCursor(d, text, null).text);
  const backspace = () => setDraft((d) => backspaceAtCursor(d, null).text);

  const submit = () => {
    if (!state || !entry) return;
    if (splitAksharas(draft).length !== WORD_GAME_LENGTH) {
      setError(t("wordGameTooShort"));
      return;
    }
    if (!validGuesses.has(draft)) {
      setError(t("wordGameNotInPool"));
      return;
    }
    setError(null);
    const next = submitGuess(state, draft);
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
      <p className="text-sm text-secondary">{t("wordGameInstructions")}</p>
      <p className="text-sm text-muted">
        {t("wordGameGuessCount", { n: Math.min(state.guesses.length + (done ? 0 : 1), MAX_GUESSES), total: MAX_GUESSES })}
      </p>

      <WordGameGrid target={entry.word} guesses={state.guesses} draft={done ? "" : draft} />

      {error && (
        <p role="status" className="text-sm font-medium text-accent">
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
          <p lang="en" className="text-sm text-secondary">
            {t("wordGameMeaning", { meaning: entry.meaning })}
          </p>
          <p className="text-xs text-muted">{t("wordGameComeBackTomorrow")}</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Button onClick={submit} disabled={splitAksharas(draft).length !== WORD_GAME_LENGTH}>
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
        </>
      )}
    </div>
  );
}
