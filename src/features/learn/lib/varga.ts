import { AVARGIYA, VARGA_CA, VARGA_KA, VARGA_PA, VARGA_TA, VARGA_TTA } from "@/lib/kannadaAlphabet";

type Text = { kn: string; en: string };

export interface VargaRow {
  letters: readonly string[];
  /** Traditional name of the place of articulation, e.g. ಕಂಠ್ಯ. */
  place: Text;
  how: Text;
  words: Text;
}

/** The five vargas, from the throat out to the lips: the reason ಕ is first and ಪ is last. */
export const VARGA_ROWS: readonly VargaRow[] = [
  {
    letters: VARGA_KA,
    place: { kn: "ಕಂಠ್ಯ · ಕಂಠ ಅಂದರೆ ಗಂಟಲು", en: "Kaṇṭhya (velar) · kaṇṭha means throat" },
    how: { kn: "ನಾಲಿಗೆಯ ಹಿಂಭಾಗ ಮೇಲೆದ್ದು ಬಾಯಿಯ ಒಳಗಿನ ಮೃದು ಅಂಗುಳಕ್ಕೆ ತಾಗುತ್ತದೆ. ಬಾಯಿಯಲ್ಲಿ ಅತ್ಯಂತ ಒಳಗಿನ ಜಾಗ.", en: "The back of the tongue rises against the soft palate, the innermost place in the mouth." },
    words: { kn: "ಕಮಲ, ಗಾಳಿ, ಘಂಟೆ", en: "ಕಮಲ lotus, ಗಾಳಿ wind, ಘಂಟೆ bell" },
  },
  {
    letters: VARGA_CA,
    place: { kn: "ತಾಲವ್ಯ · ತಾಲು ಅಂದರೆ ಅಂಗುಳ", en: "Tālavya (palatal) · tālu means palate" },
    how: { kn: "ನಾಲಿಗೆಯ ನಡುಭಾಗ ಗಟ್ಟಿ ಅಂಗುಳಕ್ಕೆ ಒತ್ತುತ್ತದೆ. ಕ-ವರ್ಗಕ್ಕಿಂತ ಸ್ವಲ್ಪ ಮುಂದೆ.", en: "The middle of the tongue presses on the hard palate, a little further forward than the ka-varga." },
    words: { kn: "ಚಂದ್ರ, ಜೇನು, ಝರಿ", en: "ಚಂದ್ರ moon, ಜೇನು honey, ಝರಿ stream" },
  },
  {
    letters: VARGA_TTA,
    place: { kn: "ಮೂರ್ಧನ್ಯ · ಮೂರ್ಧ ಅಂದರೆ ತಲೆ, ಮೇಲ್ಭಾಗ", en: "Mūrdhanya (retroflex) · mūrdha means head, the top" },
    how: { kn: "ನಾಲಿಗೆಯ ತುದಿ ಹಿಂದಕ್ಕೆ ಮಡಿಚಿ ಅಂಗುಳದ ಮೇಲ್ಭಾಗವನ್ನು ಮುಟ್ಟುತ್ತದೆ. ಕನ್ನಡದ ಗಟ್ಟಿ ಶಬ್ದಗಳು ಇಲ್ಲಿಂದ.", en: "The tip of the tongue curls back and touches the roof of the mouth. Kannada's hard ṭ and ḍ come from here." },
    words: { kn: "ಟೊಪ್ಪಿ, ಡೊಳ್ಳು, ಹಣ", en: "ಟೊಪ್ಪಿ cap, ಡೊಳ್ಳು drum, ಹಣ money" },
  },
  {
    letters: VARGA_TA,
    place: { kn: "ದಂತ್ಯ · ದಂತ ಅಂದರೆ ಹಲ್ಲು", en: "Dantya (dental) · danta means tooth" },
    how: { kn: "ನಾಲಿಗೆಯ ತುದಿ ಮೇಲಿನ ಹಲ್ಲುಗಳ ಹಿಂದೆ ತಾಗುತ್ತದೆ. ಟ-ವರ್ಗಕ್ಕಿಂತ ಮುಂದೆ, ಮೃದುವಾಗಿ.", en: "The tip of the tongue touches the back of the upper teeth: further forward and softer than the ṭa-varga." },
    words: { kn: "ತಾಯಿ, ದೀಪ, ನೀರು", en: "ತಾಯಿ mother, ದೀಪ lamp, ನೀರು water" },
  },
  {
    letters: VARGA_PA,
    place: { kn: "ಓಷ್ಠ್ಯ · ಓಷ್ಠ ಅಂದರೆ ತುಟಿ", en: "Oṣṭhya (labial) · oṣṭha means lip" },
    how: { kn: "ಎರಡೂ ತುಟಿಗಳು ಸೇರಿ ಗಾಳಿಯನ್ನು ತಡೆಯುತ್ತವೆ. ಬಾಯಿಯ ಅತ್ಯಂತ ಹೊರಗಿನ ಜಾಗ; ಅದಕ್ಕೇ ಪ-ವರ್ಗ ಕೊನೆಯದು.", en: "Both lips close and stop the air, the outermost place in the mouth. That is why the pa-varga comes last." },
    words: { kn: "ಪುಸ್ತಕ, ಬಾಳೆ, ಮನೆ", en: "ಪುಸ್ತಕ book, ಬಾಳೆ banana, ಮನೆ house" },
  },
];

