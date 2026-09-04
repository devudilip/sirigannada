import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { Converter } from "@/features/tools/components/Converter";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = { title: strings.convertTitle.kn, alternates: { canonical: "/tools/convert" } };

export default function ConvertPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-8">
      <PageTitle k="convertTitle" sub="convertSub" />
      <Converter />
    </div>
  );
}
