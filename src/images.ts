import usdLandscape from "./assets/usd-landscape.webp";
import nzd100Landscape from "./assets/nzd-100-landscape.webp";
import nzd5Landscape from "./assets/nzd-5-landscape.webp";
import cnyLandscape from "./assets/cny-landscape.webp";
import gbpLandscape from "./assets/gbp-landscape.webp";
import redEnvelopeLandscape from "./assets/red-envelope-landscape.svg";

import cnyPortrait from "./assets/cny-portrait.webp";
import gbpPortrait from "./assets/gbp-portrait.webp";
import nzd100Portrait from "./assets/nzd-100-portrait.webp";
import nzd5Portrait from "./assets/nzd-5-portrait.webp";
import usdPortrait from "./assets/usd-portrait.webp";
import redEnvelopePortrait from "./assets/red-envelope-portrait.svg";

export type ImageType =
  | "cny"
  | "usd"
  | "nzd100"
  | "nzd5"
  | "gbp"
  | "red-envelope";

export function type2PortraitImageUrl(type: ImageType): string {
  return {
    cny: cnyPortrait,
    usd: usdPortrait,
    gbp: gbpPortrait,
    nzd100: nzd100Portrait,
    nzd5: nzd5Portrait,
    "red-envelope": redEnvelopePortrait,
  }[type];
}

export function type2LandscapeImageUrl(type: ImageType): string {
  return {
    cny: cnyLandscape,
    usd: usdLandscape,
    gbp: gbpLandscape,
    nzd100: nzd100Landscape,
    nzd5: nzd5Landscape,
    "red-envelope": redEnvelopeLandscape,
  }[type];
}
