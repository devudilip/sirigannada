# Contributing to Sirigannada (ಸಿರಿಗನ್ನಡ)

Thank you for helping make Kannada words, literature, and learning accessible, offline-capable, and legally clean.

This file is the human contributor contract: what we accept, how work gets accepted, and how you keep your copyright. **Pull requests are welcome, but only against an accepted issue.** Work on a **feature branch**, verify it works, then open a PR into `main`. Never push to `main`. Every commit needs a DCO sign-off (`git commit -s`). There is no CLA.

## What this project is, in five lines

1. One reliable, open, offline-capable home for Kannada: dictionary, public-domain and openly licensed literature, proverbs, learning tools.
2. **Legally clean by construction.** Every text has verifiable provenance, and the build fails without it. That is the product, not paperwork.
3. **Copyleft.** Code is AGPL, original content is CC BY-SA. Anyone may reuse it; nobody can close it.
4. **Curated, not scraped.** Books are chosen and read by people who know Kannada. Quality beats volume.
5. **Works on a cheap Android phone with no network.** Static export, sharded data, no backend.

## What we will not build

Do not propose or submit these; the answer is a fixed no.

- User accounts, logins, or servers of any kind (including "opaque JSON" sync endpoints).
- Ads or unreviewed third-party tracking. The owner-approved Google Analytics 4
  integration is limited to standard site analytics, disables Google Signals and
  advertising-personalization signals, and must not send user-entered or locally
  saved content. Changes to analytics require an accepted issue and maintainer review.
- Machine-translated or AI-generated Kannada content presented as reference material.
- News, unlicensed website content, or copyrighted text and modern editorial material without an accepted open license. Living or recent authors are welcome when the rights holder has released the specific work under an accepted license below.
- New npm dependencies where thirty lines of code would do.
- Code, schemas, or curated data copied from other Kannada projects.

## How work is accepted

Anyone can generate a large pull request in an afternoon. What is scarce here is judgement about scope, licence, and Kannada quality, so the process is deliberately **discuss first, code second**.

