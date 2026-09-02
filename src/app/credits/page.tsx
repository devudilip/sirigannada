import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { AlarCredit } from "@/features/credits/components/AlarCredit";
import { CreditsList } from "@/features/credits/components/CreditsList";
import { readBooksManifest } from "@/features/library/lib/readManifest";

export const metadata: Metadata = { title: "ಮೂಲಗಳು" };

export default function CreditsPage() {
  const { books } = readBooksManifest();
  return (
    <div className="mx-auto max-w-2xl px-4 pt-8 pb-12">
      <PageTitle k="navCredits" sub="creditsSub" />
      <div className="flex flex-col gap-8">
        <AlarCredit />
        <CreditsList books={books} />
      </div>
    </div>
  );
}
