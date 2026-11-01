import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { GadePurna } from "@/features/games/components/GadePurna";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = {
  title: strings.gadeTitle.kn,
  alternates: { canonical: "/games/gade" },
};

export default function GadePurnaPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-12 pt-8">
      <PageTitle k="gadeTitle" sub="gadeSub" />
      <GadePurna />
    </div>
  );
}
