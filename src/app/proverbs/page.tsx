import type { Metadata } from "next";
import { ProverbsBrowse } from "@/features/proverbs/components/ProverbsBrowse";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = { title: strings.proverbsTitle.kn, alternates: { canonical: "/proverbs" } };

export default function ProverbsPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-4 pb-12">
      <ProverbsBrowse />
    </div>
  );
}
