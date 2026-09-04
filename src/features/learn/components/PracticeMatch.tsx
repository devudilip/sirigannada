"use client";

import { useEffect, useState } from "react";
import { useT } from "@/components/providers/AppProviders";
import { Skeleton } from "@/components/ui/Card";
import type { DailyWords } from "@/lib/types";
import { type MatchQuestion, buildMatchDeck } from "../lib/practiceMatch";
import { advance, answerQuestion, initSession, isDone, type SessionState } from "../lib/practiceSession";
import { PracticeQuizChoices } from "./PracticeQuizChoices";

/**
 * Word→meaning match: a Kannada headword from the daily.json curated list, four English-meaning
 * choices (one correct, three distractors from other daily.json words). Fully offline — daily.json
 * is already shipped under public/data/dict/ and fetched like any other local dictionary shard.
 */
export function PracticeMatch() {
  const t = useT();
  const [deck, setDeck] = useState<MatchQuestion[] | null>(null);
  const [seed, setSeed] = useState(() => Date.now());
  const [session, setSession] = useState<SessionState>(initSession());

  useEffect(() => {
    let cancelled = false;
    fetch("/data/dict/daily.json")
      .then((res) => (res.ok ? (res.json() as Promise<DailyWords>) : null))
      .then((data) => {
        if (cancelled || !data) return;
        setDeck(buildMatchDeck(data.entries, seed, 10));
      })
      .catch(() => {
        if (!cancelled) setDeck([]);
      });
    return () => {
      cancelled = true;
    };
  }, [seed]);

  if (deck === null) {
    return <Skeleton className="h-48 w-full" />;
  }
  if (deck.length === 0) {
    return <p className="text-base text-secondary">{t("noResults")}</p>;
  }

  const question = deck[session.index]!;

  return (
    <div className="flex flex-col gap-4">
      <p lang="kn" className="text-2xl font-serif font-semibold text-ink">
        {t("practiceMatchPrompt", { word: question.word })}
      </p>
      <PracticeQuizChoices
        choices={question.choices}
        correctIndex={question.correctIndex}
        selectedIndex={session.selectedIndex}
        answered={session.answered}
        done={isDone(session, deck.length)}
        score={session.score}
        total={deck.length}
        choiceLang="en"
        onAnswer={(i) => setSession((s) => answerQuestion(s, question.correctIndex, i))}
        onNext={() => setSession((s) => advance(s, deck.length))}
        onRestart={() => {
          setSession(initSession());
          setSeed(Date.now());
        }}
      />
    </div>
  );
}