export interface VargaColumn {
  example: string;
  name: Text;
  tip: Text;
}

/** The five columns inside every varga, shown on ಕ-ವರ್ಗ. */
export const VARGA_COLUMNS: readonly VargaColumn[] = [
  { example: "ಕ", name: { kn: "ಅಲ್ಪಪ್ರಾಣ, ಅಘೋಷ", en: "Unaspirated, voiceless" }, tip: { kn: "ಕಡಿಮೆ ಉಸಿರು, ಗಂಟಲು ನಡುಗುವುದಿಲ್ಲ.", en: "Little breath; the throat does not hum." } },
  { example: "ಖ", name: { kn: "ಮಹಾಪ್ರಾಣ, ಅಘೋಷ", en: "Aspirated, voiceless" }, tip: { kn: "ಬಾಯಿಯ ಮುಂದೆ ಅಂಗೈ ಹಿಡಿದು ಕ, ಖ ಹೇಳಿ: ಖದಲ್ಲಿ ಉಸಿರು ಕೈಗೆ ತಾಗುತ್ತದೆ.", en: "Hold your palm before your mouth and say ಕ, then ಖ: with ಖ a puff of air hits your hand." } },
  { example: "ಗ", name: { kn: "ಅಲ್ಪಪ್ರಾಣ, ಘೋಷ", en: "Unaspirated, voiced" }, tip: { kn: "ಗಂಟಲಿನ ಮೇಲೆ ಬೆರಳಿಟ್ಟು ಕ, ಗ ಹೇಳಿ: ಗದಲ್ಲಿ ಗಂಟಲು ನಡುಗುತ್ತದೆ.", en: "Put a finger on your throat and say ಕ, then ಗ: with ಗ the throat buzzes." } },
  { example: "ಘ", name: { kn: "ಮಹಾಪ್ರಾಣ, ಘೋಷ", en: "Aspirated, voiced" }, tip: { kn: "ಉಸಿರೂ ಇದೆ, ನಡುಕವೂ ಇದೆ.", en: "Both the puff and the buzz." } },
  { example: "ಙ", name: { kn: "ಅನುನಾಸಿಕ", en: "Nasal" }, tip: { kn: "ಗಾಳಿ ಮೂಗಿನಿಂದ ಹೊರಡುತ್ತದೆ. ಮೂಗು ಮುಚ್ಚಿ ಮ ಹೇಳಲು ಪ್ರಯತ್ನಿಸಿ!", en: "The air leaves through the nose. Try saying ಮ with your nose pinched!" } },
];

export interface MeaningPair {
  a: string;
  b: string;
  sounds: string;
  meaning: Text;
}

/** One sound moved to a neighbouring place, and the word changes. */
export const MEANING_PAIRS: readonly MeaningPair[] = [
  { a: "ಕಟ್ಟು", b: "ಕತ್ತು", sounds: "ಟ · ತ", meaning: { kn: "ಕಟ್ಟು = ಬಂಧಿಸು · ಕತ್ತು = ಕುತ್ತಿಗೆ", en: "kaṭṭu, to tie · kattu, the neck" } },
  { a: "ಮನೆ", b: "ಮಣೆ", sounds: "ನ · ಣ", meaning: { kn: "ಮನೆ = ಗೃಹ · ಮಣೆ = ಕೂರುವ ಹಲಗೆ", en: "mane, a house · maṇe, a low wooden seat" } },
  { a: "ಹುಲಿ", b: "ಹುಳಿ", sounds: "ಲ · ಳ", meaning: { kn: "ಹುಲಿ = ವ್ಯಾಘ್ರ · ಹುಳಿ = ಹುಳಿ ರುಚಿ", en: "huli, a tiger · huḷi, sour" } },
  { a: "ಬೆಲೆ", b: "ಬೆಳೆ", sounds: "ಲ · ಳ", meaning: { kn: "ಬೆಲೆ = ಕ್ರಯ · ಬೆಳೆ = ಹೊಲದ ಫಸಲು", en: "bele, a price · beḷe, a crop" } },
];

export const AVARGIYA_LETTERS = AVARGIYA;

/** Every letter the lesson shows, in page order (the letter popup steps through these). */
export const VARGA_LESSON_LETTERS: readonly string[] = [...VARGA_ROWS.flatMap((row) => row.letters), ...AVARGIYA];

export const VARGA_VIDEO_URL = "https://youtu.be/ONw93ud1et0";
