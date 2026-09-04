"use client";

import { useT } from "@/components/providers/AppProviders";
import { toIso15919 } from "@/lib/iso15919";
import { OTTAKSHARA_GROUPS } from "../lib/alphabet";
import { useSpeakKannada } from "@/lib/SpeakContext";
import { OttaksharaRow } from "./OttaksharaRow";

export function OttaksharaExamples() {
  const t = useT();
  const speak = useSpeakKannada();
  return (
    <section className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-semibold text-ink">{t("alphabetOttakshara")}</h2>
        <p className="mt-1 text-base text-secondary leading-kannada">{t("alphabetOttaksharaSub")}</p>
      </div>
      {OTTAKSHARA_GROUPS.map((group) => (
        <div key={group.titleKey} className="flex flex-col gap-2">
          <h3 className="text-base font-medium text-ink">{t(group.titleKey)}</h3>
          <ul className="flex flex-col gap-2">
            {group.examples.map((ex) => (
              <li key={ex.word}>
                <OttaksharaRow
                  conjunct={ex.conjunct}
                  word={ex.word}
                  iso={toIso15919(ex.word)}
                  gloss={t(ex.glossKey)}
                  speak={speak}
                  label={t("speakLetter", { letter: ex.word })}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
