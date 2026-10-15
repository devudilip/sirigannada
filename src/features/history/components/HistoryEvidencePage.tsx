"use client";

import { useApp } from "@/components/providers/AppProviders";
import { toKannadaDigits } from "@/lib/kannada";
import { groupByTier, pickFacts } from "../lib/tiers";
import type { HistoryStory } from "../types";
import { FactLine } from "./FactLine";
import { TierChip } from "./TierChip";
import { PAGE } from "./HistoryTitlePage";

/**
 * ಇದು ಕಥೆ, ಇದು ಇತಿಹಾಸ: scene by scene, the lines invented for the telling and the facts the
 * scene rests on, grouped by tier. Kept off the scene pages so the story reads without breaks.
 */
export function HistoryEvidencePage({ story }: { story: HistoryStory }) {
  const { locale, t } = useApp();
  return (
    <section aria-labelledby="history-evidence-title" className={`${PAGE} pt-14`} lang={locale}>
      <div className="mx-auto max-w-2xl px-6 pb-reader-bar">
        <h2 id="history-evidence-title" className="font-serif text-2xl font-semibold text-ink">{t("historyStoryVsHistory")}</h2>
        <p className="mt-2 text-sm text-muted">{t("historyStoryVsHistoryNote")}</p>
        <ol className="mt-6 flex flex-col gap-8">
          {story.scenes.map((scene, index) => {
            const groups = groupByTier(pickFacts(story.facts, scene.facts));
            return (
              <li key={scene.id} className="border-t border-line pt-4">
                <h3 className="font-serif text-lg font-semibold text-ink" lang="kn">{toKannadaDigits(index + 1)}. {scene.title}</h3>
                {scene.dramatised && scene.dramatised.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-secondary">{t("historyDramatised")}</p>
                    <ul className="mt-1 flex list-disc flex-col gap-1 pl-5 text-sm text-secondary" lang="kn">
                      {scene.dramatised.map((line, i) => <li key={i}>{line}</li>)}
                    </ul>
                  </div>
                )}
                <p className="mt-3 text-sm font-semibold text-secondary">{t("historyEvidence")}</p>
                <div className="mt-1 flex flex-col gap-3">
                  {groups.map((group) => (
                    <div key={group.tier}>
                      <TierChip tier={group.tier} />
                      <ul className="mt-2 flex flex-col gap-2">
                        {group.facts.map((fact) => <FactLine key={fact.id} fact={fact} showTier={false} compact />)}
                      </ul>
                    </div>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
