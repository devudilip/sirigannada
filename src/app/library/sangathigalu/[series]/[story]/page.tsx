import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HistoryReader } from "@/features/history/components/HistoryReader";
import { historyStoryUrl, readHistorySeries, readHistorySeriesBySlug, readHistoryStories, readHistoryStory } from "@/features/history/lib/catalog";

const SHELF = "sangathigalu";
type Props = { params: Promise<{ series: string; story: string }> };
export const dynamicParams = false;
/** Static export refuses an empty list here, so one placeholder path is emitted until a book ships. */
export function generateStaticParams() {
  const params = readHistorySeries(SHELF).flatMap(({ slug }) => readHistoryStories(slug).map((story) => ({ series: slug, story: story.slug })));
  return params.length ? params : [{ series: "_", story: "_" }];
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { series, story: slug } = await params;
  const story = readHistoryStory(series, slug);
  if (!story || !readHistorySeriesBySlug(series, SHELF)) return {};
  return { title: story.title.kn, description: story.teaser.kn, alternates: { canonical: historyStoryUrl(story, SHELF) } };
}

/** The immersive reader for one ಸಂಗತಿಗಳು book. */
export default async function SangathigaluStoryPage({ params }: Props) {
  const { series, story: slug } = await params;
  const story = readHistoryStory(series, slug);
  const found = readHistorySeriesBySlug(series, SHELF);
  if (!story || !found) notFound();
  return <HistoryReader story={story} seriesTitle={found.title.kn} shelf={SHELF} />;
}
