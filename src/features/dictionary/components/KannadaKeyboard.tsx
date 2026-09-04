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
import { KeyboardRow } from "./KeyboardRow";

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
}

/**
 * Toggleable virtual Kannada keyboard for the dictionary search box.
 * Phonetic layout: vowels, then vowel signs, then consonants by varga.
 * Every key uses onClick so mouse and touch both work; onMouseDown prevents
 * default to keep focus (and cursor position) on the search input.
 */
export function KannadaKeyboard({ open, onInsert, onBackspace, onClose }: KannadaKeyboardProps) {
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

  return (
    <div
      role="group"
      aria-label={t("kbdTitle")}
      className={`mt-3 flex flex-col gap-3 rounded-lg border border-line bg-elevated p-3 shadow-elevated transition-all duration-200 ease-out ${
        entered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">{t("kbdTitle")}</span>
        <IconButton onClick={onClose} aria-label={t("kbdCloseKeyboard")}>
          <CloseIcon size={18} />
        </IconButton>
      </div>

      <KeyboardRow title={t("alphabetVowels")} letters={VOWELS} onPress={onInsert} />
      <KeyboardRow
        title={t("kbdMatras")}
        letters={MATRAS}
        onPress={onInsert}
        display={(sign) => gunitaksharaForm("ಕ", sign)}
      />
      {CONSONANT_ROWS.map((group) => (
        <KeyboardRow key={group.titleKey} title={t(group.titleKey)} letters={group.letters} onPress={onInsert} />
      ))}

      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={onBackspace}
        aria-label={t("kbdBackspace")}
        className="inline-flex min-h-11 items-center justify-center self-end rounded-md border border-line bg-elevated px-4 text-sm text-ink transition-colors duration-150 hover:border-line-strong hover:bg-paper active:bg-paper-edge"
      >
        {t("kbdBackspace")}
      </button>
    </div>
  );
}
