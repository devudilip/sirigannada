import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { LearnIndex } from "@/features/learn/components/LearnIndex";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = { title: strings.learnTitle.kn, alternates: { canonical: "/learn" } };

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-8 pb-12">
      <PageTitle k="learnTitle" sub="learnSub" />
      <LearnIndex />
    </div>
  );
}
