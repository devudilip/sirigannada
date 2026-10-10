import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { sha256, validateReview } from "./children";
import { storyboardDimensions } from "./storyboard";

/**
 * ಕರ್ನಾಟಕ ಇತಿಹಾಸ publication gate (data/history-src/README.md §8). Every story.json must match
 * src/features/history/types.ts, every scene must rest on known facts, every picture must be a
 * 16:9 WebP within budget, and review.json must bind an approval to the exact text and pictures.
 */
type RecordValue = Record<string, unknown>;
const record = (v: unknown): v is RecordValue => !!v && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const localized = (v: unknown): v is { kn: string; en: string } => record(v) && text(v.kn) && text(v.en);
const list = (v: unknown): v is string[] => Array.isArray(v) && v.length > 0 && v.every(text);
const slug = (v: unknown): v is string => text(v) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v);
const optionalText = (v: unknown) => v === undefined || text(v);
const url = (v: unknown) => text(v) && /^https?:\/\//.test(v);

export const TIERS = ["inscription", "scholarship", "legend"] as const;
export const AGES = ["12+", "16+"] as const;
export const LICENCES = ["public-domain", "CC0-1.0", "CC-BY-4.0", "CC-BY-SA-4.0"] as const;
/** Book pictures: 16:9 within ±2%, at least 1280 wide, at most 200 KB each. */
export const IMAGE = { minWidth: 1280, maxBytes: 200_000, ratio: 16 / 9, tolerance: 0.02 } as const;

export function validateHistorySeries(value: unknown): string[] {
  if (!record(value) || !slug(value.slug) || !localized(value.title) || !localized(value.description)) return ["invalid history series"];
  const years = value.years;
  if (!Array.isArray(years) || years.length !== 2 || !years.every(Number.isInteger) || Number(years[0]) >= Number(years[1])) {
    return [`${value.slug}: years must be [start, end] with start before end`];
  }
  return [];
}

/** Structural checks on one story.json; `expected` pins the folder it was read from. */
export function validateHistoryStory(value: unknown, expected?: { series: string; slug: string }): string[] {
  if (!record(value)) return ["story must be an object"];
  const errors: string[] = [];
  const check = (valid: boolean, message: string) => { if (!valid) errors.push(message); };
  check(slug(value.slug) && slug(value.series), "invalid story/series slug");
  if (expected) check(value.series === expected.series && value.slug === expected.slug, "folder identity mismatch");
  check(Number.isInteger(value.order) && Number(value.order) > 0, "order must be positive");
  check(localized(value.title) && localized(value.subtitle) && localized(value.teaser), "bilingual title/subtitle/teaser required");
  check(text(value.era), "era required");
  check((AGES as readonly unknown[]).includes(value.age) && value.language === "kn", `age must be one of ${AGES.join(", ")}; Kannada language required`);
  const imageDir = `/history/${value.series}/${value.slug}/`;
  const imagePath = (v: unknown) => text(v) && v.startsWith(imageDir) && v.endsWith(".webp") && !v.slice(imageDir.length).includes("/");
  check(imagePath(value.cover), `cover must be a WebP under ${imageDir}`);
  check(list(value.introduction) && list(value.summary), "introduction and summary paragraphs required");
  check(localized(value.contentNote), "bilingual content note required");
  const source = value.provenance;
  check(record(source) && url(source.source) && text(source.licenseNote) && text(source.retrieved), "provenance incomplete");
  if (record(source)) check((LICENCES as readonly unknown[]).includes(source.license), "licence not allowed");
  const art = value.illustrations;
  check(record(art) && text(art.generator) && text(art.promptDir) && localized(art.disclosure), "illustration provenance incomplete");
  check(!(record(art) && /^TO BE RECORDED/i.test(String(art.generator))), "illustration generator still a placeholder");

  const prose: string[] = [];
  const english: string[] = [];
  const both = (field: unknown) => { if (localized(field)) { prose.push(field.kn); english.push(field.en); } };
  [value.title, value.subtitle, value.teaser, value.contentNote, record(art) ? art.disclosure : undefined].forEach(both);
  if (list(value.introduction)) prose.push(...value.introduction);
  if (list(value.summary)) prose.push(...value.summary);

  const factIds = new Set<string>();
  check(Array.isArray(value.facts) && value.facts.length > 0, "facts required");
  if (Array.isArray(value.facts)) value.facts.forEach((fact: unknown, i: number) => {
    if (!record(fact)) { errors.push(`fact ${i + 1} invalid`); return; }
    check(text(fact.id) && !factIds.has(String(fact.id)), `fact ${i + 1} needs a unique id`);
    factIds.add(String(fact.id));
    check(localized(fact.text) && (TIERS as readonly unknown[]).includes(fact.tier) && text(fact.source), `fact ${fact.id ?? i + 1} needs bilingual text, a tier and a source`);
    check((fact.url === undefined || url(fact.url)) && optionalText(fact.quote) && (fact.disputed === undefined || localized(fact.disputed)), `fact ${fact.id ?? i + 1} has an invalid url, quote or disputed note`);
    both(fact.text);
    if (fact.disputed !== undefined) both(fact.disputed);
  });
  const known = (ids: unknown, label: string) => {
    check(list(ids), `${label}: facts list must not be empty`);
    if (Array.isArray(ids)) for (const id of ids) check(factIds.has(String(id)), `${label}: unknown fact id ${String(id)}`);
  };

  check(Array.isArray(value.scenes) && value.scenes.length > 0, "at least one scene required");
  if (Array.isArray(value.scenes)) {
    const ids = new Set<string>();
    value.scenes.forEach((scene: unknown, i: number) => {
      if (!record(scene)) { errors.push(`scene ${i + 1} invalid`); return; }
      check(slug(scene.id) && !ids.has(String(scene.id)), `scene ${i + 1} needs unique stable id`);
      ids.add(String(scene.id));
      check(text(scene.title) && localized(scene.imageAlt) && list(scene.paragraphs), `scene ${i + 1} incomplete`);
      check(imagePath(scene.image), `scene ${i + 1}: image must be a WebP under ${imageDir}`);
      check(scene.dramatised === undefined || list(scene.dramatised), `scene ${i + 1}: dramatised must be a non-empty list or absent`);
      known(scene.facts, `scene ${i + 1}`);
      if (text(scene.title)) prose.push(scene.title);
      if (list(scene.paragraphs)) prose.push(...scene.paragraphs);
      if (list(scene.dramatised)) prose.push(...scene.dramatised);
      both(scene.imageAlt);
    });
  }
  known(value.didYouKnow, "didYouKnow");
  check(Array.isArray(value.visitToday) && value.visitToday.length > 0, "visitToday required");
  if (Array.isArray(value.visitToday)) value.visitToday.forEach((place: unknown, i: number) => {
    check(record(place) && text(place.place) && text(place.what) && (place.url === undefined || url(place.url)), `visitToday ${i + 1} incomplete`);
    if (record(place)) for (const field of [place.place, place.what]) if (text(field)) prose.push(field);
  });

  check(prose.every((s) => !/—|---|<[^>]*>|\*\*/u.test(s)), "story prose contains forbidden dash or markup");
  check(prose.every((s) => /[ಀ-೿]/u.test(s) && s === s.normalize("NFC")), "story prose must be NFC Kannada");
  check(english.every((s) => !/—|---/u.test(s)), "English text contains forbidden dash");
  return errors;
}

