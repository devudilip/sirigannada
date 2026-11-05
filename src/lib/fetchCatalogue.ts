/** A content revision bypasses older cache-first/HTTP copies; saved catalogues still work offline. */
export async function fetchCatalogue(path: string): Promise<Response> {
  try {
    const response = await fetch(`${path}?v=20261105-ux2`);
    if (response.ok) return response;
  } catch { /* Fall back to the catalogue already saved by an earlier app version. */ }
  return fetch(path);
}
