"use client";

import { useT } from "@/components/providers/AppProviders";
import { CONSONANT_GROUPS } from "@/lib/kannadaAlphabet";
import { LetterGroup } from "./LetterGroup";

export function ConsonantChart() {
  const t = useT();
  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-ink">{t("alphabetConsonants")}</h2>
      {CONSONANT_GROUPS.map((group) => (
        <LetterGroup
          key={group.titleKey}
          title={t(group.titleKey)}
          letters={group.letters}
          columns={group.letters.length <= 3 ? 2 : 5}
        />
      ))}
    </section>
  );
}
