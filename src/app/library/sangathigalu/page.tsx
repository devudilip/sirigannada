import type { Metadata } from "next";
import { HistorySeriesShelf, type SeriesCard } from "@/features/history/components/HistorySeriesShelf";
import { SANGATHIGALU_URL, readHistorySeries, readHistoryStories } from "@/features/history/lib/catalog";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = {
  title: strings.sangathigaluTitle.kn,
  description: strings.sangathigaluSub.kn,
  alternates: { canonical: SANGATHIGALU_URL },
};

/** ಕರ್ನಾಟಕ ಸಂಗತಿಗಳು: festivals and other things of the land, read with the history reader. */
export default function SangathigaluIndexPage() {
  const cards = readHistorySeries("sangathigalu").map((series): SeriesCard => {
    const stories = readHistoryStories(series.slug);
    const first = stories[0];
    return { series, count: stories.length, cover: first ? { image: first.cover, alt: first.title.kn } : undefined };
  });
  return <HistorySeriesShelf cards={cards} shelf="sangathigalu" />;
}
