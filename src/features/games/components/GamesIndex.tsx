"use client";

import { useT } from "@/components/providers/AppProviders";
import { CrosswordBlock } from "./CrosswordBlock";
import { DailyWordBlock } from "./DailyWordBlock";
import { GadeBlock } from "./GadeBlock";

/** 1h Games hub: the three daily puzzles as rule-separated blocks, then the midnight note. */
export function GamesIndex() {
  const t = useT();
  return (
    <div className="flex flex-col gap-8">
      <DailyWordBlock />
      <CrosswordBlock />
      <GadeBlock />
      <p className="rule-section pt-3 text-sm text-muted">{t("gamesTomorrowNote")}</p>
    </div>
  );
}
