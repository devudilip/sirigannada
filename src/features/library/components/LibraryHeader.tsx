"use client";

import { useApp } from "@/components/providers/AppProviders";
import { PageTitle } from "@/components/ui/PageTitle";
import { useCachedBooks } from "../lib/bookCache";
import { localiseDigits } from "../lib/readPercent";
import { useBooksManifest } from "../lib/useBooksManifest";

/** "ಗ್ರಂಥಾಲಯ" over a 2 px rule with "12 books · all on device" once the manifest and cache are read. */
export function LibraryHeader() {
  const { locale, t } = useApp();
  const manifest = useBooksManifest();
  const slugs = manifest?.books.map((b) => b.slug);
  const cached = useCachedBooks(slugs);

  const count = manifest?.books.length ?? 0;
  const allOnDevice = cached !== null && count > 0 && cached.size === count;
  const detail =
    count > 0
      ? `${t("libraryBookCount", { n: localiseDigits(count, locale) })}${allOnDevice ? ` · ${t("libraryAllOnDevice")}` : ""}`
      : undefined;

  return <PageTitle k="navLibrary" detail={detail} />;
}
