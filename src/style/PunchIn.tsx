import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { duration, ease, zoom } from "./tokens";

// A smooth punch-in: scales the footage from 1 to `to` starting at frame `at`, and back at `outAt` if given.
// `origin` is the point that stays still (put it on the face). No shake, ever.
export const PunchIn: React.FC<{
  at: number;
  outAt?: number;
  to?: number;
  origin?: string;
  children: React.ReactNode;
}> = ({ at, outAt, to = zoom.punch, origin = "50% 35%", children }) => {
  const frame = useCurrentFrame();
  const target = Math.min(to, zoom.max);
  const zin = interpolate(frame, [at, at + duration.zoom], [1, target], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.move,
  });
  const scale =
    outAt === undefined
      ? zin
      : interpolate(frame, [outAt, outAt + duration.zoom], [zin, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease.move,
        });
  return (
    <AbsoluteFill style={{ transform: `scale(${frame < at ? 1 : scale})`, transformOrigin: origin }}>
      {children}
    </AbsoluteFill>
  );
};
