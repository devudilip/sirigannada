"use client";

import { useT } from "@/components/providers/AppProviders";
import { CrosswordBlock } from "./CrosswordBlock";
import { DailyWordBlock } from "./DailyWordBlock";

/** 1h Games hub: the two daily puzzles as rule-separated blocks, then the midnight note. */
export function GamesIndex() {
  const t = useT();
  return (
    <div className="flex flex-col gap-8">
      <DailyWordBlock />
      <CrosswordBlock />
      <p className="rule-section pt-3 text-sm text-muted">{t("gamesTomorrowNote")}</p>
    </div>
  );
}
