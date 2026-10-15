import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HistoryReader } from "@/features/history/components/HistoryReader";
import { historyStoryUrl, readHistorySeries, readHistorySeriesBySlug, readHistoryStories, readHistoryStory } from "@/features/history/lib/catalog";

type Props = { params: Promise<{ series: string; story: string }> };
export const dynamicParams = false;
/**
 * Static export refuses an empty list here, so until the first story ships one placeholder path
 * is emitted; it renders the not-found page and drops out as soon as a story exists.
 */
const PLACEHOLDER = { series: "_", story: "_" };
export function generateStaticParams() {
  const params = readHistorySeries().flatMap(({ slug }) => readHistoryStories(slug).map((story) => ({ series: slug, story: story.slug })));
  return params.length ? params : [PLACEHOLDER];
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { series, story: slug } = await params;
  const story = readHistoryStory(series, slug);
  if (!story) return {};
  return { title: story.title.kn, description: story.teaser.kn, alternates: { canonical: historyStoryUrl(story) } };
}

/** The immersive reader for one history story. */
export default async function HistoryStoryPage({ params }: Props) {
  const { series, story: slug } = await params;
  const story = readHistoryStory(series, slug);
  const found = readHistorySeriesBySlug(series);
  if (!story || !found) notFound();
  return <HistoryReader story={story} seriesTitle={found.title.kn} />;
}
