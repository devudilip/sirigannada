"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons";
import { IconButton } from "./Button";
import { useT } from "@/components/providers/AppProviders";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const focusableSelector = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function focusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => !element.closest("[hidden], [aria-hidden='true']"),
  );
}

/**
 * Bottom sheet on mobile, centered dialog on md+. Closes on backdrop click and Escape.
 * Uses a single translate transition; respects reduced motion via globals.css.
 */
export function Sheet({ open, onClose, title, children }: SheetProps) {
  const t = useT();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  const [entered, setEntered] = useState(false);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = window.requestAnimationFrame(() => {
      setEntered(true);
      const dialog = dialogRef.current;
      if (!dialog) return;
      const preferred = dialog.querySelector<HTMLElement>("[data-sheet-initial-focus]");
      (preferred ?? focusableElements(dialog)[0] ?? dialog).focus();
    });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = focusableElements(dialog);
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !dialog.contains(active))) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      setEntered(false);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end md:items-center justify-center transition-opacity duration-200 ${
        entered ? "opacity-100" : "opacity-0"
      }`}
    >
      <button
        type="button"
        aria-label={t("close")}
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-ink/40"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={`relative w-full md:max-w-lg max-h-[85dvh] overflow-y-auto bg-elevated rounded-t-lg md:rounded-lg shadow-elevated transition-transform duration-300 ease-out ${
          entered ? "translate-y-0" : "translate-y-8 md:translate-y-4"
        }`}
      >
        <div className="sticky top-0 flex items-center justify-between gap-3 px-4 pt-3 pb-2 bg-elevated">
          <div className="mx-auto md:hidden absolute left-1/2 -translate-x-1/2 top-1.5 h-1 w-10 rounded-full bg-line-strong" />
          {title ? <h2 id={titleId} className="text-lg font-semibold text-ink pt-2 md:pt-0">{title}</h2> : <span />}
          <IconButton onClick={onClose} aria-label={t("close")}>
            <CloseIcon size={20} />
          </IconButton>
        </div>
        <div className="px-4 pb-6 safe-bottom">{children}</div>
      </div>
    </div>
  );
}
