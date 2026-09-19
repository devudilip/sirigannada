"use client";

import { useId, useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import type { StringKey } from "@/lib/i18n";
import type { SearchResult } from "../lib/search";
import { EntryCard } from "./EntryCard";

const REASON_LABEL: Record<SearchResult["match"], StringKey> = {
  exact: "dictMatchExact",
  inflected: "dictMatchInflected",
  prefix: "dictMatchPrefix",
  phonetic: "dictMatchPhonetic",
  english: "dictMatchEnglish",
};

/**
 * One related match: headword left, why-it-matched right, on a 1 px rule. Tapping expands the
 * compact entry in place (aria-expanded / aria-controls) instead of navigating away.
 */
export function RelatedRow({ result }: { result: SearchResult }) {
  const t = useT();
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const { entry, match, suffix } = result;

  return (
    <li className="rule-row">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={t("dictExpandEntry", { word: entry.word })}
        className="flex w-full min-h-14 items-center justify-between gap-3 py-2 text-left hover:bg-elevated active:bg-paper-edge"
      >
        <span className="font-serif text-base text-ink break-words min-w-0" lang="kn">
          {entry.word}
        </span>
        <span className="shrink-0 inline-flex items-center gap-1 text-xs text-muted">
          {t(REASON_LABEL[match])}
          <ChevronDownIcon size={14} className={open ? "rotate-180" : undefined} />
        </span>
      </button>
      <div id={panelId} hidden={!open}>
        {open && <EntryCard entry={entry} match={match} suffix={suffix} compact />}
      </div>
    </li>
  );
}
