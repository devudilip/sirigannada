import { hasKannada, normalise, phoneticKey } from "../../src/lib/kannada";
import type { DictEntry } from "../../src/lib/types";
import type { AlarEntry } from "./alar";
import { mapPos } from "./pos";
import { isTruncatedHeadword } from "./truncated";

/**
 * One raw Alar record → one DictEntry, or undefined when the record is unusable.
 * Optional fields are only set when the source has them, so the shards stay small.
 */
export function toDictEntry(raw: AlarEntry): DictEntry | undefined {
  const word = normalise(raw.entry);
  // One source record has the headword "1" (a typo); require real Kannada text.
  if (word === "" || !hasKannada(word)) return undefined;
  const defs = (raw.defs ?? [])
    .map((d) => ({ text: (d.entry ?? "").trim(), pos: mapPos(d.type) }))
    .filter((d) => d.text !== "");
  if (defs.length === 0) return undefined;

  const entry: DictEntry = { id: raw.id, word, key: phoneticKey(word), defs };
  if (raw.phone) entry.phone = raw.phone.trim();
  const origin = raw.origin?.trim();
  if (origin) entry.origin = origin;
  if (isTruncatedHeadword(word, entry.phone)) entry.truncated = true;
  return entry;
}
