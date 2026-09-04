import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { PadabandhaGame } from "@/features/padabandha/components/PadabandhaGame";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = {
  title: strings.padabandhaTitle.kn,
  alternates: { canonical: "/learn/padabandha" },
};

export default function PadabandhaPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-12 pt-8">
      <PageTitle k="padabandhaTitle" sub="padabandhaSub" />
      <PadabandhaGame />
    </div>
  );
}
