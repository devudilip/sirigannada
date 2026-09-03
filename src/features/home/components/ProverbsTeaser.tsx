"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/Card";
import { DestinationLink } from "@/components/ui/DestinationLink";
import { useT } from "@/components/providers/AppProviders";
import { ProverbRow } from "@/features/proverbs/components/ProverbRow";
import { loadProverbs } from "@/features/proverbs/lib/load";
import { pickTeasers } from "@/features/proverbs/lib/teasers";
import type { ProverbsFile } from "@/features/proverbs/types";

const TEASER_COUNT = 3;

export function ProverbsTeaser() {
  const t = useT();
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

  if (failed) {
    return <DestinationLink href="/proverbs" titleKey="proverbsTitle" subKey="proverbsSub" />;
  }

  if (!data) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
    );
  }

  const teasers = pickTeasers(data.proverbs, TEASER_COUNT);

  return (
    <Link
      href="/proverbs"
      className="block rounded-lg border border-line bg-elevated px-4 hover:border-accent transition-colors"
    >
      <p className="pt-3 text-sm text-muted">{t("proverbCount", { n: data.proverbs.length })}</p>
      <ul>
        {teasers.map((proverb) => (
          <ProverbRow key={proverb.id ?? proverb.text} proverb={proverb} />
        ))}
      </ul>
    </Link>
  );
}
