"use client";

import { useT } from "@/components/providers/AppProviders";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SANSKRIT_VOWELS, VOWELS, YOGAVAHA } from "@/lib/kannadaAlphabet";
import { LetterCell } from "./LetterCell";
import { LetterGroup } from "./LetterGroup";

export function VowelChart() {
  const t = useT();
  return (
    <section className="flex flex-col gap-5">
      <SectionHeading k="alphabetVowels" detail={String(VOWELS.length)} />
      <div className="grid grid-cols-7 gap-1">
        {VOWELS.map((glyph) => (
          <LetterCell key={glyph} glyph={glyph} />
        ))}
      </div>
      <LetterGroup title={t("alphabetYogavaha")} letters={YOGAVAHA} />
      <LetterGroup title={t("alphabetSanskritVowels")} letters={SANSKRIT_VOWELS} />
    </section>
  );
}
