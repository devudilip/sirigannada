/**
 * Pure readiness math: given the URLs a category expects to have cached and the URLs actually
 * found in the cache, compute how many are present and which are missing. No Cache API here —
 * that lives in `status.ts`, which is not unit-testable without a real browser.
 */
export interface Readiness {
  cachedCount: number;
  totalCount: number;
  missingUrls: string[];
}

export function computeReadiness(expectedUrls: readonly string[], cachedUrls: ReadonlySet<string> | readonly string[]): Readiness {
  const cachedSet = cachedUrls instanceof Set ? cachedUrls : new Set(cachedUrls);
  const missingUrls = expectedUrls.filter((url) => !cachedSet.has(url));
  return {
    cachedCount: expectedUrls.length - missingUrls.length,
    totalCount: expectedUrls.length,
    missingUrls,
  };
}
