"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckIcon, DownloadIcon, TextSizeIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import { formatBytes } from "@/features/offline/lib/formatSize";
import type { Story } from "@/lib/types";
import { cachedStoryBytes, saveStoryOffline, useStoryCached } from "../lib/offline";

const cell = "flex items-center gap-3 px-4 min-h-14 text-base font-semibold text-ink";

/** Two-cell rule row: read along (left) and the on-device / save-for-offline state (right). */
export function StoryActionsRow({ story }: { story: Story }) {
  const t = useT();
  const [tick, setTick] = useState(0);
  const [saving, setSaving] = useState(false);
  const [bytes, setBytes] = useState(0);
  const cached = useStoryCached(story, tick);
  const hasText = Boolean(story.sentences?.length);

  useEffect(() => {
    if (!cached) return;
    let alive = true;
    void cachedStoryBytes(story).then((b) => {
      if (alive) setBytes(b);
    });
    return () => {
      alive = false;
    };
  }, [cached, story]);

  const save = async () => {
    setSaving(true);
    await saveStoryOffline(story);
    setSaving(false);
    setTick((n) => n + 1);
  };

  return (
    <div className="mt-6 grid grid-cols-2 rounded-lg border border-line bg-elevated overflow-hidden">
      {hasText ? (
        <Link href={`/stories/${story.slug}/read`} className={`${cell} hover:bg-surface active:bg-paper-edge`}>
          <TextSizeIcon size={22} />
          <span>
            <span lang="kn">{t("playerReadAlong")}</span>
            <span className="ml-1.5 text-sm font-normal text-muted" lang="en">
              · {t("playerReadAlong")}
            </span>
          </span>
        </Link>
      ) : (
        <div className={`${cell} text-muted`} aria-disabled="true">
          <TextSizeIcon size={22} />
          <span>
            <span lang="kn">{t("playerReadAlong")}</span>
            <span className="ml-1.5 text-sm font-normal">· {t("playerNoText")}</span>
          </span>
        </div>
      )}
      {cached ? (
        <div className={`${cell} border-l border-line`} role="status">
          <CheckIcon size={22} />
          <span>{t("playerSaved", { size: formatBytes(bytes) })}</span>
        </div>
      ) : (
        <button type="button" onClick={() => void save()} disabled={saving || cached === null} className={`${cell} border-l border-line text-left hover:bg-surface active:bg-paper-edge disabled:opacity-60`}>
          <DownloadIcon size={22} />
          <span>{saving ? t("playerSavingOne") : t("playerSave")}</span>
        </button>
      )}
    </div>
  );
}
