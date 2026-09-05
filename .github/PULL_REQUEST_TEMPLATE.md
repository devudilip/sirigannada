## Linked issue

Closes #<!-- issue number -->. The issue carries the `accepted` label. PRs without an accepted issue are closed and redirected to Discussions (see CONTRIBUTING.md, "How work is accepted").

## What changed and why

<!-- Two or three sentences. Say why, not just what. -->

## Checklist

- [ ] `npm run typecheck` clean
- [ ] `npm test` green
- [ ] `npm run data:validate` green (if corpus, pipeline, or `public/data/` changed)
- [ ] Checked in a browser at a phone width (or tests only, for pure logic)
- [ ] No new npm dependencies
- [ ] No runtime `fetch()` to third-party services; no servers, accounts, ads, or analytics
- [ ] Every user-visible string goes through `src/lib/i18n.ts`; no hardcoded UI text
- [ ] Colours, spacing, and fonts come from `src/styles/tokens.css`; no new hex values in components
- [ ] Files under 250 lines; one React component per file
- [ ] No new text or data entered the corpus, **or** it has a complete `provenance` block and the author died in or before 1965 / the licence is CC0, CC BY, CC BY-SA, or ODbL
- [ ] No code, schema, or curated data copied from another Kannada project
- [ ] Every commit is signed off (`git commit -s`, DCO)
