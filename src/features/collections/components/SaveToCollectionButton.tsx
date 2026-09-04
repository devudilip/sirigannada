"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { Button, IconButton } from "@/components/ui/Button";
import { StarIcon, PlusIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import type { CollectionItemInput } from "../types";
import { useCollections } from "../lib/useCollections";
import { collectionDisplayName } from "../lib/labels";

/**
 * Small "save this to a collection" affordance. Shows filled when the item is saved
 * anywhere, and opens a sheet to add/remove it across collections or start a new one.
 */
export function SaveToCollectionButton({ item }: { item: CollectionItemInput }) {
  const t = useT();
  const { collections, isSaved, collectionsContaining, save, unsave, saveToNewCollection } = useCollections();
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const saved = isSaved(item);
  const memberIds = new Set(collectionsContaining(item));

  function toggleIn(collectionId: string) {
    if (memberIds.has(collectionId)) unsave(collectionId, item);
    else save(collectionId, item);
  }

  function addNewAndSave() {
    const name = newName.trim();
    if (!name) return;
    saveToNewCollection(name, item);
    setNewName("");
  }

  return (
    <>
      <IconButton
        aria-label={saved ? t("savedToCollection") : t("saveToCollection")}
        aria-pressed={saved}
        onClick={() => setOpen(true)}
      >
        <StarIcon size={20} filled={saved} className={saved ? "text-accent" : "text-muted"} />
      </IconButton>
      <Sheet open={open} onClose={() => setOpen(false)} title={t("saveToCollectionSheetTitle")}>
        <div className="flex flex-col gap-2">
          {collections.length === 0 && <p className="text-sm text-secondary py-2">{t("collectionsEmpty")}</p>}
          {collections.map((c) => {
            const checked = memberIds.has(c.id);
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={checked}
                onClick={() => toggleIn(c.id)}
                className={`min-h-11 flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-left text-base ${
                  checked ? "border-accent bg-accent-soft text-ink" : "border-line text-ink hover:bg-paper"
                }`}
              >
                <span className="truncate">{collectionDisplayName(c, t)}</span>
                {checked && <StarIcon size={18} filled className="text-accent shrink-0" />}
              </button>
            );
          })}
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t("collectionNamePlaceholder")}
              className="min-h-11 flex-1 rounded-md border border-line-strong bg-elevated px-3 text-base text-ink"
              lang="kn"
            />
            <Button variant="secondary" size="md" onClick={addNewAndSave} aria-label={t("saveToNewCollection")}>
              <PlusIcon size={18} />
            </Button>
          </div>
        </div>
      </Sheet>
    </>
  );
}
