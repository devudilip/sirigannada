import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { TextHealthChecker } from "@/features/text-health/components/TextHealthChecker";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = { title: strings.textHealthTitle.kn, alternates: { canonical: "/tools/text-health" } };

export default function TextHealthPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-8">
      <PageTitle k="textHealthTitle" sub="textHealthSub" />
      <TextHealthChecker />
    </div>
  );
}
