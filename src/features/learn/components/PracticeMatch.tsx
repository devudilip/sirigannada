"use client";

import { useState } from "react";
import { useT } from "@/components/providers/AppProviders";
import { LETTER_WORDS } from "../lib/letterWords";
import { buildMatchDeck } from "../lib/practiceMatch";
import { advance, answerQuestion, initSession, isDone, type SessionState } from "../lib/practiceSession";
import { PracticeQuizChoices } from "./PracticeQuizChoices";

/** Hand-checked everyday words with short glosses; dictionary first senses were often an obscure homograph. */
const PAIRS = Object.values(LETTER_WORDS).flat();

/**
 * Word→meaning match: a Kannada word from the alphabet's curated word list, four short English
 * meanings (one correct, three from other words in the list).
 */
export function PracticeMatch() {
  const t = useT();
  const [deck, setDeck] = useState(() => buildMatchDeck(PAIRS, Date.now(), 10));
  const [session, setSession] = useState<SessionState>(initSession());

  const question = deck[session.index]!;

  return (
    <div className="flex flex-col gap-4">
      <p lang="kn" className="text-2xl font-serif font-semibold text-ink">
        {t("practiceMatchPrompt", { word: question.word })}
      </p>
      <PracticeQuizChoices
        choices={question.choices.map((c) => c.charAt(0).toUpperCase() + c.slice(1))}
        correctIndex={question.correctIndex}
        selectedIndex={session.selectedIndex}
        answered={session.answered}
        done={isDone(session, deck.length)}
        score={session.score}
        total={deck.length}
        choiceLang="en"
        titleKey="practiceModeMatch"
        onAnswer={(i) => setSession((s) => answerQuestion(s, question.correctIndex, i))}
        onNext={() => setSession((s) => advance(s, deck.length))}
        onRestart={() => {
          setSession(initSession());
          setDeck(buildMatchDeck(PAIRS, Date.now(), 10));
        }}
      />
    </div>
  );
}
