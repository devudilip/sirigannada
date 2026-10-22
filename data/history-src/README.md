# ಕರ್ನಾಟಕ ಇತಿಹಾಸ: books and animated stories (production plan, draft 2026-10-10)

Owner direction, 2026-10-10: a series of Karnataka-history books on Sirigannada, and from the
same material a series of animated videos. Facts only, no assumptions. Every story needs an
introduction, the story, a summary and "did you know" facts. Every story should give goosebumps.
AI images must match the facts (a 7th-century fleet must look like one). Realistic, cinematic
style with effects, not the children's watercolor look. This file is the working plan; it
becomes the playbook once the owner answers the open questions at the end.

## 1. Series (ಸರಣಿ) and the first story in each

| Series slug | ಸರಣಿ | Era | Likely first story (all inscription-backed) |
|---|---|---|---|
| `kadamba` | ಕದಂಬರು | c. 345–540 | ಮಯೂರಶರ್ಮ: the Brahmin student insulted at Kanchi who became a king (Talagunda pillar inscription) |
| `ganga` | ಗಂಗರು | c. 350–1000 | ದುರ್ವಿನೀತ / ಚಾವುಂಡರಾಯ and the raising of Gommateshwara at Shravanabelagola (983) |
| `badami-chalukya` | ಬಾದಾಮಿ ಚಾಲುಕ್ಯರು | 543–757 | **ಇಮ್ಮಡಿ ಪುಲಿಕೇಶಿ** (pilot): Harsha stopped at the Narmada, the fleet at Puri, Hiuen Tsang's account (Aihole inscription 634, Xuanzang c. 641) |
| `rashtrakuta` | ರಾಷ್ಟ್ರಕೂಟರು | 753–982 | ಅಮೋಘವರ್ಷ ನೃಪತುಂಗ: the emperor who wrote ಕವಿರಾಜಮಾರ್ಗ; ಮೂರನೇ ಕೃಷ್ಣ / Kailasa at Ellora |
| `kalyani-chalukya` | ಕಲ್ಯಾಣಿ ಚಾಲುಕ್ಯರು | 973–1189 | ಆರನೇ ವಿಕ್ರಮಾದಿತ್ಯ and Bilhana's ವಿಕ್ರಮಾಂಕದೇವಚರಿತ; the Chalukya-Vikrama era |
| `hoysala` | ಹೊಯ್ಸಳರು | c. 1026–1343 | ವಿಷ್ಣುವರ್ಧನ, ಶಾಂತಲೆ and the Belur temple (1117); ಬಲ್ಲಾಳ II; the fall of ಮೂರನೇ ಬಲ್ಲಾಳ at Madurai |
| `vijayanagara` | ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ | 1336–1646 | ಹಕ್ಕ-ಬುಕ್ಕ (founding), ಕೃಷ್ಣದೇವರಾಯ (Raichur 1520, Paes's eyewitness account), ತಾಳಿಕೋಟೆ 1565 |
| `mysuru` | ಮೈಸೂರು ಸಾಮ್ರಾಜ್ಯ | 1399–1947 | ರಾಜ ಒಡೆಯರ್ takes Srirangapatna (1610); ಹೈದರ್, ಟಿಪ್ಪು and the four Anglo-Mysore wars; ನಾಲ್ವಡಿ ಕೃಷ್ಣರಾಜ ಒಡೆಯರ್ |
| later | ಕೆಳದಿ ನಾಯಕರು, ಚಿತ್ರದುರ್ಗ ನಾಯಕರು (ಒನಕೆ ಓಬವ್ವ), ಕಿತ್ತೂರು ಚೆನ್ನಮ್ಮ, ಸಂಗೊಳ್ಳಿ ರಾಯಣ್ಣ, ಏಕೀಕರಣ | | |

Note: the owner's list says ಕಲ್ಯಾಣಿ ಚಾಲುಕ್ಯರು but ಇಮ್ಮಡಿ ಪುಲಿಕೇಶಿ is a **Badami** Chalukya, so the
series list needs both Chalukya houses. Each series also carries "ಇತರ ಮುಖ್ಯ ವ್ಯಕ್ತಿಗಳು" (poets,
queens, generals, saints: ಪಂಪ, ರನ್ನ, ಅತ್ತಿಮಬ್ಬೆ, ಶಾಂತಲೆ, ಬಸವಣ್ಣ, ಪುರಂದರದಾಸ, ವಿದ್ಯಾರಣ್ಯ, ...) as
their own stories, so a person is never squeezed into a king's story.

## 2. Facts only: the evidence rule

Nothing goes into a story that is not in `facts.json` with a source. Three evidence tiers, and
the tier is shown to the reader:

| tier | Kannada label | Meaning | Example |
|---|---|---|---|
| `inscription` | ಶಾಸನ / ಸಮಕಾಲೀನ ದಾಖಲೆ | An inscription, coin, contemporary chronicle or eyewitness | Aihole prashasti; Xuanzang; Domingo Paes; Tipu's own letters |
| `scholarship` | ಇತಿಹಾಸಕಾರರ ನಿರ್ಣಯ | Accepted conclusion of historians from the primary evidence | Pulakeshin's "Puri" = the fort near Goa/Elephanta (identification debated: say so) |
| `legend` | ಐತಿಹ್ಯ | Traditional story with no contemporary evidence | Sala killing the tiger; Vidyaranya and the hare chasing the hounds |

Rules: a `legend` may be told, but always introduced as ಐತಿಹ್ಯ and never illustrated as if it
were a record. Disputed points are stated as disputed (the Ajanta "Persian embassy" painting,
the year of Harsha's defeat). No invented dialogue is presented as quotation; invented dialogue
is allowed in the screenplay only where the facts sheet allows it and it is marked `dramatised`.
No dates, numbers or names from memory: every fact needs a URL or a page reference.

Primary sources that are public domain and already usable: Epigraphia Indica / Epigraphia
Carnatica (Rice, d. 1927), Fleet's *Dynasties of the Kanarese Districts* (1896), Beal's
*Si-yu-ki* (Xuanzang, 1884), Sewell's *A Forgotten Empire* (1900, has Paes and Nuniz), Kirkpatrick's
*Select Letters of Tippoo Sultan* (1811), Aluru Venkata Rao's ಕರ್ನಾಟಕ ಗತವೈಭವ (already in the
library). Modern works (Nilakanta Sastri, Kamath, Settar) are cited as references, never copied.

## 3. The shape of one story (both versions share it)

1. ಪೀಠಿಕೆ (introduction): where, when, who; one map image; what the reader will feel.
2. ಕಥೆ: 8 to 12 scenes. Each scene has one image, 2 to 5 paragraphs, and the facts it rests on.
3. ಸಾರಾಂಶ (summary): what happened and why it mattered, in ten lines.
4. ನಿಮಗೆ ಗೊತ್ತೇ? (little-known facts): 5 to 8, each with its source and tier.
5. ಆಧಾರಗಳು (sources): the primary evidence, with links, and where to see it today (the Aihole
   temple, Badami caves, the inscription stone).
6. ಇದು ಕಥೆ, ಇದು ಇತಿಹಾಸ (what is dramatised): plain list of every dramatised line or legend.

"Goosebumps" comes from the true turning point, not from invention: Harsha's army of elephants
turned back at the Narmada; the Chalukya fleet appearing before Puri; Krishnadevaraya walking
into the Raichur fort; Obavva at the Chitradurga gate. Each story is built around one such moment.

## 4. One source, two outputs

```
data/history-src/
  collections.json                 series in display order
  <series>/<story>/
    facts.json                     every fact with source, tier, quote/page
    story.json                     the BOOK: sections above, scene text, image paths, provenance
    screenplay.json                the VIDEO: acts, shots, dialogue, narration, cues
    bible/
      characters.json              locked description per character, reference image path
      settings.json                locked description per location/prop
      style.md                     era visual guide: dress, arms, ships, architecture, emblems
    prompts/
      <shot-id>.txt                exact Codex prompt used for each locked image
    review.json                    reviewer decision + hashes (same pattern as children's stories)
public/history/<series>/<story>/
    scene-01.webp ...              book images (16:9, <= 200 KB each)
```

Screenplay content: act/scene/shot list; for each shot the camera, duration, background id,
characters on screen (by bible id), Kannada dialogue, Kannada narration, SFX and music cue,
transition, and the prompt for the locked image. Character sheets hold front/three-quarter
reference renders so every later image is generated against the same reference. Backgrounds are
rendered once per location and reused. Full-resolution video assets (PNGs, character sheets)
are too heavy for the web repo; see question 3.

## 5. Images: realistic, with effects, and historically right

- Style line for every prompt: cinematic, photorealistic, dramatic light, atmospheric effects
  (spray, dust, smoke, mist), no cartoon, no watercolor, no text.
- `style.md` per era is written BEFORE any image: period dress, armour, weapons, ships, horses and
  elephants with the right furniture, temple style (Badami cave, Aihole, Hoysala soapstone,
  Vijayanagara granite), dynastic emblem (Chalukya varaha, Hoysala Sala-and-tiger, Vijayanagara
  varaha, Mysuru gandabherunda, Ganga elephant, Rashtrakuta garuda), all drawn from sculptures,
  reliefs, coins and the primary accounts, with the reference listed.
- Hard exclusions in every prompt: no gunpowder before the 14th century, no European ship forms,
  no Mughal dress on Chalukya figures, no modern objects, no Bollywood-set look.
- Generation through Codex (`codex exec`, image_generation on), one image per shot, prompt saved.
  Inspect every image against the facts sheet and the bible; regenerate on any anachronism.
- Faces of real people: reconstruct only from surviving sculpture or portraits where they exist
  (Krishnadevaraya's Tirupati bronze, Tipu's portraits); otherwise a consistent invented face,
  disclosed as AI reconstruction.

## Placement in Sirigannada (proposal, see question 1)

A new library box ಕರ್ನಾಟಕದ ಇತಿಹಾಸ beside ಚಿತ್ರಕಥೆ, at `/library/itihasa/<series>/<story>`, with
age band (battles and deaths are told plainly, so most stories are 10+ or 12+). The existing
readers do not fit: library books are chapter text, children's stories are one six-panel
image. This needs a new data contract and reader (per-scene image, sections, facts panel,
sources panel), built once with the pilot and reused for every story.

## Pilot: ಇಮ್ಮಡಿ ಪುಲಿಕೇಶಿ

Why: the richest contemporary evidence of any early Karnataka king (Aihole inscription by
Ravikirti 634 CE, Xuanzang's visit, Harsha's own records, the Chinese annals), a sea battle,
an emperor stopped at a river, and a cinematic ending (the Pallava sack of Badami, 642). The
pilot proves the format, the reader, the image pipeline and the review gate before any
other story starts.

Order of work: facts.json → style.md and bibles → book text → book images → screenplay →
screenplay images → review → app reader → PR.

## Gates

Same as the children's playbook: a separate reviewer reads the whole text and every image,
checks each fact against `facts.json`, and only then `review.json` with hashes is written.
`npm run data:history` validates sources, tiers, image sizes and hashes.

## Owner decisions, 2026-10-10

1. Placement: inside ಗ್ರಂಥಾಲಯ as a series ಕರ್ನಾಟಕ ಇತಿಹಾಸ; each story is one entry in it.
2. Audience: adults. Battles and deaths told plainly; no vulgarity.
3. The web repo keeps only what the site needs (story text, scene WebPs, facts, sources).
   Screenplays, locked character sheets, backgrounds and full-size renders live outside the
   repo in `/Users/devudilip/projects/ideas/sirigannda/history-video/<series>/<story>/`.
4. Animation tool: undecided. Screenplay stays tool-neutral: 16:9 images, shot durations,
   start frame per shot; add end frames later if the tool needs them.
5. Narration: Kannada, with an English subtitle track in the screenplay.
6. Research first (`research/<series>.md`, one sourced fact sheet per dynasty), then pick the
   pilot person or dynasty from the evidence. Stories must be substantial, not a plain retelling.

## Production recipe (as used for the pilot, 2026-10-10)

1. `research/<series>.md` and `research/<series>-verified.md`: tiered, sourced notes with verbatim
   primary quotations. Nothing enters a story that is not here.
2. `<series>/<story>/facts.json`: every fact with id, bilingual text, tier, source, url, and a bilingual
   `disputed` note where historians disagree.
3. `outline.md`: scene table mapping each scene to fact ids; `bible/style.md`: era visual guide.
4. `story.json`: the book (introduction, 10 to 12 scenes, summary, ನಿಮಗೆ ಗೊತ್ತೇ?, ಇಂದು ನೋಡಬಹುದು,
   facts copied in, provenance, illustration disclosure, content note). No em dashes, NFC Kannada.
   Scene prose is pure storytelling (owner rule, 2026-10-11, after reading Pulikeshi): events happen
   on the page, in order, with confidence. Inside a scene never write "the poet says", "the stone
   does not say", "historians think", "disputed", "perhaps", or name Rice, Kielhorn or any scholar;
   never stop the flow to ask what is unknown. Where the record is silent, choose one plausible
   telling (the exile at the Ganga court, the Narmada bank, the day of the battle) and tell it, then
   disclose the choice in that scene's `dramatised[]` so it appears on the last page (ಇದು ಕಥೆ, ಇದು
   ಇತಿಹಾಸ). The facts stay in `facts.json` with their disputed notes; the evidence page carries all
   the caveats. The reader must feel the legend; the last page must tell the truth about it.
