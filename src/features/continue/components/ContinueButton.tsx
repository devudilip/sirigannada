"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useApp, useT } from "@/components/providers/AppProviders";
import { IconButton } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { DevicesIcon } from "@/components/icons";
import { buildProgress } from "../lib/buildProgress";
import type { ProgressBlob } from "../types";

// Loaded only once the sheet actually opens, so `qrcode-generator` and the handoff UI never
// weigh down the reader/game/collections pages that just mount this trigger button.
const ContinueHandoff = dynamic(() => import("./ContinueHandoff").then((m) => m.ContinueHandoff), { ssr: false });

interface ContinueButtonProps {
  /** Book slugs to scan for the most recent reading position (empty for non-library screens). */
  bookSlugs?: string[];
  /** The open book, when a reader is mounted — carries its exact page. */
  current?: { bookId: string; verseId: number; page?: number };
  /** Icon-only trigger, for toolbars (reader top bar). Default is a labelled button. */
  icon?: boolean;
  className?: string;
}

/** Opt-in "Continue on another device" trigger. Builds the blob only when tapped. */
export function ContinueButton({ bookSlugs = [], current, icon, className }: ContinueButtonProps) {
  const t = useT();
  const { locale } = useApp();
  const [blob, setBlob] = useState<ProgressBlob | null>(null);
  const open = async () => setBlob(await buildProgress(bookSlugs, { current, locale }));

  return (
    <>
      {icon ? (
        <IconButton onClick={() => void open()} aria-label={t("continueTitle")}>
          <DevicesIcon size={22} />
        </IconButton>
      ) : (
        <button
          type="button"
          onClick={() => void open()}
          className={
            className ??
            "inline-flex min-h-11 items-center gap-2 rounded-md border border-line px-3 py-2 text-base text-ink hover:border-accent"
          }
        >
          <DevicesIcon size={18} className="shrink-0 text-secondary" />
          {t("continueButton")}
        </button>
      )}
      <Sheet open={blob !== null} onClose={() => setBlob(null)} title={t("continueTitle")}>
        {blob && <ContinueHandoff blob={blob} />}
      </Sheet>
    </>
  );
}
