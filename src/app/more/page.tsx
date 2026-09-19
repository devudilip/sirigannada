import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { MoreIndex } from "@/features/more/components/MoreIndex";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = { title: strings.navMore.kn, alternates: { canonical: "/more" } };

export default function MorePage() {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-6 pb-12">
      <PageTitle k="navMore" />
      <MoreIndex />
    </div>
  );
}
