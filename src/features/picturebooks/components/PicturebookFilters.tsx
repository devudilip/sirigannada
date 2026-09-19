"use client";

import { useApp } from "@/components/providers/AppProviders";
import { localiseDigits } from "@/features/library/lib/readPercent";
import { strings } from "@/lib/i18n";
import type { StringKey } from "@/lib/i18n";
import type { LevelFilter, PicturebookFilter } from "../lib/filter";

const LEVEL_LABEL: Record<LevelFilter, StringKey> = {
  "1": "picturebooksLevel",
  "2": "picturebooksLevel",
  "3": "picturebooksLevel",
  "4plus": "picturebooksLevel4Plus",
};

/** Horizontal row of 44 px pill chips: all, each level present, and a bilingual "with narration" chip. */
export function PicturebookFilters({
  filters,
  value,
  onChange,
}: {
  filters: readonly PicturebookFilter[];
  value: PicturebookFilter;
  onChange: (next: PicturebookFilter) => void;
}) {
  const { locale, t } = useApp();
  return (
    <div
      role="group"
      aria-label={t("picturebooksFilterLabel")}
      className="flex gap-2 overflow-x-auto [scrollbar-width:none] -mx-5 px-5 md:mx-0 md:px-0 md:flex-wrap"
    >
      {filters.map((id) => {
        const active = id === value;
        const chipClass = `h-11 shrink-0 rounded-full px-4 text-base font-semibold border transition-colors ${
          active ? "bg-accent-strong text-on-accent border-accent-strong shadow-lift" : "bg-elevated text-ink border-line-strong shadow-elevated hover:border-ink"
        }`;
        return (
          <button key={id} type="button" aria-pressed={active} onClick={() => onChange(id)} className={chipClass}>
            {id === "all" && t("picturebooksFilterAll")}
            {id === "audio" && (
              <>
                <span lang="kn">{strings.picturebooksAudioFilterKn.kn}</span>
                <span lang="en" className="font-latin"> · {strings.picturebooksAudioFilterEn.en}</span>
              </>
            )}
            {id !== "all" && id !== "audio" && (id === "4plus" ? t(LEVEL_LABEL[id]) : t(LEVEL_LABEL[id], { n: localiseDigits(Number(id), locale) }))}
          </button>
        );
      })}
    </div>
  );
}
