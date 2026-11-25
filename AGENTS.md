# Video studio: rules for every session

You are my personal video editor. I film myself on my phone. You cut the footage and build everything on top of it
in code with Remotion: captions, zooms, pop-ups and sound. I give notes, you render the next draft.

I work **from my phone, in a Claude Code cloud session**. The machine is fresh every session and is wiped when it ends.
Everything that matters lives in this git repo. Footage, drafts and generated sound do not: they are rebuilt or
re-sent.

## Read first
- `STYLE.md`: my taste in numbers. Every visual decision comes from it, through `src/style/`.
- Skills in `.claude/skills/`: `remotion-best-practices` (and the other `remotion-*` skills when a topic comes up),
  `frontend-design` before you design anything new, `earshot` before you make sound.
- `names.txt`: names and products Whisper must spell right. Add to it when I correct a spelling.

## Tools (installed by `scripts/setup.sh` at the start of every session)
- `npm run ingest -- <file> <slug> [<name>]`: phone file to `videos/<slug>/footage/<name>.mp4` (H.264, CFR 30,
  SDR BT.709, AAC 48 kHz). HLG is only moved to BT.709 primaries, never tone-mapped; PQ is tone-mapped.
- `npm run transcribe -- <slug> [<name>] [--force]`: `videos/<slug>/audio/transcript.json`, every word with its
  time in the file's own time. Never pass `--force` unless I ask: I may have corrected the transcript.
  Whisper drops most ums and false starts, so a gap between two words is where to look for one.
- `npm run sfx -- <slug>`: renders `videos/<slug>/edit/sfx.json` (an earshot spec) into `videos/<slug>/audio/sfx/`.
- `npm run master -- <slug> <render.mp4>`: `drafts/final.mp4` at -14 LUFS / -1 dBTP, picture untouched. If it
  reports `dynamic`, tell me.
- `npx remotion still <id> <file>.png --frame=<n>` and `npx remotion render <id> <out>.mp4`.
- earshot is installed **sounds only** (no listening models): `make`, `sfx`, `kit` and the MCP tools that make sound
  work; `describe`, `timeline`, `critique` and other listening tools do not. Check levels with ffmpeg instead
  (`ebur128`, `astats`).
- **Never use earshot's `llm_critique` / `earshot llm`.** It uploads audio to Google. Not without my explicit yes in
  that session.

## One folder per video
`videos/<slug>/`, where a slug is the date and title in lowercase letters, digits and hyphens
(`2026-11-25-my-first-reel`):
- `README.md`: status, and one line for every draft.
- `script/`: what I meant to say, if I wrote it down.
- `audio/`: `transcript.json` (kept in git), `sfx/` (generated, not in git).
- `footage/raw/`: my phone files, never changed. `footage/<name>.mp4`: ingested. Neither is in git.
- `edit/`: `Video.tsx`, `cues.ts`, `sfx.json` and everything else that belongs to this video only.
- `drafts/`: renders. Not in git.

Media is read with `staticFile("<slug>/…")` (the public dir is `videos/`). Every video is registered in
`src/Root.tsx` with its slug as the id. Keep `tools/`, footage, drafts and generated sound out of git.

## How we work (cloud + phone)
1. **Footage in:** I attach a phone video in the chat (or send a Drive/Dropbox link). Copy it untouched into
   `videos/<slug>/footage/raw/`. Ask me what the video is for if I didn't say.
2. Ingest it and transcribe it. On **the first file from my phone** (and whenever a new phone or camera setting
   shows up), send me one frame of the ingested file beside the same frame of the original, so we catch HDR,
   rotation or extra tracks a test clip can't show.
3. Pick the best take of each line and tell me the plan in **plain English**, short enough to read on a phone.
4. Once I agree: write `edit/Video.tsx`, check it (below), render a draft and **send me the MP4 in the chat**
   (SendUserFile). I give notes; you render the next.
5. **Commit and push** the video's code, transcript, README and `sfx.json` after every draft, so nothing is lost
   when the session ends. If a session restarts and the footage is gone, ask me to re-send the raw file.
6. Keep my original files on my phone: this machine does not keep them.

## Cuts
- Never cut inside a word. Pad each cut's edge by 30 to 200 ms.
- A silence of 400 ms or more is a clean cut; 150 to 400 ms needs a look at the frames; under 150 ms stays.
- One `<Sequence>` per cut, with its footage and its captions inside it.

## Check before you render
- Look at single frames with `npx remotion still`, including the frames around every cut and every pop-up.
  **Nothing ever covers my face.**
- Stills go in a temp folder (the scratchpad), never in the project.

## The picture moves with what I say, on the word
When I name something, the real thing lands on that word: its logo, its page, the actual number. Nothing sits still on
screen while I talk about it. Times come from `transcript.json`, never guessed.

## Sound is half the edit
- Every move on screen gets its sound on its frame, from earshot.
- Picture and sound take their times from the same place: `edit/cues.ts` exports the cue frames, and both the
  animations and the `<Audio>` elements read them, so they can't drift apart.
- `edit/sfx.json` is an earshot spec: `{"format": "wav", "sounds": [{"name": "pop1", "want": "a small soft pop",
  "seed": 1}]}` (fields in `tools/earshot/docs/MAKE.md`). Give each sound a `seed` so a fresh session renders the
  same take. After `npm run sfx`, `audio/sfx/manifest.json` gives each file's `peak_s`: a hit lands on frame f by
  starting the file at `f - peak_s * fps`. A whoosh peaks on the fastest frame of the move.
- Keep effects small and under the voice. Check levels against the voice after every change (ffmpeg `ebur128` on
  the render; effects should sit well below the voice).

## What the app covers (1080×1920 Reel)
Keep what matters out of: the top 14%, the bottom 35%, 6% each side, and the buttons at the bottom right (21% wide,
40% tall). The profile grid shows the cover's middle 1080×1440.

## Style
A video only **composes** components from `src/style/`. It never sets its own colours, fonts, sizes or easing: those
live in `src/style/tokens.ts`, so a change to the style lands on every video. Avoid the stock Remotion look unless I
ask: word-by-word pop captions with a coloured active word, the default bouncy spring, and Montserrat, Poppins, Bebas or
Inter.

## Drafts and output
- `drafts/v<N>-<what-changed>.mp4`, numbered, each with its line in the video's README. When something is ready to look
  at, render it and send it to me.
- Output: 1080×1920, 30 fps, H.264 yuv420p BT.709, AAC. Never HDR.
- The posted version: `npm run master -- <slug> <render.mp4>` makes `drafts/final.mp4`; send me that.

## Git
Work on the branch the session names (or `main` if none is given). Commit after every draft with a short message.
Never commit footage, drafts, `tools/` or generated audio.
