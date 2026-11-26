# My style (version 1, still exploring)

I'm still finding my style. This is a starting point, not a rule set: **ask me again** when a video's topic or mood
seems to want something different, and keep what works. Every value below lives in `src/style/tokens.ts`; change it
there, and it changes every video. Check a change with the 3-second `style-preview` composition.

## What I make
- Sport and training, vlogs and day-in-the-life, and opinions / talking to camera. Still testing formats.
- In English, for a general audience.

## Type
- **Instrument Sans** (SIL Open Font License), stored in `videos/_fonts/`. Weights 400, 500, 600.
- Never Montserrat, Poppins, Bebas or Inter (the stock Remotion look).

## Colour: warm / earthy
| Name | Hex | Used for |
|---|---|---|
| bone | `#F3EBDD` | caption text |
| sand | `#E4D4B4` | card surface |
| ochre | `#C08A3A` | the one accent: the card's left rule |
| moss | `#5A6240` | secondary text on cards |
| bark | `#2A221B` | dark text, shadow base |

One accent only. Deliberately not cream + terracotta (the generic "AI" warm look).

## Captions: everything, clean and calm
- Every word is captioned, a **phrase at a time**: at most 4 words and 24 characters per phrase; a new phrase at
  punctuation or a pause over 0.35 s. A phrase stays up through gaps under 0.3 s, so nothing flickers.
- 60 px, weight 600, line height 1.14, tracking -0.01em, bone, centred, max 820 px wide.
- Soft shadow `0 2px 18px rgba(42,34,27,.55), 0 1px 3px rgba(42,34,27,.6)` instead of a box.
- Centred at 60% of the height (above the bottom 35% that Instagram covers).
- In: fade + rise 14 px over 6 frames (200 ms). Out: fade over 4 frames (133 ms).
- Not word-by-word pop captions and no coloured active word.

## Motion: quick but smooth
- Enter: `cubic-bezier(0.22, 1, 0.36, 1)`: fast start, long soft landing.
- Exit: `cubic-bezier(0.4, 0, 1, 1)`.
- Zooms and moves: `cubic-bezier(0.65, 0, 0.35, 1)`.
- Never a spring with overshoot, never bounce, **never shaky or fast-jittery zooms**.

## Punch-in zoom
- 1 → 1.12 over 10 frames (333 ms), never above 1.2. The face is the still point (default origin 50% 33%).

## Pop-up card
- Sand surface, radius 26, 8 px ochre rule on the left, padding 30 × 40, max 760 px wide, soft shadow
  `0 18px 40px rgba(42,34,27,.28)`.
- Title 56 px / 600 bark (the thing named: a number, a name); one body line 34 px / 500 moss.
- In: rise 24 px, scale 0.97 → 1, fade over 9 frames (300 ms). Out: fade over 6 frames (200 ms).
- Default spot: left edge (6% margin), top at 42% of the height, between a selfie-framed face and the captions.
  Move it if it would cover the face.

## Sound
- Small and soft, from earshot: a muted paper tap for a card (volume 0.22), a very soft airy whoosh for a zoom (0.18).
- Each hit's loudest moment lands on its frame. Effects stay well under the voice.
- No meme sounds unless I ask.

## Open questions to revisit
- Captions: always full, or keyword-only for some formats?
- Motion: calmer for vlogs, punchier for training?
- Colours per series?
