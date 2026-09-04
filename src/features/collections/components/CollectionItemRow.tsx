"use client";

import { useState } from "react";
import Link from "next/link";
import { useT } from "@/components/providers/AppProviders";
import { TrashIcon } from "@/components/icons";
import { IconButton } from "@/components/ui/Button";
import { entryPermalinkPath } from "@/features/dictionary/lib/permalink";
import { versePermalinkPath } from "@/features/reader/lib/versePermalink";
import { useBooksManifest } from "@/features/library/lib/useBooksManifest";
import { useProverbLookup } from "../lib/useProverbLookup";
import type { CollectionItem } from "../types";

function useItemDisplay(item: CollectionItem): { text: string; href: string; source: string } {
  const books = useBooksManifest();
  const proverbs = useProverbLookup();
  const t = useT();

  if (item.kind === "word") {
    return { text: item.word, href: entryPermalinkPath(item.word), source: t("dictCredit") };
  }
  if (item.kind === "verse") {
    const book = books?.books.find((b) => b.slug === item.bookSlug);
    const label = book ? `${book.title} — ${book.author}` : item.bookSlug;
    return { text: label, href: versePermalinkPath(item.bookSlug, item.blockIndex), source: book?.provenance.source ?? "" };
  }
  const proverb = proverbs?.get(item.proverbId);
  return { text: proverb?.text ?? item.proverbId, href: "/proverbs", source: t("proverbCredit") };
}

export function CollectionItemRow({
  item,
  onRemove,
  onNoteChange,
}: {
  item: CollectionItem;
  onRemove: () => void;
  onNoteChange: (note: string) => void;
}) {
  const t = useT();
  const { text, href, source } = useItemDisplay(item);
  const [editingNote, setEditingNote] = useState(false);
  const [draft, setDraft] = useState(item.note ?? "");

  const kindLabel = item.kind === "word" ? t("collectionKindWord") : item.kind === "verse" ? t("collectionKindVerse") : t("collectionKindProverb");
  const lang = item.kind === "word" || item.kind === "proverb" ? "kn" : undefined;

  return (
    <li className="border-b border-line py-3 last:border-b-0 print:break-inside-avoid">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-accent font-medium">{kindLabel}</p>
          <Link href={href} className="font-serif text-lg text-ink hover:underline break-words" lang={lang}>
            {text}
          </Link>
          {source && <p className="text-xs text-muted mt-0.5">{source}</p>}
        </div>
        <div className="shrink-0 flex items-center gap-1 print:hidden">
          <IconButton aria-label={t("collectionRemoveItem")} onClick={onRemove}>
            <TrashIcon size={18} className="text-muted" />
          </IconButton>
        </div>
      </div>
      {editingNote ? (
        <input
          type="text"
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            setEditingNote(false);
            onNoteChange(draft);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
          placeholder={t("collectionNotePlaceholder")}
          className="mt-2 min-h-9 w-full rounded-md border border-line-strong bg-elevated px-2 text-sm text-ink"
          lang="kn"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditingNote(true)}
          className="mt-2 text-sm text-secondary text-left print:hidden"
        >
          {item.note ? item.note : t("collectionNotePlaceholder")}
        </button>
      )}
      {item.note && <p className="hidden print:block mt-2 text-sm text-secondary">{item.note}</p>}
    </li>
  );
}
