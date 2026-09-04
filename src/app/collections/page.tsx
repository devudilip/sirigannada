import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { CollectionsManager } from "@/features/collections/components/CollectionsManager";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = {
  title: strings.collectionsTitle.kn,
  alternates: { canonical: "/collections" },
};

export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-8 pb-12">
      <PageTitle k="collectionsTitle" sub="collectionsSub" />
      <CollectionsManager />
    </div>
  );
}
