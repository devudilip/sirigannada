import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { PracticeHub } from "@/features/learn/components/PracticeHub";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = { title: strings.practiceTitle.kn };

export default function PracticePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-8 pb-12">
      <PageTitle k="practiceTitle" sub="practiceSub" />
      <PracticeHub />
    </div>
  );
}
