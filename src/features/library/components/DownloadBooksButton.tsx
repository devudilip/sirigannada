"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useT } from "@/components/providers/AppProviders";
import { useBooksManifest } from "../lib/useBooksManifest";
import { slugFromBookUrl, warmBookCache } from "../lib/warmBookCache";
import type { OfflineWarmProgress } from "../types";

export function DownloadBooksButton() {
  const t = useT();
  const manifest = useBooksManifest();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<OfflineWarmProgress | null>(null);
  const [noCache, setNoCache] = useState(false);

  if (!manifest || manifest.books.length === 0) return null;

  const books = manifest.books;
  const titlesBySlug = new Map(books.map((b) => [b.slug, b.title]));
  const failedNames = (progress?.failedUrls ?? [])
    .map((url) => {
      const slug = slugFromBookUrl(url);
      return slug ? (titlesBySlug.get(slug) ?? slug) : url;
    })
    .join(", ");

  async function onDownload() {
    if (busy) return;
    if (typeof caches === "undefined") {
      setNoCache(true);
      return;
    }
    setNoCache(false);
    setBusy(true);
    setProgress({ done: 0, total: books.length + 1, failedUrls: [] });
    try {
      const result = await warmBookCache(
        books.map((b) => b.slug),
        setProgress,
      );
      setProgress(result);
    } catch {
      setProgress({
        done: 0,
        total: books.length + 1,
        failedUrls: books.map((b) => `/data/books/${b.slug}.json`),
      });
    } finally {
      setBusy(false);
    }
  }

  const finished = progress && !busy && progress.done === progress.total;
  const status = noCache
    ? t("offlineBooksUnavailable")
    : busy && progress
      ? t("offlineBooksProgress", { n: progress.done, total: progress.total })
      : finished && progress && progress.failedUrls.length === 0
        ? t("offlineBooksDone")
        : finished && progress && progress.failedUrls.length > 0
          ? t("offlineBooksPartial", { count: progress.failedUrls.length, names: failedNames })
          : null;

  return (
    <div className="mb-6">
      <Button variant="secondary" disabled={busy} onClick={() => void onDownload()}>
        {t("offlineBooksDownload")}
      </Button>
      {status && (
        <p className="mt-2 text-sm text-secondary" aria-live="polite">
          {status}
        </p>
      )}
    </div>
  );
}
