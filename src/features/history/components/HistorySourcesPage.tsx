"use client";

import { useApp } from "@/components/providers/AppProviders";
import { groupByTier } from "../lib/tiers";
import type { HistoryStory } from "../types";
import { FactLine } from "./FactLine";
import { PAGE } from "./HistoryTitlePage";
import { TierChip } from "./TierChip";

/**
 * ಆಧಾರಗಳು, the last page: every fact grouped by tier with source and link, then the text's
 * provenance, the AI-illustration disclosure, the content note, and the way back to the series.
 */
export function HistorySourcesPage({ story, back, onReadAgain }: { story: HistoryStory; back: { href: string; label: string }; onReadAgain: () => void }) {
  const { locale, t } = useApp();
  return (
    <section aria-labelledby="history-sources-title" className={`${PAGE} pt-14`} lang={locale}>
      <div className="mx-auto max-w-2xl px-6 pt-8 pb-reader-bar">
        <h2 id="history-sources-title" className="font-serif text-2xl font-semibold text-ink">{t("historySources")}</h2>
        {groupByTier(story.facts).map((group) => (
          <div key={group.tier} className="mt-6">
            <TierChip tier={group.tier} />
            <ol className="mt-3 flex flex-col gap-4">
              {group.facts.map((fact) => <FactLine key={fact.id} fact={fact} showTier={false} />)}
            </ol>
          </div>
        ))}
        <div className="mt-10 flex flex-col gap-3 text-base text-secondary">
          <h3 className="font-serif text-xl font-semibold text-ink">{t("historyAbout")}</h3>
          <p>{story.illustrations.disclosure[locale]}</p>
          <p><span className="text-muted">{t("historyContentNote")}: </span>{story.contentNote[locale]}</p>
          <p><span className="text-muted">{t("historyLicense")}: </span>{story.provenance.licenseNote}</p>
          <a className="underline text-accent" href={story.provenance.source} target="_blank" rel="noopener noreferrer">{t("historyProvenance")}</a>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={onReadAgain} className="inline-flex min-h-11 items-center rounded-full border border-line-strong bg-elevated px-5 font-semibold text-ink hover:border-ink">
            {t("picturebooksReadAgain")}
          </button>
          <a href={back.href} className="inline-flex min-h-11 items-center rounded-full bg-accent-strong px-5 font-semibold text-on-accent" lang="kn">
            {back.label}
          </a>
        </div>
      </div>
    </section>
  );
}
