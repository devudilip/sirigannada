# Sirigannada — agent handbook

Read this first. It is the single document that lets a new agent (any model, any tool, no prior chat
history) pick up this project and do useful work without breaking anything. Everything else in the
repo is referenced from here.

## 1. Sixty-second brief

- **What**: ಸಿರಿಗನ್ನಡ / Sirigannada — one reliable, open, offline-capable home for Kannada: a fast
  dictionary (Alar, 156k entries), a page-turning reader for public-domain classics, and later tools.
- **For whom**: students, teachers, researchers, and ordinary Kannada readers on cheap Android phones.
- **How**: Next.js static export + hand-written service worker. No backend. All data is pre-built JSON.
- **Legal**: code AGPL-3.0-or-later; every text has a `provenance` block; only public domain
  (author died ≤ 1965), CC0/CC BY/CC BY-SA, or ODbL (Alar) content. **This is non-negotiable.**
- **Owner**: Devu Dilip <devu.dilip@gmail.com>. Commit identity is set repo-locally; never change it.
- **Rules that bind you**: `.cursor/rules/project.mdc`, `data-license.mdc`, `ui.mdc`, `git.mdc`.

## 2. Background — why this exists

Kannada has a rich thousand-year literary record and ~45 million speakers, yet its digital
presence is fragmented and poor: dictionaries scattered across dead or ad-ridden sites, classic
texts locked in legacy ASCII fonts (Nudi/Baraha) or scanned PDFs, no offline access, and interfaces
designed for desktops in 2005. Earlier community efforts (the owner contributed to one for years)
later became closed or copyright-claimed. The lesson: **licensing and provenance decide whether a
project survives.** Sirigannada is built clean-room, from scratch, so that nobody can ever claim it.

## 3. Mission and non-goals

**Mission**: be the place a Kannada learner or scholar opens first — and can keep using offline.

**Non-goals** (do not build these): user accounts, servers, ads, analytics that phone home,
machine-translated content, scraped news, anything from an author who died after 1965.

## 4. The moat — why this is hard to copy and worth doing

1. **Legal cleanliness as a product feature.** Every book carries verifiable provenance, enforced
   by `scripts/validate-corpus.ts` at build time. Competitors with mixed-license corpora cannot
   claim this and cannot be forked safely; we can.
2. **AGPL code + CC BY-SA content.** Anyone may reuse it; anyone who does must stay open. Closing
   it is legally impossible, which is the exact failure mode of previous efforts.
3. **Curated, not scraped.** Books are chosen and checked by Kannada judgement (correct ankitas,
   metre, spelling, no OCR debris), not bulk-imported. Quality is the differentiator on a shelf
   where most digital Kannada text is garbage.
4. **Offline-first on low-end phones.** Sharded dictionary data, cached books, installable PWA.
   Most Kannada resources assume a fast connection and a large screen.
5. **A reading experience people enjoy** — real pagination, page-turn, paper themes, tap-to-lookup.
6. **Small-model-friendly codebase.** Strict structure and rules mean cheap models can extend the
   project safely, so the cost of adding content and features keeps falling.

## 5. Legal constitution (summary — full text in `.cursor/rules/data-license.mdc`)

| Allowed | Condition |
|---|---|
| Public domain | Author died in or before **1965** (India: life + 60). Record death year. |
| CC0 / CC BY / CC BY-SA | Record exact license and source URL. |
| ODbL | Alar dictionary only. Credit V. Krishna. |

Never: post-1965 authors (Kuvempu, Bendre, DVG, Karanth, Masti are all still copyrighted), text
retyped from a modern printed edition, modern editors' introductions/notes/glossaries, scraped
websites, news. **Never copy code or curated data from other Kannada projects** — ideas yes,
implementations no.

## 6. Architecture map

```
src/app/                routes only; thin server components importing from features
src/features/<name>/    dictionary · reader · library · home  (components/, lib/, types.ts)
src/components/ui/      design-system primitives   src/components/shell/  nav + app shell
src/lib/                types.ts · i18n.ts · storage.ts · kannada.ts (script utilities)
src/styles/             tokens.css (all colours/spacing/fonts) · globals.css (Tailwind theme map)
scripts/                data pipeline (tsx): build-dictionary, build-books, validate-corpus, fetch-wikisource
data/books-src/<slug>/  curated book sources: book.json + sources.txt + NN-chapter.txt  (committed)
data/raw/               downloaded Alar yaml etc. (git-ignored)
public/data/dict/       generated dictionary shards (git-ignored, ~57 MB, rebuilt each deploy)
public/data/books/      generated book JSON + manifest.json (committed — the corpus is the product)
public/sw.js            hand-written service worker; bump cache version names when data changes
docs/                   this handbook · brand.md · book-format.md · data-pipeline.md
```

Key contracts: `src/lib/types.ts` (DictEntry, Book, Provenance…), `docs/book-format.md`
(book folder format), `src/lib/i18n.ts` (every UI string, Kannada default + English).

Hard coding rules: files < 250 lines, one component per file, TypeScript strict with no `any`,
no new npm dependencies without checking `package.json`, no runtime `fetch()` to third parties,
colours/spacing only from tokens, UI text only through i18n, Kannada always Unicode.

