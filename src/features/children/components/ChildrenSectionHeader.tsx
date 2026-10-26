"use client";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProviders";
import { PageTitle } from "@/components/ui/PageTitle";
import { localiseDigits } from "@/features/library/lib/readPercent";
import type { StoryCollection } from "../types";
import { CHILDREN_URL, LIBRARY_URL } from "../lib/sections";

/** Section page top: a link back to ಮಕ್ಕಳ ಕಥೆಗಳು, the section's own title and description, and its count. */
export function ChildrenSectionHeader({
  collection,
  count,
}: {
  collection: StoryCollection;
  count: number;
}) {
  const { locale, t } = useApp();
  const countLabel =
    collection.kind === "stories"
      ? count === 1
        ? t("childrenStoryOne")
        : t("childrenStoryCount", { n: localiseDigits(count, locale) })
      : t("picturebooksCount", { n: localiseDigits(count, locale) });
  return (
    <header className="mb-6">
      <Link
        href={collection.kind === "stories" && collection.audience === "adults" ? LIBRARY_URL : CHILDREN_URL}
        className="hidden sm:inline-flex min-h-11 items-center text-accent"
      >
        {collection.kind === "stories" && collection.audience === "adults" ? t("navLibrary") : t("childrenTitle")}
      </Link>
      <PageTitle title={collection.title[locale]} lang={locale} detail={count > 0 ? countLabel : undefined} />
      <p className="mt-3 text-lg text-secondary" lang={locale}>{collection.description[locale]}</p>
    </header>
  );
}
