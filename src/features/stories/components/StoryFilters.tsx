"use client";

import { useT } from "@/components/providers/AppProviders";
import type { StringKey } from "@/lib/i18n";
import type { StoryFilter } from "../types";

const LABELS: Record<StoryFilter, StringKey> = {
  all: "storiesFilterAll",
  short: "storiesFilterShort",
  animal: "storiesFilterAnimal",
  moral: "storiesFilterMoral",
  funny: "storiesFilterFunny",
  school: "storiesFilterSchool",
  family: "storiesFilterFamily",
};

/** Horizontal row of 44 px pill chips; the active one is a coral fill. Scrolls sideways on phones. */
export function StoryFilters({
  filters,
  value,
  onChange,
}: {
  filters: readonly StoryFilter[];
  value: StoryFilter;
  onChange: (next: StoryFilter) => void;
}) {
  const t = useT();
  return (
    <div
      role="group"
      aria-label={t("storiesFilterLabel")}
      className="flex gap-2 overflow-x-auto [scrollbar-width:none] -mx-5 px-5 md:mx-0 md:px-0 md:flex-wrap"
    >
      {filters.map((id) => {
        const active = id === value;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(id)}
            className={`h-11 shrink-0 rounded-full px-4 text-base font-semibold border transition-colors ${
              active ? "bg-accent text-on-accent border-accent" : "bg-elevated text-ink border-line-strong hover:border-ink"
            }`}
          >
            {t(LABELS[id])}
          </button>
        );
      })}
    </div>
  );
}
