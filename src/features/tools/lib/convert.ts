import { SYLLABLE_TO_ASCII, SYLLABLE_TO_UNI } from "./nudiSyllables";
import {
  ARKAVATTU,
  CONS_TO_VATTU,
  DIGIT_TO_ASCII,
  DIGIT_TO_UNI,
  VATTU_TO_CONS,
  VOWEL_TO_ASCII,
  VOWEL_TO_UNI,
  applyBrokenMark,
  isBrokenMark,
} from "./nudiMarks";

const VIRAMA = "್";
const MATRAS = "ಾಿೀುೂೃೄೆೇೈೊೋೌ";
const SKIP = /[\u200B-\u200D\uFEFF]/;

const TO_UNI: Record<string, string> = {
  ...VOWEL_TO_UNI,
  ...DIGIT_TO_UNI,
  ...SYLLABLE_TO_UNI,
};
const TO_ASCII: Record<string, string> = {
  ...VOWEL_TO_ASCII,
  ...DIGIT_TO_ASCII,
  ...SYLLABLE_TO_ASCII,
};

const UNI_KEYS = Object.keys(TO_UNI).sort((a, b) => b.length - a.length);

function isCons(ch: string): boolean {
  const c = ch.codePointAt(0) ?? 0;
  return (c >= 0x0c95 && c <= 0x0cb9) || c === 0x0cde;
}

function isMatra(ch: string): boolean {
  return ch !== "" && MATRAS.includes(ch);
}

function longest(table: Record<string, string>, keys: string[], src: string, i: number): string | null {
  for (const key of keys) {
    if (src.startsWith(key, i)) return key;
  }
  return table[src[i] ?? ""] !== undefined ? src[i]! : null;
}

function splitLast(text: string): [string, string] {
  const chars = [...text];
  if (chars.length === 0) return ["", ""];
  let i = chars.length - 1;
  if (isMatra(chars[i]!)) i--;
  while (i >= 0 && isCons(chars[i]!)) {
    i--;
    if (i >= 0 && chars[i] === VIRAMA) {
      i--;
      continue;
    }
    break;
  }
  const cut = i + 1;
  return [chars.slice(0, cut).join(""), chars.slice(cut).join("")];
}

function attachVattu(text: string, cons: string): string {
  const [head, syll] = splitLast(text);
  if (!syll) return text + VIRAMA + cons;
  const last = syll.at(-1) ?? "";
  if (isMatra(last)) return head + syll.slice(0, -1) + VIRAMA + cons + last;
  if (last === VIRAMA) return head + syll + cons;
  return head + syll + VIRAMA + cons;
}

function applyReph(text: string): string {
  const [head, syll] = splitLast(text);
  return syll ? head + "ರ" + VIRAMA + syll : text + ARKAVATTU;
}

function convertChunk(src: string): string {
  let out = "";
  let i = 0;
  while (i < src.length) {
    if (SKIP.test(src[i]!)) {
      i++;
      continue;
    }
    const key = longest(TO_UNI, UNI_KEYS, src, i);
    if (key !== null) {
      out += TO_UNI[key];
      i += key.length;
      continue;
    }
    const ch = src[i]!;
    if (ch === ARKAVATTU) {
      out = applyReph(out);
      i++;
      continue;
    }
    const vattu = VATTU_TO_CONS[ch];
    if (vattu !== undefined) {
      out = attachVattu(out, vattu);
      i++;
      continue;
    }
    if (isBrokenMark(ch)) {
      const [head, syll] = splitLast(out);
      const next = syll ? applyBrokenMark(syll, ch) : null;
      if (next !== null) {
        out = head + next;
        i++;
        continue;
      }
    }
    out += ch;
    i++;
  }
  return out;
}

function mapProtected(text: string, conv: (chunk: string) => string): string {
  const re = /\$([^$]*)\$/g;
  let last = 0;
  let out = "";
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    out += conv(text.slice(last, match.index)) + match[1];
    last = match.index + match[0].length;
  }
  return out + conv(text.slice(last));
}

/** Nudi/Baraha ASCII font bytes → Unicode Kannada. */
export function nudiToUnicode(input: string): string {
  return mapProtected(input.normalize("NFC"), convertChunk);
}

function takeCluster(chars: string[], start: number): { base: string; vattus: string[]; vowel: string; len: number } {
  const base = chars[start]!;
  const vattus: string[] = [];
  let i = start + 1;
  while (chars[i] === VIRAMA && isCons(chars[i + 1] ?? "")) {
    vattus.push(chars[i + 1]!);
    i += 2;
  }
  let vowel = "";
  const next = chars[i];
  if (next === VIRAMA) {
    vowel = VIRAMA;
    i++;
  } else if (next !== undefined && isMatra(next)) {
    vowel = next;
    i++;
  }
  return { base, vattus, vowel, len: i - start };
}

function emitSyllable(cons: string, vowel: string): string {
  const uni = vowel === VIRAMA ? cons + VIRAMA : cons + vowel;
  return TO_ASCII[uni] ?? uni;
}

function emitCluster(base: string, vattus: string[], vowel: string): string {
  if (vattus.length === 0) return emitSyllable(base, vowel);
  const useReph = base === "ರ" && vattus[0] !== "ಯ" && vattus[0] !== "ರ";
  if (useReph) {
    const rest = vattus.slice(1);
    const core = rest.length ? emitCluster(vattus[0]!, rest, vowel) : emitSyllable(vattus[0]!, vowel);
    return core + ARKAVATTU;
  }
  let out = emitSyllable(base, vowel);
  for (const cons of vattus) out += CONS_TO_VATTU[cons] ?? emitSyllable(cons, VIRAMA);
  return out;
}

function unicodeChunk(src: string): string {
  const chars = [...src];
  let i = 0;
  let out = "";
  while (i < chars.length) {
    const ch = chars[i]!;
    if (SKIP.test(ch)) {
      i++;
      continue;
    }
    if (isCons(ch)) {
      const cluster = takeCluster(chars, i);
      out += emitCluster(cluster.base, cluster.vattus, cluster.vowel);
      i += cluster.len;
      continue;
    }
    const mapped = TO_ASCII[ch];
    if (mapped !== undefined) {
      out += mapped;
      i++;
      continue;
    }
    out += ch;
    i++;
  }
  return out;
}

/** Unicode Kannada → Nudi/Baraha ASCII font bytes. */
export function unicodeToNudi(input: string): string {
  return mapProtected(input.normalize("NFC"), unicodeChunk);
}
