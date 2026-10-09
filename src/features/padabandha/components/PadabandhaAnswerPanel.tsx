"use client";

import { useLayoutEffect, useRef, useState, type RefObject, type SyntheticEvent } from "react";
import { KeyboardIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/Button";
import { CompactKannadaKeyboard } from "@/features/dictionary/components/CompactKannadaKeyboard";
import { backspaceAtCursor, insertAtCursor, type CursorEditResult } from "@/features/dictionary/lib/insertAtCursor";
import type { Locale } from "@/lib/types";
import type { NumberedEntry } from "../types";
import { LatinTypingHelp } from "./LatinTypingHelp";
import { PadabandhaClueBar } from "./PadabandhaClueBar";

interface PadabandhaAnswerPanelProps {
  entry: NumberedEntry;
  /** Kannada answer saved for the entry (what the cells show). */
  kannada: string;
  /** Latin letters as typed for the entry, or "" when the field holds Kannada. */
  latin: string;
  locale: Locale;
  keyboardOpen: boolean;
  areaRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  onAnswer: (raw: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onCheck: () => void;
  onHint: () => void;
  onClear: () => void;
  onKeyboardOpen: (open: boolean) => void;
}

/**
 * Selected clue + answer box + actions. Three ways to type: the phone's Kannada keyboard, English
 * letters (transliterated live, with a preview), or the compact on-screen keyboard, which edits
 * at the cursor. While the on-screen keyboard is open the field asks for no system keyboard.
 */
export function PadabandhaAnswerPanel(props: PadabandhaAnswerPanelProps) {
  const { entry, kannada, latin, locale, keyboardOpen, areaRef, inputRef, onAnswer } = props;
  const t = useT();
  const [cursor, setCursor] = useState<number | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const pendingCaret = useRef<number | null>(null);
  const shown = latin || kannada;
  const captureCursor = (event: SyntheticEvent<HTMLInputElement>) => setCursor(event.currentTarget.selectionStart);

  // On-screen keys write Kannada: a Latin draft is first replaced by its Kannada, editing at the end.
  const applyKey = (edit: (value: string, at: number | null) => CursorEditResult) => {
    const result = latin ? edit(kannada, null) : edit(shown, cursor);
    onAnswer(result.text);
    setCursor(result.cursor);
    pendingCaret.current = result.cursor;
  };

  // Put the caret back where the key acted, before the browser reports the end-of-value caret.
  useLayoutEffect(() => {
    const caret = pendingCaret.current;
    const input = inputRef.current;
    if (caret === null || !input) return;
    pendingCaret.current = null;
    if (document.activeElement === input) input.setSelectionRange(caret, caret);
  });

  return (
    <form
      className="border border-line bg-elevated p-4"
      onSubmit={(event) => {
        event.preventDefault();
        props.onCheck();
      }}
    >
      <div ref={areaRef} className="scroll-mb-24 scroll-mt-2">
        <PadabandhaClueBar entry={entry} guess={kannada} locale={locale} onPrev={props.onPrev} onNext={props.onNext} />
        <label htmlFor="padabandha-answer" className="mt-3 block text-base font-semibold text-ink">
          {t("padabandhaAnswer", { number: entry.number })}
        </label>
        <input
          ref={inputRef}
          id="padabandha-answer"
          lang={latin ? "en" : "kn"}
          value={shown}
          onChange={(event) => {
            onAnswer(event.target.value);
            setCursor(event.target.selectionStart);
          }}
          onSelect={captureCursor}
          onClick={captureCursor}
          onKeyUp={captureCursor}
          onFocus={captureCursor}
          inputMode={keyboardOpen ? "none" : "text"}
          enterKeyHint="done"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          aria-describedby="padabandha-typing-hint"
          className="mt-2 h-12 w-full border border-line bg-surface px-3 font-serif text-xl text-ink outline-none transition-colors focus:border-accent"
        />
        <p id="padabandha-typing-hint" aria-live="polite" className="mt-2 text-base text-secondary">
          {latin ? (
            <span className="text-ink">
              <span lang="en" className="font-latin">{latin}</span> → <span lang="kn" className="font-serif text-lg">{kannada}</span>
            </span>
          ) : (
            <>
              {t("padabandhaLatinHint")}{" "}
              <button
                type="button"
                onClick={() => setHelpOpen(true)}
                className="font-semibold text-accent-strong underline underline-offset-4"
              >
                {t("padabandhaLatinHelpLink")}
              </button>
            </>
          )}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="submit" variant="primary">{t("padabandhaCheck")}</Button>
        <Button type="button" variant="secondary" onClick={props.onHint}>{t("padabandhaHint")}</Button>
        <Button type="button" variant="secondary" onClick={props.onClear}>{t("padabandhaClear")}</Button>
        <Button
          type="button"
          variant="secondary"
          aria-pressed={keyboardOpen}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            props.onKeyboardOpen(!keyboardOpen);
            if (keyboardOpen) return;
            // Refocus after inputMode becomes "none" so the phone's own keyboard steps aside.
            window.requestAnimationFrame(() => {
              inputRef.current?.blur();
              inputRef.current?.focus({ preventScroll: true });
            });
          }}
        >
          <KeyboardIcon size={18} />
          {t("padabandhaKeyboard")}
        </Button>
      </div>
      <CompactKannadaKeyboard
        open={keyboardOpen}
        onClose={() => props.onKeyboardOpen(false)}
        onInsert={(text) => applyKey((value, at) => insertAtCursor(value, text, at))}
        onBackspace={() => applyKey((value, at) => backspaceAtCursor(value, at))}
      />
      <LatinTypingHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
    </form>
  );
}
