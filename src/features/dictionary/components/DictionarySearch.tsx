"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchBox } from "@/components/ui/SearchBox";
import { Skeleton } from "@/components/ui/Card";
import { useT } from "@/components/providers/AppProviders";
import { useSearch } from "../lib/useSearch";
import { EntryCard } from "./EntryCard";

export function DictionarySearch() {
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const { results, loading } = useSearch(q);

  // Keep the URL shareable without adding history entries on every keystroke.
  useEffect(() => {
    const current = params.get("q") ?? "";
    if (q.trim() === current) return;
    const url = q.trim() ? `/dictionary?q=${encodeURIComponent(q.trim())}` : "/dictionary";
    router.replace(url, { scroll: false });
  }, [q, params, router]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <SearchBox value={q} onChange={setQ} size="lg" autoFocus />
        <p className="mt-2 text-sm text-muted">{t("searchHint")}</p>
      </div>

      {loading && results.length === 0 && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      )}

      {!loading && q.trim() && results.length === 0 && (
        <p className="text-secondary text-base py-8 text-center">{t("noResults")}</p>
      )}

      {results.length > 0 && (
        <ul className="flex flex-col gap-3" aria-live="polite">
          {results.map(({ entry }) => (
            <li key={entry.id}>
              <EntryCard entry={entry} />
            </li>
          ))}
        </ul>
      )}

      {!q.trim() && <p className="text-xs text-muted">{t("dictCredit")}</p>}
    </div>
  );
}
