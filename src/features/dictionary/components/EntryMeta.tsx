"use client";

import type { DictEntry } from "@/lib/types";
import { phoneDiffersFromIso, toIso15919 } from "@/lib/iso15919";
import { hasKannada } from "@/lib/kannada";
import { useT } from "@/components/providers/AppProviders";
import type { StringKey } from "@/lib/i18n";

interface MetaRow {
  key: StringKey;
  value: string;
  /** Transliterations are Latin and set in italics; an origin may be Kannada. */
  latin: boolean;
}

function metaRows(entry: DictEntry): MetaRow[] {
  const iso = toIso15919(entry.word);
  const phone = entry.phone ?? "";
  const rows: MetaRow[] = [];
  if (iso !== "" && iso !== entry.word) rows.push({ key: "translitIso", value: iso, latin: true });
  if (phoneDiffersFromIso(phone, iso)) rows.push({ key: "alarPhone", value: phone, latin: true });
  if (entry.origin) rows.push({ key: "wordOrigin", value: entry.origin, latin: false });
  return rows;
}

function valueClass(latin: boolean): string {
  return latin ? "text-sm text-secondary font-sans italic" : "text-sm text-secondary font-sans";
}

function valueLang(row: MetaRow): "en" | "kn" {
  return row.latin || !hasKannada(row.value) ? "en" : "kn";
}

/**
 * The Latin transliteration (ISO 15919, computed from the headword), Alar's own phone
 * when it says something different, and the loanword origin when the source has one.
 */
export function EntryMeta({ entry, compact = false }: { entry: DictEntry; compact?: boolean }) {
  const t = useT();
  const rows = metaRows(entry);
  if (rows.length === 0) return null;

  if (compact) {
    return (
      <p className="mt-0.5 flex flex-wrap items-baseline gap-x-1.5 text-sm text-muted">
        {rows.map((row, i) => (
          <span key={row.key} className={valueClass(row.latin)} lang={valueLang(row)} title={t(row.key)}>
            {i > 0 && <span className="text-muted not-italic">· </span>}
            {row.value}
          </span>
        ))}
      </p>
    );
  }

  return (
    <dl className="mt-1 flex flex-col gap-0.5">
      {rows.map((row) => (
        <div key={row.key} className="flex flex-wrap items-baseline gap-x-2">
          <dt className="text-xs font-medium text-muted">{t(row.key)}</dt>
          <dd className={valueClass(row.latin)} lang={valueLang(row)}>
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
