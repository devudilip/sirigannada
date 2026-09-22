"use client";

import { useApp } from "@/components/providers/AppProviders";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CHILDREN_URL } from "@/features/children/lib/sections";
import { localiseDigits } from "@/features/library/lib/readPercent";
import { usePicturebooksManifest } from "../lib/manifest";
import { PicturebookCoverStrip } from "./PicturebookCoverStrip";

/** "ಮಕ್ಕಳ ಕಥೆಗಳು · 40 books · All →" over a 2 px rule (linking to the children's hub), then the lifted cover strip. */
export function PicturebooksShelf({ limit = 6 }: { limit?: number }) {
  const { locale, t } = useApp();
  const manifest = usePicturebooksManifest();
  const count = manifest?.books.length ?? 0;
  const detail = count > 0 ? t("picturebooksCount", { n: localiseDigits(count, locale) }) : undefined;
  return (
    <section>
      <SectionHeading k="navChildren" detail={detail} href={CHILDREN_URL} linkKey="picturebooksSeeAll" />
      <PicturebookCoverStrip limit={limit} />
    </section>
  );
}
