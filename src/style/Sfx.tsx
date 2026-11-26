import React from "react";
import { Audio } from "@remotion/media";
import { Sequence, staticFile, useVideoConfig } from "remotion";

// Plays an earshot sound so that its loudest moment lands exactly on frame `at`.
// `peak` comes from the video's edit/sfx-peaks.json; `volume` from tokens.sound.
export const Sfx: React.FC<{ src: string; at: number; peak: number; volume: number }> = ({
  src,
  at,
  peak,
  volume,
}) => {
  const { fps } = useVideoConfig();
  const from = Math.round(at - peak * fps);
  const trim = Math.max(0, -from);
  return (
    <Sequence from={Math.max(0, from)} layout="none" name={`sfx ${src}`}>
      <Audio src={staticFile(src)} volume={volume} trimBefore={trim} />
    </Sequence>
  );
};
