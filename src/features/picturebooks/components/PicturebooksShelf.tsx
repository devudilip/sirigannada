"use client";

import { useApp } from "@/components/providers/AppProviders";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { localiseDigits } from "@/features/library/lib/readPercent";
import { usePicturebooksManifest } from "../lib/manifest";
import { PicturebookCoverStrip } from "./PicturebookCoverStrip";

/** "ಚಿತ್ರಪುಸ್ತಕಗಳು · 40 books · All books →" over a 2 px rule, then the lifted cover strip. */
export function PicturebooksShelf({ limit = 6 }: { limit?: number }) {
  const { locale, t } = useApp();
  const manifest = usePicturebooksManifest();
  const count = manifest?.books.length ?? 0;
  const detail = count > 0 ? t("picturebooksCount", { n: localiseDigits(count, locale) }) : undefined;
  return (
    <section>
      <SectionHeading k="navPicturebooks" detail={detail} href="/picturebooks" linkKey="picturebooksSeeAll" />
      <PicturebookCoverStrip limit={limit} />
    </section>
  );
}
