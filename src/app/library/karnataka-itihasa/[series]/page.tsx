import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HistoryStoryShelf } from "@/features/history/components/HistoryStoryShelf";
import { historySeriesUrl, readHistorySeries, readHistorySeriesBySlug, readHistoryStories } from "@/features/history/lib/catalog";

type Props = { params: Promise<{ series: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return readHistorySeries().map(({ slug }) => ({ series: slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { series } = await params;
  const found = readHistorySeriesBySlug(series);
  if (!found) return {};
  return { title: found.title.kn, description: found.description.kn, alternates: { canonical: historySeriesUrl(series) } };
}

/** One series (ಕದಂಬರು, ಬಾದಾಮಿ ಚಾಲುಕ್ಯರು, ...): its stories, or a note that they are on the way. */
export default async function HistorySeriesPage({ params }: Props) {
  const { series } = await params;
  const found = readHistorySeriesBySlug(series);
  if (!found) notFound();
  return <HistoryStoryShelf series={found} stories={readHistoryStories(series)} />;
}
