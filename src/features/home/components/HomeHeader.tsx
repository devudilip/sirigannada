"use client";

import Link from "next/link";
import { useT } from "@/components/providers/AppProviders";
import { useOfflineReady } from "@/components/shell/useOfflineReady";
import { Wordmark } from "@/components/ui/Wordmark";

/** Mobile-only top row: wordmark on the left, ink square + offline state on the right. */
export function HomeHeader() {
  const t = useT();
  const offlineReady = useOfflineReady();
  return (
    <div className="flex items-center justify-between gap-4 pt-4 md:hidden">
      <Link href="/" aria-label={t("appName")}>
        <Wordmark size={36} showLatin />
      </Link>
      <span className="inline-flex items-center gap-2 text-sm text-ink" aria-live="polite">
        <span aria-hidden="true" className={`block size-2 ${offlineReady ? "bg-ink" : "bg-paper-edge"}`} />
        {offlineReady ? t("navOfflineReady") : t("navOnlineOnly")}
      </span>
    </div>
  );
}
