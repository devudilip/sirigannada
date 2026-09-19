"use client";

import { useState } from "react";
import type { DictEntry, PartOfSpeech } from "@/lib/types";
import { CheckIcon, LinkIcon, ShareIcon, StarIcon, VolumeIcon } from "@/components/icons";
import { IconButton } from "@/components/ui/Button";
import { useT } from "@/components/providers/AppProviders";
import type { StringKey } from "@/lib/i18n";
import { useSpeakKannada } from "@/lib/SpeakContext";
import { ShareCardSheet } from "@/features/share/components/ShareCardSheet";
import { CANONICAL_ORIGIN } from "@/features/reader/lib/versePermalink";
import { entryPermalinkUrl } from "../lib/permalink";
import type { SearchResult } from "../lib/search";
import { useEntryCopy } from "../lib/useEntryCopy";
import { EntryMeta } from "./EntryMeta";

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

const citeClass = "inline-flex items-center min-h-11 px-2 -mr-2 text-sm font-semibold text-accent-strong hover:underline";

export function EntryCard({
  entry,
  match,
  suffix,
  compact = false,
  compactActions = false,
  favourited = false,
  onToggleFavourite,
}: {
  entry: DictEntry;
  match?: SearchResult["match"];
  /** Stripped inflection suffix (ಮನೆಯಲ್ಲಿ → ಯಲ್ಲಿ); shown as "ಮನೆ + ಯಲ್ಲಿ" on an inflected match. */
  suffix?: string;
  compact?: boolean;
  /** Show a reduced action row (copy link/citation, no speak/favourite) even in compact mode — used by the reader's context lens. */
  compactActions?: boolean;
  favourited?: boolean;
  onToggleFavourite?: () => void;
}) {
  const t = useT();
  const speak = useSpeakKannada();
  const [shareOpen, setShareOpen] = useState(false);
  const { copied, copyCitation, copyLink } = useEntryCopy(entry.word);

  const groups = groupByPos(entry);
  const singlePos = groups.length === 1 ? groups[0]?.[0] : undefined;
  const cite = (
    <button type="button" onClick={copyCitation} aria-label={t("copyCitation")} className={citeClass}>
      {copied === "citation" ? t("copied") : t("dictCite")}
    </button>
  );
  const linkButton = (
    <IconButton aria-label={copied === "link" ? t("copied") : t("copyLink")} onClick={copyLink}>
      {copied === "link" ? <CheckIcon size={20} /> : <LinkIcon size={20} />}
    </IconButton>
  );

  return (
    <article className={compact ? "pb-3" : "bg-elevated p-4"}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3
            className={`font-serif font-bold text-ink leading-tight break-words ${compact ? "text-xl" : "text-3xl"}`}
            lang="kn"
          >
            {entry.word}
          </h3>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5 text-sm text-muted">
            <EntryMeta entry={entry} compact inline />
            {singlePos && t(POS_LABEL[singlePos]) && <span>· {t(POS_LABEL[singlePos])}</span>}
          </p>
        </div>
        {!compact && (
          <div className="shrink-0 flex items-center -mr-2 -mt-1">
            {speak && (
              <IconButton aria-label={t("speakWord", { word: entry.word })} onClick={() => speak(entry.word)}>
                <VolumeIcon size={20} />
              </IconButton>
            )}
            {onToggleFavourite && (
              <IconButton
                aria-label={favourited ? t("unstarWord") : t("starWord")}
                aria-pressed={favourited}
                onClick={onToggleFavourite}
              >
                <StarIcon size={20} filled={favourited} className={favourited ? "text-accent" : undefined} />
              </IconButton>
            )}
            {linkButton}
          </div>
        )}
      </div>

      {match === "inflected" && (
        <p className="mt-3 inline-flex items-center bg-accent-soft text-accent-text text-xs font-semibold px-2 py-1">
          {t("dictMatchInflected")}
          <span className="ml-1 font-serif font-normal text-sm" lang="kn">
            · {entry.word}
            {suffix ? ` + ${suffix}` : ""}
          </span>
        </p>
      )}

      <div className="mt-3 flex flex-col gap-3">
        {groups.map(([pos, texts]) => (
          <div key={pos}>
            {!singlePos && t(POS_LABEL[pos]) && <p className="kicker text-accent-strong mb-1">{t(POS_LABEL[pos])}</p>}
            <ol className="flex flex-col gap-1 list-decimal pl-5 marker:text-muted">
              {(compact ? texts.slice(0, 3) : texts).map((text, i) => (
                <li key={i} className="text-base text-ink leading-[1.55]" lang="en">
                  {text}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      {(!compact || compactActions) && (
        <div className={`rule-row mt-4 flex items-center justify-between gap-3 ${compact ? "pt-1" : "pt-2"}`}>
          <p className="text-xs text-muted" lang="en">
            {t("dictSourceLine")}
          </p>
          <div className="flex items-center gap-1">
            {compact && linkButton}
            {!compact && (
              <IconButton aria-label={t("shareCardAction")} onClick={() => setShareOpen(true)}>
                <ShareIcon size={20} />
              </IconButton>
            )}
            {cite}
          </div>
        </div>
      )}

      <ShareCardSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        input={
          shareOpen
            ? {
                kind: "word",
                main: entry.word,
                support: entry.defs.slice(0, 6).map((d) => d.text).join(" · "),
                url: entryPermalinkUrl(entry.word, CANONICAL_ORIGIN),
                source: "Alar · V. Krishna",
                size: "portrait",
              }
            : null
        }
      />
    </article>
  );
}
