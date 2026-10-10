"use client";

import { useApp } from "@/components/providers/AppProviders";
import type { TextSize } from "@/features/picturebooks/lib/textSize";
import { toKannadaDigits } from "@/lib/kannada";
import { groupByTier, pickFacts } from "../lib/tiers";
import type { HistoryFact, HistoryScene } from "../types";
import { FactLine } from "./FactLine";
import { TierChip } from "./TierChip";
import { PAGE } from "./HistoryTitlePage";

const DISCLOSURE = "group mt-3 rounded-lg border border-line bg-paper px-4 py-2";
const SUMMARY = "flex min-h-11 cursor-pointer list-none items-center justify-between text-sm font-semibold text-secondary [&::-webkit-details-marker]:hidden";

/**
 * One scene: the 16:9 picture full width, the scene number and title, the paragraphs, and under
 * them two small disclosures: ಆಧಾರ (the facts this scene rests on, by tier) and, when the scene
 * has invented lines, ಕಲ್ಪಿತ (each of them, so nothing invented passes as record).
 */
export function HistoryScenePage({ scene, index, facts, size }: { scene: HistoryScene; index: number; facts: HistoryFact[]; size: TextSize }) {
  const { locale, t } = useApp();
  const groups = groupByTier(pickFacts(facts, scene.facts));
  return (
    <section aria-labelledby={`${scene.id}-title`} className={`${PAGE} pt-14`} lang="kn">
      <div className="bg-elevated">
        <img src={scene.image} alt={scene.imageAlt[locale]} width={1280} height={720} loading="lazy" decoding="async" className="mx-auto aspect-video w-full max-w-4xl object-cover" />
      </div>
      <div className="mx-auto max-w-2xl px-6 pt-6 pb-reader-bar">
        <p className="font-serif text-base text-muted">{toKannadaDigits(index + 1)}</p>
        <h2 id={`${scene.id}-title`} className="font-serif text-2xl font-semibold text-ink">{scene.title}</h2>
        <div className="mt-4 font-serif text-ink" style={{ fontSize: `${size}px`, lineHeight: 1.8 }}>
          {scene.paragraphs.map((paragraph, i) => (
            <p key={i} className={`text-pretty ${i === 0 ? "" : "indent-8"}`}>{paragraph}</p>
          ))}
        </div>
        <details className={DISCLOSURE} lang={locale}>
          <summary className={SUMMARY}>
            <span>{t("historyEvidence")}</span>
            <span aria-hidden="true" className="flex gap-1">{groups.map((g) => <TierChip key={g.tier} tier={g.tier} />)}</span>
          </summary>
          <div className="flex flex-col gap-4 pb-2 pt-2">
            {groups.map((group) => (
              <div key={group.tier}>
                <TierChip tier={group.tier} />
                <ul className="mt-2 flex flex-col gap-3">
                  {group.facts.map((fact) => <FactLine key={fact.id} fact={fact} showTier={false} compact />)}
                </ul>
              </div>
            ))}
          </div>
        </details>
        {scene.dramatised && scene.dramatised.length > 0 && (
          <details className={DISCLOSURE}>
            <summary className={SUMMARY} lang={locale}>{t("historyDramatised")}</summary>
            <p className="pt-1 text-sm text-muted" lang={locale}>{t("historyDramatisedNote")}</p>
            <ul className="flex list-disc flex-col gap-1 py-2 pl-5 text-sm text-secondary">
              {scene.dramatised.map((line, i) => <li key={i}>{line}</li>)}
            </ul>
          </details>
        )}
      </div>
    </section>
  );
}