/** Every unique picture a story shows (cover first, then scenes in order), as local paths. */
export function historyImagePaths(story: RecordValue): string[] {
  const scenes = Array.isArray(story.scenes) ? story.scenes : [];
  return [...new Set([story.cover, ...scenes.map((s: unknown) => (record(s) ? s.image : undefined))].filter(text))];
}

/** What review.json's imageSha256 hashes: the sorted hex hashes of every picture, concatenated. */
export function historyImageManifest(images: readonly Buffer[]): string {
  return images.map((bytes) => sha256(bytes)).sort().join("");
}

/** The value review.json must carry as imageSha256 for these pictures. */
export function historyImageDigest(images: readonly Buffer[]): string {
  return sha256(historyImageManifest(images));
}

export function validateHistoryImage(bytes: Buffer): string | undefined {
  if (bytes.length > IMAGE.maxBytes) return `exceeds ${IMAGE.maxBytes / 1000} KB budget`;
  const dims = storyboardDimensions(bytes);
  if (!dims) return "not a WebP";
  if (dims.width < IMAGE.minWidth) return `must be at least ${IMAGE.minWidth}px wide`;
  if (Math.abs(dims.width / dims.height - IMAGE.ratio) > IMAGE.ratio * IMAGE.tolerance) return "must be 16:9";
  return undefined;
}

/**
 * Validate data/history-src/: collections.json, every story folder that has a story.json (a
 * folder with only a facts sheet is work in progress and is skipped), its pictures and review.
 */
export function validateHistory(project = process.cwd()): string[] {
  const root = join(project, "data/history-src");
  const errors: string[] = [];
  try {
    const series: unknown = JSON.parse(readFileSync(join(root, "collections.json"), "utf8"));
    if (!Array.isArray(series) || !series.length) return ["history series missing"];
    const seen = new Set<string>();
    for (const s of series) {
      const issues = validateHistorySeries(s);
      if (issues.length || !record(s) || !slug(s.slug)) { errors.push(...issues); continue; }
      if (seen.has(s.slug)) errors.push(`duplicate series ${s.slug}`);
      seen.add(s.slug);
      const dir = join(root, s.slug);
      if (!existsSync(dir)) continue;
      for (const folder of readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory())) {
        const label = `${s.slug}/${folder.name}`;
        const storyFile = join(dir, folder.name, "story.json");
        if (!existsSync(storyFile)) continue;
        try {
          const bytes = readFileSync(storyFile, "utf8");
          const story: unknown = JSON.parse(bytes);
          const issues = validateHistoryStory(story, { series: s.slug, slug: folder.name });
          if (issues.length || !record(story)) { errors.push(...issues.map((e) => `${label}: ${e}`)); continue; }
          const images: Buffer[] = [];
          for (const image of historyImagePaths(story)) {
            const file = join(project, "public", image);
            if (!existsSync(file)) { errors.push(`${label}: picture missing ${image}`); continue; }
            const data = readFileSync(file);
            const issue = validateHistoryImage(data);
            if (issue) errors.push(`${label}: ${image} ${issue}`);
            images.push(data);
          }
          const reviewFile = join(dir, folder.name, "review.json");
          if (!existsSync(reviewFile) || !statSync(reviewFile).isFile()) { errors.push(`${label}: review.json missing`); continue; }
          const review: unknown = JSON.parse(readFileSync(reviewFile, "utf8"));
          errors.push(...validateReview(review, bytes, Buffer.from(historyImageManifest(images))).map((e) => `${label}: ${e}`));
        } catch (error) { errors.push(`${label}: ${String(error)}`); }
      }
    }
  } catch (error) { errors.push(`history corpus: ${String(error)}`); }
  return errors;
}
