"use client";

import { useState } from "react";
import type { DictEntry, PartOfSpeech } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { CheckIcon, CopyIcon, StarIcon } from "@/components/icons";
import { IconButton } from "@/components/ui/Button";
import { useT } from "@/components/providers/AppProviders";

const POS_LABEL: Record<PartOfSpeech, string> = {
  noun: "ನಾಮಪದ", verb: "ಕ್ರಿಯಾಪದ", adjective: "ಗುಣವಾಚಕ", adverb: "ಕ್ರಿಯಾವಿಶೇಷಣ", pronoun: "ಸರ್ವನಾಮ",
  conjunction: "ಸಂಯೋಜಕ", interjection: "ಭಾವಸೂಚಕ", preposition: "ಉಪಸರ್ಗ", prefix: "ಪೂರ್ವಪ್ರತ್ಯಯ",
  suffix: "ಪ್ರತ್ಯಯ", other: "",
};

function groupByPos(entry: DictEntry): Array<[PartOfSpeech, string[]]> {
  const groups = new Map<PartOfSpeech, string[]>();
  for (const d of entry.defs) groups.set(d.pos, [...(groups.get(d.pos) ?? []), d.text]);
  return [...groups.entries()];
}

export function EntryCard({
  entry,
  compact = false,
  favourited = false,
  onToggleFavourite,
}: {
  entry: DictEntry;
  compact?: boolean;
  favourited?: boolean;
  onToggleFavourite?: () => void;
}) {
  const t = useT();
  const [copied, setCopied] = useState(false);

  const copyCitation = async () => {
    const url = `https://sirigannada.in/dictionary?q=${encodeURIComponent(entry.word)}`;
    const text = `ವಿ. ಕೃಷ್ಣ, ಅಲರ್ ಕನ್ನಡ-ಇಂಗ್ಲಿಷ್ ನಿಘಂಟು, «${entry.word}». ${url}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <Card className={compact ? "p-4" : "p-5"}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-serif font-bold text-ink text-2xl leading-tight break-words" lang="kn">
            {entry.word}
          </h3>
          {entry.phone && <p className="mt-0.5 text-sm text-muted font-sans italic">{entry.phone}</p>}
        </div>
        {!compact && (
          <div className="shrink-0 flex items-center">
            {onToggleFavourite && (
              <IconButton
                aria-label={favourited ? t("unstarWord") : t("starWord")}
                aria-pressed={favourited}
                onClick={onToggleFavourite}
              >
                <StarIcon size={20} filled={favourited} className={favourited ? "text-accent" : "text-muted"} />
              </IconButton>
            )}
            <button
              type="button"
              onClick={copyCitation}
              aria-label={t("copyCitation")}
              className="inline-flex items-center gap-1.5 h-11 px-2.5 rounded-md text-xs font-medium text-secondary hover:text-ink hover:bg-paper"
            >
              {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
              <span className="hidden sm:inline">{copied ? t("copied") : t("copyCitation")}</span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {groupByPos(entry).map(([pos, texts]) => (
          <div key={pos}>
            {POS_LABEL[pos] && <p className="text-xs font-medium text-accent mb-1">{POS_LABEL[pos]}</p>}
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
    </Card>
  );
}
