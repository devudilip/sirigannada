import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HistoryStoryShelf } from "@/features/history/components/HistoryStoryShelf";
import { historySeriesUrl, readHistorySeries, readHistorySeriesBySlug, readHistoryStories } from "@/features/history/lib/catalog";

const SHELF = "sangathigalu";
type Props = { params: Promise<{ series: string }> };
export const dynamicParams = false;
/** Static export refuses an empty list, so one placeholder path is emitted until a series exists. */
export function generateStaticParams() {
  const params = readHistorySeries(SHELF).map(({ slug }) => ({ series: slug }));
  return params.length ? params : [{ series: "_" }];
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { series } = await params;
  const found = readHistorySeriesBySlug(series, SHELF);
  if (!found) return {};
  return { title: found.title.kn, description: found.description.kn, alternates: { canonical: historySeriesUrl(series, SHELF) } };
}

/** One ಸಂಗತಿಗಳು series (ಹಬ್ಬ-ಜಾತ್ರೆಗಳು, ...): its books, or a note that they are on the way. */
export default async function SangathigaluSeriesPage({ params }: Props) {
  const { series } = await params;
  const found = readHistorySeriesBySlug(series, SHELF);
  if (!found) notFound();
  return <HistoryStoryShelf series={found} stories={readHistoryStories(series)} />;
}
