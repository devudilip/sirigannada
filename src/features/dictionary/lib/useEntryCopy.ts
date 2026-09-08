"use client";

import { useState } from "react";
import { entryPermalinkUrl } from "./permalink";

export type CopiedKind = "citation" | "link" | null;

function pageOrigin(): string {
  return typeof window === "undefined" ? "" : window.location.origin;
}

/** Alar citation line for a headword, ending in its permalink. */
export function citationFor(word: string, origin: string): string {
  return `ವಿ. ಕೃಷ್ಣ, ಅಲರ್ ಕನ್ನಡ-ಇಂಗ್ಲಿಷ್ ನಿಘಂಟು, «${word}». ${entryPermalinkUrl(word, origin)}`;
}

/** Copy-to-clipboard for an entry's citation and permalink, with a short "copied" flag. */
export function useEntryCopy(word: string): { copied: CopiedKind; copyCitation: () => void; copyLink: () => void } {
  const [copied, setCopied] = useState<CopiedKind>(null);

  const copyText = async (text: string, kind: Exclude<CopiedKind, null>) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return {
    copied,
    copyCitation: () => void copyText(citationFor(word, pageOrigin()), "citation"),
    copyLink: () => void copyText(entryPermalinkUrl(word, pageOrigin()), "link"),
  };
}
