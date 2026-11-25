#!/usr/bin/env node
// npm run ingest -- <file> <slug> [<name>]
// Turns a phone file into videos/<slug>/footage/<name>.mp4: H.264 CRF 16, a keyframe every second,
// constant 30 fps, SDR BT.709 (tv range, yuv420p), AAC 48 kHz, +faststart, full resolution.
// HLG is only moved to BT.709 primaries (never tone-mapped); PQ is tone-mapped with hable.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [file, slug, name = "source"] = process.argv.slice(2);
if (!file || !slug) {
  console.error("usage: npm run ingest -- <file> <slug> [<name>]");
  process.exit(1);
}
if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error(`slug must be lowercase letters, digits and hyphens: ${slug}`);
  process.exit(1);
}
if (!fs.existsSync(file)) {
  console.error(`no such file: ${file}`);
  process.exit(1);
}

const probe = spawnSync(
  "ffprobe",
  ["-v", "error", "-select_streams", "v:0", "-show_entries",
   "stream=codec_name,width,height,color_transfer,color_primaries,color_space,r_frame_rate,avg_frame_rate",
   "-of", "json", file],
  { encoding: "utf8" },
);
if (probe.status !== 0) {
  console.error(probe.stderr);
  process.exit(1);
}
const v = JSON.parse(probe.stdout).streams?.[0];
if (!v) {
  console.error("no video stream found");
  process.exit(1);
}
// Read from JSON, never CSV: phone files put a trailing comma after color_transfer in CSV output.
const transfer = (v.color_transfer || "").trim();
const matrix = (v.color_space || "").trim();

const filters = ["fps=30"];
let kind = "SDR";
if (transfer === "arib-std-b67") {
  kind = "HLG (colours moved, not tone-mapped)";
  filters.push("zscale=tin=bt709:pin=bt2020:min=bt2020nc:t=bt709:p=bt709:m=bt709:r=tv");
} else if (transfer === "smpte2084") {
  kind = "PQ (tone-mapped)";
  filters.push(
    "zscale=tin=smpte2084:pin=bt2020:min=bt2020nc:t=linear:npl=100,format=gbrpf32le,zscale=p=bt709," +
      "tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv",
  );
} else if (["bt470bg", "smpte170m"].includes(matrix)) {
  kind = `SDR (${matrix} matrix converted to bt709)`;
  filters.push(`zscale=min=${matrix === "bt470bg" ? "470bg" : "170m"}:m=bt709:r=tv`);
}
// ffmpeg takes the output's colour tags from the frames, so set them on the frames last.
filters.push("setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709:range=tv,format=yuv420p");

const outDir = path.join("videos", slug, "footage");
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${name}.mp4`);

console.log(`ingest: ${file} -> ${out}`);
console.log(`  ${v.codec_name} ${v.width}x${v.height} @ ${v.avg_frame_rate}, transfer=${transfer || "unknown"}: ${kind}`);

const args = [
  "-hide_banner", "-loglevel", "error", "-stats", "-nostdin", "-y",
  "-i", file,
  "-map", "0:v:0", "-map", "0:a:0?",
  "-vf", filters.join(","),
  "-fps_mode", "cfr", "-r", "30",
  "-c:v", "libx264", "-preset", "medium", "-crf", "16",
  "-g", "30", "-keyint_min", "30", "-sc_threshold", "0",
  "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", "-color_range", "tv",
  "-c:a", "aac", "-b:a", "256k", "-ar", "48000",
  "-movflags", "+faststart",
  "-map_metadata", "-1", "-dn", "-sn",
  out,
];
const r = spawnSync("ffmpeg", args, { stdio: "inherit" });
if (r.status !== 0) process.exit(r.status ?? 1);
console.log(`done: ${out}`);
