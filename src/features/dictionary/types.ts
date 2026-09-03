export const DICT_HISTORY_KEY = "dict:history";
export const DICT_FAVOURITES_KEY = "dict:favourites";
export const DICT_HISTORY_LIMIT = 20;

export interface DictOfflineWarmProgress {
  done: number;
  total: number;
  failedUrls: string[];
}
