/** Stable discovery shelves: rotate daily, interleave categories, and ignore input ordering. */
export function dailySelection<T>(
  items: readonly T[],
  key: (item: T) => string,
  limit: number,
  date: Date,
  group: (item: T) => string = () => "all",
): T[] {
  if (limit <= 0) return [];
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  const hash = (text: string) => {
    let value = 2166136261;
    for (const char of text) value = Math.imul(value ^ char.charCodeAt(0), 16777619);
    return value >>> 0;
  };
  const unique = [...new Map(items.map((item) => [key(item), item])).values()];
  const buckets = new Map<string, T[]>();
  for (const item of unique) {
    const id = group(item);
    const bucket = buckets.get(id);
    if (bucket) bucket.push(item);
    else buckets.set(id, [item]);
  }
  const rotate = <U,>(list: U[]) => {
    if (!list.length) return list;
    const offset = ((day % list.length) + list.length) % list.length;
    return [...list.slice(offset), ...list.slice(0, offset)];
  };
  const groups = rotate([...buckets.keys()].sort());
  const queues = groups.map((id) => rotate(buckets.get(id)!.sort((a, b) => hash(key(a)) - hash(key(b)) || key(a).localeCompare(key(b)))));
  const result: T[] = [];
  for (let row = 0; result.length < Math.min(limit, unique.length); row++) {
    for (const queue of queues) {
      if (row < queue.length && result.length < limit) result.push(queue[row]!);
    }
  }
  return result;
}
