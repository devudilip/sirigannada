"use client";

import { useApp } from "@/components/providers/AppProviders";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CHILDREN_URL } from "@/features/children/lib/sections";
import { localiseDigits } from "@/features/library/lib/readPercent";
import { usePicturebooksManifest } from "../lib/manifest";
import { PicturebookCoverStrip, type ShelfLead } from "./PicturebookCoverStrip";

/** Daily children's discovery, with the full collection one link away. */
export function PicturebooksShelf({ limit = 6, leads, leadCount = 0 }: { limit?: number; leads?: ShelfLead[]; leadCount?: number }) {
  const { locale, t } = useApp();
  const manifest = usePicturebooksManifest();
  const count = (manifest?.books.length ?? 0) + (manifest ? leadCount : 0);
  const detail = count > 0 ? t("picturebooksCount", { n: localiseDigits(count, locale) }) : undefined;
  return (
    <section>
      <SectionHeading k="navChildren" detail={detail} href={CHILDREN_URL} linkKey="picturebooksSeeAll" />
      <p className="mb-4 text-base text-secondary">{t("homeDailyShelf")}</p>
      <PicturebookCoverStrip limit={limit} leads={leads} />
    </section>
  );
}
