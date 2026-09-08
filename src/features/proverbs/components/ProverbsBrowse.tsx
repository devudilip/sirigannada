"use client";

import { useEffect, useMemo, useState } from "react";
import { PageTitle } from "@/components/ui/PageTitle";
import { SearchBox } from "@/components/ui/SearchBox";
import { Skeleton } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useApp, useT } from "@/components/providers/AppProviders";
import { arabicToKannadaDigits } from "@/features/tools/lib/numerals";
import { filterProverbs } from "../lib/filter";
import { groupProverbs } from "../lib/group";
import { loadProverbs } from "../lib/load";
import { getNextVisibleCount, getVisibleProverbs, INITIAL_PROVERB_COUNT, PROVERB_BATCH_SIZE } from "../lib/window";
import type { ProverbsFile } from "../types";
import { ProverbGroup } from "./ProverbGroup";
import { ProverbQuickChips } from "./ProverbQuickChips";
import { ProverbRow } from "./ProverbRow";
import { ProverbsCredit } from "./ProverbsCredit";

export function ProverbsBrowse() {
  const t = useT();
  const { locale } = useApp();
  const [q, setQ] = useState("");
  const [data, setData] = useState<ProverbsFile | null>(null);
  const [failed, setFailed] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_PROVERB_COUNT);
  const [selected, setSelected] = useState<string | null>(null);

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

  const matches = useMemo(() => (data ? filterProverbs(data.proverbs, q) : []), [data, q]);
  const visible = useMemo(() => getVisibleProverbs(matches, visibleCount), [matches, visibleCount]);
  const grouped = !q.trim();
  const groups = useMemo(() => (grouped ? groupProverbs(visible, matches) : []), [grouped, visible, matches]);

  function handleQueryChange(value: string) {
    setQ(value);
    setVisibleCount(INITIAL_PROVERB_COUNT);
    setSelected(null);
  }

  const total = data ? data.proverbs.length : 0;
  const count = locale === "kn" ? arabicToKannadaDigits(String(total)) : total.toLocaleString("en-IN");
  const detail = data ? `${count} · ${t("licenseCCBYSA")}` : undefined;
  const remaining = matches.length - visible.length;

  const row = (p: ProverbsFile["proverbs"][number], index: number) => {
    const key = p.id ?? `${p.text}-${index}`;
    return <ProverbRow key={key} proverb={p} selected={selected === key} onSelect={() => setSelected(selected === key ? null : key)} />;
  };

  return (
    <div className="flex flex-col gap-5">
      <PageTitle k="proverbsTitle" detail={detail} />
      {failed && <p className="text-secondary text-base py-8">{t("proverbLoadError")}</p>}
      {!failed && !data && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-11" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      )}
      {data && (
        <>
          <SearchBox value={q} onChange={handleQueryChange} placeholder={t("proverbSearchPlaceholder")} aria-label={t("proverbSearchPlaceholder")} />
          <ProverbQuickChips active={q} onPick={handleQueryChange} />
          {!grouped && (
            <p className="text-sm text-muted" aria-live="polite">
              {t("proverbVisibleCount", { shown: visible.length, total: matches.length })}
            </p>
          )}
          {!grouped && matches.length === 0 ? (
            <p className="text-secondary text-base py-8">{t("noResults")}</p>
          ) : grouped ? (
            <div id="proverb-results" className="flex flex-col gap-6">
              {groups.map((group) => (
                <ProverbGroup key={group.letter} group={group}>
                  {group.items.map(row)}
                </ProverbGroup>
              ))}
            </div>
          ) : (
            <ul id="proverb-results" className="flex flex-col">
              {visible.map(row)}
            </ul>
          )}
          {remaining > 0 ? (
            <Button
              variant="ghost"
              className="-ml-4 self-start"
              aria-controls="proverb-results"
              onClick={() => setVisibleCount((c) => getNextVisibleCount(c, matches.length))}
            >
              {t("proverbShowMoreCount", { count: Math.min(remaining, PROVERB_BATCH_SIZE) })} ↓
            </Button>
          ) : null}
          <ProverbsCredit source={data.provenance.source} />
        </>
      )}
    </div>
  );
}
