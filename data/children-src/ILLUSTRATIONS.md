# Illustration recipe

Read alongside `README.md`. Use the imagegen skill and built-in image-generation tool.
Do not substitute emoji, stock photographs, SVG placeholders or images copied from the source book.

## One storyboard, consistent characters

The first release uses ONE image containing six equal square panels in a two-column, three-row
grid. Its portrait ratio is 2:3. Panels run top left to bottom right. The shared reader displays
each panel using CSS background positioning; do not put narrative text into the image.

1. Make a scene table with exactly six rows: action, visible characters, setting, emotion,
   camera/viewpoint, and what the illustration must NOT show. Match it to the approved draft.
2. Write a character bible of 2–4 identifying traits per recurring character: species, colour,
   proportions, distinctive features, clothing if genuinely relevant. Add a relative size rule.
3. Write a setting bible: region/environment, season/light, buildings/props. Describe recurring
   props precisely. A well must not become a lake; reflection must not become a second animal.
4. Use the template below. Paste the character and setting descriptions without changing wording
   between iterations. Request all six panels together to improve consistency.
5. Generate one storyboard using the built-in tool. Save the exact prompt to `image-prompt.txt`.
   Do not silently switch to a paid API or another model if the tool fails.
6. Open the resulting image and inspect EVERY panel at readable size. Read its paired paragraph.
   Check identity, anatomy, extra/missing characters, objects, action, sequence and emotional tone.
7. If a panel fails, use imagegen editing with the actual image as reference. Ask for the specific
   correction, and explicitly preserve the other five panels, grid, identities and style. Inspect
   again. If an edit changes other panels, review those too. Never approve based on the prompt alone.
8. Keep the original generated output as a working reference. Use the final reviewed image only.
9. Convert to WebP at quality 82 with the already installed `sharp` library. This is file-format
   optimization, not a creative redraw. Retain 1024×1536 dimensions if the source has them. The
   published file must be at most 650,000 bytes. Inspect the compressed version, especially faces.
10. Record the tool actually used, original/edited prompt chain where applicable, alt descriptions,
    AI disclosure, file dimensions and final review. A new generation invalidates previous review.

## Copyable generation template

Use case: illustration-story.
Asset: ONE children's picture-book storyboard with six equal square panels.
Layout: exactly two columns and three rows, edge-to-edge, no gutters or panel borders,
portrait 2:3. No text, numbers, captions, speech bubbles, logos or watermark.
Audience: Kannada readers aged 8–12.
Style: expressive watercolor and soft gouache on textured cream paper; warm Indian woodland,
muted leaf green, ochre earth, golden light. Original art, no named-artist imitation.
Character continuity: [repeat exact character bible here].
Setting/prop continuity: [repeat exact setting bible here].
Top left: [scene 1 action, characters, emotion, viewpoint].
Top right: [scene 2].
Middle left: [scene 3].
Middle right: [scene 4].
Bottom left: [scene 5, including any optical/physical constraints].
Bottom right: [scene 6].
Constraints: [story-specific exclusions]. No graphic injury or death, extra limbs,
modern objects, invented costumes, or unsupported plot events. Preserve all identities.

## Exact first-story reference

Read `panchatantra/chatura-mola/image-prompt.txt` for the complete successful prompt.
Its distinctive constraints are the sandy-brown long-eared hare, golden lion with chestnut mane,
old circular stone well, clear water reflection, and no image of the fatal ending.
Do not reuse these characters or story beats in unrelated tales just because the template does.

## Optimization command

Replace the two explicit paths below with the actual generated file and assigned story asset path.
Create the destination folder first. Never overwrite another story's asset.

```sh
node -e 'require("sharp")("/absolute/path/to/generated.png").webp({quality:82}).toFile("public/stories/COLLECTION/STORY/storyboard.webp").then(console.log)'
```

If the grid isn't even, use imagegen to correct it rather than hide a broken layout in CSS.
If a future story needs more than six scenes or independent art files, agree and implement a new
data contract and reader first. Do not force a longer story into this format by silently omitting
essential events. Prefer selecting a suitable shorter tale for the next task.

Original documentation: CC BY-SA 4.0.
