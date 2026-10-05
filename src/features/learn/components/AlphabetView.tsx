"use client";

import { useState } from "react";
import { ALPHABET_ORDER } from "@/lib/kannadaAlphabet";
import { useSpeakKannada } from "@/lib/SpeakContext";
import { ContinueButton } from "@/features/continue/components/ContinueButton";
import { hearLetter, letterMedia } from "../lib/letterMedia";
import { OpenLetterContext } from "../lib/openLetter";
import { AlphabetLicense } from "./AlphabetLicense";
import { AlphabetSpeakHint } from "./AlphabetSpeakHint";
import { ConsonantChart } from "./ConsonantChart";
import { LetterSheet } from "./LetterSheet";
import { VowelChart } from "./VowelChart";

/** Letters the popup can show (those with a handwriting animation and recording), in page order. */
const POPUP_LETTERS = ALPHABET_ORDER.filter((letter) => letterMedia(letter));

export function AlphabetView() {
  const speak = useSpeakKannada();
  const [glyph, setGlyph] = useState<string | null>(null);
  const open = (next: string) => {
    hearLetter(next, speak);
    setGlyph(next);
  };
  const step = (by: -1 | 1) => {
    if (glyph === null) return;
    const n = POPUP_LETTERS.length;
    open(POPUP_LETTERS[(POPUP_LETTERS.indexOf(glyph) + by + n) % n]!);
  };

  return (
    <OpenLetterContext.Provider value={open}>
      <div className="flex flex-col gap-10">
        <AlphabetSpeakHint />
        <VowelChart />
        <ConsonantChart />
        <AlphabetLicense />
        <ContinueButton page="/learn/alphabet" className="inline-flex min-h-11 items-center gap-2 self-start rounded-md border border-line px-3 py-2 text-base text-ink hover:border-accent" />
      </div>
      <LetterSheet glyph={glyph} onClose={() => setGlyph(null)} onStep={step} />
    </OpenLetterContext.Provider>
  );
}
