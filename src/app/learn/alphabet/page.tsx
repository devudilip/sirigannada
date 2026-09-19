import type { Metadata } from "next";
import { AlphabetPageTitle } from "@/features/learn/components/AlphabetPageTitle";
import { AlphabetView } from "@/features/learn/components/AlphabetView";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = { title: strings.alphabetTitle.kn, alternates: { canonical: "/learn/alphabet" } };

export default function AlphabetPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-6 pb-12">
      <AlphabetPageTitle />
      <AlphabetView />
    </div>
  );
}
