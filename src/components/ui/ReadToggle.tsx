"use client";

import { useT } from "@/components/providers/AppProviders";
import { setRead } from "@/lib/readingStatus";

export function ReadToggle({ id, finished, title }: { id: string; finished: boolean; title: string }) {
  const t = useT();
  return <button type="button" aria-pressed={finished} aria-label={t(finished ? "readingMarkUnreadNamed" : "readingMarkReadNamed", { title })} onClick={() => setRead(id, !finished)} className="min-h-11 w-full rounded-md border border-line px-3 py-2 text-base font-semibold text-accent-strong hover:bg-accent-soft">{t(finished ? "readingMarkUnread" : "readingMarkRead")}</button>;
}
