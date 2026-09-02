import type { Proverb } from "../types";

export function ProverbRow({ proverb }: { proverb: Proverb }) {
  return (
    <li className="border-b border-line py-3 last:border-b-0">
      <p className="font-serif text-base text-ink leading-kannada" lang="kn">
        {proverb.text}
      </p>
    </li>
  );
}
