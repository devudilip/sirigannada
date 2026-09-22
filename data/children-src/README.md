# Children's illustrated stories: production playbook

This is the durable, tracked handoff for adding one story at a time. Read it before starting.
Owner direction, 2026-09-20: add a children's menu, Panchatantra as the first collection, and
Chatura Mola as the first story. A coordinator or review agent must read the text AND inspect
the illustrations and confirm approval before any GitHub push. The owner need not approve
each story again when the work stays within this agreed format.

## Product and scope

The journey is `/children` → `/children/panchatantra` → `/children/panchatantra/chatura-mola`.
Desktop has a ಮಕ್ಕಳ ಕಥೆಗಳು menu; phones reach it from the home shelf and More, preserving the
existing five-tab bar. The hub shows one card per section in `collections.json` order:
ಪಂಚತಂತ್ರ ಕಥೆಗಳು (`kind: stories`, this folder), ಕೇಳಿ ಓದಿ (`kind: picturebooks`, `narrated: true`,
the StoryWeaver books with audio) and ಚಿತ್ರಪುಸ್ತಕಗಳು (`narrated: false`). Picture-book sections
have no folder here; they are views of `public/data/picturebooks/manifest.json` with the same
level chips. Owner direction, 2026-09-22. Use the first story as the working example. The target is Kannada readers around ages 8–12,
not toddlers. Age suitability is an editorial judgement until tested with real children.
Build one complete story, verify it, then start another. Do not bulk-generate a collection.

Each story has six short scenes, one coherent illustration per scene, three to five useful word
meanings, one pause for prediction or reflection, and two discussion questions. Keep the reading pleasure
first. No forced quizzes, scores, invented audio buttons, accounts, or automatic translation.
The interface follows the user's locale; the story itself stays explicitly labelled Kannada.

## Files and responsibilities

| File | Purpose |
| --- | --- |
| `collections.json` | Hub sections in display order: slug, `kind`, bilingual name and description; picture-book sections add `narrated` |
| `<collection>/<story>/story.json` | Canonical text, metadata, source, scene order, image path |
| `<collection>/<story>/image-prompt.txt` | Exact final generation prompt and tool used |
| `<collection>/<story>/review.json` | Final reviewer decision and exact content/image hashes |
| `public/stories/<collection>/<story>/storyboard.webp` | Optimized six-panel illustration |
| `src/features/children/types.ts` | Data contract |
| `src/features/children/lib/catalog.ts` | Automatic story discovery at build time |
| `scripts/lib/children.ts` | Publication checks |

JSON corpus text is content, not interface copy. New interface labels belong in
`src/lib/i18n.children.ts`, exported through `i18n.ts`. Do not hardcode new labels in JSX.
Do not copy pilot HTML into the app. Reuse the shared reader and shelf components.

## Exact sequence for a small model

1. Read `docs/handbook.md`, project/data-license/UI/git rules, this file, `ILLUSTRATIONS.md`,
   `REVIEW.md`, the types and the complete first story. Check git status. Preserve unrelated edits.
2. State the one story and folder you will work on. Use a feature branch, never push main.
3. Establish the source BEFORE writing. Record URL, edition, author/translator, death year where
   relevant, explicit licence, access date, and why reuse is permitted. Public access is not a licence.
4. Map the whole tale: characters, setting, problem, key decisions, cause and effect, ending.
   Identify its frame story. State what will be omitted. Do not confuse a chapter with one tale.
5. Write fresh Kannada prose from the cleared traditional plot. Do not translate a modern protected
   rendering, copy its dialogue, or ask AI to disguise it. For original open stories, record the
   creator's actual release. Never invent evidence or dates to satisfy validation.
6. Create six scenes. Aim for a few short paragraphs per scene, direct speech where useful, and
   familiar Kannada. Keep names and tenses consistent. Preserve the meaningful consequences.
