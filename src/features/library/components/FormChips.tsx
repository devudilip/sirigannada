"use client";

import { useT } from "@/components/providers/AppProviders";
import type { BookForm } from "@/lib/types";
import { FORM_KEYS } from "../lib/formKeys";
import type { BookFormFilter, SectionFilter } from "../types";

/** Horizontal row of 44 px pill chips: the active one is a coral fill, the rest elevated outlines. */
export function FormChips({
  forms,
  extras = [],
  value,
  onChange,
}: {
  forms: readonly BookForm[];
  /** Trailing non-form chips (ಚಿತ್ರಕಥೆ, ಕರ್ನಾಟಕ ಇತಿಹಾಸ), one per section box on the shelf. */
  extras?: ReadonlyArray<{ id: SectionFilter; label: string }>;
  value: BookFormFilter;
  onChange: (next: BookFormFilter) => void;
}) {
  const t = useT();
  const options: Array<{ id: BookFormFilter; label: string }> = [
    { id: "all", label: t("libraryChipAll") },
    ...forms.map((form) => ({ id: form, label: t(FORM_KEYS[form]) })),
    ...extras,
  ];
  return (
    <div role="group" aria-label={t("libraryFilterLabel")} className="flex gap-2 overflow-x-auto [scrollbar-width:none] -mx-5 px-5 md:mx-0 md:px-0 md:flex-wrap">
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={`h-11 shrink-0 rounded-full px-4 text-base font-semibold border transition-colors ${
              active ? "bg-accent-strong text-on-accent border-accent-strong" : "bg-elevated text-ink border-line-strong hover:border-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
