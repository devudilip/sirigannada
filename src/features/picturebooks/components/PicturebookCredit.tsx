"use client";

import { useT } from "@/components/providers/AppProviders";

/** "Stories from StoryWeaver (Pratham Books) · CC BY 4.0", linking out to StoryWeaver. */
export function PicturebookCredit() {
  const t = useT();
  return (
    <p className="text-sm text-muted">
      <a href="https://storyweaver.org.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">
        {t("picturebooksCredit")}
      </a>
      <span aria-hidden="true"> · </span>
      {t("licenseCCBY")}
    </p>
  );
}
