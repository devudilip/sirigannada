import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryReader } from "@/features/children/components/StoryReader";
import { readChildStories, storyUrl } from "@/features/children/lib/catalog";

type Props = { params: Promise<{ collection: string; slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return readChildStories().map(({ collection, slug }) => ({ collection, slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection, slug } = await params;
  const story = readChildStories().find((s) => s.collection === collection && s.slug === slug);
  if (!story) return {};
  return { title: story.title.kn, description: story.teaser.kn, alternates: { canonical: storyUrl(story) } };
}
export default async function StoryPage({ params }: Props) {
  const { collection, slug } = await params;
  const story = readChildStories().find((s) => s.collection === collection && s.slug === slug);
  if (!story) notFound();
  return <StoryReader story={story} />;
}
