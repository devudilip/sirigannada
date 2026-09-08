"use client";

import { useEffect, useState } from "react";
import { useT } from "@/components/providers/AppProviders";
import { CloseIcon } from "@/components/icons";
import { IconButton } from "@/components/ui/Button";
import {
  AVARGIYA,
  GUNITA_SIGNS,
  VARGA_CA,
  VARGA_KA,
  VARGA_PA,
  VARGA_TA,
  VARGA_TTA,
  VOWELS,
  gunitaksharaForm,
} from "@/lib/kannadaAlphabet";
import type { StringKey } from "@/lib/i18n";
import type { KeyStatus } from "./KeyboardKey";
import { KeyboardRow } from "./KeyboardRow";

export type KeyStatuses = Readonly<Record<string, KeyStatus>>;

const CONSONANT_ROWS: readonly { titleKey: StringKey; letters: readonly string[] }[] = [
  { titleKey: "alphabetVargaKa", letters: VARGA_KA },
  { titleKey: "alphabetVargaCa", letters: VARGA_CA },
  { titleKey: "alphabetVargaTta", letters: VARGA_TTA },
  { titleKey: "alphabetVargaTa", letters: VARGA_TA },
  { titleKey: "alphabetVargaPa", letters: VARGA_PA },
  { titleKey: "alphabetAvargiya", letters: AVARGIYA },
];

// Vowel signs (matras) shown combined with ಕ so their shape is recognisable;
// pressing one inserts just the sign, which Unicode renders attached to
// whatever consonant precedes it (skips the "no sign" inherent-vowel entry).
const MATRAS = GUNITA_SIGNS.slice(1);

interface KannadaKeyboardProps {
  open: boolean;
  onInsert: (text: string) => void;
  onBackspace: () => void;
  onClose: () => void;
  /** When given, an ink "Enter" key sits beside ⌫ (the word game submits a guess with it). */
  onEnter?: () => void;
  /** Word-game feedback per key, keyed by the inserted text. */
  statuses?: KeyStatuses;
}

/**
 * Toggleable virtual Kannada keyboard for the dictionary search box and the word game.
 * Phonetic layout: vowels, then vowel signs, then consonants by varga. Sits under a 2 px rule.
 * Every key uses onClick so mouse and touch both work; onMouseDown prevents default to keep
 * focus (and cursor position) on the input.
 */
export function KannadaKeyboard({ open, onInsert, onBackspace, onClose, onEnter, statuses }: KannadaKeyboardProps) {
  const t = useT();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!open) {
      setEntered(false);
      return;
    }
    const frame = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  if (!open) return null;

  const actionKey =
    "inline-flex h-10.5 items-center justify-center px-4 font-sans text-sm font-semibold transition-colors duration-150";

  return (
    <div
      role="group"
      aria-label={t("kbdTitle")}
      className={`rule-section mt-3 flex flex-col gap-3 pt-3 transition-opacity duration-200 ease-out ${entered ? "opacity-100" : "opacity-0"}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">{t("kbdTitle")}</span>
        <IconButton onClick={onClose} aria-label={t("kbdCloseKeyboard")}>
          <CloseIcon size={18} />
        </IconButton>
      </div>

      <KeyboardRow title={t("alphabetVowels")} letters={VOWELS} onPress={onInsert} statuses={statuses} />
      <KeyboardRow
        title={t("kbdMatras")}
        letters={MATRAS}
        onPress={onInsert}
        display={(sign) => gunitaksharaForm("ಕ", sign)}
        statuses={statuses}
        outlined
      />
      {CONSONANT_ROWS.map((group) => (
        <KeyboardRow key={group.titleKey} title={t(group.titleKey)} letters={group.letters} onPress={onInsert} statuses={statuses} />
      ))}

      <div className="flex gap-1">
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={onBackspace}
          aria-label={t("kbdBackspace")}
          className={`${actionKey} border border-ink bg-elevated text-ink hover:bg-paper-edge active:bg-paper-edge`}
        >
          {t("kbdBackspace")}
        </button>
        {onEnter && (
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={onEnter}
            className={`${actionKey} flex-1 bg-ink text-surface hover:bg-accent-strong active:bg-accent-strong`}
          >
            {t("kbdEnter")}
          </button>
        )}
      </div>
    </div>
  );
}