## 7. Current state (2026-09-02)

Done: branding + logo, design tokens, bilingual shell, PWA (manifest, icons, service worker,
install button), dictionary pipeline and search UI (exact → prefix → phonetic; English reverse
index; Latin transliteration; word of the day), reader (measurement-based pagination, 3D page turn,
spread mode on wide screens, font/paper settings, chapters, bookmarks, progress, tap-to-lookup).

Corpus on the shelf: Basavanna, Akka Mahadevi, Allama Prabhu (vachanas); Kumaravyasa Bharata
Adiparva sandhis 1–5; Purandaradasa kirtanes; Kanakadasa Haribhaktisara. In progress or planned:
Sarvajna tripadis, a Sharana anthology, Shishunala Sharif, Jagannatha Dasa, Lakshmisha,
Raghavanka, one Navodaya PD work (B.M. Sri / Panje / Muddana).

Next milestones: finish the first shelf → full production build → tag v0.1.0 → deploy to a static
host → then grammar/tools, proverb collection, Old-Kannada glossary, audio (only CC sources).

## 8. How to work

### Session start (every time)
1. Read `.cursor/rules/*.mdc`, then this file's sections 5–6.
2. `git status` and `git log --oneline | head -20` to see where the last session stopped.
3. `npm run typecheck && npm test` — must be green before you start.
4. If the task touches data: `npm run data:validate`.

### One unit of work
Pick one small, complete change (a component that renders, a script that runs, a book that
validates). Read the feature's `types.ts` and one neighbouring file first; copy its shape. Do not
refactor unrelated code. Finish with typecheck + tests + validate, then commit with a
Conventional Commit message (`feat|fix|data|style|docs|chore|refactor|test(scope): summary`).

### Verification checklist before any commit
- `npm run typecheck` clean · `npm test` green · `npm run data:validate` green (if data changed).
- Every user-visible string went through `i18n.ts`; no hex colours in components.
- New book: read at least 10 blocks yourself; ankita/metre/author match; no `*`, `_`, Latin
  letters, `<tags>`, `(variant?)` notes, wiki markup; `provenance` complete and true.
- Commit message says *why* when it isn't obvious.

### Sandbox notes
`tsx` opens an IPC pipe under `$TMPDIR`; in a sandbox run with `TMPDIR=/tmp` or elevated
permissions. Wikisource fetches need network access. Never commit `node_modules`, `.next`, `out`,
`data/raw`, `public/data/dict`.

### Coordination model (many agents)
One **coordinator** (stronger model) plans, launches workers, reviews their output, and commits.
**Workers** (cheaper model, e.g. Grok) do curation, pipeline fixes, and small features. Worker
contract: write only inside your assigned folder(s); do not edit shared scripts, `src/`, or docs
unless that *is* the task; never `git add`/`commit`; report precisely (files, counts, hand-fixes,
bugs found, doubts). The coordinator never commits worker output unread.

## 9. Playbooks

**Add a book.** Confirm death year ≤ 1965. Survey pages:
`tsx scripts/fetch-wikisource.ts --links "<index>"` / `--dump "<index>" <dir>`. Write
`data/books-src/<slug>/sources.txt` (see an existing one), regenerate with `--sources`, review
every chapter, write `book.json` with full provenance, `npm run data:books`, commit
`data(corpus): add <title>`. Bump `DATA_CACHE` in `public/sw.js` when shipping.

**Add a UI feature.** Put types in `features/<name>/types.ts`, logic in `lib/`, one component per
file in `components/`, strings in `i18n.ts`, tokens in `tokens.css`. Wire the route in `src/app/`
last. Test the pure logic with Vitest (`*.test.ts`).

**Fix the pipeline.** Change `scripts/lib/*.ts`, add a test in the sibling `*.test.ts`, rebuild
(`npm run data`), diff a sample of the output, commit `fix(scripts): …`.

## 10. Known pitfalls (learned the hard way)

- Satori / `ImageResponse` does not shape Kannada conjuncts (ನ್ನ breaks). Render OG images with a
  real browser (`public/og.png` is pre-rendered).
- `serve -s` rewrites all routes to `index.html`, which hides offline-caching bugs; test the export
  with `npx serve out` (no `-s`).
- `ResizeObserver` may not fire on first paint in embedded browsers; the reader measures
  synchronously in `useLayoutEffect` as well.
- Tailwind v4 owns `--color-*`; our tokens are `--sg-*` and mapped in `globals.css` `@theme inline`.
- Wikisource vachana imports break lines at dropped commas and leak editor notes like `(ಹೊದಿಕೆ?)`;
  `cleanWikitext` strips them, but always read the result.
- Legacy-font imports lose ಷ್ಠ (`ಷ*`) and produce `್ರ್` sequences; see `fixConversionGlitches`.

## 11. Definition of done for v0.1.0

Six-plus books validated and built; dictionary search correct on real data (test ಮನೆ, ಶಾಲೆ vs ಸಾಲೆ,
"house", "mane"); `npm run build` succeeds; offline: home, dictionary, one book work with the
network off; Lighthouse PWA installable; README and this handbook current; tag `v0.1.0`.
