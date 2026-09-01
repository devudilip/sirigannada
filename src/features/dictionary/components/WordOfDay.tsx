"use client";

import { useEffect, useState } from "react";
import type { DictEntry } from "@/lib/types";
import { Skeleton } from "@/components/ui/Card";
import { useT } from "@/components/providers/AppProviders";
import { loadDaily } from "../lib/data";
import { EntryCard } from "./EntryCard";

function dayOfYear(d = new Date()): number {
  const start = Date.UTC(d.getFullYear(), 0, 0);
  return Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - start) / 86_400_000);
}

export function WordOfDay() {
  const t = useT();
  const [entry, setEntry] = useState<DictEntry | null | undefined>(undefined);

  useEffect(() => {
    loadDaily().then((daily) => {
      if (!daily || daily.entries.length === 0) return setEntry(null);
      setEntry(daily.entries[dayOfYear() % daily.entries.length] ?? null);
    });
  }, []);

  if (entry === undefined) return <Skeleton className="h-36" />;
  if (entry === null) return null;

  return (
    <div>
      <EntryCard entry={entry} compact />
      <p className="mt-2 text-xs text-muted">{t("dictCredit")}</p>
    </div>
  );
}
