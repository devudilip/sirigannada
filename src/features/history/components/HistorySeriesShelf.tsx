"use client";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProviders";
import { LIBRARY_URL } from "@/features/children/lib/sections";
import { localiseDigits } from "@/features/library/lib/readPercent";
import { historySeriesUrl } from "../lib/urls";
import type { HistorySeries } from "../types";
import { HistoryCover } from "./HistoryCover";
import { HistoryHeader } from "./HistoryHeader";

/** What the index needs per series, resolved at build time: the series, its story count and first cover. */
export interface SeriesCard {
  series: HistorySeries;
  count: number;
  cover?: { image: string; alt: string };
}

/** /library/karnataka-itihasa: one card per series in collections.json order, with its era and story count. */
export function HistorySeriesShelf({ cards }: { cards: SeriesCard[] }) {
  const { locale, t } = useApp();
  const years = (s: HistorySeries) => t("historyYears", { from: localiseDigits(s.years[0], locale), to: localiseDigits(s.years[1], locale) });
  const stories = (n: number) => (n === 0 ? t("historyComingSoon") : n === 1 ? t("historyStoryOne") : t("historyStoryCount", { n: localiseDigits(n, locale) }));
  return (
    <div className="mx-auto max-w-5xl px-5 pt-8 pb-12">
      <HistoryHeader
        up={{ href: LIBRARY_URL, label: t("navLibrary") }}
        title={{ kn: t("historyTitle"), en: t("historyTitle") }}
        description={{ kn: t("historySub"), en: t("historySub") }}
        count={cards.length === 1 ? t("historySeriesOne") : t("historySeriesCount", { n: localiseDigits(cards.length, locale) })}
      />
      <h2 className="mb-4 text-xl font-semibold">{t("historySeries")}</h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ series, count, cover }) => (
          <li key={series.slug}>
            <Link href={historySeriesUrl(series.slug)} className="flex h-full flex-col rounded-lg border border-line bg-paper p-4 transition-colors hover:border-accent active:bg-paper-edge">
              <HistoryCover image={cover?.image} alt={cover?.alt} title={series.title.kn} className="rounded-md" />
              <h3 className="mt-4 font-serif text-xl font-semibold text-ink" lang={locale}>{series.title[locale]}</h3>
              <p className="mt-1 text-sm text-muted" lang={locale}>{years(series)} · {stories(count)}</p>
              <p className="mt-2 text-base text-secondary" lang={locale}>{series.description[locale]}</p>
              <p className="mt-auto pt-3 text-base text-accent">{t("historyOpenSeries")}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
