/**
 * Render settings for every video in this studio.
 * Phones and Instagram expect BT.709; Remotion's default is BT.601, so it is set here.
 * Note: the Node.js APIs ignore this file; pass the same options there.
 */
import { Config } from "@remotion/cli/config";
import fs from "node:fs";

// Cloud sessions ship a headless Chrome; use it instead of downloading one from remotion.media.
const PREINSTALLED_SHELL = "/opt/pw-browsers/chromium_headless_shell";
if (fs.existsSync(PREINSTALLED_SHELL)) {
  Config.setBrowserExecutable(PREINSTALLED_SHELL);
}

Config.setRspack(true);
Config.setPublicDir("./videos");
Config.setColorSpace("bt709");
Config.setPixelFormat("yuv420p");
Config.setVideoImageFormat("png");
Config.setCrf(12);
Config.setX264Preset("slow");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);
