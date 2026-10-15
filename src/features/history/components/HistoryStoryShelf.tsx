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
      {series.dynasty && <DynastyIntro series={series} stories={stories} />}
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

/** ಈ ರಾಜವಂಶ: what the dynasty was, its capital, and the main rulers in order, each linked to a story when one is published. */
function DynastyIntro({ series, stories }: { series: HistorySeries; stories: HistoryStory[] }) {
  const { locale, t } = useApp();
  const dynasty = series.dynasty;
  if (!dynasty) return null;
  const published = new Map(stories.map((s) => [s.slug, s]));
  return (
    <section aria-labelledby="history-dynasty-title" className="mb-10 rounded-lg border border-line bg-paper p-5 sm:p-6" lang={locale}>
      <h2 id="history-dynasty-title" className="font-serif text-2xl font-semibold text-ink">{t("historyDynasty")}</h2>
      <p className="mt-1 text-sm text-muted">{t("historyCapital")}: {dynasty.capital[locale]}</p>
      <div className="mt-3 font-serif text-lg text-ink" style={{ lineHeight: 1.8 }}>
        {dynasty.intro[locale].map((paragraph, i) => <p key={i} className={`text-pretty ${i === 0 ? "" : "mt-3"}`}>{paragraph}</p>)}
      </div>
      <h3 className="mt-6 text-base font-semibold text-ink">{t("historyRulers")}</h3>
      <ol className="mt-2 flex flex-col">
        {dynasty.rulers.map((ruler, i) => {
          const story = ruler.story ? published.get(ruler.story) : undefined;
          return (
            <li key={i} className="grid gap-x-4 gap-y-0.5 border-t border-line py-2.5 sm:grid-cols-[9rem_1fr]">
              <span className="text-sm text-muted">{ruler.years[locale]}</span>
              <div>
                <span className="font-serif font-semibold text-ink">{ruler.name[locale]}</span>
                <span className="text-secondary">. {ruler.note[locale]}</span>
                {story && (
                  <Link href={historyStoryUrl(story)} className="ml-2 inline-flex min-h-8 items-center text-accent">{t("historyRulerStory")}</Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-sm text-muted"><span className="font-semibold">{t("historyDynastyDating")}:</span> {dynasty.dating[locale]}</p>
      <p className="mt-1 text-sm text-muted"><span className="font-semibold">{t("historyDynastySources")}:</span> {dynasty.sources.join("; ")}</p>
    </section>
  );
}
