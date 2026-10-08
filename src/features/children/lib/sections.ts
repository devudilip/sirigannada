/**
 * Client-safe pointers into the children's hub. The two picture-book sections are fixed slugs in
 * `data/children-src/collections.json` (validated by scripts/lib/children.ts), so the picture-book
 * reader can send a child back to the section they came from without reading the catalogue.
 */
export const CHILDREN_URL = "/children";
export const NARRATED_SECTION_SLUG = "keli-odi";
export const PICTUREBOOKS_SECTION_SLUG = "picturebooks";

/** The one adults-only story section (16+). It lives in the library, not in ಮಕ್ಕಳ ಕಥೆಗಳು. */
export const ADULT_STORIES_SLUG = "doddavara-kathegalu";
export const LIBRARY_URL = "/library";
export const ADULT_STORIES_URL = `${LIBRARY_URL}/${ADULT_STORIES_SLUG}`;

export function sectionUrl(slug: string): string {
  return slug === ADULT_STORIES_SLUG ? ADULT_STORIES_URL : `${CHILDREN_URL}/${slug}`;
}

/** Where a picture book belongs: ಕೇಳಿ ಓದಿ when it has narration, ಚಿತ್ರಪುಸ್ತಕಗಳು otherwise. */
export function picturebookShelfUrl(hasAudio: boolean): string {
  return sectionUrl(hasAudio ? NARRATED_SECTION_SLUG : PICTUREBOOKS_SECTION_SLUG);
}
