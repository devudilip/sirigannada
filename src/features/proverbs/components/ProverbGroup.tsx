"use client";

import type { ReactNode } from "react";
import { useApp, useT } from "@/components/providers/AppProviders";
import { arabicToKannadaDigits } from "@/features/tools/lib/numerals";
import type { ProverbGroup as Group } from "../lib/group";

/** Letter index section: serif 26/700 letter + "count · showing shown" on a 2 px rule, rows beneath. */
export function ProverbGroup({ group, children }: { group: Group; children: ReactNode }) {
  const t = useT();
  const { locale } = useApp();
  const n = (value: number) => (locale === "kn" ? arabicToKannadaDigits(String(value)) : String(value));
  const headingId = `proverb-group-${group.letter}`;

  return (
    <section aria-labelledby={headingId}>
      <div className="rule-section flex items-baseline justify-between gap-4 pt-3">
        <h2 id={headingId} className="font-serif font-bold text-ink leading-tight text-[1.625rem]" lang="kn">
          {group.letter}
        </h2>
        <p className="text-sm text-muted shrink-0">
          {t("proverbGroupShowing", { count: n(group.total), shown: n(group.items.length) })}
        </p>
      </div>
      <ul className="mt-2 flex flex-col">{children}</ul>
    </section>
  );
}
