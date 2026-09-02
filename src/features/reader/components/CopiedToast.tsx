"use client";

import { useT } from "@/components/providers/AppProviders";

/** Brief confirmation that a verse permalink is on the clipboard. */
export function CopiedToast({ visible }: { visible: boolean }) {
  const t = useT();
  return (
    <div
      role="status"
      aria-live="polite"
      className={`absolute inset-x-0 bottom-20 flex justify-center pointer-events-none transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="rounded-full px-4 py-2 font-sans text-sm bg-elevated text-ink shadow-elevated">
        {visible ? t("verseLinkCopied") : ""}
      </span>
    </div>
  );
}
