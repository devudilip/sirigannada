# First story release verification

Verified by Codex coordinator, 2026-09-22, integrated with main at f7db1e4.

- Independent review agent read the complete Kannada story and inspected all six illustration panels.
  Its two wording corrections were applied and re-reviewed. Exact hashes are in the story review record.
- TypeScript passed. All 733 tests across 104 files passed.
- Corpus validation passed for 14 classic books, 407 picture books and the new children's corpus.
- Full data pipeline and static production export passed with `npm run build -- --webpack`.
  Webpack was used because this local environment blocked Turbopack's internal port binding.
- Offline shell budget: 1819.2 KB against 2048 KB. Only the children's hub joins the precache list;
  the collection and story use the existing visited-page cache strategy.
- Production export browser checks: children hub → Panchatantra → first story navigation;
  320px layout (document width equals viewport width), six scene sections; 390px More menu link;
  1280px desktop navigation; English interface retaining Kannada story text; dark-mode rendering.
- Six-panel artwork inspected in the earlier full-page mobile reader check. Text/image hashes
  are unchanged after integration. This remains agent review, not a teacher certification.
- No claim of an explicit offline story pack, recorded narration, child user testing, or a new
  end-to-end airplane-mode certification is made by this release.
- Pre-existing workspace changes were preserved. Integration uses a separate current-main worktree.

Original documentation: CC BY-SA 4.0.
