"use client";

import { useId, useState, type MouseEvent } from "react";
import { useT } from "@/components/providers/AppProviders";
import { CloseIcon } from "@/components/icons";
import { IconButton } from "@/components/ui/Button";
import { GUNITA_SIGNS, SCHOOL_CONSONANTS, VOWELS, gunitaksharaForm } from "@/lib/kannadaAlphabet";
import type { StringKey } from "@/lib/i18n";
import { KeyboardKey } from "./KeyboardKey";

type KeyboardTab = "vowels" | "consonants" | "signs";

const TABS: readonly { id: KeyboardTab; labelKey: StringKey }[] = [
  { id: "vowels", labelKey: "kbdTabVowels" },
  { id: "consonants", labelKey: "kbdTabConsonants" },
  { id: "signs", labelKey: "kbdTabSigns" },
];

// Signs: the 12 matras, then anusvara, visarga and virama — each shown on ಕ so its shape reads.
const KEYS: Readonly<Record<KeyboardTab, readonly string[]>> = {
  vowels: VOWELS,
  consonants: SCHOOL_CONSONANTS,
  signs: GUNITA_SIGNS.slice(1),
};

interface CompactKannadaKeyboardProps {
  open: boolean;
  onInsert: (text: string) => void;
  onBackspace: () => void;
  onClose: () => void;
}

const keepFocus = (event: MouseEvent) => event.preventDefault();

/**
 * Short on-screen Kannada keyboard pinned to the bottom of the viewport (above the phone tab bar,
 * at most 45% of the screen): one group of keys at a time behind ಸ್ವರ / ವ್ಯಂಜನ / ಚಿಹ್ನೆ switches,
 * with ⌫ and close always in reach. Keys keep focus on the input so its cursor survives.
 * The page should leave room underneath (a spacer) while it is open.
 */
export function CompactKannadaKeyboard({ open, onInsert, onBackspace, onClose }: CompactKannadaKeyboardProps) {
  const t = useT();
  const [tab, setTab] = useState<KeyboardTab>("consonants");
  const panelId = useId();
  if (!open) return null;

  return (
    <div
      role="group"
      aria-label={t("kbdTitle")}
      className="fixed inset-x-0 above-nav z-40 flex max-h-[45dvh] flex-col border-t-2 border-line-strong bg-surface md:bottom-0 md:safe-bottom"
    >
      <div className="mx-auto flex w-full max-w-2xl items-center gap-1 px-2 pt-2">
        <div className="flex flex-1 gap-1">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={tab === item.id}
              aria-controls={panelId}
              onMouseDown={keepFocus}
              onClick={() => setTab(item.id)}
              className={`min-h-11 rounded-sm px-3 text-base font-semibold transition-colors duration-150 ${
                tab === item.id ? "bg-ink text-surface" : "bg-elevated text-ink hover:bg-paper-edge"
              }`}
            >
              {t(item.labelKey)}
            </button>
          ))}
        </div>
        <button
          type="button"
          onMouseDown={keepFocus}
          onClick={onBackspace}
          aria-label={t("kbdBackspace")}
          className="flex h-11 min-w-13 items-center justify-center rounded-sm border border-line-strong bg-elevated text-lg text-ink hover:bg-paper-edge active:bg-paper-edge"
        >
          ⌫
        </button>
        <IconButton onMouseDown={keepFocus} onClick={onClose} aria-label={t("kbdCloseKeyboard")}>
          <CloseIcon size={20} />
        </IconButton>
      </div>
      <div
        id={panelId}
        className="mx-auto grid w-full max-w-2xl grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-1 overflow-y-auto overscroll-contain px-2 pb-2 pt-2"
      >
        {KEYS[tab].map((letter) => {
          const glyph = tab === "signs" ? gunitaksharaForm("ಕ", letter) : letter;
          return (
            <KeyboardKey
              key={letter}
              glyph={glyph}
              insert={letter}
              ariaLabel={t("kbdInsertLetter", { letter: glyph })}
              onPress={onInsert}
              outlined={tab === "signs"}
            />
          );
        })}
      </div>
    </div>
  );
}
