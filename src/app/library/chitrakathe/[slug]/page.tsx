import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookStoryReader } from "@/features/children/components/BookStoryReader";
import { readAdultStories, storyUrl } from "@/features/children/lib/catalog";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return readAdultStories().map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = readAdultStories().find((s) => s.slug === slug);
  if (!story) return {};
  return { title: story.title.kn, description: story.teaser.kn, alternates: { canonical: storyUrl(story) } };
}
export default async function AdultStoryPage({ params }: Props) {
  const { slug } = await params;
  const story = readAdultStories().find((s) => s.slug === slug);
  if (!story) notFound();
  return <BookStoryReader story={story} />;
}
