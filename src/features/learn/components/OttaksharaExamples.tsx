"use client";

import { useT } from "@/components/providers/AppProviders";
import { toIso15919 } from "@/lib/iso15919";
import { OTTAKSHARA_GROUPS } from "../lib/alphabet";

export function OttaksharaExamples() {
  const t = useT();
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
              <li
                key={ex.word}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-md border border-line bg-paper px-3 py-3"
              >
                <span className="font-serif text-2xl text-ink" lang="kn">
                  {ex.conjunct}
                </span>
                <span className="font-serif text-lg text-ink" lang="kn">
                  {ex.word}
                </span>
                <span className="text-sm text-muted" lang="en">
                  {toIso15919(ex.word)}
                </span>
                <span className="text-sm text-secondary">{t(ex.glossKey)}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