7. Remove em dashes and triple-dash separators from narrative text. Write natural sentences instead.
   Example: `ಜಿಂಕೆ, ಹಂದಿ, ಮೊಲ ಎಲ್ಲವೂ ಭಯದಿಂದ ಬದುಕುತ್ತಿದ್ದವು.` Do not merely substitute three hyphens.
   Ordinary hyphens in slugs and numeric age-range punctuation are allowed.
8. Add five non-circular word definitions, one prediction or reflection question, two open discussion questions,
   image alt text for each scene, a truthful parent content note, and adaptation changes.
9. Review the draft yourself for source fidelity, clarity, natural Kannada, and age suitability.
   Settle the text before generating art. This self-check does not replace the final review.
10. Follow `ILLUSTRATIONS.md` exactly. Inspect the actual output. Do not assume prompt compliance.
11. Create `<collection>/<slug>/story.json` by copying the first story's STRUCTURE only. Replace
    every text, source, identifier, credit and path that differs. Never inherit its review approval.
12. Use panels 0,1,2,3,4,5 in reading order. Stable scene IDs are `scene-1` through `scene-6`.
    Set `order` to the intended collection position, such as 2 for the next Panchatantra story.
13. Put the WebP and exact prompt in the paths listed above. No route component changes are needed
    for another story: routes, collection lists, metadata and sitemap discover folders automatically.
14. Ask the coordinator or a separate agent to perform `REVIEW.md`. Supply exact local paths and
    the source references. Fix all blockers; show changed text/art to the reviewer again.
15. Only after the reviewer actually confirms approval, record `review.json` with exact hashes.
    Do not write approval in advance. Tests are not editorial review.
16. Run `npm run data:children`, `npm run typecheck`, `npm test`, `npm run data:validate`,
    `npm run build`, and `npm run check:bundle`. If `tsx` IPC fails in the sandbox, use
    `node --import tsx scripts/validate-corpus.ts` or the approved execution environment.
17. Serve the static `out` directory without SPA fallback. Open the menu, collection, story and
    direct URL; inspect all six scenes at 320, 390 and desktop widths. Check Kannada and English
    UI, dark mode, keyboard navigation, large text, source link and parent-note disclosure.
18. Check offline after a full online visit. The existing service worker caches visited pages,
    local art and scripts; this is NOT a guaranteed downloadable story pack. Do not advertise one.
19. Inspect `git diff`. Bump shell cache names together in `public/sw.js` and
    `src/lib/cacheNames.ts` when publishing changed story art/pages. Run gates again after changes.
20. Stage only intended files, commit with sign-off on the feature branch, push the branch and
    open a PR. Follow repository merge policy. Never push an unreviewed story or directly to main.

## Current first story

`panchatantra/chatura-mola` is an original traditional-tale retelling with Ryder's 1925 version
as a plot reference. It is not presented as Durgasimha's particular recension. The 2014
Aithal rendering at archive.org/details/dli.language.0489 was NOT used as adaptation text.
The traditional fatal ending is briefly stated and disclosed to parents, but not illustrated.

## Future work, after the format proves useful

Add one reviewed Panchatantra tale at a time. Later: reviewed human narration with open release,
tappable inline vocabulary, saved reading progress, and an explicit offline pack. Do not claim
these features exist in this first release. Test comprehension and voluntary return with readers.

## Copyable worker assignment

> Add ONE story: [title], collection [slug], folder [path]. Read the children's playbook and
> first-story example. First verify [source/edition/licence]. Produce six original Kannada scenes,
> vocabulary, questions, alt text, provenance, exact image prompt and reviewed storyboard candidate.
> No em dashes or triple-dash separators in prose. Preserve the source's causal logic; disclose
> adaptation changes. Write only inside the assigned story and asset folders. Do not mark yourself
> approved, edit shared routes, commit, or push. Report files, source evidence, deviations and doubts.

Original documentation: CC BY-SA 4.0.
