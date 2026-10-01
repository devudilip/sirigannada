/**
 * Handwriting animation and recorded pronunciation for each alphabet letter, from Wikimedia Commons
 * (the set used on Kannada Wikipedia's ಕನ್ನಡ ಅಕ್ಷರಮಾಲೆ article), mirrored under public/learn/letters/
 * so nothing is fetched from a third party at runtime. Animations: Gopala Krishna A; recordings
 * (Commons MP3 transcodes of Kn-<letter>.oga): Surabhi18. Both CC BY-SA 4.0, credited in the letter
 * popup and on /credits. Sanskrit vocalics and archaic letters have neither (no open media exists),
 * so they get no popup.
 */
const LETTERS: Readonly<Record<string, readonly [slug: string, commonsGif: string]>> = {
  ಅ: ["a", "Kannada-alphabet-a.gif"], ಆ: ["aa", "Kannada-alphabet-aa.gif"], ಇ: ["i", "Kannada-alphabet-e.gif"],
  ಈ: ["ii", "Kannada-alphabet-ee.gif"], ಉ: ["u", "Kannada-alphabet-u.gif"], ಊ: ["uu", "Kannada-alphabet-uu.gif"],
  ಋ: ["ru", "Kannada-alphabet-ru.gif"], ಎ: ["e", "Kannada-alphabet-ae.gif"], ಏ: ["ee", "Kannada-alphabet-aee.gif"],
  ಐ: ["ai", "Kannada-alphabet-ai.gif"], ಒ: ["o", "Kannada-alphabet-o.gif"], ಓ: ["oo", "Kannada-alphabet-oo.gif"],
  ಔ: ["au", "Kannada-alphabet-ou.gif"], ಅಂ: ["am", "Kannada-alphabet-am.gif"], ಅಃ: ["ah", "Aha.gif"],
  ಕ: ["ka", "Kannada-alphabet-ka.gif"], ಖ: ["kha", "Kannada-alphabet-kha.gif"], ಗ: ["ga", "Kannada-alphabet-ga.gif"],
  ಘ: ["gha", "Kannada-alphabet-gha.gif"], ಙ: ["nga", "Kannada-alphabet-knha.gif"], ಚ: ["ca", "Kannada-alphabet-cha.gif"],
  ಛ: ["cha", "Kannada-alphabet-chha.gif"], ಜ: ["ja", "Kannada-alphabet-ja.gif"], ಝ: ["jha", "Kannada-alphabet-jha.gif"],
  ಞ: ["nya", "Kannada-alphabet-chna.gif"], ಟ: ["tta", "Kannada-alphabet-ta.gif"], ಠ: ["ttha", "Kannada-alphabet-tta.gif"],
  ಡ: ["dda", "Kannada-alphabet-da.gif"], ಢ: ["ddha", "Kannada-alphabet-dda.gif"], ಣ: ["nna", "Kannada-alphabet-nna.gif"],
  ತ: ["ta", "Kannada-alphabet-tha.gif"], ಥ: ["tha", "Kannada-alphabet-thha.gif"], ದ: ["da", "Kannada-alphabet-dha.gif"],
  ಧ: ["dha", "Kannada-alphabet-dhha.gif"], ನ: ["na", "Kannada-alphabet-na.gif"], ಪ: ["pa", "Kannada-alphabet-pa.gif"],
  ಫ: ["pha", "Kannada-alphabet-pha.gif"], ಬ: ["ba", "Kannada-alphabet-ba.gif"], ಭ: ["bha", "Kannada-alphabet-bha.gif"],
  ಮ: ["ma", "Kannada-alphabet-ma.gif"], ಯ: ["ya", "Kannada-alphabet-ya.gif"], ರ: ["ra", "Kannada-alphabet-ra.gif"],
  ಲ: ["la", "Kannada-alphabet-la.gif"], ವ: ["va", "Kannada-alphabet-va.gif"], ಶ: ["sha", "Kannada-alphabet-sha.gif"],
  ಷ: ["ssa", "Kannada-alphabet-shha.gif"], ಸ: ["sa", "Kannada-alphabet-sa.gif"], ಹ: ["ha", "Kannada-alphabet-ha.gif"],
  ಳ: ["lla", "Kannada-alphabet-lla.gif"],
};

const COMMONS = "https://commons.wikimedia.org/wiki/File:";

export interface LetterMedia {
  gif: string;
  audio: string;
  gifSource: string;
  audioSource: string;
}

export function letterMedia(glyph: string): LetterMedia | null {
  const entry = LETTERS[glyph];
  if (!entry) return null;
  const [slug, commonsGif] = entry;
  return {
    gif: `/learn/letters/${slug}.gif`,
    audio: `/learn/letters/${slug}.mp3`,
    gifSource: COMMONS + commonsGif,
    audioSource: COMMONS + encodeURIComponent(`Kn-${glyph}.oga`),
  };
}

let player: HTMLAudioElement | null = null;

/**
 * Play the recorded pronunciation, falling back to the device's Kannada voice if playback fails.
 * One shared player, so a second call (Strict Mode's double effect, a quick replay tap) restarts
 * the sound instead of layering a second copy over it.
 */
export function hearLetter(glyph: string, speak: ((text: string) => void) | null): void {
  const media = letterMedia(glyph);
  if (!media) return;
  player ??= new Audio();
  player.pause();
  player.src = media.audio;
  player.play().catch((error: unknown) => {
    // A newer call interrupting this one is not a playback failure.
    if (!(error instanceof DOMException && error.name === "AbortError")) speak?.(glyph);
  });
}
