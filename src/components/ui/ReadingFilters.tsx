"use client";

import { useT } from "@/components/providers/AppProviders";
import type { ReadingFilter } from "@/lib/readingStatus";

export function ReadingFilters({ value, onChange }: { value: ReadingFilter; onChange: (value: ReadingFilter) => void }) {
  const t = useT();
  return <div><label className="flex items-center gap-3 sm:hidden text-base"><span className="shrink-0">{t("readingFilter")}</span><select aria-label={t("readingFilter")} value={value} onChange={(e) => onChange(e.target.value as ReadingFilter)} className="min-h-11 min-w-0 flex-1 rounded-md border border-line bg-elevated px-3">{(["unread", "read", "all"] as const).map((filter) => <option key={filter} value={filter}>{t(filter === "unread" ? "readingUnread" : filter === "read" ? "readingRead" : "readingAll")}</option>)}</select></label><div role="group" aria-label={t("readingFilter")} className="hidden sm:flex flex-wrap gap-2">{(["unread", "read", "all"] as const).map((filter) => <button key={filter} type="button" aria-pressed={value === filter} onClick={() => onChange(filter)} className={`min-h-11 px-4 rounded-full border text-base font-semibold ${value === filter ? "bg-accent-soft border-accent-strong text-accent-text" : "bg-elevated border-line text-secondary"}`}>{t(filter === "unread" ? "readingUnread" : filter === "read" ? "readingRead" : "readingAll")}</button>)}</div></div>;
}
