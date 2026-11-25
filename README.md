# video-studio

My personal video editor, run by Claude Code in the cloud from my phone. Phone footage in, cut and built in code with
[Remotion](https://remotion.dev): captions, zooms, pop-ups and sound ([earshot](https://github.com/Leonxlnx/earshot),
pinned to a reviewed commit).

- Rules for every session: [`AGENTS.md`](AGENTS.md) (loaded through `CLAUDE.md`).
- My style: `STYLE.md` and `src/style/`.
- One folder per video: `videos/<slug>/`.
- Fresh machine: `npm run setup` (also run by the cloud environment's setup script).

Remotion is free for individuals and teams of up to 3; bigger companies need a licence (remotion.dev/license).
