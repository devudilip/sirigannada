"use client";

import { useRef, useState } from "react";
import { useT } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/Button";
import { PlusIcon, DownloadIcon, UploadIcon } from "@/components/icons";
import { useCollections } from "../lib/useCollections";
import { exportCollections, serializeExport, parseExportJson } from "../lib/collections";
import { collectionDisplayName } from "../lib/labels";
import { downloadJson } from "../lib/exportFile";
import { CollectionDetail } from "./CollectionDetail";

export function CollectionsManager() {
  const t = useT();
  const { data, loaded, collections, create, rename, remove, unsave, setNote, importJson } = useCollections();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [importError, setImportError] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const selected = collections.find((c) => c.id === selectedId) ?? null;

  function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    create(name);
    setNewName("");
  }

  function handleExportAll() {
    downloadJson("collections.json", serializeExport(exportCollections(data)));
  }

  async function handleImportFile(file: File) {
    setImportError(false);
    const text = await file.text();
    const parsed = parseExportJson(text);
    if (!parsed) {
      setImportError(true);
      return;
    }
    importJson(parsed);
  }

  if (!loaded) return null;

  return (
    <div className="grid gap-6 md:grid-cols-[260px_1fr]">
      <div className="no-print flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder={t("collectionNamePlaceholder")}
            className="min-h-11 flex-1 rounded-md border border-line-strong bg-elevated px-3 text-base text-ink"
            lang="kn"
          />
          <Button variant="secondary" onClick={handleCreate} aria-label={t("collectionCreate")}>
            <PlusIcon size={18} />
          </Button>
        </div>

        {collections.length === 0 ? (
          <p className="text-sm text-secondary">{t("collectionsEmpty")}</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {collections.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  aria-current={c.id === selectedId ? "true" : undefined}
                  className={`min-h-11 w-full flex items-center justify-between gap-2 rounded-md px-3 text-left text-base ${
                    c.id === selectedId ? "bg-accent-soft text-ink font-medium" : "text-ink hover:bg-paper"
                  }`}
                >
                  <span className="truncate" lang="kn">{collectionDisplayName(c, t)}</span>
                  <span className="text-xs text-muted shrink-0">{c.items.length}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-2 pt-2 border-t border-line">
          <Button variant="secondary" size="sm" onClick={handleExportAll} className="justify-start gap-2">
            <DownloadIcon size={16} /> {t("collectionExportAll")}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => fileInput.current?.click()} className="justify-start gap-2">
            <UploadIcon size={16} /> {t("collectionImport")}
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImportFile(file);
              e.target.value = "";
            }}
          />
          {importError && <p className="text-xs text-accent">{t("collectionImportError")}</p>}
        </div>
      </div>

      <div>
        {selected ? (
          <CollectionDetail
            collection={selected}
            onRemoveItem={(item) => unsave(selected.id, item)}
            onNoteChange={(item, note) => setNote(selected.id, item, note)}
            onDelete={() => {
              remove(selected.id);
              setSelectedId(null);
            }}
            onRename={(name) => rename(selected.id, name)}
            onExport={() => ({ version: 1 as const, exportedAt: Date.now(), collections: [selected] })}
          />
        ) : (
          <p className="no-print text-secondary text-base py-8 text-center">{t("collectionsEmpty")}</p>
        )}
      </div>
    </div>
  );
}
