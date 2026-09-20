import type { Metadata } from "next";
import { ChildrenShelf } from "@/features/children/components/ChildrenShelf";
import { readChildStories, readCollections } from "@/features/children/lib/catalog";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = { title: strings.childrenTitle.kn, alternates: { canonical: "/children" } };

export default function ChildrenPage() {
  return <ChildrenShelf collections={readCollections()} stories={readChildStories()} />;
}
