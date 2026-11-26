#!/usr/bin/env node
// npm run sfx -- <slug>
// Renders videos/<slug>/edit/sfx.json (an earshot spec: {"set": "...", "format": "wav", "sounds": [{"name", "want"}]})
// into videos/<slug>/audio/sfx/. Generated sound stays out of git; the spec is the source.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [slug] = process.argv.slice(2);
if (!slug) {
  console.error("usage: npm run sfx -- <slug>");
  process.exit(1);
}
const spec = path.join("videos", slug, "edit", "sfx.json");
if (!fs.existsSync(spec)) {
  console.error(`no spec at ${spec}`);
  process.exit(1);
}
const out = path.join("videos", slug, "audio", "sfx");
fs.mkdirSync(out, { recursive: true });
const r = spawnSync("tools/earshot/.venv/bin/python", ["-m", "earshot", "make", "--spec", spec, "-o", out], {
  stdio: "inherit",
  env: { ...process.env, EARSHOT_THREADS: process.env.EARSHOT_THREADS || "3" },
});
if (r.status !== 0) process.exit(r.status ?? 1);

// Measure where each file is loudest, so a hit can land on its frame: start the file at f - peak_s * fps.
// Saved next to the spec (kept in git): the same seeds render the same takes in a fresh session.
const py = `
import json, sys, os, numpy as np, soundfile as sf
out = {}
for f in sorted(os.listdir(sys.argv[1])):
    if f.endswith(".wav"):
        a, sr = sf.read(os.path.join(sys.argv[1], f), always_2d=True)
        out[f[:-4]] = round(float(np.argmax(np.abs(a).max(axis=1))) / sr, 3)
print(json.dumps(out, indent=1))
`;
const m = spawnSync("tools/earshot/.venv/bin/python", ["-c", py, out], { encoding: "utf8" });
if (m.status !== 0) {
  console.error(m.stderr);
  process.exit(1);
}
const peaksFile = path.join("videos", slug, "edit", "sfx-peaks.json");
fs.writeFileSync(peaksFile, m.stdout);
console.log(`peaks -> ${peaksFile}: ${m.stdout.replace(/\s+/g, " ")}`);
