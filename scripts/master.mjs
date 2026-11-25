#!/usr/bin/env node
// npm run master -- <slug> <render.mp4>
// Makes videos/<slug>/drafts/final.mp4: picture copied untouched, mix at -14 LUFS / -1 dBTP,
// ending with the picture (-shortest). Two-pass loudnorm: measure, then one linear gain.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [slug, render] = process.argv.slice(2);
if (!slug || !render) {
  console.error("usage: npm run master -- <slug> <render.mp4>");
  process.exit(1);
}
if (!fs.existsSync(render)) {
  console.error(`no such file: ${render}`);
  process.exit(1);
}

const lastJson = (text) => {
  const start = text.lastIndexOf("{");
  const end = text.lastIndexOf("}");
  return JSON.parse(text.slice(start, end + 1));
};

// Pass 1: measure.
const m = spawnSync(
  "ffmpeg",
  ["-hide_banner", "-nostdin", "-i", render, "-map", "0:a:0", "-af",
   "loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"],
  { encoding: "utf8" },
);
if (m.status !== 0) {
  console.error(m.stderr);
  process.exit(1);
}
const meas = lastJson(m.stderr);
const lra = Math.min(50, Math.max(11, Math.ceil(Number(meas.input_lra))));
console.log(`measured: ${meas.input_i} LUFS, ${meas.input_tp} dBTP, LRA ${meas.input_lra} -> target LRA ${lra}`);

// Pass 2: apply one gain.
const af =
  `loudnorm=I=-14:TP=-1:LRA=${lra}:measured_I=${meas.input_i}:measured_TP=${meas.input_tp}` +
  `:measured_LRA=${meas.input_lra}:measured_thresh=${meas.input_thresh}:offset=${meas.target_offset}` +
  `:linear=true:print_format=json`;
const outDir = path.join("videos", slug, "drafts");
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, "final.mp4");
const a = spawnSync(
  "ffmpeg",
  ["-hide_banner", "-nostdin", "-y", "-i", render, "-map", "0:v:0", "-map", "0:a:0",
   "-c:v", "copy", "-af", af, "-c:a", "aac", "-b:a", "320k", "-ar", "48000",
   "-shortest", "-movflags", "+faststart", out],
  { encoding: "utf8" },
);
if (a.status !== 0) {
  console.error(a.stderr);
  process.exit(1);
}
const res = lastJson(a.stderr);
console.log(`output: ${res.output_i} LUFS, ${res.output_tp} dBTP (${res.normalization_type})`);
if (res.normalization_type === "dynamic") {
  console.log(
    "NOTE: one gain would have pushed the true peak past -1 dBTP, so loudnorm compressed instead (dynamic). " +
      "Tell the user; lowering the loudest effects in the mix avoids it.",
  );
}
console.log(`done: ${out}`);
