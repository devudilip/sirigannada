"use client";

import { useCallback, useEffect, useState } from "react";
import { useT } from "@/components/providers/AppProviders";
import { lookupInflected, type SearchResult } from "@/features/dictionary/lib/search";
import { useStoriesManifest } from "../lib/manifest";
import { usePlayer } from "../lib/PlayerContext";
import { playable } from "../lib/queue";
import { sentenceAt, sentenceStart, stripPunctuation } from "../lib/sentences";
import { DEFAULT_TEXT_SIZE, nextTextSize, readTextSize, writeTextSize, type TextSize } from "../lib/textSize";
import { PLAYBACK_RATES } from "../types";
import { ReadAlongHeader } from "./ReadAlongHeader";
import { ReadAlongText } from "./ReadAlongText";
import { ReadAlongTransport } from "./ReadAlongTransport";
import { StoryWordSheet } from "./StoryWordSheet";

/**
 * /stories/[slug]/read — the story text following the shared player. Works even when the player
 * holds a different story (or none): the text shows and the play button loads this one.
 */
export function ReadAlong({ slug }: { slug: string }) {
  const t = useT();
  const manifest = useStoriesManifest();
  const player = usePlayer();
  const [size, setSize] = useState<TextSize>(DEFAULT_TEXT_SIZE);
  const [word, setWord] = useState<{ text: string; sentence: number } | null>(null);
  const [result, setResult] = useState<SearchResult | null | undefined>(undefined);

  useEffect(() => setSize(readTextSize()), []);

  const story = manifest?.stories.find((s) => s.slug === slug) ?? null;
  const isCurrent = story !== null && player.story?.slug === story.slug;
  const timings = story?.timings ?? null;
  const sentences = story?.sentences ?? [];
  const position = isCurrent ? player.position : 0;
  const current = isCurrent && timings ? sentenceAt(timings, position) : -1;

  const cycleSize = useCallback(() => {
    setSize((s) => {
      const n = nextTextSize(s);
      writeTextSize(n);
      return n;
    });
  }, []);

  const ensurePlaying = useCallback(() => {
    if (!story || !manifest) return;
    if (isCurrent) player.toggle();
    else player.play(story, playable(manifest.stories));
  }, [story, manifest, isCurrent, player]);

  const seekSentence = useCallback(
    (i: number) => {
      if (!timings || !isCurrent) return;
      player.seek(sentenceStart(timings, i));
    },
    [timings, isCurrent, player],
  );

  const onWord = useCallback((raw: string, sentence: number) => {
    const text = stripPunctuation(raw);
    if (!text) return;
    setWord({ text, sentence });
    setResult(undefined);
    void lookupInflected(text).then((r) => setResult(r));
  }, []);

  const hearAgain = useCallback(() => {
    if (!word || !story) return;
    if (!isCurrent) {
      ensurePlaying();
      return;
    }
    if (timings) player.seek(sentenceStart(timings, word.sentence));
    if (!player.playing) player.toggle();
  }, [word, story, isCurrent, ensurePlaying, timings, player]);

  const cycleRate = useCallback(() => {
    const i = PLAYBACK_RATES.indexOf(player.rate);
    player.setRate(PLAYBACK_RATES[(i + 1) % PLAYBACK_RATES.length] ?? 1);
  }, [player]);

  if (!manifest) return <p className="mx-auto max-w-2xl px-5 pt-6 text-secondary">{t("loading")}</p>;
  if (!story || sentences.length === 0) return <p className="mx-auto max-w-2xl px-5 pt-6 text-secondary">{t("playerNoText")}</p>;

  return (
    <div className="mx-auto max-w-2xl px-5 pb-32">
      <ReadAlongHeader slug={slug} title={story.title} size={size} onCycleSize={cycleSize} />
      <ReadAlongText sentences={sentences} current={current} hasTimings={timings !== null} size={size} onSeek={seekSentence} onWord={onWord} />
      <ReadAlongTransport
        playing={isCurrent && player.playing}
        position={position}
        duration={isCurrent && player.duration > 0 ? player.duration : story.durationSec}
        sentence={current + 1}
        total={sentences.length}
        canStep={timings !== null && isCurrent}
        rate={player.rate}
        onPrev={() => seekSentence(current - 1)}
        onToggle={ensurePlaying}
        onNext={() => seekSentence(current + 1)}
        onRate={cycleRate}
      />
      <StoryWordSheet
        word={word?.text ?? null}
        result={result}
        onClose={() => setWord(null)}
        onHearAgain={() => {
          hearAgain();
          setWord(null);
        }}
      />
    </div>
  );
}
