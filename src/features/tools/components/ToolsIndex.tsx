"use client";

import Link from "next/link";
import { useT } from "@/components/providers/AppProviders";
import { ArrowRightIcon } from "@/components/icons";
import type { StringKey } from "@/lib/i18n";

interface ToolEntry {
  href: string;
  titleKey: StringKey;
  subKey: StringKey;
}

const TOOLS: ToolEntry[] = [
  { href: "/tools/transliterate", titleKey: "transliterateTitle", subKey: "transliterateSub" },
  { href: "/tools/numbers", titleKey: "numbersTitle", subKey: "numbersSub" },
  { href: "/tools/convert", titleKey: "convertTitle", subKey: "convertSub" },
  { href: "/learn/alphabet", titleKey: "alphabetTitle", subKey: "alphabetSub" },
  { href: "/proverbs", titleKey: "proverbsTitle", subKey: "proverbsSub" },
];

export function ToolsIndex() {
  const t = useT();
  return (
    <ul className="flex flex-col gap-3">
      {TOOLS.map((tool) => (
        <li key={tool.href}>
          <Link
            href={tool.href}
            className="group flex items-center justify-between gap-4 rounded-lg border border-line bg-paper p-4 transition-colors hover:border-accent"
          >
            <span className="flex flex-col gap-1 min-w-0">
              <span className="text-lg font-semibold text-ink">{t(tool.titleKey)}</span>
              <span className="text-sm text-secondary">{t(tool.subKey)}</span>
            </span>
            <ArrowRightIcon size={20} className="shrink-0 text-muted group-hover:text-accent transition-colors" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
