"use client";

import { useState } from "react";
import { useT } from "@/components/providers/AppProviders";
import { buildGunitaDeck } from "../lib/practiceGunita";
import { advance, answerQuestion, initSession, isDone, type SessionState } from "../lib/practiceSession";
import { PracticeQuizChoices } from "./PracticeQuizChoices";

const DECK_SIZE = 10;

/**
 * ಕಾಗುಣಿತ (gunitakshara) drill: alternates "compose" prompts (consonant + vowel → pick the
 * combined akshara) and "identify" prompts (akshara → pick which vowel/sign it uses). Purely
 * derived from src/lib/kannadaAlphabet.ts — no network, no dictionary data needed.
 */
export function PracticeGunita() {
  const t = useT();
  const [seed, setSeed] = useState(() => Date.now());
  const [deck, setDeck] = useState(() => buildGunitaDeck(seed, DECK_SIZE));
  const [session, setSession] = useState<SessionState>(initSession());

  const question = deck[session.index]!;
  const prompt =
    question.direction === "compose"
      ? t("practiceComposePrompt", { consonant: question.consonant, vowel: question.signLabel })
      : t("practiceIdentifyPrompt", { akshara: question.consonant });

  return (
    <div className="flex flex-col gap-4">
      <p lang="kn" className="text-2xl font-serif font-semibold text-ink">
        {prompt}
      </p>
      <PracticeQuizChoices
        choices={question.choices}
        correctIndex={question.correctIndex}
        selectedIndex={session.selectedIndex}
        answered={session.answered}
        done={isDone(session, deck.length)}
        score={session.score}
        total={deck.length}
        choiceLang="kn"
        onAnswer={(i) => setSession((s) => answerQuestion(s, question.correctIndex, i))}
        onNext={() => setSession((s) => advance(s, deck.length))}
        onRestart={() => {
          const next = Date.now();
          setSeed(next);
          setDeck(buildGunitaDeck(next, DECK_SIZE));
          setSession(initSession());
        }}
      />
    </div>
  );
}
