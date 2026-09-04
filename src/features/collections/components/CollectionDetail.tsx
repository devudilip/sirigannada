"use client";

import { useRef, useState } from "react";
import { useT } from "@/components/providers/AppProviders";
import { Button, IconButton } from "@/components/ui/Button";
import { DownloadIcon, PencilIcon, PrinterIcon, TrashIcon } from "@/components/icons";
import { serializeExport } from "../lib/collections";
import { collectionDisplayName } from "../lib/labels";
import { downloadJson } from "../lib/exportFile";
import { FAVOURITES_COLLECTION_ID, type Collection, type CollectionItemInput } from "../types";
import { CollectionItemRow } from "./CollectionItemRow";

export function CollectionDetail({
  collection,
  onRemoveItem,
  onNoteChange,
  onDelete,
  onRename,
  onExport,
}: {
  collection: Collection;
  onRemoveItem: (item: CollectionItemInput) => void;
  onNoteChange: (item: CollectionItemInput, note: string) => void;
  onDelete: () => void;
  onRename: (name: string) => void;
  onExport: () => { version: 1; exportedAt: number; collections: Collection[] };
}) {
  const t = useT();
  const printRef = useRef<HTMLDivElement>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(collection.name);

  function handleExport() {
    const json = serializeExport(onExport());
    downloadJson(`${collection.name.replace(/[^a-zA-Z0-9-]+/g, "_") || "collection"}.json`, json);
  }

  function handlePrint() {
    window.print();
  }

  const name = collectionDisplayName(collection, t);
  const canRename = collection.id !== FAVOURITES_COLLECTION_ID;

  return (
    <div ref={printRef} className="print-collection">
      <div className="flex items-start justify-between gap-3 print:hidden">
        <div className="min-w-0">
          {editingName ? (
            <input
              type="text"
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={() => {
                setEditingName(false);
                if (nameDraft.trim()) onRename(nameDraft);
              }}
              onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
              className="min-h-9 rounded-md border border-line-strong bg-elevated px-2 text-xl font-semibold text-ink"
              lang="kn"
            />
          ) : (
            <button
              type="button"
              disabled={!canRename}
              onClick={() => canRename && setEditingName(true)}
              className="flex items-center gap-1.5 text-xl font-semibold text-ink disabled:cursor-default"
              aria-label={canRename ? t("collectionRename") : undefined}
            >
              <span lang="kn">{name}</span>
              {canRename && <PencilIcon size={14} className="text-muted" />}
            </button>
          )}
          <p className="text-sm text-muted">{t("collectionItemCount", { count: collection.items.length })}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <IconButton aria-label={t("collectionExportOne")} onClick={handleExport}>
            <DownloadIcon size={18} className="text-muted" />
          </IconButton>
          <IconButton aria-label={t("collectionPrint")} onClick={handlePrint}>
            <PrinterIcon size={18} className="text-muted" />
          </IconButton>
          <IconButton aria-label={t("collectionDelete")} onClick={() => setConfirmDelete(true)}>
            <TrashIcon size={18} className="text-muted" />
          </IconButton>
        </div>
      </div>

      <h1 className="hidden print:block text-2xl font-semibold mb-4" lang="kn">{name}</h1>

      {confirmDelete && (
        <div className="mt-3 rounded-md border border-line bg-paper p-3 print:hidden">
          <p className="text-sm text-ink">{t("collectionDeleteConfirm", { name })}</p>
          <div className="mt-2 flex gap-2">
            <Button variant="primary" size="sm" onClick={onDelete}>{t("collectionDelete")}</Button>
            <Button variant="secondary" size="sm" onClick={() => setConfirmDelete(false)}>{t("close")}</Button>
          </div>
        </div>
      )}

      {collection.items.length === 0 ? (
        <p className="text-secondary text-base py-6 text-center print:hidden">{t("collectionEmptyItems")}</p>
      ) : (
        <ul className="mt-3 rounded-lg border border-line bg-elevated px-4 print:border-0 print:px-0">
          {collection.items.map((item) => (
            <CollectionItemRow
              key={`${item.kind}:${item.kind === "word" ? item.word : item.kind === "verse" ? `${item.bookSlug}:${item.blockIndex}` : item.proverbId}`}
              item={item}
              onRemove={() => onRemoveItem(item)}
              onNoteChange={(note) => onNoteChange(item, note)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
