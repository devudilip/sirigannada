"use client";

import { useApp } from "@/components/providers/AppProviders";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CHILDREN_URL } from "@/features/children/lib/sections";
import { localiseDigits } from "@/features/library/lib/readPercent";
import { usePicturebooksManifest } from "../lib/manifest";
import { PicturebookCoverStrip, type ShelfLead } from "./PicturebookCoverStrip";

/**
 * "ಮಕ್ಕಳ ಕಥೆಗಳು · 408 books · All →" over a 2 px rule (linking to the children's hub), then the lifted
 * cover strip. `lead` puts the first illustrated story in front of the picture books so home shows
 * every kind of story the hub holds; `leadCount` is added to the total.
 */
export function PicturebooksShelf({ limit = 6, lead, leadCount = 0 }: { limit?: number; lead?: ShelfLead; leadCount?: number }) {
  const { locale, t } = useApp();
  const manifest = usePicturebooksManifest();
  const count = (manifest?.books.length ?? 0) + (manifest ? leadCount : 0);
  const detail = count > 0 ? t("picturebooksCount", { n: localiseDigits(count, locale) }) : undefined;
  return (
    <section>
      <SectionHeading k="navChildren" detail={detail} href={CHILDREN_URL} linkKey="picturebooksSeeAll" />
      <PicturebookCoverStrip limit={limit} lead={lead} />
    </section>
  );
}
