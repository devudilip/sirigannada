"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { shareOrigin, versePermalinkUrl } from "./versePermalink";

const CONFIRM_MS = 1800;

/** Copies `/library/<slug>#b<index>` to the clipboard and flashes a confirmation. */
export function useVerseLink(slug: string) {
  const [copiedBlock, setCopiedBlock] = useState<number | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  const copyBlockLink = useCallback(
    async (block: number) => {
      const url = versePermalinkUrl(slug, block, shareOrigin(window.location.origin));
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        return; /* clipboard unavailable or denied */
      }
      setCopiedBlock(block);
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopiedBlock(null), CONFIRM_MS);
    },
    [slug]
  );

  return { copiedBlock, copyBlockLink };
}