5. Images through Codex in the video folder (outside the repo):
   `codex exec --skip-git-repo-check -s workspace-write -C <video folder> - < shots/<id>.prompt.txt`.
   One character reference sheet first; every later prompt tells Codex to open the sheet and match
   the face. The sheet prompt MUST give the lead a distinct face type (build, face shape, nose,
   hairline, facial hair, age marks) that differs from every earlier story's lead; the image model
   otherwise returns the same default face for every hero (owner caught this on story 3). But the
   lead must stay handsome, strong and heroic: never ugly, fat or bad-looking (owner rule, story 3).
   Where a real depiction exists (coin, relief, portrait sculpture, painting) match it and cite it. Inspect every render against the scene text and the bible; regenerate on any
   anachronism. Then `sharp` to 1600x900 WebP at or under 200 KB into `public/history/...`, and copy
   the exact prompts into `<story>/prompts/`.
6. A separate reviewer reads the whole text and every image against `facts.json`, then
   `review.json` with hashes is written. `npm run data:history` enforces all of it.
7. `screenplay.json` and `screenplay.md` in the video folder, built from the same facts and scenes.

## Research files

`research/<series>.md`: timeline, rulers, primary sources with links and licence status,
candidate stories with their goosebump moment, little-known facts (each with source and tier),
disputed points, visual references (sculpture, coins, emblems, sites), and sources to avoid.

