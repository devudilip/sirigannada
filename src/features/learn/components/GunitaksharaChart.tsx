"use client";

import { useState } from "react";
import { useT } from "@/components/providers/AppProviders";
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
      <h2 className="text-xl font-semibold text-ink">{t("alphabetGunita")}</h2>
      <p className="text-base text-secondary leading-kannada">{t("alphabetGunitaHint")}</p>
      <div
        role="group"
        aria-label={t("alphabetPickConsonant")}
        className="grid grid-cols-5 gap-1 sm:grid-cols-6"
      >
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
              className={`flex min-h-11 items-center justify-center rounded-md border font-serif text-xl transition-colors duration-150 ${
                selected
                  ? "border-accent bg-accent-soft text-ink"
                  : "border-line bg-elevated text-ink hover:border-line-strong"
              }`}
              lang="kn"
            >
              {letter}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {forms.map((glyph) => (
          <LetterCell key={glyph} glyph={glyph} />
        ))}
      </div>
    </section>
  );
}
