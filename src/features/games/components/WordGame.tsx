"use client";

import { useEffect, useMemo, useState } from "react";
import { useApp, useT } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Card";
import { ShareIcon } from "@/components/icons";
import { splitAksharas } from "@/lib/kannada";
import type { WordGamePool } from "@/lib/types";
import { ShareCardSheet } from "@/features/share/components/ShareCardSheet";
import { CANONICAL_ORIGIN } from "@/features/reader/lib/versePermalink";
import { keyStatuses } from "../lib/keyStatuses";
import { dailyPoolIndex, dateKey } from "../lib/wordGameDay";
import { MAX_GUESSES, loadWordGameState, saveWordGameState, submitGuess, type WordGameState } from "../lib/wordGameSession";
import { WordGameGrid } from "./WordGameGrid";
import { WordGameHeader } from "./WordGameHeader";
import { WordGameInput } from "./WordGameInput";

/**
 * Daily akshara-guess game (L-05/L-15). Fully offline: the pool is a static JSON file and today's
 * word is a pure function of the local date, the same for everyone. One word a day, on purpose —
 * the pool rotates so tomorrow is always new, but there is no "play another" (owner decision).
 */
export function WordGame() {
  const t = useT();
  const { locale } = useApp();
  const [pool, setPool] = useState<WordGamePool | null>(null);
  const [state, setState] = useState<WordGameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [shareOpen, setShareOpen] = useState(false);

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

  const entry = pool && total > 0 ? pool.words[dailyIndex] ?? null : null;

  useEffect(() => {
    if (!entry) return;
    setState(loadWordGameState(dateKey(today), entry.word));
    setError(null);
    setDraft("");
  }, [entry, today]);

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

  if (pool === null) return <Skeleton className="h-64 w-full" />;
  if (!entry || !state) return <p className="text-base text-secondary">{t("wordGameLoadError")}</p>;

  const done = state.outcome !== "playing";
  const guessNumber = Math.min(state.guesses.length + (done ? 0 : 1), MAX_GUESSES);

  return (
    <div className="flex flex-col gap-4">
      <WordGameHeader dayNumber={dailyIndex + 1} date={today} guessNumber={guessNumber} />
      <p className="text-base text-secondary">{t("wordGameInstructions", { count: targetLength })}</p>

      <WordGameGrid target={entry.word} guesses={state.guesses} draft={done ? "" : draft} />

      {error && (
        <p id="word-game-error" role="status" className="text-base font-medium text-accent">
          {error}
        </p>
      )}

      {done ? (
        <div className="flex flex-col gap-2 border border-line bg-elevated p-4">
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
          <Button variant="secondary" className="self-start" onClick={() => setShareOpen(true)}>
            <ShareIcon size={18} />
            {t("shareCardAction")}
          </Button>
          <ShareCardSheet
            open={shareOpen}
            onClose={() => setShareOpen(false)}
            input={
              shareOpen
                ? {
                    kind: "dailyWord",
                    main: entry.word,
                    support: entry.meaning[locale],
                    url: `${CANONICAL_ORIGIN}/games/word`,
                    source: "Alar · V. Krishna",
                    size: "portrait",
                  }
                : null
            }
          />
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
          statuses={keyStatuses(state.guesses, entry.word)}
        />
      )}
    </div>
  );
}
