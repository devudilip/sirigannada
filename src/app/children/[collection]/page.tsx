import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChildrenSectionHeader } from "@/features/children/components/ChildrenSectionHeader";
import { ChildrenShelf } from "@/features/children/components/ChildrenShelf";
import { readChildStories, readCollections, readHubSections } from "@/features/children/lib/catalog";
import { PicturebooksHub } from "@/features/picturebooks/components/PicturebooksHub";

type Props = { params: Promise<{ collection: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return readCollections().map((c) => ({ collection: c.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection } = await params;
  return { title: readCollections().find((c) => c.slug === collection)?.title.kn, alternates: { canonical: `/children/${collection}` } };
}

/** A story section lists its illustrated stories; a picture-book section is the StoryWeaver shelf split by narration. */
export default async function CollectionPage({ params }: Props) {
  const { collection } = await params;
  const section = readHubSections().find((s) => s.collection.slug === collection);
  if (!section) notFound();
  if (section.collection.kind === "stories") {
    return <ChildrenShelf collection={section.collection} stories={readChildStories()} />;
  }
  return (
    <div className="mx-auto max-w-5xl px-5 pt-8 pb-12">
      <ChildrenSectionHeader collection={section.collection} count={section.count} />
      <PicturebooksHub narrated={section.collection.narrated} hideTitle />
    </div>
  );
}
