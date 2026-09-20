# Final review before GitHub

Required by the owner. A coordinator or separate agent must review both text and actual images
and explicitly confirm before pushing. A tool pass or a confident author is not enough.
Agent review must be labelled as agent review, never as human teacher or scholar certification.

## Text pass

- Read the complete story, not just a sample or summary.
- Verify source evidence, allowed licence, exact edition and adaptation attribution.
- Check character names, chronology, motivations, cause and effect and the ending.
- Read Kannada aloud mentally: natural wording, short sentences, non-circular vocabulary meanings.
- Check reflection versus shadow, echo versus a second voice, and other teaching facts.
- Verify the pause question appears before its answer and the discussion prompts suit the story.
- Check for em dashes, triple-dash prose separators, OCR debris and misleading claims.
- Confirm parent content notes and the record of omissions/changes.

## Illustration pass

- Open the final optimized WebP. Inspect all six panels, paired with the text and alt descriptions.
- Check character identity/scale, anatomy, setting, repeated objects, and causal action.
- Check reflections and other physically meaningful details, rather than accepting a pretty image.
- No visual text artifacts, graphic violence, unintended stereotypes, copied source illustrations
  or an image that changes the ending.
- Inspect responsive panel crops in the actual app. Check layout, dark mode and readability.

## Record the decision

Report blockers first. Correct them and re-review the changed material before approval.
After approval, create `review.json` using `StoryReview` in `src/features/children/types.ts`.
Include `status: approved`, reviewer identity, ISO date, concrete `text` and `illustrations`
observations, and honest `limitations`. Record the final file hashes using this read-only command:

```sh
shasum -a 256 data/children-src/COLLECTION/STORY/story.json public/stories/COLLECTION/STORY/storyboard.webp
```

Copy those exact hashes into `storySha256` and `imageSha256`. Never use placeholder hashes.
If text, provenance, alt text or art changes later, the validation gate fails until someone
re-reviews the changed files and updates the approval. Do not regenerate hashes to suppress a
failure without actually reviewing. The check binds evidence to files; it cannot prove a human
or agent really performed an honest review, so that remains the coordinator's responsibility.

Run content checks, typecheck, tests and build. Open the exported app and verify all three levels
of navigation plus the story's source/parent details. Only then commit and push a feature branch.
The review record is necessary but does not replace browser QA or normal code review.

Original documentation: CC BY-SA 4.0.
