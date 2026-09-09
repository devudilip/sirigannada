/**
 * One typed progress blob for cross-device continue. Carries no book text and no Nudi/Baraha.
 * It NEVER contains the daily-word answer — only the date and the guesses already made.
 * `exp` is an epoch-ms cutoff: the site has no server, so the link carries its own expiry.
 */
export interface ProgressBlob {
  v: 1;
  /** Epoch ms. The continue link is treated as broken after this (24–48h from creation). */
  exp: number;
  library?: {
    bookId: string;
    /** 1-based page at last save, if known. */
    page?: number;
    /** Global block index of the verse to land on. */
    verseId?: number;
  };
  padabandha?: {
    packId: string;
    /** entry id -> guessed answer, exactly as the game already stores it. */
    grid: Record<string, string>;
  };
  dailyWord?: {
    date: string;
    guesses: string[];
  };
  stars?: {
    words: string[];
    /** proverb ("ಗಾದೆ") ids. */
    gade: string[];
  };
}
