"use client";

import { useApp } from "@/components/providers/AppProviders";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CoverStrip } from "@/features/library/components/CoverStrip";
import { localiseDigits } from "@/features/library/lib/readPercent";
import { useBooksManifest } from "@/features/library/lib/useBooksManifest";

/** "ಗ್ರಂಥಾಲಯ · 12 books" over a 2 px rule, then the cover strip. */
export function HomeShelf() {
  const { locale, t } = useApp();
  const manifest = useBooksManifest();
  const count = manifest?.books.length ?? 0;
  const detail = count > 0 ? t("libraryBookCount", { n: localiseDigits(count, locale) }) : undefined;
  return (
    <section>
      <SectionHeading k="navLibrary" detail={detail} href="/library" linkKey="homeShelfLink" />
      <CoverStrip />
    </section>
  );
}
