import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { NumbersTool } from "@/features/tools/components/NumbersTool";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = { title: strings.numbersTitle.kn };

export default function NumbersPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-8">
      <PageTitle k="numbersTitle" sub="numbersSub" />
      <NumbersTool />
    </div>
  );
}
