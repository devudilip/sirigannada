"use client";

import { useT } from "@/components/providers/AppProviders";
import type { BookForm } from "@/lib/types";
import { FORM_KEYS } from "../lib/formKeys";
import type { BookFormFilter } from "../types";

/** Horizontal row of 44 px pill chips: the active one is a coral fill, the rest elevated outlines. */
export function FormChips({
  forms,
  extra,
  value,
  onChange,
}: {
  forms: readonly BookForm[];
  /** Label of a trailing non-form chip (ಚಿತ್ರಕಥೆ), when that section exists. */
  extra?: string;
  value: BookFormFilter;
  onChange: (next: BookFormFilter) => void;
}) {
  const t = useT();
  const options: Array<{ id: BookFormFilter; label: string }> = [
    { id: "all", label: t("libraryChipAll") },
    ...forms.map((form) => ({ id: form, label: t(FORM_KEYS[form]) })),
    ...(extra ? [{ id: "chitrakathe" as const, label: extra }] : []),
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
