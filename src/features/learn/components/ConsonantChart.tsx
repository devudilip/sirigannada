"use client";

import { useT } from "@/components/providers/AppProviders";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CONSONANT_GROUPS, SCHOOL_CONSONANTS } from "@/lib/kannadaAlphabet";
import { LetterGroup } from "./LetterGroup";

export function ConsonantChart() {
  const t = useT();
  return (
    <section className="flex flex-col gap-5">
      <SectionHeading k="alphabetConsonants" detail={String(SCHOOL_CONSONANTS.length)} />
      {CONSONANT_GROUPS.map((group) => (
        <LetterGroup key={group.titleKey} title={t(group.titleKey)} letters={group.letters} />
      ))}
    </section>
  );
}
