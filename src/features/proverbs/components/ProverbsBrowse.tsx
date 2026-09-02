"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchBox } from "@/components/ui/SearchBox";
import { Skeleton } from "@/components/ui/Card";
import { useT } from "@/components/providers/AppProviders";
import { filterProverbs } from "../lib/filter";
import { loadProverbs } from "../lib/load";
import type { ProverbsFile } from "../types";
import { ProverbRow } from "./ProverbRow";
import { ProverbsCredit } from "./ProverbsCredit";

export function ProverbsBrowse() {
  const t = useT();
  const [q, setQ] = useState("");
  const [data, setData] = useState<ProverbsFile | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    loadProverbs().then((file) => {
      if (!alive) return;
      if (!file) setFailed(true);
      else setData(file);
    });
    return () => {
      alive = false;
    };
  }, []);

  const visible = useMemo(
    () => (data ? filterProverbs(data.proverbs, q) : []),
    [data, q],
  );

  if (failed) {
    return <p className="text-secondary text-base py-8 text-center">{t("proverbLoadError")}</p>;
  }

  if (!data) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-12" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <SearchBox
        value={q}
        onChange={setQ}
        size="lg"
        placeholder={t("proverbSearchPlaceholder")}
        aria-label={t("proverbSearchPlaceholder")}
      />
      <p className="text-sm text-muted" aria-live="polite">
        {t("proverbCount", { n: visible.length })}
      </p>
      {q.trim() && visible.length === 0 ? (
        <p className="text-secondary text-base py-8 text-center">{t("noResults")}</p>
      ) : (
        <ul className="rounded-lg border border-line bg-elevated px-4">
          {visible.map((p) => (
            <ProverbRow key={p.id ?? p.text} proverb={p} />
          ))}
        </ul>
      )}
      <ProverbsCredit source={data.provenance.source} />
    </div>
  );
}
