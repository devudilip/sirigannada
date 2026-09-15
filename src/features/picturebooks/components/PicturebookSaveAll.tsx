"use client";

import { useEffect, useState } from "react";
import { CheckIcon, DownloadIcon } from "@/components/icons";
import { useApp } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/Button";
import { localiseDigits } from "@/features/library/lib/readPercent";
import type { PictureBookMeta } from "@/lib/types";
import { loadPicturebook } from "../lib/manifest";
import { isBookCached, saveBookOffline } from "../lib/offline";
import { saveAll } from "../lib/saveAll";

type Phase = "checking" | "idle" | "saving" | "done";

/**
 * "Save all N for offline": saves every book's data one after another, announcing progress as it
 * goes. Shows the all-saved line instead of the button when every book is already cached.
 */
export function PicturebookSaveAll({ books, onSaved }: { books: readonly PictureBookMeta[]; onSaved: () => void }) {
  const { locale, t } = useApp();
  const [phase, setPhase] = useState<Phase>("checking");
  const [done, setDone] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);
  const total = books.length;

  useEffect(() => {
    let alive = true;
    void Promise.all(books.map((b) => isBookCached(b.slug))).then((flags) => {
      if (alive) setPhase(flags.length > 0 && flags.every(Boolean) ? "done" : "idle");
    });
    return () => {
      alive = false;
    };
  }, [books]);

  const targets = failed.length > 0 ? books.filter((b) => failed.includes(b.slug)) : books;

  const start = async () => {
    setPhase("saving");
    setDone(0);
    const missed = await saveAll(
      targets,
      async (meta) => {
        const book = await loadPicturebook(meta.slug);
        if (!book) return false;
        const ok = await saveBookOffline(book);
        if (ok) onSaved();
        return ok;
      },
      (n) => setDone(n),
    );
    setFailed(missed);
    setPhase(missed.length === 0 ? "done" : "idle");
  };

  if (phase === "checking" || total === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {phase === "done" ? (
        <p className="inline-flex items-center gap-2 text-base text-ink">
          <CheckIcon size={20} />
          {t("picturebooksAllSaved")}
        </p>
      ) : (
        <Button variant="secondary" size="lg" onClick={() => void start()} disabled={phase === "saving"} className="w-full sm:w-auto">
          <DownloadIcon size={20} />
          {t("picturebooksSaveAll", { n: localiseDigits(targets.length, locale) })}
        </Button>
      )}
      <p className="text-sm text-muted min-h-5" aria-live="polite">
        {phase === "saving" ? t("picturebooksSaving", { done: localiseDigits(done, locale), total: localiseDigits(targets.length, locale) }) : ""}
      </p>
    </div>
  );
}
