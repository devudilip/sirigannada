import type { Metadata } from "next";
import { Suspense } from "react";
import { PageTitle } from "@/components/ui/PageTitle";
import { CorpusSearch } from "@/features/search/components/CorpusSearch";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = { title: strings.corpusSearchTitle.kn, alternates: { canonical: "/search" } };

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-4 pb-12">
      <PageTitle k="corpusSearchTitle" sub="corpusSearchSub" />
      <Suspense fallback={null}>
        <CorpusSearch />
      </Suspense>
    </div>
  );
}
