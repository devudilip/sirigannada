import { SaveToCollectionButton } from "@/features/collections/components/SaveToCollectionButton";
import type { Proverb } from "../types";

export function ProverbRow({ proverb }: { proverb: Proverb }) {
  return (
    <li className="border-b border-line py-3 last:border-b-0 flex items-start justify-between gap-2">
      <p className="font-serif text-base text-ink leading-kannada" lang="kn">
        {proverb.text}
      </p>
      {proverb.id && (
        <div className="shrink-0">
          <SaveToCollectionButton item={{ kind: "proverb", proverbId: proverb.id }} />
        </div>
      )}
    </li>
  );
}
