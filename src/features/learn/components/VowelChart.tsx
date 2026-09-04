"use client";

import { useT } from "@/components/providers/AppProviders";
import { SANSKRIT_VOWELS, VOWELS, YOGAVAHA } from "@/lib/kannadaAlphabet";
import { LetterCell } from "./LetterCell";
import { LetterGroup } from "./LetterGroup";

export function VowelChart() {
  const t = useT();
  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-ink">{t("alphabetVowels")}</h2>
      <div className="grid grid-cols-5 gap-2">
        {VOWELS.map((glyph) => (
          <LetterCell key={glyph} glyph={glyph} />
        ))}
      </div>
      <LetterGroup title={t("alphabetYogavaha")} letters={YOGAVAHA} columns={2} />
      <LetterGroup title={t("alphabetSanskritVowels")} letters={SANSKRIT_VOWELS} columns={3} />
    </section>
  );
}
