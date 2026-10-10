import type { LocalizedText, Provenance } from "@/lib/types";

/** How well a statement is backed. Shown to the reader beside every fact. */
export type EvidenceTier = "inscription" | "scholarship" | "legend";

/** One sourced statement. Everything in a story must trace back to one of these. */
export interface HistoryFact {
  id: string;
  /** The statement, in Kannada and English. */
  text: LocalizedText;
  tier: EvidenceTier;
  /** Primary edition or work: "Aihole inscription, Epigraphia Indica VI, p. 1–12 (Kielhorn 1900)". */
  source: string;
  url?: string;
  /** Short quotation from the source where one exists. */
  quote?: string;
  /** Set when historians disagree; says what is disputed, in both languages. */
  disputed?: LocalizedText;
}

export interface HistoryScene {
  id: string;
  title: string;
  /** Kannada prose paragraphs. */
  paragraphs: string[];
  /** 16:9 WebP under public/history/<series>/<story>/. */
  image: string;
  imageAlt: LocalizedText;
  /** Fact ids this scene rests on. Validation fails on an unknown id or an empty list. */
  facts: string[];
  /** Lines or details invented for the telling, each disclosed to the reader. */
  dramatised?: string[];
}

export interface HistoryStory {
  slug: string;
  /** Series slug from data/history-src/collections.json, e.g. "badami-chalukya". */
  series: string;
  order: number;
  title: LocalizedText;
  /** The person or event, for the shelf card: "ಇಮ್ಮಡಿ ಪುಲಿಕೇಶಿ, 610–642". */
  subtitle: LocalizedText;
  teaser: LocalizedText;
  era: string;
  /** Adults' section; battles and deaths told plainly, no vulgarity. */
  age: "12+" | "16+";
  language: "kn";
  cover: string;
  introduction: string[];
  scenes: HistoryScene[];
  summary: string[];
  /** ನಿಮಗೆ ಗೊತ್ತೇ?: fact ids, 5 to 8. */
  didYouKnow: string[];
  /** Where the evidence can be seen today. */
  visitToday: { place: string; what: string; url?: string }[];
  facts: HistoryFact[];
  provenance: Provenance;
  illustrations: { generator: string; promptDir: string; disclosure: LocalizedText };
  contentNote: LocalizedText;
}

export interface HistorySeries {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  /** Start and end years for shelf ordering. */
  years: [number, number];
}
