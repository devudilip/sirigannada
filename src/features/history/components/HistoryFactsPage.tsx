"use client";

import { useApp } from "@/components/providers/AppProviders";
import { pickFacts } from "../lib/tiers";
import type { HistoryStory } from "../types";
import { FactLine } from "./FactLine";
import { PAGE } from "./HistoryTitlePage";

/** ನಿಮಗೆ ಗೊತ್ತೇ?: the story's little-known facts, each with its tier chip and source. */
export function HistoryFactsPage({ story }: { story: HistoryStory }) {
  const { locale, t } = useApp();
  return (
    <section aria-labelledby="history-dyk-title" className={`${PAGE} pt-14`} lang={locale}>
      <div className="mx-auto max-w-2xl px-6 pt-8 pb-reader-bar">
        <h2 id="history-dyk-title" className="font-serif text-2xl font-semibold text-ink">{t("historyDidYouKnow")}</h2>
        <ol className="mt-6 flex flex-col gap-6">
          {pickFacts(story.facts, story.didYouKnow).map((fact) => <FactLine key={fact.id} fact={fact} />)}
        </ol>
      </div>
    </section>
  );
}
