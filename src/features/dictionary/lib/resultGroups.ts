import type { SearchResult } from "./search";

export interface ResultGroups {
  answers: SearchResult[];
  related: SearchResult[];
}

/** Split the resolved answer from exploratory matches without changing result order. */
export function groupSearchResults(results: SearchResult[]): ResultGroups {
  const answers: SearchResult[] = [];
  const related: SearchResult[] = [];

  for (const result of results) {
    if (result.match === "exact" || result.match === "inflected") answers.push(result);
    else related.push(result);
  }

  // English reverse lookup ranks the strongest definition first. When no Kannada
  // headword resolved directly, promote that one result as the answer instead of
  // presenting every English hit as equally exploratory.
  if (answers.length === 0 && results[0]?.match === "english") {
    const bestEnglish = results[0];
    return { answers: [bestEnglish], related: related.filter((result) => result !== bestEnglish) };
  }

  return { answers, related };
}
