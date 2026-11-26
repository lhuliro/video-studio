import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { card, color, duration, ease, font, HEIGHT, safe } from "./tokens";

// A card that lands on the word: in at frame `at`, out at frame `outAt`.
// `title` is the thing named (a number, a name); `body` is one short supporting line.
export const PopCard: React.FC<{
  at: number;
  outAt: number;
  title: string;
  body?: string;
  topY?: number; // fraction of the height; move it if it would cover the face
}> = ({ at, outAt, title, body, topY = card.topY }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > outAt + duration.cardOut) return null;
  const enter = interpolate(frame, [at, at + duration.cardIn], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.enter,
  });
  const exit = interpolate(frame, [outAt, outAt + duration.cardOut], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.exit,
  });
  const scale = card.scaleFrom + (1 - card.scaleFrom) * enter;
  return (
    <div
      style={{
        position: "absolute",
        top: Math.max(topY * HEIGHT, safe.top),
        left: safe.side,
        maxWidth: card.maxWidth,
        opacity: enter * (1 - exit),
        transform: `translateY(${(1 - enter) * card.rise - exit * 8}px) scale(${scale})`,
        transformOrigin: "left center",
        display: "flex",
        background: color.sand,
        borderRadius: card.radius,
        boxShadow: card.shadow,
        overflow: "hidden",
      }}
    >
      <div style={{ width: card.ruleWidth, background: color.ochre, flexShrink: 0 }} />
      <div style={{ padding: `${card.padY}px ${card.padX}px`, fontFamily: font.family }}>
        <div
          style={{
            fontSize: card.titleSize,
            fontWeight: card.titleWeight,
            color: color.bark,
            lineHeight: 1.05,
            letterSpacing: "-0.015em",
          }}
        >
          {title}
        </div>
        {body ? (
          <div
            style={{
              marginTop: 10,
              fontSize: card.bodySize,
              fontWeight: card.bodyWeight,
              color: color.moss,
              lineHeight: 1.25,
            }}
          >
            {body}
          </div>
        ) : null}
      </div>
    </div>
  );
};
