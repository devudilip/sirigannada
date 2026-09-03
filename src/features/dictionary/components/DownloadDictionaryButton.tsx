"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useT } from "@/components/providers/AppProviders";
import type { DictOfflineWarmProgress } from "../types";
import { warmDictionaryCache } from "../lib/warmDictionaryCache";

export function DownloadDictionaryButton() {
  const t = useT();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<DictOfflineWarmProgress | null>(null);
  const [noCache, setNoCache] = useState(false);

  async function onDownload() {
    if (busy) return;
    if (typeof caches === "undefined") {
      setNoCache(true);
      return;
    }
    setNoCache(false);
    setBusy(true);
    setProgress({ done: 0, total: 1, failedUrls: [] });
    try {
      const result = await warmDictionaryCache(setProgress);
      setProgress(result);
    } catch {
      setProgress({ done: 0, total: 1, failedUrls: ["/data/dict/manifest.json"] });
    } finally {
      setBusy(false);
    }
  }

  const finished = progress && !busy && progress.done === progress.total;
  const status = noCache
    ? t("offlineDictUnavailable")
    : busy && progress
      ? t("offlineDictProgress", { n: progress.done, total: progress.total })
      : finished && progress && progress.failedUrls.length === 0
        ? t("offlineDictDone")
        : finished && progress && progress.failedUrls.length > 0
          ? t("offlineDictPartial", { count: progress.failedUrls.length })
          : null;

  return (
    <div className="mb-4">
      <Button variant="secondary" disabled={busy} onClick={() => void onDownload()}>
        {t("offlineDictDownload")}
      </Button>
      {status && (
        <p className="mt-2 text-sm text-secondary" aria-live="polite">
          {status}
        </p>
      )}
    </div>
  );
}
