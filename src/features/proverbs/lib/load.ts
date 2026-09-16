import type { ProverbsFile } from "../types";

// Shared across every caller in the tab so two components mounting at once (e.g. a proverb
// lookup and the full-list hook) trigger one fetch of /data/proverbs.json, not two.
let inflight: Promise<ProverbsFile | null> | null = null;

export async function loadProverbs(): Promise<ProverbsFile | null> {
  if (!inflight) {
    inflight = fetch("/data/proverbs.json")
      .then(async (res) => (res.ok ? ((await res.json()) as ProverbsFile) : null))
      .catch(() => null)
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}
