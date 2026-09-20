import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { storyboardDimensions } from "./storyboard";

type RecordValue = Record<string, unknown>;
const record = (v: unknown): v is RecordValue => !!v && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const localized = (v: unknown) => record(v) && text(v.kn) && text(v.en);
const list = (v: unknown): v is string[] => Array.isArray(v) && v.length > 0 && v.every(text);
const slug = (v: unknown): v is string => text(v) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v);
export const sha256 = (bytes: string | Buffer) => createHash("sha256").update(bytes).digest("hex");

export function validateStory(value: unknown): string[] {
  if (!record(value)) return ["story must be an object"];
  const errors: string[] = [];
  const check = (valid: boolean, message: string) => { if (!valid) errors.push(message); };
  check(slug(value.slug) && slug(value.collection), "invalid story/collection slug");
  check(Number.isInteger(value.order) && Number(value.order) > 0, "order must be positive");
  check(localized(value.title) && localized(value.teaser), "bilingual title/teaser required");
  check(text(value.age) && value.language === "kn", "age and Kannada language required");
  check(value.image === `/stories/${value.collection}/${value.slug}/storyboard.webp`, "invalid local image path");
  check(localized(value.contentNote), "bilingual content note required");
  const source = value.provenance;
  check(record(source) && text(source.source) && source.source.startsWith("https://") &&
    text(source.licenseNote) && text(source.author) && text(source.retrieved), "source provenance incomplete");
  if (record(source)) {
    check(["public-domain", "CC0-1.0", "CC-BY-4.0", "CC-BY-SA-4.0"].includes(String(source.license)), "source licence not allowed");
    if (source.license === "public-domain") check(Number.isInteger(source.authorDied) &&
      Number(source.authorDied) <= 1965 && Number(source.authorDied) > 0, "public-domain source needs verified death year at or before 1965");
  }
  const adaptation = value.adaptation;
  check(record(adaptation) && localized(adaptation.credit) && localized(adaptation.note) &&
    adaptation.license === "CC-BY-SA-4.0" && list(adaptation.changes), "adaptation provenance incomplete");
  const art = value.illustrations;
  check(record(art) && text(art.generator) && art.promptFile === "image-prompt.txt" &&
    localized(art.disclosure), "illustration provenance incomplete");
  check(Array.isArray(value.scenes) && value.scenes.length === 6, "storyboard requires six scenes");
  const prose: string[] = [];
  for (const field of [value.title, value.teaser, value.contentNote,
    record(adaptation) ? adaptation.credit : undefined, record(adaptation) ? adaptation.note : undefined,
    record(art) ? art.disclosure : undefined]) {
    if (record(field) && text(field.kn)) prose.push(field.kn);
  }
  if (Array.isArray(value.scenes)) {
    const ids = new Set<string>();
    value.scenes.forEach((scene: unknown, i: number) => {
      if (!record(scene)) { errors.push(`scene ${i + 1} invalid`); return; }
      check(slug(scene.id) && !ids.has(String(scene.id)), `scene ${i + 1} needs unique stable id`);
      ids.add(String(scene.id));
      check(text(scene.title) && text(scene.imageAlt) && list(scene.paragraphs), `scene ${i + 1} incomplete`);
      check(scene.panel === i, `scene ${i + 1} panel must match reading order`);
      check(scene.question === undefined || text(scene.question), `scene ${i + 1} question invalid`);
      if (list(scene.paragraphs)) prose.push(...scene.paragraphs);
      for (const field of [scene.title, scene.imageAlt, scene.question]) if (text(field)) prose.push(field);
    });
  }
  check(Array.isArray(value.vocabulary) && value.vocabulary.length >= 3, "at least three vocabulary entries required");
  if (Array.isArray(value.vocabulary)) value.vocabulary.forEach((v: unknown) => {
    check(record(v) && text(v.word) && text(v.meaning), "vocabulary entry incomplete");
    if (record(v) && text(v.word) && text(v.meaning)) prose.push(v.word, v.meaning);
  });
  check(list(value.questions), "discussion questions required");
  if (list(value.questions)) prose.push(...value.questions);
  check(prose.every((s) => !/—|---|<[^>]*>|\*\*/u.test(s)), "story prose contains forbidden dash or markup");
  check(prose.every((s) => /[\u0C80-\u0CFF]/u.test(s) && s === s.normalize("NFC")), "story prose must be NFC Kannada");
  return errors;
}

export function validateReview(value: unknown, storyBytes: string, imageBytes: Buffer): string[] {
  if (!record(value)) return ["review record missing"];
  const errors: string[] = [];
  if (value.status !== "approved" || !text(value.reviewer) || !text(value.date) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(String(value.date))) errors.push("dated reviewer approval required");
  if (value.storySha256 !== sha256(storyBytes)) errors.push("story changed since review");
  if (value.imageSha256 !== sha256(imageBytes)) errors.push("illustration changed since review");
  if (!list(value.text) || !list(value.illustrations) || !list(value.limitations)) errors.push("review evidence and limitations required");
  return errors;
}

export function validateChildren(project = process.cwd()): string[] {
  const root = join(project, "data/children-src");
  const errors: string[] = [];
  try {
    const collections: unknown = JSON.parse(readFileSync(join(root, "collections.json"), "utf8"));
    if (!Array.isArray(collections) || !collections.length) return ["children collections missing"];
    const collectionIds = new Set<string>();
    for (const c of collections) {
      if (!record(c) || !slug(c.slug) || !localized(c.title) || !localized(c.description)) {
        errors.push("invalid children collection"); continue;
      }
      if (collectionIds.has(c.slug)) errors.push(`duplicate collection ${c.slug}`);
      collectionIds.add(c.slug);
      const folders = readdirSync(join(root, c.slug), { withFileTypes: true }).filter((d) => d.isDirectory());
      if (!folders.length) errors.push(`${c.slug}: empty collection`);
      for (const folder of folders) {
        const label = `${c.slug}/${folder.name}`;
        try {
          const dir = join(root, label);
          const bytes = readFileSync(join(dir, "story.json"), "utf8");
          const story: unknown = JSON.parse(bytes);
          const issues = validateStory(story);
          if (issues.length || !record(story)) { errors.push(...issues.map((e) => `${label}: ${e}`)); continue; }
          if (story.collection !== c.slug || story.slug !== folder.name) errors.push(`${label}: folder identity mismatch`);
          const image = join(project, "public", String(story.image));
          if (!existsSync(image)) { errors.push(`${label}: illustration missing`); continue; }
          if (statSync(image).size > 650_000) errors.push(`${label}: storyboard exceeds 650 KB budget`);
          const dimensions = storyboardDimensions(readFileSync(image));
          if (!dimensions || dimensions.width < 1024 || dimensions.width * 3 !== dimensions.height * 2) {
            errors.push(`${label}: storyboard must be a WebP at least 1024px wide with a 2:3 canvas`);
          }
          if (!readFileSync(join(dir, "image-prompt.txt"), "utf8").trim()) errors.push(`${label}: illustration prompt missing`);
          const review: unknown = JSON.parse(readFileSync(join(dir, "review.json"), "utf8"));
          errors.push(...validateReview(review, bytes, readFileSync(image)).map((e) => `${label}: ${e}`));
        } catch (error) { errors.push(`${label}: ${String(error)}`); }
      }
    }
  } catch (error) { errors.push(`children corpus: ${String(error)}`); }
  return errors;
}
