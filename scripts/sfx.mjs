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
process.exit(r.status ?? 1);
