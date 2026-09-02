import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { AlphabetView } from "@/features/learn/components/AlphabetView";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = { title: strings.alphabetTitle.kn };

export default function AlphabetPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-8 pb-12">
      <PageTitle k="alphabetTitle" sub="alphabetSub" />
      <AlphabetView />
    </div>
  );
}
