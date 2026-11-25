"""npm run transcribe -- <slug> [<name>] [--force]

Writes videos/<slug>/audio/transcript.json: every word with its start and end, in the file's own time.
faster-whisper, local CPU, model `small`, int8. Names and products come from names.txt (one per line).
Never overwrites an existing transcript unless --force is given, because it may have been corrected by hand.
"""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS = os.path.join(ROOT, "tools", "whisper-models")


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    force = "--force" in sys.argv
    if not args:
        sys.exit("usage: npm run transcribe -- <slug> [<name>] [--force]")
    slug = args[0]
    name = args[1] if len(args) > 1 else "source"

    src = os.path.join(ROOT, "videos", slug, "footage", f"{name}.mp4")
    if not os.path.exists(src):
        sys.exit(f"no ingested footage at {src}; run npm run ingest first")
    out_dir = os.path.join(ROOT, "videos", slug, "audio")
    out = os.path.join(out_dir, "transcript.json" if name == "source" else f"transcript-{name}.json")
    if os.path.exists(out) and not force:
        sys.exit(f"{out} already exists (it may have hand corrections). Pass --force to overwrite.")

    import numpy as np
    from faster_whisper import WhisperModel

    # Decode with ffmpeg ourselves: faster-whisper's own decoder fails on some machines.
    pcm = subprocess.run(
        ["ffmpeg", "-v", "error", "-nostdin", "-i", src, "-vn", "-ac", "1", "-ar", "16000",
         "-f", "f32le", "-acodec", "pcm_f32le", "-"],
        capture_output=True, check=True,
    ).stdout
    audio = np.frombuffer(pcm, dtype=np.float32)

    names_file = os.path.join(ROOT, "names.txt")
    prompt = None
    if os.path.exists(names_file):
        names = [l.strip() for l in open(names_file, encoding="utf-8") if l.strip() and not l.startswith("#")]
        if names:
            prompt = ", ".join(names) + "."

    model = WhisperModel("small", device="cpu", compute_type="int8", download_root=MODELS)
    segments, info = model.transcribe(
        audio, word_timestamps=True, condition_on_previous_text=False, initial_prompt=prompt,
    )

    words, segs = [], []
    for s in segments:
        segs.append({"start": round(s.start, 3), "end": round(s.end, 3), "text": s.text.strip()})
        for w in s.words or []:
            words.append({"word": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3),
                          "p": round(w.probability, 3)})

    os.makedirs(out_dir, exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        json.dump({"source": f"{slug}/footage/{name}.mp4", "language": info.language,
                   "duration": round(len(audio) / 16000, 3), "words": words, "segments": segs},
                  f, ensure_ascii=False, indent=1)
    print(f"{len(words)} words, {len(segs)} segments -> {out}")


if __name__ == "__main__":
    main()
