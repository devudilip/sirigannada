import type { Metadata } from "next";
import { ReadAlong } from "@/features/stories/components/ReadAlong";
import { readStoriesManifest } from "@/features/stories/lib/readManifest";
import { storiesStrings } from "@/lib/i18n.stories";

export const dynamicParams = false;

export function generateStaticParams() {
  return readStoriesManifest()
    .stories.filter((s) => s.sentences)
    .map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const story = readStoriesManifest().stories.find((s) => s.slug === slug);
  const readAlong = storiesStrings.readAlongTitle.kn;
  return {
    title: story ? `${story.title} · ${readAlong}` : readAlong,
    alternates: { canonical: `/stories/${slug}/read` },
  };
}

export default async function ReadAlongPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ReadAlong slug={slug} />;
}
