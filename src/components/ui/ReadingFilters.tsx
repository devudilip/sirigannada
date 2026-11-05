"use client";

import { useT } from "@/components/providers/AppProviders";
import type { ReadingFilter } from "@/lib/readingStatus";

export function ReadingFilters({ value, onChange }: { value: ReadingFilter; onChange: (value: ReadingFilter) => void }) {
  const t = useT();
  return <div><div role="group" aria-label={t("readingFilter")} className="flex flex-wrap gap-2">{(["unread", "read", "all"] as const).map((filter) => <button key={filter} type="button" aria-pressed={value === filter} onClick={() => onChange(filter)} className={`min-h-11 px-4 rounded-full border text-base font-semibold ${value === filter ? "bg-accent-soft border-accent-strong text-accent-text" : "bg-elevated border-line text-secondary"}`}>{t(filter === "unread" ? "readingUnread" : filter === "read" ? "readingRead" : "readingAll")}</button>)}</div><p className="mt-2 text-base text-muted">{t("readingDeviceNote")}</p></div>;
}