## 6. Storytelling template (owner review, 2026-10-20)

A reader who has never heard of the ruler must be able to follow the book, and the video narration,
as one story. Fact-forward telling (one event per scene, names and dates in every line) reads as a
list. Every book and every screenplay from this date follows this shape, and the older ones are
rewritten to it:

1. **One spine.** Before writing, state in one line: who the hero is, what they want, what stands in
   the way, the one moment it turns, what it cost, why it matters today. Every scene serves that line
   or is cut.
2. **Order.** Background (the land, the house, the enemy), then the hero's beginning, then the rising
   events, then the turning point, then the cost and the resolution, then the legacy. No flash-forward
   opening: the teaser may hint, the story itself starts at the beginning.
3. **Five named people, five dates.** The hero, one companion (minister, queen, brother), one
   adversary, at most two more. Everyone else is a role ("the minister", "the Portuguese captain").
   One name per person (ತಿಮ್ಮರಸು, never also ಅಪ್ಪಾಜಿ and ಸಾಳುವ ತಿಮ್ಮ). At most five years or dates in
   the prose; the rest live in ನಿಮಗೆ ಗೊತ್ತೇ? and the evidence page.
4. **Big moments are whole scenes.** The turning point and the two or three heroic beats each get a
   full scene with setup, tension and release, with the hero's choice shown, not reported. A moment
   that would be one sentence is either expanded into a scene or moved to the evidence page.
