"use client";

import { useState, type SyntheticEvent } from "react";
import { useT } from "@/components/providers/AppProviders";
import { Button, IconButton } from "@/components/ui/Button";
import { KeyboardIcon } from "@/components/icons";
import { backspaceAtCursor, insertAtCursor } from "@/features/dictionary/lib/insertAtCursor";
import { KannadaKeyboard, type KeyStatuses } from "@/features/dictionary/components/KannadaKeyboard";

/** Guess field with the on-screen Kannada keyboard. The parent owns the draft so the grid can preview it. */
export function WordGameInput({
  targetLength,
  draft,
  error,
  onDraft,
  onSubmit,
  statuses,
}: {
  targetLength: number;
  draft: string;
  error: string | null;
  onDraft: (text: string) => void;
  onSubmit: (guess: string) => boolean;
  /** Best-known tile status per key, so used keys tint like the grid. */
  statuses?: KeyStatuses;
}) {
  const t = useT();
  const setDraft = onDraft;
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [cursor, setCursor] = useState<number | null>(null);
  const captureCursor = (event: SyntheticEvent<HTMLInputElement>) => setCursor(event.currentTarget.selectionStart);

  const insertText = (text: string) => {
    const result = insertAtCursor(draft, text, cursor);
    setDraft(result.text);
    setCursor(result.cursor);
  };
  const backspace = () => {
    const result = backspaceAtCursor(draft, cursor);
    setDraft(result.text);
    setCursor(result.cursor);
  };
  const submit = () => {
    if (onSubmit(draft)) setDraft("");
  };

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <label htmlFor="word-game-guess" className="text-base font-semibold text-ink">
        {t("wordGameInputLabel", { count: targetLength })}
      </label>
      <input
        id="word-game-guess"
        lang="kn"
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value);
          setCursor(event.target.selectionStart);
        }}
        onSelect={captureCursor}
        onClick={captureCursor}
        onKeyUp={captureCursor}
        onFocus={captureCursor}
        aria-describedby={error ? "word-game-error" : undefined}
        autoComplete="off"
        autoCapitalize="none"
        enterKeyHint="done"
        spellCheck={false}
        className="h-12 w-full border border-line bg-elevated px-3 font-serif text-xl text-ink outline-none transition-colors focus:border-accent"
      />
      <div className="flex items-center gap-2">
        <Button type="submit">{t("wordGameSubmit")}</Button>
        <IconButton
          onClick={() => setKeyboardOpen((v) => !v)}
          aria-label={keyboardOpen ? t("kbdCloseKeyboard") : t("kbdOpenKeyboard")}
          aria-pressed={keyboardOpen}
        >
          <KeyboardIcon size={20} />
        </IconButton>
      </div>
      <KannadaKeyboard
        open={keyboardOpen}
        onInsert={insertText}
        onBackspace={backspace}
        onEnter={submit}
        onClose={() => setKeyboardOpen(false)}
        statuses={statuses}
      />
    </form>
  );
}
