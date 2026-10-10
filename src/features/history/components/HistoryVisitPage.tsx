"use client";

import { useApp } from "@/components/providers/AppProviders";
import type { HistoryStory } from "../types";
import { PAGE } from "./HistoryTitlePage";

/** ಇಂದು ನೋಡಬಹುದು: where the evidence stands today, one card per place. */
export function HistoryVisitPage({ story }: { story: HistoryStory }) {
  const { locale, t } = useApp();
  return (
    <section aria-labelledby="history-visit-title" className={`${PAGE} pt-14`}>
      <div className="mx-auto max-w-2xl px-6 pt-8 pb-reader-bar">
        <h2 id="history-visit-title" className="font-serif text-2xl font-semibold text-ink" lang={locale}>{t("historyVisitToday")}</h2>
        <ul className="mt-6 flex flex-col gap-4" lang="kn">
          {story.visitToday.map((place) => (
            <li key={place.place} className="rounded-lg border border-line bg-paper p-4">
              <p className="font-serif text-lg font-semibold text-ink">{place.place}</p>
              <p className="mt-1 text-base text-secondary">{place.what}</p>
              {place.url && (
                <a href={place.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center text-sm underline text-accent" lang={locale}>
                  {t("historyMapLink")}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
