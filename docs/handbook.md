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

### Handoff — 2026-09-02 02:20 (read before touching anything)

The last coordinator session stopped mid-flight. The working tree holds three kinds of changes;
handle them in this order:

**A. Verified by the coordinator, ready to commit as-is** (typecheck + 59 tests green,
`data:validate` green):
- `scripts/fetch-wikisource.ts` + new `scripts/fetch-wikisource.test.ts` — re-wraps word-per-line
  imports → `fix(scripts): re-wrap word-per-line Wikisource imports into readable lines`
- `data/books-src/allamaprabhu-vachanagalu/` — 107 vachanas in 4 chapters, replaces the committed
  76-vachana draft (two agents collided on this folder; the 4-chapter version wins) →
  `data(corpus): replace Allama selection with 107 vachanas in 4 thematic chapters`
- `data/books-src/panje-koti-chennaya/` — Panje Mangesha Rao (d. 1937), ಕೋಟಿ ಚೆನ್ನಯ, 1924 first
  edition, prose, 351 blocks; paragraph-final commas are faithful to the print → `data(corpus): add
  Panje Mangesha Rao's Koti Chennaya (1924 first edition, prose, 351 blocks)`

**B. Produced by agents, NOT yet reviewed — verify before committing** (read ≥10 blocks each,
check ankita/author, run the junk scan `rg -n '[A-Za-z]{2,}|\*|_|\?\)|<|>|=' <folder>/0*.txt`):
- `data/books-src/sarvajna-tripadigalu/` — agent finished: 7 chapters, 284 tripadis, every block
  ends in ಸರ್ವಜ್ಞ; 19th-century interpolations (railway/telegraph sections) omitted. Same agent made
  the final small edits to `akkamahadevi-vachanagalu/` (75 vachanas; one misfiled Allama page
  dropped), `basavanna-vachanagalu/book.json`, and the one-line `scripts/lib/wikisource.ts`
  change (`\` → `।`). All reported green; still needs the coordinator's read-through.
- `data/books-src/sharanara-vachanagalu/` — agent finished, but Wikisource only had enough
  proofread pages for ONE chapter: ಚೆನ್ನಬಸವಣ್ಣ, 29 vachanas (ankita ಕೂಡಲಚೆನ್ನಸಂಗಮದೇವ verified).
  Dasimayya, Siddharama (5 pages), Machideva, Chowdayya, Lakkamma, Appanna, Satyakka, Muktayakka
  have no usable corpus there. **Decision needed**: rename to `chennabasavanna-vachanagalu`
  (author ಚೆನ್ನಬಸವಣ್ಣ, authorDied 1196) rather than ship a one-author "anthology". Bug it found:
  `fixConversionGlitches` lacks `ಸ್ಧ → ಸ್ಥ`.
- `scripts/lib/daily.ts`, `daily.test.ts`, new `dailyFilters.ts`/`.test.ts` — word-of-the-day
  selection rewrite, second iteration in progress. First iteration removed junk but produced ~95%
  verbs; second was asked for a 60/20/20 noun/adj/verb mix plus a compound-family commonness
  score. Judge the result by reading the 366 headwords in `public/data/dict/daily.json` — a
  native speaker should recognise ≥90% as ordinary words. Do not commit if it fails that test.
- `public/data/books/*.json` + `manifest.json` — generated; regenerate with `npm run data:books`
  after A and B are settled, then commit together with the sources.

**C. Owner's own change** — `.gitignore` (adds `AGENTS.md`, `CLAUDE.md`). Leave it to the owner.

**Known pipeline bugs reported by curation agents, not yet fixed** (good first task for a
worker; add tests in `scripts/lib/wikisource.test.ts`):
1. `numbered` mode / `dropNonVerse` leaves modern ತಾತ್ಪರ್ಯ / ಪದವಿಭಾಗ table-cell text after
   `cleanWikitext` strips the table markup — copyrighted commentary can leak into verse blocks.
   Safer: extract only `<poem>` bodies when present.
2. `joinNumberedVerses` glues an unnumbered ಸೂಚನೆ (ends `||`, no digit) onto verse 1.
3. `dropNonVerse` only drops `##` headings and ರಾಗ/ತಾಳ/ರಚನೆ lines; tatvapada pages carry modern
   commentary and nav text that survive in `blocks` mode.
4. No cleanup for stray Latin inside Kannada (`ಮತ್ತs`), em-dash line-wraps (`ತಾ—` / `ನಾಗಿ`), or
   `(gloss=…)` notes (the `=` fails validation).

**Wanted but no clean source on kn.wikisource** (do not retry without a new source): Raghavanka
ಹರಿಶ್ಚಂದ್ರ ಕಾವ್ಯ, Ratnakaravarni ಭರತೇಶ ವೈಭವ, Chamarasa ಪ್ರಭುಲಿಂಗಲೀಲೆ, Kanakadasa kirtanes (pages
have lost line breaks), B.M. Sri ಇಂಗ್ಲಿಷ್ ಗೀತಗಳು (scattered, attribution issues).

**Lesson from this session**: never assign two agents the same book slug or let a worker "also"
write a folder outside its assignment — the Allama folder was written twice. One slug, one agent.

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
