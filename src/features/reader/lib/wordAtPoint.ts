const KANNADA_CHAR = /[\u0C80-\u0CFF\u200C\u200D]/;

interface CaretHit {
  node: Node;
  offset: number;
}

function caretAt(x: number, y: number): CaretHit | null {
  const doc = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
  };
  if (doc.caretPositionFromPoint) {
    const pos = doc.caretPositionFromPoint(x, y);
    return pos ? { node: pos.offsetNode, offset: pos.offset } : null;
  }
  if (doc.caretRangeFromPoint) {
    const range = doc.caretRangeFromPoint(x, y);
    return range ? { node: range.startContainer, offset: range.startOffset } : null;
  }
  return null;
}

/**
 * Returns the Kannada word under a screen point, or null if the point is not on Kannada text.
 * Works without wrapping every word in a span, so large books stay cheap to render.
 */
export function wordAtPoint(x: number, y: number): string | null {
  const hit = caretAt(x, y);
  if (!hit || hit.node.nodeType !== Node.TEXT_NODE) return null;
  const text = hit.node.textContent ?? "";
  if (!text) return null;

  let start = Math.min(hit.offset, text.length);
  let end = start;
  // If the caret landed just after a word, step back into it.
  if (start > 0 && !KANNADA_CHAR.test(text[start] ?? "") && KANNADA_CHAR.test(text[start - 1] ?? "")) start--;
  if (!KANNADA_CHAR.test(text[start] ?? "")) return null;

  while (start > 0 && KANNADA_CHAR.test(text[start - 1] ?? "")) start--;
  end = start;
  while (end < text.length && KANNADA_CHAR.test(text[end] ?? "")) end++;
  const word = text.slice(start, end).replace(/[\u0C82\u0C83]?[।॥]+$/g, "");
  return word.length >= 2 ? word : null;
}