5. **Side trips go to the facts.** Weighings, street widths, tank works, temple grants, poets' names:
   ನಿಮಗೆ ಗೊತ್ತೇ?, not the story, unless the scene's conflict needs them.
6. **Climax late.** The turning point sits at scene 9 to 11; scene 12 is the resolution and what
   remains today. Nothing after the climax may be a travelogue.
7. **Suspense.** Each scene ends on a question the next scene answers. The reader must know what the
   hero stands to lose before the fight.
8. **Why they are great, said once, shown everywhere.** One scene makes the greatness explicit through
   an act (mercy, a return of gold, a law, a stand); the summary states it in one line.
9. **Screenplays** follow the same spine with the same five names; narration is spoken Kannada, short
   sentences, dates only on title cards.

## 7. The newcomer test and video-generation continuity (owner, 2026-10-20)

**Newcomer test.** Before a book or screenplay is called done, answer two questions in the review and
in NOTES.md: (1) Can a person who has never heard of this ruler follow it from start to end and say
who they were, what they wanted, what happened and why it matters? (2) Is it interesting: is there
suspense, a turning point, a moment that gives goosebumps? If either answer is no, it is not done.
The independent reviewer answers both explicitly.

**Continuity for video generation.** The video tools forget earlier shots, drop people from a scene,
skip dialogue, and mismatch who is speaking with who is on screen. The screenplay must not depend on
the tool's memory. Every shot must be self-contained:
- `characters` lists everyone in frame, by id, and the prompt for that shot repeats each one's full
  look (copied from the bible, with the "FIRST open the sheet" line), even if the same person was in
  the previous shot.
- Continuity line per shot: what carries over (the same place, time of day, weather, the king's dress,
  the wound, the child in arms), stated again in words, never "as before".
- Dialogue only from someone who is on screen in that shot and listed in `characters`; `speaker` and
  `mouth` fields set; at most two speakers in a shot; no dialogue over a shot where the speaker is not
  visible. A reply belongs in the same shot as the line it answers, or the next shot shows the person
  replying.
- Each dialogue line is short (one breath) and the action line says who it is addressed to and what
  the listener does.
- A shot never assumes the viewer remembers a name from an earlier scene: the first shot of each scene
  re-establishes the place and the people in narration ("ಬೆಳವಡಿಯ ಕೋಟೆ, ಮುತ್ತಿಗೆಯ ಹತ್ತನೇ ದಿನ. ಮಲ್ಲಮ್ಮ…").
- Keyframes must show the listed characters; a shot whose picture lacks a listed character gets a new
  keyframe prompt or loses that character from `characters`.
