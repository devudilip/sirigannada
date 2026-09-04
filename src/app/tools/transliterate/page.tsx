import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { Transliterator } from "@/features/tools/components/Transliterator";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = {
  title: strings.transliterateTitle.kn,
  alternates: { canonical: "/tools/transliterate" },
};

export default function TransliteratePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-8">
      <PageTitle k="transliterateTitle" sub="transliterateSub" />
      <Transliterator />
    </div>
  );
}
