import type { Metadata } from "next";
import { Suspense } from "react";
import { DictionarySearch } from "@/features/dictionary/components/DictionarySearch";
import { PageTitle } from "@/components/ui/PageTitle";

export const metadata: Metadata = { title: "ನಿಘಂಟು", alternates: { canonical: "/dictionary" } };

export default function DictionaryPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-4 pb-12">
      <div className="hidden md:block">
        <PageTitle k="navDictionary" />
      </div>
      <Suspense fallback={null}>
        <DictionarySearch />
      </Suspense>
    </div>
  );
}
