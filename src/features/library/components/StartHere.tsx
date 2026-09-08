"use client";

import { useT } from "@/components/providers/AppProviders";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { StartHereId, StartHerePath } from "../lib/startHere";

/** Three bordered cells: curated entry points into the shelf. Tapping one narrows the list. */
export function StartHere({
  paths,
  active,
  onSelect,
}: {
  paths: readonly StartHerePath[];
  active: StartHereId | null;
  onSelect: (id: StartHereId) => void;
}) {
  const t = useT();
  if (paths.length === 0) return null;
  return (
    <section>
      <SectionHeading k="libraryStartHere" />
      <div className="grid grid-cols-3 border border-line">
        {paths.map((path, i) => {
          const isActive = path.id === active;
          return (
            <button
              key={path.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(path.id)}
              className={`flex min-h-11 flex-col items-start gap-1 p-3 text-left transition-colors ${
                i < paths.length - 1 ? "border-r border-line" : ""
              } ${isActive ? "bg-elevated" : "hover:bg-elevated"}`}
            >
              <span className="text-base font-semibold leading-snug text-ink">{t(path.titleKey)}</span>
              <span className="text-sm leading-snug text-muted">
                {t(path.subKey)} · {path.books.length}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
