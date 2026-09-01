/**
 * English tokeniser for the reverse (English → Kannada) index.
 * Lower-cases, strips punctuation and diacritics, drops stopwords and short tokens.
 */

const STOPWORDS = new Set([
  "the", "a", "an", "of", "to", "in", "and", "or", "is", "be", "as", "by", "for", "with",
  "that", "which", "on", "at", "from", "one", "who", "etc", "it", "its", "this", "these",
  "those", "are", "was", "were", "been", "being", "has", "have", "had", "not", "but", "into",
  "than", "then", "there", "their", "they", "them", "his", "her", "him", "she", "he", "any",
  "all", "also", "can", "may", "such", "used", "usu", "esp", "fig", "lit", "prov", "see",
  "very", "when", "where", "while", "whose", "whom", "what", "does", "did", "done", "each",
  "other", "some", "same", "more", "most", "much", "many", "only", "over", "under", "out",
  "off", "own", "per", "so", "too", "up", "upon", "via", "will", "would", "should", "could",
  "about", "after", "before", "between", "both", "because", "through", "without", "within",
  "against", "among", "during", "having", "made", "make", "makes", "making", "kind", "sort",
]);

const MIN_LENGTH = 3;

/** Strip combining marks so "kannaḍa" → "kannada". */
function fold(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function tokenise(text: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of fold(text.toLowerCase()).split(/[^a-z]+/)) {
    if (raw.length < MIN_LENGTH || STOPWORDS.has(raw) || seen.has(raw)) continue;
    seen.add(raw);
    out.push(raw);
  }
  return out;
}

/** Reverse-index shard letter for a token: a–z or "other". */
export function tokenShard(token: string): string {
  const first = token.charAt(0);
  return first >= "a" && first <= "z" ? first : "other";
}
