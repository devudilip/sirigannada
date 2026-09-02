import type { ProverbsFile } from "../types";

export async function loadProverbs(): Promise<ProverbsFile | null> {
  try {
    const res = await fetch("/data/proverbs.json");
    return res.ok ? ((await res.json()) as ProverbsFile) : null;
  } catch {
    return null;
  }
}
