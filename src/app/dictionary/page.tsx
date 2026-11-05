import type { Metadata } from "next";
import { Suspense } from "react";
import { DictionarySearch } from "@/features/dictionary/components/DictionarySearch";
import { PageTitle } from "@/components/ui/PageTitle";

export const metadata: Metadata = {
  title: "ನಿಘಂಟು",
  alternates: { canonical: "/dictionary" },
};

export default function DictionaryPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-8 pb-12">
      <PageTitle k="navDictionary" showBack={false} />
      <Suspense fallback={null}>
        <DictionarySearch />
      </Suspense>
    </div>
  );
}
