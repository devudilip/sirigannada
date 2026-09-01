"use client";

import { useEffect, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons";
import { IconButton } from "./Button";
import { useT } from "@/components/providers/AppProviders";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

/**
 * Bottom sheet on mobile, centered dialog on md+. Closes on backdrop click and Escape.
 * Uses a single translate transition; respects reduced motion via globals.css.
 */
export function Sheet({ open, onClose, title, children }: SheetProps) {
  const t = useT();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 flex items-end md:items-center justify-center transition-opacity duration-200 ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <button type="button" aria-label={t("close")} onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative w-full md:max-w-lg max-h-[85dvh] overflow-y-auto bg-elevated rounded-t-lg md:rounded-lg shadow-elevated transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-8 md:translate-y-4"
        }`}
      >
        <div className="sticky top-0 flex items-center justify-between gap-3 px-4 pt-3 pb-2 bg-elevated">
          <div className="mx-auto md:hidden absolute left-1/2 -translate-x-1/2 top-1.5 h-1 w-10 rounded-full bg-line-strong" />
          {title ? <h2 className="text-lg font-semibold text-ink pt-2 md:pt-0">{title}</h2> : <span />}
          <IconButton onClick={onClose} aria-label={t("close")}>
            <CloseIcon size={20} />
          </IconButton>
        </div>
        <div className="px-4 pb-6 safe-bottom">{children}</div>
      </div>
    </div>
  );
}