1. **Propose in Discussions.** New features and ideas go to [Discussions › Ideas](https://github.com/devudilip/sirigannada/discussions/categories/ideas). New books use the **New book** issue template because they need a licence check. Bugs use the **Bug** template.
2. **Wait for `accepted`.** A maintainer weighs the proposal against the mission and the legal constitution below. Accepted work becomes an issue with the `accepted` label. `needs-discussion` means not yet; `legal-review` means a source or death year must be verified first; `blocked-source` means no legally clean source exists, so do not retry it.
3. **Claim it.** Comment `/assign` on an `accepted` issue. A bot assigns you if nobody else has it. One task, one person.
4. **Branch, build, verify, PR.** Follow the sections below. The PR template checklist is the review checklist; fill it in honestly.
5. **Review.** Every PR needs a maintainer review and green CI (typecheck, tests, corpus validation, build, DCO). CI on a first-time contributor's PR waits for a maintainer to approve the run; that is a GitHub safety default, not a judgement on your work.
6. **Preview.** Cloudflare does not build previews for PRs from forks. Once a maintainer has read your diff they add the `preview` label, a bot mirrors your commit to a `preview/pr-N` branch, and a preview URL appears as a comment on the PR. It updates on every push you make. Test there on a phone before asking for merge.

Unsolicited PRs, and PRs whose scope grew past the accepted issue, are closed with a pointer back to step 1. Small, complete changes merge fastest.

## License of your work

- **Code** you submit is licensed under [AGPL-3.0-or-later](LICENSE), same as the rest of the repo.
- **Original documentation and original content** you submit is CC BY-SA 4.0 unless a file says otherwise.
- **Third-party texts and dictionary data** keep the license recorded in their `provenance` block. Do not relicense them.

## Legal constitution (non-negotiable)

Only these may enter the corpus:

| Allowed | Condition |
|---|---|
| Public domain | Verify the applicable copyright term and source edition. For the ordinary Indian life-plus-60 rule, the 2026 cutoff is an author death year of **1965** or earlier; record it. Special cases need separate review. |
| Openly licensed content | CC0, CC BY, or CC BY-SA only, including works by living authors or authors who died after 1965. Verify the rights holder's release; record the exact license version and source URL. |
| ODbL | Alar dictionary only. Credit V. Krishna; derived data stays ODbL. |
| Government CC | Only works **explicitly** released under one of the accepted licenses above (for example Dept. of Kannada & Culture). Government publication alone is not permission. |

**Openly available is not openly licensed.** A free download, a public GitHub repository, or a website calling itself "open source" is not sufficient evidence of permission to reuse its books, images, or audio. A code license does not automatically cover accompanying content. CC BY-NC, CC BY-ND, and other licenses outside the list above are not accepted for corpus imports.

Check the rights to each included component: original text, translation, introduction, notes, illustrations, and recordings. A public-domain original does not clear a modern translation or illustration. Modern editions need source review; do not copy protected editorial additions without an accepted license. Preserve required credits and license notices, identify changes, and comply with ShareAlike where applicable. Third-party content keeps its recorded license, not automatically our CC BY-SA license.

Every book needs a complete `provenance` block (`source`, `license`, `author`, plus `licenseNote` / `retrieved` in the source `book.json`). `authorDied` is required by the current validator for public-domain claims, not for openly licensed works; never invent a death year for a living author. Validation checks metadata, not ownership or legal clearance: maintainer source review remains mandatory.

Legal references: [Creative Commons attribution terms](https://creativecommons.org/licenses/by/4.0/) and [Indian copyright terms, including special cases](https://copyright.gov.in/Copyright_Act_1957/chapter_v.html). Uncertain rights or public-domain cases the current schema cannot represent stay in `legal-review` until resolved.

**Clean room:** do not copy code, schemas, or curated data from other Kannada projects. Ideas are fine; implementations here are written fresh.

## Proposing a new book

Open a **New book** issue (use the GitHub template). Fill in provenance **before** anyone starts ingesting text:

- Source URL (Wikisource proofread page, CC release, or other allowed origin)
- License (`public-domain`, `CC0-1.0`, `CC-BY-4.0`, `CC-BY-SA-4.0`)
- Author name
- For public-domain claims: author death year and evidence of the applicable term and source edition; the current validator requires **1965 or earlier**
- For openly licensed works: the rights holder's license statement covering the specific work, including any translation, images, or audio being submitted; no death-year cutoff applies
- Required attribution and a description of any edits or adaptations

A maintainer will check the source, rights evidence, and license compatibility before accepting ingestion. Do not paste large copyrighted excerpts into the issue before clearance.

## Reporting a bug

Use the **Bug** issue template. Include steps, what you expected, what happened, and browser/device (especially if it is an offline / PWA problem).

## Code and corpus patches

```bash
npm install
npm run data        # dictionary + books into public/data
npm run typecheck && npm test
npm run data:validate   # if you touched corpus or pipeline
npm run dev
```

- Conventional Commits: `feat|fix|data|style|docs|chore|refactor|test(scope): …`
- TypeScript strict, files under 250 lines, one React component per file, UI strings via `src/lib/i18n.ts`, colours from design tokens.
- Kannada is always Unicode. Never store Nudi/Baraha ASCII.
- No feature may fetch third-party APIs at runtime; data lives under `public/data/`.
  The reviewed production analytics tag documented above is the sole exception.

Book source layout is documented in [`docs/book-format.md`](docs/book-format.md).

## Branch, verify, PR (never `main`)

`main` is production. Do not push commits onto it.

```bash
git fetch origin
git checkout -b feat/short-slug origin/main
# …implement…
npm run typecheck && npm test
# Exercise the change in the browser (or the closest substitute) until it works.
git commit -s
git push -u origin HEAD
gh pr create --base main
```

A maintainer reviews and merges the PR. Force-push to `main` is never allowed.

## Developer Certificate of Origin (DCO)

There is **no CLA** and **no copyright assignment**. You keep copyright in your contribution.

Every commit must include a DCO sign-off (`git commit -s`), which adds:

```
Signed-off-by: Your Name <you@example.com>
```

That certifies you have the right to submit the work under this project’s licenses (DCO 1.1: you created it, or it is already under an appropriate open license and you may submit it). See [developercertificate.org](https://developercertificate.org/).

If a commit is missing the line, amend locally with `git commit --amend -s` **before** it is pushed, or add a follow-up commit that restates the sign-off — do not rewrite history on shared branches.
