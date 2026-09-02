/**
 * Nudi 01-e / Baraha Kannada ASCII font: Latin-1 slots that hold consonant shapes.
 * Written from public glyph-encoding knowledge (not copied from another converter).
 *
 * Pattern: body+ï = virama, body+À or a dedicated letter = inherent a, body+Á = aa,
 * a dedicated letter = i, body+É = e, body+Ë = au. u/uu/ee/ai/o/oo are those
 * frames plus the font's combining marks Ä Æ Ã Ê.
 */

type Frame = readonly [
  kn: string,
  virama: string,
  a: string,
  aa: string,
  i: string,
  e: string,
  au: string,
];

/** One row per consonant. Empty i-form means that matra is unused. */
const FRAMES: readonly Frame[] = [
  ["ಕ", "Pï", "PÀ", "PÁ", "Q", "PÉ", "PË"],
  ["ಖ", "Sï", "R", "SÁ", "T", "SÉ", "SË"],
  ["ಗ", "Uï", "UÀ", "UÁ", "V", "UÉ", "UË"],
  ["ಘ", "Wï", "WÀ", "WÁ", "X", "WÉ", "WË"],
  ["ಙ", "Yï", "Y", "YÁ", "", "YÉ", "YË"],
  ["ಚ", "Zï", "ZÀ", "ZÁ", "a", "ZÉ", "ZË"],
  ["ಛ", "bï", "bÀ", "bÁ", "c", "bÉ", "bË"],
  ["ಜ", "eï", "d", "eÁ", "f", "eÉ", "eË"],
  ["ಞ", "kï", "k", "kÁ", "", "kÉ", "kË"],
  ["ಟ", "mï", "l", "mÁ", "n", "mÉ", "mË"],
  ["ಠ", "oï", "oÀ", "oÁ", "p", "oÉ", "oË"],
  ["ಡ", "qï", "qÀ", "qÁ", "r", "qÉ", "qË"],
  ["ಢ", "qsï", "qsÀ", "qsÁ", "rü", "qsÉ", "qsË"],
  ["ಣ", "uï", "t", "uÁ", "v", "uÉ", "uË"],
  ["ತ", "wï", "wÀ", "wÁ", "x", "wÉ", "wË"],
  ["ಥ", "yï", "yÀ", "yÁ", "z", "yÉ", "yË"],
  ["ದ", "zï", "zÀ", "zÁ", "¢", "zÉ", "zË"],
  ["ಧ", "züï", "züÀ", "züÁ", "¢ü", "züÉ", "züË"],
  ["ನ", "£ï", "£À", "£Á", "¤", "£É", "£Ë"],
  ["ಪ", "¥ï", "¥À", "¥Á", "¦", "¥É", "¥Ë"],
  ["ಫ", "¥sï", "¥sÀ", "¥sÁ", "¦ü", "¥sÉ", "¥sË"],
  ["ಬ", "¨sï", "¨sÀ", "¨sÁ", "©", "¨sÉ", "¨sË"],
  ["ಭ", "ªï", "ªÀ", "ªÁ", "º", "ªÉ", "ªË"],
  ["ಮ", "ªÀiï", "ªÀi", "ªÀiÁ", "«", "ªÉi", "ªËi"],
  ["ಯ", "AiÀiï", "AiÀÄ", "AiÀiÁ", "0i", "AiÉÄ", "AiËÄ"],
  ["ರ", "gï", "gÀ", "gÁ", "j", "gÉ", "gË"],
  ["ಲ", "¯ï", "®", "¯Á", "°", "¯É", "¯Ë"],
  ["ವ", "Ã÷ï", "Ã÷", "Ã÷Á", "¬Ä", "ÃÉ÷", "ÃË÷"],
  ["ಶ", "±ï", "±À", "±Á", "²", "±É", "±Ë"],
  ["ಷ", "µï", "µÀ", "µÁ", "¶", "µÉ", "µË"],
  ["ಸ", "¸ï", "¸À", "¸Á", "¹", "¸É", "¸Ë"],
  ["ಹ", "ºï", "ºÀ", "ºÁ", "»", "ºÉ", "ºË"],
  ["ಳ", "¼ï", "¼À", "¼Á", "½", "¼É", "¼Ë"],
];

/** ಝ is drawn as ರ + an h-stroke in this font, so the frames are irregular. */
const JHA: Record<string, string> = {
  gÀhiï: "ಝ್",
  gÀhÄ: "ಝ",
  gÀhiÁ: "ಝಾ",
  jhÄ: "ಝಿ",
  "jhÄÃ": "ಝೀ",
  gÀhÄÄ: "ಝು",
  gÀhÄÆ: "ಝೂ",
  gÉhÄ: "ಝೆ",
  "gÉhÄÃ": "ಝೇ",
  gÉhÄÊ: "ಝೈ",
  gÉhÆ: "ಝೊ",
  "gÉhÆÃ": "ಝೋ",
  gÀhiË: "ಝೌ",
};

function expand(frame: Frame, add: (ascii: string, uni: string) => void): void {
  const [kn, virama, a, aa, i, e, au] = frame;
  add(virama, kn + "್");
  add(a, kn);
  add(aa, kn + "ಾ");
  if (i) {
    add(i, kn + "ಿ");
    add(i + "Ã", kn + "ೀ");
  }
  add(a + "Ä", kn + "ು");
  add(a + "Æ", kn + "ೂ");
  add(e, kn + "ೆ");
  add(e + "Ã", kn + "ೇ");
  add(e + "Ê", kn + "ೈ");
  add(e + "Æ", kn + "ೊ");
  add(e + "ÆÃ", kn + "ೋ");
  add(au, kn + "ೌ");
}

function build(): { toUni: Record<string, string>; toAscii: Record<string, string> } {
  const toUni: Record<string, string> = {};
  const toAscii: Record<string, string> = {};
  const add = (ascii: string, uni: string) => {
    toUni[ascii] = uni;
    if (toAscii[uni] === undefined) toAscii[uni] = ascii;
  };
  for (const frame of FRAMES) expand(frame, add);
  for (const [ascii, uni] of Object.entries(JHA)) add(ascii, uni);
  return { toUni, toAscii };
}

const MAPS = build();

export const SYLLABLE_TO_UNI = MAPS.toUni;
export const SYLLABLE_TO_ASCII = MAPS.toAscii;
