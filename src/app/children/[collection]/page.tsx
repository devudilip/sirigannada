import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChildrenShelf } from "@/features/children/components/ChildrenShelf";
import { readChildStories, readCollections } from "@/features/children/lib/catalog";

type Props = { params: Promise<{ collection: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return readCollections().map((c) => ({ collection: c.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection } = await params;
  return { title: readCollections().find((c) => c.slug === collection)?.title.kn, alternates: { canonical: `/children/${collection}` } };
}
export default async function CollectionPage({ params }: Props) {
  const { collection } = await params;
  const selected = readCollections().find((c) => c.slug === collection);
  if (!selected) notFound();
  return <ChildrenShelf collections={readCollections()} stories={readChildStories()} collection={selected} />;
}
