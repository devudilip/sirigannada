import type { Story } from "@/lib/types";

export type SleepTimer = "off" | "end" | 15 | 30;
export const PLAYBACK_RATES = [0.8, 1, 1.25] as const;
export type PlaybackRate = (typeof PLAYBACK_RATES)[number];
export const SKIP_SECONDS = 15;

/** Everything the player knows. Lives above the router so audio survives navigation. */
export interface PlayerState {
  story: Story | null;
  /** Playable stories in hub order; `next`/`prev` walk this list. */
  queue: Story[];
  playing: boolean;
  /** Seconds into the current story, updated a few times a second while playing. */
  position: number;
  duration: number;
  rate: PlaybackRate;
  autoplay: boolean;
  stopAfter: boolean;
  sleep: SleepTimer;
  /** True while the browser is fetching enough audio to start or continue. */
  buffering: boolean;
  error: boolean;
}

export interface PlayerActions {
  /** Load `story` (and remember `queue` for next/prev) and start playing from its saved position. */
  play: (story: Story, queue?: Story[]) => void;
  toggle: () => void;
  pause: () => void;
  seek: (seconds: number) => void;
  skip: (deltaSeconds: number) => void;
  next: () => void;
  prev: () => void;
  setRate: (rate: PlaybackRate) => void;
  setAutoplay: (on: boolean) => void;
  setStopAfter: (on: boolean) => void;
  setSleep: (timer: SleepTimer) => void;
  /** Unload the story and hide the mini-player. */
  stop: () => void;
}

export type StoryFilter = "all" | "short" | "animal" | "moral" | "funny" | "school" | "family";
