"use client";

import { useApp } from "@/components/providers/AppProviders";
import { toKannadaDigits } from "@/lib/kannada";

/** The story's age band (೨+, ೮+ …) as a pill beside its title; the full phrase is the accessible name. */
export function AgeBadge({ age, className = "" }: { age: string; className?: string }) {
  const { locale, t } = useApp();
  const shown = locale === "kn" ? toKannadaDigits(age) : age;
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full bg-gold-soft px-2.5 py-0.5 font-sans text-sm font-semibold text-ink ${className}`}
      title={t("childrenAge", { age: shown })}
      aria-label={t("childrenAge", { age: shown })}
    >
      {shown}
    </span>
  );
}
