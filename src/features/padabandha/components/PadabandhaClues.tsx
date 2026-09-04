import { CheckIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import type { Locale } from "@/lib/types";
import type { EntryGuesses, NumberedEntry, PadabandhaDirection } from "../types";
import { localized } from "../types";
import { isEntrySolved } from "../lib/puzzle";

export function PadabandhaClues({
  entries,
  guesses,
  locale,
  selectedId,
  onSelect,
}: {
  entries: readonly NumberedEntry[];
  guesses: EntryGuesses;
  locale: Locale;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const t = useT();
  const groups: readonly { direction: PadabandhaDirection; title: string }[] = [
    { direction: "across", title: t("padabandhaAcross") },
    { direction: "down", title: t("padabandhaDown") },
  ];
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {groups.map((group) => (
        <section key={group.direction}>
          <h2 className="mb-2 text-lg font-semibold text-ink">{group.title}</h2>
          <ol className="flex flex-col gap-2">
            {entries.filter((entry) => entry.direction === group.direction).map((entry) => {
              const solved = isEntrySolved(guesses, entry);
              return (
                <li key={entry.id}>
                  <button
                    type="button"
                    aria-pressed={selectedId === entry.id}
                    onClick={() => onSelect(entry.id)}
                    className={`flex min-h-11 w-full items-start gap-2 rounded-md border p-3 text-left transition-colors ${
                      selectedId === entry.id ? "border-accent bg-accent-soft" : "border-line bg-elevated hover:border-line-strong"
                    }`}
                  >
                    <span className="font-semibold text-ink">{entry.number}.</span>
                    <span className="flex-1">
                      <span lang={locale} className="block text-base text-ink">{localized(entry.clue, locale)}</span>
                      <span className="block text-base text-secondary">{t("padabandhaAksharaCount", { count: entry.aksharas.length })}</span>
                    </span>
                    {solved && <CheckIcon size={18} className="mt-1 shrink-0 text-accent" />}
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
