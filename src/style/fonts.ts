// Instrument Sans (SIL Open Font License, videos/_fonts/OFL.txt), stored in the repo because the cloud network
// does not reach Google Fonts.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { font } from "./tokens";

export const fontsLoaded = Promise.all(
  [font.regular, font.medium, font.semibold].map((w) =>
    loadFont({ family: font.family, url: staticFile(`_fonts/InstrumentSans-${w}.woff2`), weight: String(w) }),
  ),
);
