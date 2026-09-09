import type { Metadata } from "next";
import { StoryPlayer } from "@/features/stories/components/StoryPlayer";
import { readStoriesManifest } from "@/features/stories/lib/readManifest";

export const dynamicParams = false;

export function generateStaticParams() {
  return readStoriesManifest().stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const story = readStoriesManifest().stories.find((s) => s.slug === slug);
  if (!story) return { title: "ಮಕ್ಕಳ ಕಥೆಗಳು", alternates: { canonical: `/stories/${slug}` } };
  return {
    title: story.title,
    description: `${story.title} · ${story.collection.kn}`,
    alternates: { canonical: `/stories/${slug}` },
    openGraph: {
      type: "website",
      siteName: "Sirigannada",
      locale: "kn_IN",
      title: `${story.title} · ${story.collection.kn}`,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "ಸಿರಿಗನ್ನಡ · Sirigannada" }],
    },
  };
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <StoryPlayer slug={slug} />;
}
