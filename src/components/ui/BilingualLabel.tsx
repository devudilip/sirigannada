import { strings, type StringKey } from "@/lib/i18n";

/**
 * "ಕನ್ನಡ · English" inline label for controls that always show both languages (brand rule:
 * Kannada leads, English follows after a middle dot). Uses the raw string table so the
 * rendering is the same in either UI locale.
 */
export function BilingualLabel({ k, englishClassName = "" }: { k: StringKey; englishClassName?: string }) {
  const entry = strings[k];
  return (
    <>
      <span lang="kn">{entry.kn}</span>
      <span lang="en" className={englishClassName}>
        {" · "}
        {entry.en}
      </span>
    </>
  );
}
