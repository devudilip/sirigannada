import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChildrenShelf } from "@/features/children/components/ChildrenShelf";
import { readAdultCollection, readAdultStories } from "@/features/children/lib/catalog";
import { ADULT_STORIES_URL } from "@/features/children/lib/sections";

export function generateMetadata(): Metadata {
  return { title: readAdultCollection()?.title.kn, alternates: { canonical: ADULT_STORIES_URL } };
}

/** ಚಿತ್ರಕಥೆ: the 16+ retellings, shelved in the library and kept out of ಮಕ್ಕಳ ಕಥೆಗಳು. */
export default function AdultStoriesPage() {
  const collection = readAdultCollection();
  if (!collection) notFound();
  return <ChildrenShelf collection={collection} stories={readAdultStories()} />;
}
