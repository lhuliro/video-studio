import React from "react";
import { AbsoluteFill } from "remotion";
import peaks from "../../videos/_style/edit/sfx-peaks.json";
import { Captions, Word } from "./Captions";
import { PopCard } from "./PopCard";
import { PunchIn } from "./PunchIn";
import { Sfx } from "./Sfx";
import { color, sound } from "./tokens";

// A 3-second check of the style: captions, a card landing on its word, a punch-in, and their sounds.
// Render it after any change to src/style: npx remotion render style-preview <out>.mp4
const words: Word[] = [
  { word: "Three", start: 0.1, end: 0.3 },
  { word: "things", start: 0.3, end: 0.55 },
  { word: "I", start: 0.55, end: 0.62 },
  { word: "learned", start: 0.62, end: 0.95 },
  { word: "from", start: 1.0, end: 1.12 },
  { word: "my", start: 1.12, end: 1.25 },
  { word: "first", start: 1.25, end: 1.5 },
  { word: "marathon.", start: 1.5, end: 2.0 },
  { word: "Pacing.", start: 2.3, end: 2.8 },
];

// Cue frames: picture and sound both read these.
const cue = { card: 45, cardOut: 84, zoom: 69 };

// A stand-in for footage: a warm, out-of-focus outdoor scene with a head-and-shoulders shape where a face would be.
const StandIn: React.FC = () => (
  <AbsoluteFill
    style={{ background: `linear-gradient(180deg, #8C9A86 0%, #A89B7C 45%, #6E6145 100%)`, overflow: "hidden" }}
  >
    <div
      style={{
        position: "absolute",
        left: 540 - 170,
        top: 420,
        width: 340,
        height: 420,
        borderRadius: "50%",
        background: "#B98E6E",
        filter: "blur(6px)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 540 - 420,
        top: 800,
        width: 840,
        height: 1300,
        borderRadius: "48% 48% 0 0",
        background: color.moss,
        filter: "blur(6px)",
      }}
    />
  </AbsoluteFill>
);

export const StylePreview: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: color.bark }}>
    <PunchIn at={cue.zoom} origin="50% 33%">
      <StandIn />
    </PunchIn>
    <PopCard at={cue.card} outAt={cue.cardOut} title="42.2 km" body="My first marathon" />
    <Captions words={words} />
    <Sfx src="_style/audio/sfx/card.wav" at={cue.card} peak={peaks.card} volume={sound.card} />
    <Sfx src="_style/audio/sfx/zoom.wav" at={cue.zoom} peak={peaks.zoom} volume={sound.zoom} />
  </AbsoluteFill>
);
