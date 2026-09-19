export type SaveProgress = (done: number, total: number) => void;

/**
 * Save `items` one after another (mirrors `stories/lib/saveAll.ts`; kept generic here since a
 * picture book is not a `Story`). `save` resolves true on success. Reports progress after each
 * item and returns the slugs that failed so the caller can offer a retry. Never throws.
 */
export async function saveAll<T extends { slug: string }>(
  items: readonly T[],
  save: (item: T) => Promise<boolean>,
  onProgress: SaveProgress = () => {},
): Promise<string[]> {
  const failed: string[] = [];
  const total = items.length;
  onProgress(0, total);
  let done = 0;
  for (const item of items) {
    let ok = false;
    try {
      ok = await save(item);
    } catch {
      ok = false;
    }
    if (!ok) failed.push(item.slug);
    done += 1;
    onProgress(done, total);
  }
  return failed;
}
