"use client";

import { formatEra } from "@/lib/kannada";

import { useApp } from "@/components/providers/AppProviders";
import { toKannadaDigits } from "@/lib/kannada";
import type { HistoryStory } from "../types";

export const PAGE = "h-full w-full shrink-0 snap-center overflow-y-auto";

/** The reader's first page: the cover plate, series name, title, subtitle, era and age band. */
export function HistoryTitlePage({ story, seriesTitle }: { story: HistoryStory; seriesTitle: string }) {
  const { locale, t } = useApp();
  const digits = (s: string) => (locale === "kn" ? toKannadaDigits(s) : s);
  return (
    <section className={`${PAGE} flex flex-col items-center justify-center px-6 pt-14 pb-reader-bar text-center`} lang={locale}>
      <div className="w-full max-w-xl border border-line bg-paper p-2 shadow-elevated">
        <img src={story.cover} alt={story.title[locale]} width={1280} height={720} decoding="async" className="aspect-video w-full object-cover" />
      </div>
      <p className="mt-8 text-sm tracking-widest text-muted">{seriesTitle}</p>
      <h1 className="mt-3 font-serif text-3xl md:text-4xl font-bold leading-tight text-ink">{story.title[locale]}</h1>
      <p className="mt-3 font-serif text-lg text-secondary">{story.subtitle[locale]}</p>
      <p className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-muted">
        <span>{t("historyEra")}: {formatEra(story.era, locale)}</span>
        <span className="inline-flex items-center rounded-full bg-gold-soft px-2.5 py-0.5 font-sans font-semibold text-ink" aria-label={t("historyAge", { age: digits(story.age) })}>
          {digits(story.age)}
        </span>
      </p>
    </section>
  );
}
