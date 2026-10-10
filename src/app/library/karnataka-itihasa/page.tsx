import type { Metadata } from "next";
import { HistorySeriesShelf, type SeriesCard } from "@/features/history/components/HistorySeriesShelf";
import { HISTORY_URL, readHistorySeries, readHistoryStories } from "@/features/history/lib/catalog";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = {
  title: strings.historyTitle.kn,
  description: strings.historySub.kn,
  alternates: { canonical: HISTORY_URL },
};

/** ಕರ್ನಾಟಕ ಇತಿಹಾಸ: the series list, shelved in the library beside ಚಿತ್ರಕಥೆ. */
export default function HistoryIndexPage() {
  const cards = readHistorySeries().map((series): SeriesCard => {
    const stories = readHistoryStories(series.slug);
    const first = stories[0];
    return { series, count: stories.length, cover: first ? { image: first.cover, alt: first.title.kn } : undefined };
  });
  return <HistorySeriesShelf cards={cards} />;
}
