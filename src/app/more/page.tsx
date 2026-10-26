import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { MoreIndex } from "@/features/more/components/MoreIndex";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = {
  title: strings.navMore.kn,
  alternates: { canonical: "/more" },
};

export default function MorePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-8 pb-12">
      <PageTitle k="navMore" showBack={false} />
      <MoreIndex />
    </div>
  );
}
