"use client";

import { useState } from "react";
import { useT } from "@/components/providers/AppProviders";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SCHOOL_CONSONANTS, gunitaksharaRow } from "@/lib/kannadaAlphabet";
import { useSpeakKannada } from "@/lib/SpeakContext";
import { LetterCell } from "./LetterCell";

export function GunitaksharaChart() {
  const t = useT();
  const speak = useSpeakKannada();
  const [base, setBase] = useState<string>("ಕ");
  const forms = gunitaksharaRow(base);

  return (
    <section className="flex flex-col gap-4">
      <SectionHeading k="alphabetGunita" />
      <p className="text-base text-secondary leading-kannada">{t("alphabetGunitaHint")}</p>
      <div role="group" aria-label={t("alphabetPickConsonant")} className="grid grid-cols-7 gap-1">
        {SCHOOL_CONSONANTS.map((letter) => {
          const selected = letter === base;
          return (
            <button
              key={letter}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                setBase(letter);
                speak?.(letter);
              }}
              className={`flex aspect-square min-h-11 items-center justify-center border font-serif text-xl transition-colors duration-150 ${
                selected ? "border-accent bg-accent text-on-accent" : "border-line bg-transparent text-ink hover:bg-elevated"
              }`}
              lang="kn"
            >
              {letter}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {forms.map((glyph) => (
          <LetterCell key={glyph} glyph={glyph} />
        ))}
      </div>
    </section>
  );
}
