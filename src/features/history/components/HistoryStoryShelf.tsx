"use client";

import { formatEra } from "@/lib/kannada";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProviders";
import { localiseDigits } from "@/features/library/lib/readPercent";
import { toKannadaDigits } from "@/lib/kannada";
import { HISTORY_URL, historyStoryUrl } from "../lib/urls";
import type { HistorySeries, HistoryStory } from "../types";
import { HistoryCover } from "./HistoryCover";
import { HistoryHeader } from "./HistoryHeader";

/** /library/karnataka-itihasa/<series>: the series header, then one cover-led card per story. */
export function HistoryStoryShelf({ series, stories }: { series: HistorySeries; stories: HistoryStory[] }) {
  const { locale, t } = useApp();
  const digits = (s: string) => (locale === "kn" ? toKannadaDigits(s) : s);
  const count = stories.length === 0 ? undefined : stories.length === 1 ? t("historyStoryOne") : t("historyStoryCount", { n: localiseDigits(stories.length, locale) });
  return (
    <div className="mx-auto max-w-5xl px-5 pt-8 pb-12">
      <HistoryHeader up={{ href: HISTORY_URL, label: t("historyTitle") }} title={series.title} description={series.description} count={count}>
        <p className="mt-1 text-sm text-muted" lang={locale}>
          {t("historyYears", { from: localiseDigits(series.years[0], locale), to: localiseDigits(series.years[1], locale) })}
        </p>
      </HistoryHeader>
      <h2 className="mb-4 text-xl font-semibold">{t("historyStories")}</h2>
      {stories.length === 0 ? (
        <p className="rule-section py-8 text-base text-secondary" lang={locale}>{t("historyNoStories")}</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <li key={story.slug}>
              <Link href={historyStoryUrl(story)} className="flex h-full flex-col rounded-lg border border-line bg-paper p-4 transition-colors hover:border-accent active:bg-paper-edge">
                <HistoryCover image={story.cover} alt={story.title[locale]} title={story.title.kn} className="rounded-md" />
                <div className="mt-4 flex items-start justify-between gap-3">
                  <h3 className="font-serif text-xl font-semibold text-ink" lang={locale}>{story.title[locale]}</h3>
                  <span className="mt-1 inline-flex shrink-0 items-center rounded-full bg-gold-soft px-2.5 py-0.5 font-sans text-sm font-semibold text-ink" aria-label={t("historyAge", { age: digits(story.age) })}>
                    {digits(story.age)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted" lang={locale}>{story.subtitle[locale]} · {formatEra(story.era, locale)}</p>
                <p className="mt-2 text-base text-secondary" lang={locale}>{story.teaser[locale]}</p>
                <p className="mt-auto pt-3 text-base text-accent">{t("historyRead")}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
