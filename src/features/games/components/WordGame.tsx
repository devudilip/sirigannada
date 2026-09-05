"use client";

import { useEffect, useMemo, useState } from "react";
import { useApp, useT } from "@/components/providers/AppProviders";
import { Skeleton } from "@/components/ui/Card";
import { splitAksharas } from "@/lib/kannada";
import type { WordGamePool } from "@/lib/types";
import { loadRounds, nextRound, saveRounds } from "../lib/rounds";
import { dailyPoolIndex, dateKey } from "../lib/wordGameDay";
import { MAX_GUESSES, loadWordGameState, saveWordGameState, submitGuess, type WordGameState } from "../lib/wordGameSession";
import { RoundHeader } from "./RoundHeader";
import { WordGameGrid } from "./WordGameGrid";
import { WordGameInput } from "./WordGameInput";

const GAME = "word";

/** Which puzzle is on screen: today's shared word, or the n-th practice round on this device. */
interface Selection {
  round: number;
  index: number;
}

/**
 * Akshara-guess game (L-05/L-15, G-02). Fully offline: the pool is a static JSON file, today's
 * word is a pure function of the local date, and extra rounds walk the rest of the pool in a
 * per-device order with no repeats (`rounds.ts`).
 */
export function WordGame() {
  const t = useT();
  const { locale } = useApp();
  const [pool, setPool] = useState<WordGamePool | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [state, setState] = useState<WordGameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

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
  const total = pool?.words.length ?? 0;
  const dailyIndex = useMemo(() => dailyPoolIndex(today, total), [today, total]);

  useEffect(() => {
    if (total > 0) setSelection({ round: 0, index: dailyIndex });
  }, [total, dailyIndex]);

  const entry = selection && pool ? pool.words[selection.index] ?? null : null;

  useEffect(() => {
    if (!entry || !selection) return;
    const key = selection.round === 0 ? dateKey(today) : `practice:${selection.index}`;
    setState(loadWordGameState(key, entry.word));
    setError(null);
    setDraft("");
  }, [entry, selection, today]);

  const validGuesses = useMemo(() => new Set(pool?.guesses ?? []), [pool]);
  const targetLength = entry ? splitAksharas(entry.word).length : 0;

  const submit = (raw: string): boolean => {
    if (!state || !entry) return false;
    const guess = raw.normalize("NFC").trim();
    if (splitAksharas(guess).length !== targetLength) {
      setError(t("wordGameWrongLength", { count: targetLength }));
      return false;
    }
    if (!validGuesses.has(guess)) {
      setError(t("wordGameNotInPool"));
      return false;
    }
    setError(null);
    const next = submitGuess(state, guess);
    setState(next);
    saveWordGameState(next);
    return true;
  };

  const another = () => {
    if (!selection) return;
    const rounds = loadRounds(GAME, total);
    const picked = nextRound(rounds, total, [dailyIndex]);
    saveRounds(GAME, picked.state);
    setSelection({ round: selection.round + 1, index: picked.index });
  };

  if (pool === null) return <Skeleton className="h-64 w-full" />;
  if (!entry || !state || !selection) return <p className="text-base text-secondary">{t("wordGameLoadError")}</p>;

  const done = state.outcome !== "playing";

  return (
    <div className="flex flex-col gap-4">
      <RoundHeader round={selection.round} onAnother={another} onBackToDaily={() => setSelection({ round: 0, index: dailyIndex })} />
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
          <p className="text-base text-muted">{selection.round === 0 ? t("wordGameComeBackTomorrow") : t("gamePracticeNote")}</p>
        </div>
      ) : (
        <WordGameInput
          targetLength={targetLength}
          draft={draft}
          error={error}
          onDraft={(text) => {
            setDraft(text);
            setError(null);
          }}
          onSubmit={submit}
        />
      )}
    </div>
  );
}
