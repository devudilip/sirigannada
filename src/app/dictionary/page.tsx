import type { Metadata } from "next";
import { Suspense } from "react";
import { DownloadDictionaryButton } from "@/features/dictionary/components/DownloadDictionaryButton";
import { DictionarySearch } from "@/features/dictionary/components/DictionarySearch";
import { PageTitle } from "@/components/ui/PageTitle";

export const metadata: Metadata = { title: "ನಿಘಂಟು" };

export default function DictionaryPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-8">
      <PageTitle k="navDictionary" />
      <DownloadDictionaryButton />
      <Suspense fallback={null}>
        <DictionarySearch />
      </Suspense>
    </div>
  );
}
