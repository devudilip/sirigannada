"use client";

import { useState } from "react";
import type { DictEntry, PartOfSpeech } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { CheckIcon, CopyIcon, LinkIcon, ShareIcon, StarIcon, VolumeIcon } from "@/components/icons";
import { IconButton } from "@/components/ui/Button";
import { useT } from "@/components/providers/AppProviders";
import type { StringKey } from "@/lib/i18n";
import { useSpeakKannada } from "@/lib/SpeakContext";
import { ShareCardSheet } from "@/features/share/components/ShareCardSheet";
import { CANONICAL_ORIGIN } from "@/features/reader/lib/versePermalink";
import { entryPermalinkUrl } from "../lib/permalink";
import type { SearchResult } from "../lib/search";
import { EntryMeta } from "./EntryMeta";

const MATCH_LABEL: Record<SearchResult["match"], StringKey> = {
  exact: "dictMatchExact",
  inflected: "dictMatchInflected",
  prefix: "dictMatchPrefix",
  phonetic: "dictMatchPhonetic",
  english: "dictMatchEnglish",
};

const POS_LABEL: Record<PartOfSpeech, StringKey> = {
  noun: "posNoun", verb: "posVerb", adjective: "posAdjective", adverb: "posAdverb", pronoun: "posPronoun",
  conjunction: "posConjunction", interjection: "posInterjection", preposition: "posPreposition", prefix: "posPrefix",
  suffix: "posSuffix", other: "posOther",
};

function groupByPos(entry: DictEntry): Array<[PartOfSpeech, string[]]> {
  const groups = new Map<PartOfSpeech, string[]>();
  for (const d of entry.defs) groups.set(d.pos, [...(groups.get(d.pos) ?? []), d.text]);
  return [...groups.entries()];
}

function pageOrigin(): string {
  return typeof window === "undefined" ? "" : window.location.origin;
}

export function EntryCard({
  entry,
  match,
  compact = false,
  compactActions = false,
  favourited = false,
  onToggleFavourite,
}: {
  entry: DictEntry;
  match?: SearchResult["match"];
  compact?: boolean;
  /** Show a reduced action row (copy link/citation, no speak/favourite) even in compact mode — used by the reader's context lens. */
  compactActions?: boolean;
  favourited?: boolean;
  onToggleFavourite?: () => void;
}) {
  const t = useT();
  const speak = useSpeakKannada();
  const [copied, setCopied] = useState<"citation" | "link" | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const copyText = async (text: string, kind: "citation" | "link") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const copyCitation = () => {
    const url = entryPermalinkUrl(entry.word, pageOrigin());
    copyText(`ವಿ. ಕೃಷ್ಣ, ಅಲರ್ ಕನ್ನಡ-ಇಂಗ್ಲಿಷ್ ನಿಘಂಟು, «${entry.word}». ${url}`, "citation");
  };

  const copyLink = () => {
    copyText(entryPermalinkUrl(entry.word, pageOrigin()), "link");
  };

  const matchLabel = match ? t(MATCH_LABEL[match]) : null;

  return (
    <Card className={compact ? "p-4" : "p-5"}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-serif font-bold text-ink text-2xl leading-tight break-words" lang="kn">
            {entry.word}
          </h3>
          {matchLabel && <p className="mt-1 text-xs font-medium text-accent">{matchLabel}</p>}
          <EntryMeta entry={entry} compact={compact} />
        </div>
        {(!compact || compactActions) && (
          <div className="shrink-0 flex items-center">
            {!compact && speak && (
              <IconButton aria-label={t("speakWord", { word: entry.word })} onClick={() => speak(entry.word)}>
                <VolumeIcon size={20} className="text-muted" />
              </IconButton>
            )}
            {!compact && onToggleFavourite && (
              <IconButton
                aria-label={favourited ? t("unstarWord") : t("starWord")}
                aria-pressed={favourited}
                onClick={onToggleFavourite}
              >
                <StarIcon size={20} filled={favourited} className={favourited ? "text-accent" : "text-muted"} />
              </IconButton>
            )}
            <IconButton aria-label={copied === "link" ? t("copied") : t("copyLink")} onClick={copyLink}>
              {copied === "link" ? <CheckIcon size={20} /> : <LinkIcon size={20} className="text-muted" />}
            </IconButton>
            {!compact && (
              <IconButton aria-label={t("shareCardAction")} onClick={() => setShareOpen(true)}>
                <ShareIcon size={20} className="text-muted" />
              </IconButton>
            )}
            <button
              type="button"
              onClick={copyCitation}
              aria-label={t("copyCitation")}
              className="inline-flex items-center gap-1.5 h-11 px-2.5 rounded-md text-xs font-medium text-secondary hover:text-ink hover:bg-paper"
            >
              {copied === "citation" ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
              <span className="hidden sm:inline">{copied === "citation" ? t("copied") : t("copyCitation")}</span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {groupByPos(entry).map(([pos, texts]) => (
          <div key={pos}>
            {t(POS_LABEL[pos]) && <p className="text-xs font-medium text-accent mb-1">{t(POS_LABEL[pos])}</p>}
            <ol className="flex flex-col gap-1 list-decimal pl-5 marker:text-muted">
              {(compact ? texts.slice(0, 3) : texts).map((text, i) => (
                <li key={i} className="text-base text-ink leading-relaxed" lang="en">
                  {text}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <ShareCardSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        input={
          shareOpen
            ? {
                kind: "word",
                main: entry.word,
                support: entry.defs[0]?.text,
                url: entryPermalinkUrl(entry.word, CANONICAL_ORIGIN),
                source: "Alar · V. Krishna",
                size: "portrait",
              }
            : null
        }
      />
    </Card>
  );
}
