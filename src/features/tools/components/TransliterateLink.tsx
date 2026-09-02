"use client";

import Link from "next/link";
import { useT } from "@/components/providers/AppProviders";

export function TransliterateLink() {
  const t = useT();
  return (
    <Link className="text-accent underline" href="/tools/transliterate">
      {t("openTransliterator")}
    </Link>
  );
}
