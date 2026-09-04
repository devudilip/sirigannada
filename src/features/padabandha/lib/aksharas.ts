const KANNADA_CODEPOINT = /[ಀ-೿‌‍]/u;

/** Removes spaces, punctuation, and other scripts without altering valid Kannada joiners. */
export function cleanKannadaGuess(value: string): string {
  return Array.from(value.normalize("NFC")).filter((character) => KANNADA_CODEPOINT.test(character)).join("");
}
