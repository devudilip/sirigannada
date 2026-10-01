"use client";

import { useEffect, useRef, useState } from "react";
import { VolumeIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/Button";
import { toIso15919 } from "@/lib/iso15919";
import { useSpeakKannada } from "@/lib/SpeakContext";
import { hearLetter } from "../lib/letterMedia";
import { wordPictureSrc } from "../lib/letterWords";
import { buildFirstLetterDeck, buildHearLetterDeck } from "../lib/practiceListen";
import { advance, answerQuestion, initSession, isDone, type SessionState } from "../lib/practiceSession";
import { PracticeQuizChoices } from "./PracticeQuizChoices";

const DECK_SIZE = 10;

/**
 * Letter-choice drills: "hear" plays a letter's recording (Wikimedia Commons, mirrored under
 * public/learn/letters/) and asks which letter it was; "first" shows a pictured word and asks
 * which letter it begins with. Wrong choices are sound-alikes (see practiceListen.ts).
 */
export function PracticeLetterQuiz({ kind }: { kind: "hear" | "first" }) {
  const t = useT();
  const speak = useSpeakKannada();
  const build = kind === "hear" ? buildHearLetterDeck : buildFirstLetterDeck;
  const [deck, setDeck] = useState(() => build(Date.now(), DECK_SIZE));
  const [session, setSession] = useState<SessionState>(initSession());
  const question = deck[session.index]!;
  // Read through a ref so the device voice loading late doesn't replay the current letter.
  const speakRef = useRef(speak);
  speakRef.current = speak;

  // The tap that opened the mode (or pressed Next) counts as the gesture autoplay needs.
  useEffect(() => {
    if (kind === "hear") hearLetter(question.letter, speakRef.current);
  }, [kind, question]);

  return (
    <div className="flex flex-col gap-4">
      {kind === "hear" ? (
        <div className="flex flex-col items-start gap-3">
          <p className="text-2xl font-serif font-semibold text-ink">{t("practiceHearPrompt")}</p>
          <Button variant="secondary" onClick={() => hearLetter(question.letter, speak)}>
            <VolumeIcon size={20} />
            {t("practiceHearAgain")}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3">
          <p className="text-2xl font-serif font-semibold text-ink">{t("practiceFirstLetterPrompt")}</p>
          <figure className="flex flex-col items-center gap-1 self-center">
            {/* eslint-disable-next-line @next/next/no-img-element -- same-origin static asset, no optimiser in static export */}
            <img src={wordPictureSrc(question.word!.picture!)} alt={question.word!.en} className="letter-card size-40 rounded-md border border-line object-contain" />
            <figcaption className="text-sm text-secondary" lang="en">
              {session.answered ? (
                <>
                  <span lang="kn" className="font-serif text-lg font-semibold text-ink">{question.word!.word}</span>
                  {` · ${toIso15919(question.word!.word)} · `}
                </>
              ) : null}
              {question.word!.en}
            </figcaption>
          </figure>
        </div>
      )}
      <PracticeQuizChoices
        choices={question.choices}
        correctIndex={question.correctIndex}
        selectedIndex={session.selectedIndex}
        answered={session.answered}
        done={isDone(session, deck.length)}
        score={session.score}
        total={deck.length}
        choiceLang="kn"
        letters
        titleKey={kind === "hear" ? "practiceModeHearLetter" : "practiceModeFirstLetter"}
        onAnswer={(i) => setSession((s) => answerQuestion(s, question.correctIndex, i))}
        onNext={() => setSession((s) => advance(s, deck.length))}
        onRestart={() => {
          setDeck(build(Date.now(), DECK_SIZE));
          setSession(initSession());
        }}
      />
    </div>
  );
}
