// Every visual value of the studio lives here. Videos never set their own colours, fonts, sizes or easing.
// Change a value here and it lands on every video. STYLE.md explains each choice.
import { Easing } from "remotion";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Warm / earthy: trail dust, dry grass, moss, bark.
export const color = {
  bone: "#F3EBDD", // caption text, light surfaces
  sand: "#E4D4B4", // card surface
  ochre: "#C08A3A", // the one accent: card rule, numbers in cards
  moss: "#5A6240", // secondary text on cards
  bark: "#2A221B", // dark text, shadow base
} as const;

export const font = {
  family: "Instrument Sans",
  regular: 400,
  medium: 500,
  semibold: 600,
} as const;

// Quick but smooth: short moves that settle softly. No overshoot, no bounce, no shake.
export const ease = {
  enter: Easing.bezier(0.22, 1, 0.36, 1), // fast start, long soft landing
  exit: Easing.bezier(0.4, 0, 1, 1), // gentle start, clean exit
  move: Easing.bezier(0.65, 0, 0.35, 1), // zooms and position changes
} as const;

// Durations in frames at 30 fps.
export const duration = {
  captionIn: 6, // 200 ms
  captionOut: 4, // 133 ms
  cardIn: 9, // 300 ms
  cardOut: 6, // 200 ms
  zoom: 10, // 333 ms
} as const;

export const caption = {
  size: 60, // px at 1080 wide
  weight: font.semibold,
  lineHeight: 1.14,
  letterSpacing: "-0.01em",
  maxWidth: 820, // px, keeps 2 short lines at most
  maxWords: 4, // words per phrase
  maxChars: 24, // characters per phrase
  breakGap: 0.35, // s of silence that starts a new phrase
  holdGap: 0.3, // s: a phrase stays up through a gap shorter than this
  rise: 14, // px the phrase rises while it fades in
  centerY: 0.6, // vertical centre, as a fraction of the height (stays above the bottom 35%)
  shadow: "0 2px 18px rgba(42, 34, 27, 0.55), 0 1px 3px rgba(42, 34, 27, 0.6)",
} as const;

export const card = {
  radius: 26,
  padX: 40,
  padY: 30,
  ruleWidth: 8, // ochre bar on the left edge
  titleSize: 56,
  titleWeight: font.semibold,
  bodySize: 34,
  bodyWeight: font.medium,
  maxWidth: 760,
  rise: 24, // px it travels in
  scaleFrom: 0.97,
  topY: 0.42, // default: top of the card at 42% of the height, between a selfie-framed face and the captions
  shadow: "0 18px 40px rgba(42, 34, 27, 0.28)",
} as const;

export const zoom = {
  punch: 1.12, // a normal punch-in
  max: 1.2, // never more
} as const;

// What Instagram covers on a 1080×1920 Reel. Keep what matters inside `safe`.
export const safe = {
  top: 0.14 * HEIGHT,
  bottom: 0.35 * HEIGHT,
  side: 0.06 * WIDTH,
  buttons: { width: 0.21 * WIDTH, height: 0.4 * HEIGHT }, // bottom right
} as const;

// Sound: effects sit well under the voice. Volumes are linear gain on earshot's -14 LUFS files.
export const sound = {
  card: 0.22, // about -13 dB
  zoom: 0.18, // about -15 dB
} as const;
