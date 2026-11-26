import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { caption, color, duration, ease, font, HEIGHT } from "./tokens";

export type Word = { word: string; start: number; end: number };
type Phrase = { text: string; start: number; end: number };

// Groups words into calm phrases of a few words: a new phrase at punctuation, a pause, or the size limit.
export const buildPhrases = (words: Word[]): Phrase[] => {
  const phrases: Phrase[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length === 0) return;
    phrases.push({ text: cur.map((w) => w.word).join(" "), start: cur[0].start, end: cur[cur.length - 1].end });
    cur = [];
  };
  for (const w of words) {
    const prev = cur[cur.length - 1];
    const text = [...cur, w].map((x) => x.word).join(" ");
    if (
      prev &&
      (w.start - prev.end > caption.breakGap || cur.length >= caption.maxWords || text.length > caption.maxChars)
    ) {
      flush();
    }
    cur.push(w);
    if (/[.!?,;:]$/.test(w.word)) flush();
  }
  flush();
  // Hold a phrase through a short gap so captions don't flicker.
  return phrases.map((p, i) => {
    const next = phrases[i + 1];
    return next && next.start - p.end < caption.holdGap ? { ...p, end: next.start } : p;
  });
};

const PhraseView: React.FC<{ phrase: Phrase }> = ({ phrase }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inStart = phrase.start * fps;
  const outEnd = phrase.end * fps + duration.captionOut;
  const enter = interpolate(frame, [inStart, inStart + duration.captionIn], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.enter,
  });
  const exit = interpolate(frame, [outEnd - duration.captionOut, outEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.exit,
  });
  if (frame < inStart || frame > outEnd) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: caption.centerY * HEIGHT,
        transform: `translateY(calc(-50% + ${(1 - enter) * caption.rise}px))`,
        opacity: enter * (1 - exit),
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: caption.maxWidth,
          textAlign: "center",
          fontFamily: font.family,
          fontWeight: caption.weight,
          fontSize: caption.size,
          lineHeight: caption.lineHeight,
          letterSpacing: caption.letterSpacing,
          color: color.bone,
          textShadow: caption.shadow,
        }}
      >
        {phrase.text}
      </div>
    </div>
  );
};

// Captions for every word, a phrase at a time. `words` are in seconds of the sequence they sit in.
export const Captions: React.FC<{ words: Word[] }> = ({ words }) => {
  const phrases = React.useMemo(() => buildPhrases(words), [words]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {phrases.map((p, i) => (
        <PhraseView key={i} phrase={p} />
      ))}
    </AbsoluteFill>
  );
};
