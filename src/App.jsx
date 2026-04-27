import { useEffect, useMemo, useRef, useState } from "react";

const PRIMARY_SNIPPETS = ["SwiftUI", "Kotlin", "React", "Flutter"];
const WHITE = { red: 255, green: 255, blue: 255 };
const BLACK = { red: 0, green: 0, blue: 0 };
const OPACITY_LEVELS = [10, 20, 30, 40, 50, 60, 75, 90];
const RECENT_COLORS_STORAGE_KEY = "colordevkit:recent-colors";
const TAILWIND_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const CSS_NAMED_COLORS = {
  aliceblue: "#F0F8FF",
  antiquewhite: "#FAEBD7",
  aqua: "#00FFFF",
  aquamarine: "#7FFFD4",
  azure: "#F0FFFF",
  beige: "#F5F5DC",
  bisque: "#FFE4C4",
  black: "#000000",
  blue: "#0000FF",
  blueviolet: "#8A2BE2",
  brown: "#A52A2A",
  burlywood: "#DEB887",
  cadetblue: "#5F9EA0",
  chartreuse: "#7FFF00",
  chocolate: "#D2691E",
  coral: "#FF7F50",
  cornflowerblue: "#6495ED",
  crimson: "#DC143C",
  cyan: "#00FFFF",
  darkblue: "#00008B",
  darkcyan: "#008B8B",
  darkgoldenrod: "#B8860B",
  darkgray: "#A9A9A9",
  darkgreen: "#006400",
  darkgrey: "#A9A9A9",
  darkmagenta: "#8B008B",
  darkorange: "#FF8C00",
  darkred: "#8B0000",
  darksalmon: "#E9967A",
  darkslateblue: "#483D8B",
  darkslategray: "#2F4F4F",
  darkslategrey: "#2F4F4F",
  deeppink: "#FF1493",
  deepskyblue: "#00BFFF",
  dodgerblue: "#1E90FF",
  firebrick: "#B22222",
  floralwhite: "#FFFAF0",
  forestgreen: "#228B22",
  fuchsia: "#FF00FF",
  gainsboro: "#DCDCDC",
  ghostwhite: "#F8F8FF",
  gold: "#FFD700",
  goldenrod: "#DAA520",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#ADFF2F",
  grey: "#808080",
  hotpink: "#FF69B4",
  indianred: "#CD5C5C",
  indigo: "#4B0082",
  ivory: "#FFFFF0",
  khaki: "#F0E68C",
  lavender: "#E6E6FA",
  lawngreen: "#7CFC00",
  lemonchiffon: "#FFFACD",
  lightblue: "#ADD8E6",
  lightcoral: "#F08080",
  lightcyan: "#E0FFFF",
  lightgray: "#D3D3D3",
  lightgreen: "#90EE90",
  lightgrey: "#D3D3D3",
  lightpink: "#FFB6C1",
  lightsalmon: "#FFA07A",
  lightskyblue: "#87CEFA",
  lightyellow: "#FFFFE0",
  lime: "#00FF00",
  limegreen: "#32CD32",
  linen: "#FAF0E6",
  magenta: "#FF00FF",
  maroon: "#800000",
  mediumblue: "#0000CD",
  mediumseagreen: "#3CB371",
  mediumslateblue: "#7B68EE",
  mediumspringgreen: "#00FA9A",
  mediumturquoise: "#48D1CC",
  mintcream: "#F5FFFA",
  mistyrose: "#FFE4E1",
  moccasin: "#FFE4B5",
  navy: "#000080",
  oldlace: "#FDF5E6",
  olive: "#808000",
  olivedrab: "#6B8E23",
  orange: "#FFA500",
  orangered: "#FF4500",
  orchid: "#DA70D6",
  palegreen: "#98FB98",
  paleturquoise: "#AFEEEE",
  palevioletred: "#DB7093",
  papayawhip: "#FFEFD5",
  peachpuff: "#FFDAB9",
  peru: "#CD853F",
  pink: "#FFC0CB",
  plum: "#DDA0DD",
  powderblue: "#B0E0E6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#FF0000",
  rosybrown: "#BC8F8F",
  royalblue: "#4169E1",
  saddlebrown: "#8B4513",
  salmon: "#FA8072",
  sandybrown: "#F4A460",
  seagreen: "#2E8B57",
  seashell: "#FFF5EE",
  sienna: "#A0522D",
  silver: "#C0C0C0",
  skyblue: "#87CEEB",
  slateblue: "#6A5ACD",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#FFFAFA",
  springgreen: "#00FF7F",
  steelblue: "#4682B4",
  tan: "#D2B48C",
  teal: "#008080",
  thistle: "#D8BFD8",
  tomato: "#FF6347",
  turquoise: "#40E0D0",
  violet: "#EE82EE",
  wheat: "#F5DEB3",
  white: "#FFFFFF",
  whitesmoke: "#F5F5F5",
  yellow: "#FFFF00",
  yellowgreen: "#9ACD32",
};
const TAILWIND_PALETTE = {
  slate: { 50: "#F8FAFC", 100: "#F1F5F9", 200: "#E2E8F0", 300: "#CBD5E1", 400: "#94A3B8", 500: "#64748B", 600: "#475569", 700: "#334155", 800: "#1E293B", 900: "#0F172A", 950: "#020617" },
  gray: { 50: "#F9FAFB", 100: "#F3F4F6", 200: "#E5E7EB", 300: "#D1D5DB", 400: "#9CA3AF", 500: "#6B7280", 600: "#4B5563", 700: "#374151", 800: "#1F2937", 900: "#111827", 950: "#030712" },
  zinc: { 50: "#FAFAFA", 100: "#F4F4F5", 200: "#E4E4E7", 300: "#D4D4D8", 400: "#A1A1AA", 500: "#71717A", 600: "#52525B", 700: "#3F3F46", 800: "#27272A", 900: "#18181B", 950: "#09090B" },
  neutral: { 50: "#FAFAFA", 100: "#F5F5F5", 200: "#E5E5E5", 300: "#D4D4D4", 400: "#A3A3A3", 500: "#737373", 600: "#525252", 700: "#404040", 800: "#262626", 900: "#171717", 950: "#0A0A0A" },
  stone: { 50: "#FAFAF9", 100: "#F5F5F4", 200: "#E7E5E4", 300: "#D6D3D1", 400: "#A8A29E", 500: "#78716C", 600: "#57534E", 700: "#44403C", 800: "#292524", 900: "#1C1917", 950: "#0C0A09" },
  red: { 50: "#FEF2F2", 100: "#FEE2E2", 200: "#FECACA", 300: "#FCA5A5", 400: "#F87171", 500: "#EF4444", 600: "#DC2626", 700: "#B91C1C", 800: "#991B1B", 900: "#7F1D1D", 950: "#450A0A" },
  orange: { 50: "#FFF7ED", 100: "#FFEDD5", 200: "#FED7AA", 300: "#FDBA74", 400: "#FB923C", 500: "#F97316", 600: "#EA580C", 700: "#C2410C", 800: "#9A3412", 900: "#7C2D12", 950: "#431407" },
  amber: { 50: "#FFFBEB", 100: "#FEF3C7", 200: "#FDE68A", 300: "#FCD34D", 400: "#FBBF24", 500: "#F59E0B", 600: "#D97706", 700: "#B45309", 800: "#92400E", 900: "#78350F", 950: "#451A03" },
  yellow: { 50: "#FEFCE8", 100: "#FEF9C3", 200: "#FEF08A", 300: "#FDE047", 400: "#FACC15", 500: "#EAB308", 600: "#CA8A04", 700: "#A16207", 800: "#854D0E", 900: "#713F12", 950: "#422006" },
  lime: { 50: "#F7FEE7", 100: "#ECFCCB", 200: "#D9F99D", 300: "#BEF264", 400: "#A3E635", 500: "#84CC16", 600: "#65A30D", 700: "#4D7C0F", 800: "#3F6212", 900: "#365314", 950: "#1A2E05" },
  green: { 50: "#F0FDF4", 100: "#DCFCE7", 200: "#BBF7D0", 300: "#86EFAC", 400: "#4ADE80", 500: "#22C55E", 600: "#16A34A", 700: "#15803D", 800: "#166534", 900: "#14532D", 950: "#052E16" },
  emerald: { 50: "#ECFDF5", 100: "#D1FAE5", 200: "#A7F3D0", 300: "#6EE7B7", 400: "#34D399", 500: "#10B981", 600: "#059669", 700: "#047857", 800: "#065F46", 900: "#064E3B", 950: "#022C22" },
  teal: { 50: "#F0FDFA", 100: "#CCFBF1", 200: "#99F6E4", 300: "#5EEAD4", 400: "#2DD4BF", 500: "#14B8A6", 600: "#0D9488", 700: "#0F766E", 800: "#115E59", 900: "#134E4A", 950: "#042F2E" },
  cyan: { 50: "#ECFEFF", 100: "#CFFAFE", 200: "#A5F3FC", 300: "#67E8F9", 400: "#22D3EE", 500: "#06B6D4", 600: "#0891B2", 700: "#0E7490", 800: "#155E75", 900: "#164E63", 950: "#083344" },
  sky: { 50: "#F0F9FF", 100: "#E0F2FE", 200: "#BAE6FD", 300: "#7DD3FC", 400: "#38BDF8", 500: "#0EA5E9", 600: "#0284C7", 700: "#0369A1", 800: "#075985", 900: "#0C4A6E", 950: "#082F49" },
  blue: { 50: "#EFF6FF", 100: "#DBEAFE", 200: "#BFDBFE", 300: "#93C5FD", 400: "#60A5FA", 500: "#3B82F6", 600: "#2563EB", 700: "#1D4ED8", 800: "#1E40AF", 900: "#1E3A8A", 950: "#172554" },
  indigo: { 50: "#EEF2FF", 100: "#E0E7FF", 200: "#C7D2FE", 300: "#A5B4FC", 400: "#818CF8", 500: "#6366F1", 600: "#4F46E5", 700: "#4338CA", 800: "#3730A3", 900: "#312E81", 950: "#1E1B4B" },
  violet: { 50: "#F5F3FF", 100: "#EDE9FE", 200: "#DDD6FE", 300: "#C4B5FD", 400: "#A78BFA", 500: "#8B5CF6", 600: "#7C3AED", 700: "#6D28D9", 800: "#5B21B6", 900: "#4C1D95", 950: "#2E1065" },
  purple: { 50: "#FAF5FF", 100: "#F3E8FF", 200: "#E9D5FF", 300: "#D8B4FE", 400: "#C084FC", 500: "#A855F7", 600: "#9333EA", 700: "#7E22CE", 800: "#6B21A8", 900: "#581C87", 950: "#3B0764" },
  fuchsia: { 50: "#FDF4FF", 100: "#FAE8FF", 200: "#F5D0FE", 300: "#F0ABFC", 400: "#E879F9", 500: "#D946EF", 600: "#C026D3", 700: "#A21CAF", 800: "#86198F", 900: "#701A75", 950: "#4A044E" },
  pink: { 50: "#FDF2F8", 100: "#FCE7F3", 200: "#FBCFE8", 300: "#F9A8D4", 400: "#F472B6", 500: "#EC4899", 600: "#DB2777", 700: "#BE185D", 800: "#9D174D", 900: "#831843", 950: "#500724" },
  rose: { 50: "#FFF1F2", 100: "#FFE4E6", 200: "#FECDD3", 300: "#FDA4AF", 400: "#FB7185", 500: "#F43F5E", 600: "#E11D48", 700: "#BE123C", 800: "#9F1239", 900: "#881337", 950: "#4C0519" },
};

function clampChannel(value) {
  return Math.min(255, Math.max(0, Math.round(Number(value))));
}

function clampAlpha(value) {
  return Math.min(1, Math.max(0, Number(value)));
}

function toHexPart(value) {
  return value.toString(16).padStart(2, "0").toUpperCase();
}

function formatAlpha(alpha) {
  const normalized = Number(alpha.toFixed(3));
  return normalized.toString();
}

function parseRgbLike(input) {
  const normalized = input.trim();
  const match = normalized.match(
    /^rgba?\(\s*([+-]?\d*\.?\d+)\s*,\s*([+-]?\d*\.?\d+)\s*,\s*([+-]?\d*\.?\d+)(?:\s*,\s*([+-]?\d*\.?\d+))?\s*\)$/i,
  );

  if (!match) {
    return null;
  }

  const red = clampChannel(match[1]);
  const green = clampChannel(match[2]);
  const blue = clampChannel(match[3]);
  const alpha = match[4] === undefined ? null : clampAlpha(match[4]);

  return {
    mode: alpha === null ? "rgb" : "rgba",
    red,
    green,
    blue,
    alpha,
    cssColor:
      alpha === null
        ? `rgb(${red}, ${green}, ${blue})`
        : `rgba(${red}, ${green}, ${blue}, ${formatAlpha(alpha)})`,
    hex:
      alpha === null
        ? `#${toHexPart(red)}${toHexPart(green)}${toHexPart(blue)}`
        : `#${toHexPart(red)}${toHexPart(green)}${toHexPart(blue)}${toHexPart(
            Math.round(alpha * 255),
          )}`,
    rgbText: `rgb(${red}, ${green}, ${blue})`,
    rgbaText:
      alpha === null
        ? `rgba(${red}, ${green}, ${blue}, 1)`
        : `rgba(${red}, ${green}, ${blue}, ${formatAlpha(alpha)})`,
  };
}

function normalizeHue(value) {
  return ((Number(value) % 360) + 360) % 360;
}

function clampPercent(value) {
  return Math.min(100, Math.max(0, Number(value)));
}

function hslToRgb(hue, saturation, lightness) {
  const s = saturation / 100;
  const l = lightness / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  let red = 0;
  let green = 0;
  let blue = 0;

  if (hue < 60) {
    red = c;
    green = x;
  } else if (hue < 120) {
    red = x;
    green = c;
  } else if (hue < 180) {
    green = c;
    blue = x;
  } else if (hue < 240) {
    green = x;
    blue = c;
  } else if (hue < 300) {
    red = x;
    blue = c;
  } else {
    red = c;
    blue = x;
  }

  return {
    red: clampChannel((red + m) * 255),
    green: clampChannel((green + m) * 255),
    blue: clampChannel((blue + m) * 255),
  };
}

function hsvToRgb(hue, saturation, value) {
  const s = saturation / 100;
  const v = value / 100;
  const c = v * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = v - c;
  let red = 0;
  let green = 0;
  let blue = 0;

  if (hue < 60) {
    red = c;
    green = x;
  } else if (hue < 120) {
    red = x;
    green = c;
  } else if (hue < 180) {
    green = c;
    blue = x;
  } else if (hue < 240) {
    green = x;
    blue = c;
  } else if (hue < 300) {
    red = x;
    blue = c;
  } else {
    red = c;
    blue = x;
  }

  return {
    red: clampChannel((red + m) * 255),
    green: clampChannel((green + m) * 255),
    blue: clampChannel((blue + m) * 255),
  };
}

function parseHslLike(input) {
  const normalized = input.trim();
  const match = normalized.match(
    /^hsla?\(\s*([+-]?\d*\.?\d+)\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%(?:\s*,\s*([+-]?\d*\.?\d+))?\s*\)$/i,
  );

  if (!match) {
    return null;
  }

  const hue = normalizeHue(match[1]);
  const saturation = clampPercent(match[2]);
  const lightness = clampPercent(match[3]);
  const alpha = match[4] === undefined ? null : clampAlpha(match[4]);
  const { red, green, blue } = hslToRgb(hue, saturation, lightness);

  return createParsedColor({
    mode: alpha === null ? "hsl" : "hsla",
    red,
    green,
    blue,
    alpha,
  });
}

function parseHsbLike(input) {
  const normalized = input.trim();
  const match = normalized.match(
    /^hs[bv]a?\(\s*([+-]?\d*\.?\d+)\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%(?:\s*,\s*([+-]?\d*\.?\d+))?\s*\)$/i,
  );

  if (!match) {
    return null;
  }

  const hue = normalizeHue(match[1]);
  const saturation = clampPercent(match[2]);
  const brightness = clampPercent(match[3]);
  const alpha = match[4] === undefined ? null : clampAlpha(match[4]);
  const { red, green, blue } = hsvToRgb(hue, saturation, brightness);

  return createParsedColor({
    mode: alpha === null ? "hsb" : "hsba",
    red,
    green,
    blue,
    alpha,
  });
}

function parseHex(input) {
  const normalized = input.trim();
  const match = normalized.match(
    /^#([\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i,
  );

  if (!match) {
    return null;
  }

  let hex = match[1];

  if (hex.length === 3 || hex.length === 4) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const hasAlpha = hex.length === 8;
  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  const alpha = hasAlpha
    ? Number.parseFloat(
        (Number.parseInt(hex.slice(6, 8), 16) / 255).toFixed(3),
      )
    : null;

  return createParsedColor({
    mode: hasAlpha ? "hex-alpha" : "hex",
    red,
    green,
    blue,
    alpha,
  });
}

function parseColor(input) {
  return parseRgbLike(input) ?? parseHex(input) ?? parseHslLike(input) ?? parseHsbLike(input);
}

function createParsedColor({ mode, red, green, blue, alpha }) {
  return {
    mode,
    red,
    green,
    blue,
    alpha,
    cssColor:
      alpha === null
        ? `rgb(${red}, ${green}, ${blue})`
        : `rgba(${red}, ${green}, ${blue}, ${formatAlpha(alpha)})`,
    hex:
      alpha === null
        ? `#${toHexPart(red)}${toHexPart(green)}${toHexPart(blue)}`
        : `#${toHexPart(red)}${toHexPart(green)}${toHexPart(blue)}${toHexPart(
            Math.round(alpha * 255),
          )}`,
    rgbText: `rgb(${red}, ${green}, ${blue})`,
    rgbaText:
      alpha === null
        ? `rgba(${red}, ${green}, ${blue}, 1)`
        : `rgba(${red}, ${green}, ${blue}, ${formatAlpha(alpha)})`,
  };
}

function getContrastColor(parsedColor) {
  const { red, green, blue } = parsedColor;
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;
  return brightness > 160 ? "#111111" : "#FFFFFF";
}

function getRelativeLuminance({ red, green, blue }) {
  const transform = (channel) => {
    const value = channel / 255;
    return value <= 0.03928
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * transform(red) + 0.7152 * transform(green) + 0.0722 * transform(blue);
}

function getContrastRatio(foreground, background) {
  const lighter = Math.max(getRelativeLuminance(foreground), getRelativeLuminance(background));
  const darker = Math.min(getRelativeLuminance(foreground), getRelativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function getWcagLevel(ratio) {
  if (ratio >= 7) {
    return "AAA";
  }

  if (ratio >= 4.5) {
    return "AA";
  }

  return "Fail";
}

function rgbToHsl({ red, green, blue }) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;
  const lightness = (max + min) / 2;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  if (delta !== 0) {
    if (max === r) {
      hue = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
      hue = 60 * ((b - r) / delta + 2);
    } else {
      hue = 60 * ((r - g) / delta + 4);
    }
  }

  return {
    hue: Math.round(normalizeHue(hue)),
    saturation: Math.round(saturation * 100),
    lightness: Math.round(lightness * 100),
  };
}

function rgbToHsv({ red, green, blue }) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;

  if (delta !== 0) {
    if (max === r) {
      hue = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
      hue = 60 * ((b - r) / delta + 2);
    } else {
      hue = 60 * ((r - g) / delta + 4);
    }
  }

  return {
    hue: Math.round(normalizeHue(hue)),
    saturation: Math.round((max === 0 ? 0 : delta / max) * 100),
    brightness: Math.round(max * 100),
  };
}

function linearSrgbToOklab(value) {
  return value <= 0.04045
    ? value / 12.92
    : ((value + 0.055) / 1.055) ** 2.4;
}

function rgbToOklch({ red, green, blue }) {
  const r = linearSrgbToOklab(red / 255);
  const g = linearSrgbToOklab(green / 255);
  const b = linearSrgbToOklab(blue / 255);
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const lRoot = Math.cbrt(l);
  const mRoot = Math.cbrt(m);
  const sRoot = Math.cbrt(s);
  const okL = 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot;
  const okA = 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot;
  const okB = 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot;
  const chroma = Math.sqrt(okA ** 2 + okB ** 2);
  const hue = normalizeHue((Math.atan2(okB, okA) * 180) / Math.PI);

  return {
    lightness: okL.toFixed(2),
    chroma: chroma.toFixed(2),
    hue: hue.toFixed(2),
  };
}

function getCssNamedColor(parsedColor) {
  let closestMatch = null;

  Object.entries(CSS_NAMED_COLORS).forEach(([name, hex]) => {
    const distance = getRgbDistance(parsedColor, hexToRgb(hex));

    if (!closestMatch || distance < closestMatch.distance) {
      closestMatch = { name, distance };
    }
  });

  return closestMatch.distance <= 12 ? closestMatch.name : "No named match";
}

function getConversionCards(parsedColor) {
  const hsl = rgbToHsl(parsedColor);
  const hsv = rgbToHsv(parsedColor);
  const oklch = rgbToOklch(parsedColor);

  return [
    { label: "HEX", value: parsedColor.hex },
    { label: "RGB", value: parsedColor.rgbText },
    { label: "RGBA", value: parsedColor.rgbaText },
    { label: "HSL", value: `hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)` },
    { label: "HSB / HSV", value: `hsb(${hsv.hue}, ${hsv.saturation}%, ${hsv.brightness}%)` },
    {
      label: "OKLCH (Modern CSS)",
      value: `oklch(${oklch.lightness} ${oklch.chroma} ${oklch.hue})`,
    },
  ];
}

function getInitialInputValue() {
  const params = new URLSearchParams(window.location.search);
  const color = params.get("color");

  return color && parseColor(color) ? color : "";
}

function getInitialRecentColors() {
  try {
    const colors = JSON.parse(localStorage.getItem(RECENT_COLORS_STORAGE_KEY) ?? "[]");
    return Array.isArray(colors) ? colors.filter((color) => parseColor(color)).slice(0, 10) : [];
  } catch {
    return [];
  }
}

function saveRecentColors(colors) {
  localStorage.setItem(RECENT_COLORS_STORAGE_KEY, JSON.stringify(colors));
}

function updateColorQuery(value) {
  const url = new URL(window.location.href);

  if (value) {
    url.searchParams.set("color", value);
  } else {
    url.searchParams.delete("color");
  }

  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function getRandomInitialColor() {
  const red = Math.floor(Math.random() * 206) + 25;
  const green = Math.floor(Math.random() * 206) + 25;
  const blue = Math.floor(Math.random() * 206) + 25;

  return `rgb(${red}, ${green}, ${blue})`;
}

function getCodeSnippets(parsedColor) {
  const { red, green, blue, alpha, hex } = parsedColor;
  const alphaValue = alpha ?? 1;
  const alphaByte = Math.round(alphaValue * 255);
  const alphaHex = toHexPart(alphaByte);
  const rrggbb = hex.slice(1, 7);
  const argbHex = `#${alphaHex}${rrggbb}`;
  const cssHex = alpha === null ? hex.slice(0, 7) : hex;

  return [
    { label: "SwiftUI", code: `Color(.sRGB, red: ${red} / 255, green: ${green} / 255, blue: ${blue} / 255, opacity: ${formatAlpha(alphaValue)})` },
    { label: "Kotlin", code: `Color(${red}, ${green}, ${blue}, ${(alphaValue * 100).toFixed(0)}%)` },
    { label: "React", code: alpha === null ? cssHex : parsedColor.rgbaText },
    { label: "Flutter", code: `const Color(0x${alphaHex}${rrggbb})` },
    { label: "Swift UIKit", code: `UIColor(red: ${red} / 255, green: ${green} / 255, blue: ${blue} / 255, alpha: ${formatAlpha(alphaValue)})` },
    { label: "Java Android", code: `Color.argb(${alphaByte}, ${red}, ${green}, ${blue})` },
    { label: "HEX", code: hex },
    { label: "Android XML", code: argbHex },
  ];
}

function getCssSnippets(parsedColor) {
  const cssValue = parsedColor.alpha === null ? parsedColor.hex.slice(0, 7) : parsedColor.rgbaText;

  return [
    { label: "CSS Variable", code: `--color-primary: ${cssValue};` },
    { label: "Background", code: `background-color: ${cssValue};` },
    { label: "Text color", code: `color: ${cssValue};` },
  ];
}

function getOpacityVariants(parsedColor) {
  return OPACITY_LEVELS.map((level) => {
    const alpha = level / 100;

    return {
      label: `${level}%`,
      value: `rgba(${parsedColor.red}, ${parsedColor.green}, ${parsedColor.blue}, ${formatAlpha(alpha)})`,
    };
  });
}

function rgbToHex({ red, green, blue }) {
  return `#${toHexPart(red)}${toHexPart(green)}${toHexPart(blue)}`;
}

function hexToRgb(hex) {
  return {
    red: Number.parseInt(hex.slice(1, 3), 16),
    green: Number.parseInt(hex.slice(3, 5), 16),
    blue: Number.parseInt(hex.slice(5, 7), 16),
  };
}

function getRgbDistance(color, target) {
  return Math.sqrt(
    (color.red - target.red) ** 2
      + (color.green - target.green) ** 2
      + (color.blue - target.blue) ** 2,
  );
}

function getTailwindMatch(parsedColor) {
  const maxDistance = Math.sqrt(3 * 255 ** 2);
  let closestMatch = null;

  Object.entries(TAILWIND_PALETTE).forEach(([name, scale]) => {
    Object.entries(scale).forEach(([stop, hex]) => {
      const distance = getRgbDistance(parsedColor, hexToRgb(hex));

      if (!closestMatch || distance < closestMatch.distance) {
        closestMatch = {
          name,
          stop,
          hex,
          distance,
          className: `${name}-${stop}`,
          similarity: Math.max(0, Math.round((1 - distance / maxDistance) * 100)),
        };
      }
    });
  });

  return {
    ...closestMatch,
    isExact: closestMatch.distance === 0,
  };
}

function getGeneratedTailwindPalette(parsedColor) {
  const { hue, saturation, lightness } = rgbToHsl(parsedColor);
  const lighterMix = {
    50: 0.92,
    100: 0.78,
    200: 0.58,
    300: 0.38,
    400: 0.18,
  };
  const darkerMix = {
    600: 0.16,
    700: 0.32,
    800: 0.5,
    900: 0.68,
    950: 0.84,
  };

  return TAILWIND_STOPS.map((stop) => {
    let stopLightness = lightness;

    if (stop < 500) {
      stopLightness = lightness + (98 - lightness) * lighterMix[stop];
    }

    if (stop > 500) {
      stopLightness = lightness - (lightness - 6) * darkerMix[stop];
    }

    return {
      stop,
      hex: rgbToHex(hslToRgb(hue, saturation, Math.min(98, Math.max(6, stopLightness)))),
    };
  });
}

function getPaletteCssVariables(palette) {
  return palette.map(({ stop, hex }) => `--color-${stop}: ${hex};`).join("\n");
}

function getPaletteTailwindConfig(palette) {
  const colors = palette.map(({ stop, hex }) => `      ${stop}: '${hex}',`).join("\n");

  return `colors: {
  primary: {
${colors}
  }
}`;
}

function getCopyToastMessage(label) {
  if (!label) {
    return "";
  }

  if (label === "Share URL") {
    return "Share link copied";
  }

  if (label.startsWith("Palette")) {
    return `${label.replace("Palette ", "")} copied`;
  }

  if (label.startsWith("Tailwind")) {
    return "Tailwind class copied";
  }

  if (label.startsWith("Opacity")) {
    return "RGBA opacity copied";
  }

  return `${label} copied`;
}

async function copyText(text) {
  await navigator.clipboard.writeText(text);
}

function CopyButton({ label, text, copiedKey, onCopy }) {
  const copied = copiedKey === label;

  return (
    <button
      type="button"
      className="copy-button"
      onClick={() => onCopy(label, text)}
      aria-label={copied ? `${label} copied` : `Copy ${label} code`}
      title={copied ? `${label} copied` : `Copy ${label}`}
    >
      <span className="copy-icon" aria-hidden="true">
        {copied ? (
          <svg viewBox="0 0 24 24" focusable="false">
            <path
              d="M20 6L9 17l-5-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" focusable="false">
            <rect
              x="9"
              y="9"
              width="10"
              height="10"
              rx="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M15 9V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </button>
  );
}

function ShareButton({ parsedColor, copiedKey, onCopy }) {
  const shareUrl = new URL(window.location.href);
  shareUrl.searchParams.set("color", parsedColor.hex.slice(0, 7));

  return (
    <button
      type="button"
      className="share-button"
      onClick={() => onCopy("Share URL", shareUrl.toString())}
      aria-label="Copy shareable color URL"
      title={copiedKey === "Share URL" ? "Link copied" : "Copy share link"}
    >
      <span className="copy-icon" aria-hidden="true">
        {copiedKey === "Share URL" ? (
          <svg viewBox="0 0 24 24" focusable="false">
            <path
              d="M20 6L9 17l-5-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" focusable="false">
            <circle cx="18" cy="5" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="6" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="18" cy="19" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M8.7 10.7l6.6-4.4M8.7 13.3l6.6 4.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </span>
    </button>
  );
}

export default function App() {
  const [value, setValue] = useState(() => getInitialInputValue());
  const [copiedKey, setCopiedKey] = useState("");
  const [isSnippetModalOpen, setIsSnippetModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [recentColors, setRecentColors] = useState(() => getInitialRecentColors());
  const [initialColor] = useState(() => getRandomInitialColor());
  const colorPickerRef = useRef(null);
  const parsedColor = useMemo(() => parseColor(value), [value]);
  const activeColor = parsedColor?.cssColor ?? initialColor;
  const textColor = parsedColor ? getContrastColor(parsedColor) : "#FFFFFF";
  const swatchTextColor = parsedColor ? getContrastColor(parsedColor) : "#FFFFFF";
  const conversionCards = useMemo(
    () => (parsedColor ? getConversionCards(parsedColor) : []),
    [parsedColor],
  );
  const contrastCards = useMemo(() => {
    if (!parsedColor) {
      return [];
    }

    return [
      { label: "White text", textColor: "#FFFFFF", ratio: getContrastRatio(WHITE, parsedColor) },
      { label: "Black text", textColor: "#111111", ratio: getContrastRatio(BLACK, parsedColor) },
    ];
  }, [parsedColor]);
  const codeSnippets = useMemo(
    () => (parsedColor ? getCodeSnippets(parsedColor) : []),
    [parsedColor],
  );
  const cssSnippets = useMemo(
    () => (parsedColor ? getCssSnippets(parsedColor) : []),
    [parsedColor],
  );
  const opacityVariants = useMemo(
    () => (parsedColor ? getOpacityVariants(parsedColor) : []),
    [parsedColor],
  );
  const tailwindMatch = useMemo(
    () => (parsedColor ? getTailwindMatch(parsedColor) : null),
    [parsedColor],
  );
  const tailwindPalette = useMemo(
    () => (parsedColor ? getGeneratedTailwindPalette(parsedColor) : []),
    [parsedColor],
  );
  const tailwindPaletteCss = useMemo(
    () => getPaletteCssVariables(tailwindPalette),
    [tailwindPalette],
  );
  const tailwindPaletteConfig = useMemo(
    () => getPaletteTailwindConfig(tailwindPalette),
    [tailwindPalette],
  );
  const primarySnippets = useMemo(
    () => codeSnippets.filter((snippet) => PRIMARY_SNIPPETS.includes(snippet.label)),
    [codeSnippets],
  );
  const extraSnippets = useMemo(
    () => codeSnippets.filter((snippet) => !PRIMARY_SNIPPETS.includes(snippet.label)),
    [codeSnippets],
  );
  const copyToastMessage = getCopyToastMessage(copiedKey);

  useEffect(() => {
    if (!copiedKey) {
      return undefined;
    }

    const timer = window.setTimeout(() => setCopiedKey(""), 1500);
    return () => window.clearTimeout(timer);
  }, [copiedKey]);

  async function handleCopy(label, text) {
    try {
      await copyText(text);
      setCopiedKey(label);
    } catch {
      setCopiedKey("");
    }
  }

  useEffect(() => {
    setIsSnippetModalOpen(false);
    setIsAboutModalOpen(false);
    setIsShortcutsModalOpen(false);
  }, [value]);

  useEffect(() => {
    if (parsedColor) {
      updateColorQuery(parsedColor.hex);
    }
  }, [parsedColor]);

  useEffect(() => {
    if (!parsedColor) {
      return undefined;
    }

    const color = parsedColor.hex;
    const timer = window.setTimeout(() => {
      setRecentColors((currentColors) => {
        const nextColors = [
          color,
          ...currentColors.filter((currentColor) => currentColor !== color),
        ].slice(0, 10);

        saveRecentColors(nextColors);
        return nextColors;
      });
    }, 800);

    return () => window.clearTimeout(timer);
  }, [parsedColor]);

  useEffect(() => {
    if (!isSnippetModalOpen && !isAboutModalOpen && !isShortcutsModalOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsSnippetModalOpen(false);
        setIsAboutModalOpen(false);
        setIsShortcutsModalOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAboutModalOpen, isShortcutsModalOpen, isSnippetModalOpen]);

  useEffect(() => {
    function handleGlobalKeyDown(event) {
      const target = event.target;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable;

      if (isTyping) {
        return;
      }

      if (event.key === "?" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        setIsShortcutsModalOpen(true);
        return;
      }

      if (!parsedColor) {
        return;
      }

      const isCopyShortcut =
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "c" &&
        !event.altKey;

      if (!isCopyShortcut) {
        return;
      }

      event.preventDefault();

      if (event.shiftKey) {
        handleCopy("RGB", parsedColor.rgbText);
      } else {
        handleCopy("HEX", parsedColor.hex);
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [parsedColor]);

  function handleClearInput() {
    setValue("");
    updateColorQuery("");
  }

  function handleRestoreRecentColor(color) {
    setValue(color);
  }

  function handleClearRecentColors() {
    setRecentColors([]);
    saveRecentColors([]);
  }

  return (
    <main
      className="app-shell"
      style={{
        backgroundColor: activeColor,
        color: textColor,
      }}
    >
      <div className="overlay" />

      <section className="toolkit-shell">
        <div className="control-panel">
          <p className="eyebrow">HEX · RGB · RGBA · HSL · HSB</p>
          <h1>ColorDevKit</h1>
          <p className="tagline">Convert, inspect, and export any color for any platform.</p>
          <p className="intro">
            Paste a color like <span>rgb(255, 99, 71)</span>,{" "}
            <span>rgba(255, 99, 71, 0.6)</span>, <span>hsl(9, 100%, 64%)</span>,
            {" "}or <span>#FF6347</span>.
          </p>

          <div className="hero-control">
            <label className="input-wrap" htmlFor="color-input">
              <input
                id="color-input"
                type="text"
                inputMode="text"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    handleClearInput();
                  }
                }}
                placeholder="Enter HEX, RGB, RGBA, HSL, or HSB"
                autoComplete="off"
                spellCheck="false"
                autoFocus
              />
              <button
                type="button"
                className={`color-picker-button ${value ? "" : "color-picker-button-solo"}`}
                onClick={() => colorPickerRef.current?.click()}
                aria-label="Pick a color"
                title="Pick a color"
              >
                <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                  <path d="M14.5 5.5l4 4M13 7l4 4-8.5 8.5H4.5v-4L13 7z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15.5 4.5l4 4" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
                </svg>
              </button>
              <input
                ref={colorPickerRef}
                className="native-color-input"
                type="color"
                value={parsedColor ? parsedColor.hex.slice(0, 7) : "#FF6347"}
                onChange={(event) => setValue(event.target.value.toUpperCase())}
                aria-label="Native color picker"
                tabIndex="-1"
              />
              {value ? (
                <button
                  type="button"
                  className="clear-input-button"
                  onClick={handleClearInput}
                  aria-label="Clear color input"
                  title="Clear"
                >
                  <span aria-hidden="true">×</span>
                </button>
              ) : null}
            </label>

            <div
              className={`color-swatch ${parsedColor ? "" : "color-swatch-empty"}`}
              style={parsedColor ? { backgroundColor: parsedColor.cssColor, color: swatchTextColor } : undefined}
            >
              <span>{parsedColor ? parsedColor.hex : "Your color will appear here"}</span>
            </div>

            {recentColors.length > 0 ? (
              <section className="recent-panel" aria-labelledby="recent-title">
                <button
                  type="button"
                  className="recent-toggle"
                  onClick={() => setIsHistoryOpen((isOpen) => !isOpen)}
                  aria-expanded={isHistoryOpen}
                >
                  <span id="recent-title">Recent colors</span>
                  <span aria-hidden="true">{isHistoryOpen ? "−" : "+"}</span>
                </button>

                {isHistoryOpen ? (
                  <div className="recent-list">
                    {recentColors.map((color) => (
                      <button
                        type="button"
                        className="recent-color"
                        key={color}
                        onClick={() => handleRestoreRecentColor(color)}
                      >
                        <span
                          className="recent-dot"
                          style={{ backgroundColor: parseColor(color)?.cssColor }}
                        />
                        <span>{color}</span>
                      </button>
                    ))}

                    <button
                      type="button"
                      className="recent-clear"
                      onClick={handleClearRecentColors}
                    >
                      Clear
                    </button>
                  </div>
                ) : null}
              </section>
            ) : null}
          </div>

          <section className="seo-links-panel" aria-labelledby="seo-links-title">
            <div className="seo-links-header">
              <span className="section-kicker" id="seo-links-title">Resources</span>
              <p>Landing pages for specific conversions and platform workflows.</p>
            </div>

            <div className="seo-link-group">
              <strong>Converter pages</strong>
              <div className="seo-link-list">
                <a href="/hex-to-rgb-converter.html">HEX to RGB</a>
                <a href="/rgb-to-hex-converter.html">RGB to HEX</a>
                <a href="/rgba-to-hex-converter.html">RGBA to HEX</a>
              </div>
            </div>

            <div className="seo-link-group">
              <strong>Platform guides</strong>
              <div className="seo-link-list">
                <a href="/hex-to-swiftui-color.html">SwiftUI</a>
                <a href="/hex-to-kotlin-color.html">Kotlin</a>
                <a href="/hex-to-react-color.html">React</a>
                <a href="/hex-to-flutter-color.html">Flutter</a>
              </div>
            </div>

            <div className="seo-link-group">
              <strong>Learn</strong>
              <div className="seo-link-list">
                <a href="/hex-vs-rgb-vs-rgba.html">HEX vs RGB vs RGBA</a>
                <a href="/how-to-use-hex-colors-in-flutter.html">HEX in Flutter</a>
                <a href="/how-to-use-hex-colors-in-react.html">HEX in React</a>
              </div>
            </div>
          </section>
        </div>

        <div className="workspace-panel">
          {parsedColor ? (
            <>
              <section className="tool-section conversions-section" aria-labelledby="conversions-title">
                <div className="section-header">
                  <div>
                    <p className="section-kicker">Inspect</p>
                    <h2 id="conversions-title" className="section-title">Conversions</h2>
                  </div>
                  <p>Copy the format your next toolchain needs.</p>
                </div>

                <div className="result-panel">
                  {conversionCards.map((card) => (
                    <div className="result-row" key={card.label}>
                      <div className="result-top">
                        <span>{card.label}</span>
                        <div className="card-actions">
                          {card.label === "HEX" ? (
                            <ShareButton
                              parsedColor={parsedColor}
                              copiedKey={copiedKey}
                              onCopy={handleCopy}
                            />
                          ) : null}
                          <CopyButton
                            label={card.label}
                            text={card.value}
                            copiedKey={copiedKey}
                            onCopy={handleCopy}
                          />
                        </div>
                      </div>
                      <strong className={card.muted ? "result-muted" : undefined}>
                        {card.value}
                      </strong>
                    </div>
                  ))}
                </div>
              </section>

              <section className="tool-section contrast-section" aria-labelledby="contrast-title">
                <div className="section-header">
                  <div>
                    <p className="section-kicker">Accessibility</p>
                    <h2 id="contrast-title" className="section-title">Contrast checker</h2>
                  </div>
                </div>

                <div className="contrast-grid">
                  {contrastCards.map((card) => {
                    const level = getWcagLevel(card.ratio);

                    return (
                      <article className="contrast-card" key={card.label}>
                        <div className="contrast-top">
                          <span>{card.label}</span>
                          <span
                            className={`wcag-badge wcag-${level.toLowerCase()}`}
                            title="WCAG thresholds: AAA >= 7:1, AA >= 4.5:1, AA Large >= 3:1"
                          >
                            {level}
                          </span>
                        </div>
                        <strong>{card.ratio.toFixed(2)}:1</strong>
                        <div
                          className="contrast-preview"
                          style={{
                            backgroundColor: parsedColor.cssColor,
                            color: card.textColor,
                          }}
                        >
                          Sample text Aa
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              <section className="tool-section opacity-section" aria-labelledby="opacity-title">
                <div className="section-header">
                  <div>
                    <p className="section-kicker">Variants</p>
                    <h2 id="opacity-title" className="section-title">Opacity variants</h2>
                  </div>
                  <p>Click a swatch to copy its rgba value.</p>
                </div>

                <div className="opacity-strip">
                  {opacityVariants.map((variant) => (
                    <button
                      type="button"
                      className="opacity-swatch"
                      key={variant.label}
                      onClick={() => handleCopy(`Opacity ${variant.label}`, variant.value)}
                      title={
                        copiedKey === `Opacity ${variant.label}`
                          ? "Copied!"
                          : `Copy ${variant.value}`
                      }
                    >
                      <span
                        className="opacity-color"
                      >
                        <span style={{ backgroundColor: variant.value }} />
                      </span>
                      <span>{variant.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="tool-section developer-section" aria-labelledby="developer-title">
                <div className="section-header">
                  <div>
                    <p className="section-kicker">Export</p>
                    <h2 id="developer-title" className="section-title">Developer snippets</h2>
                  </div>
                  <p>Platform-ready code for mobile and web projects.</p>
                </div>

                {tailwindMatch ? (
                  <div className="tailwind-match-card">
                    <div className="tailwind-match-preview">
                      <div>
                        <span>Entered</span>
                        <strong>{parsedColor.hex.slice(0, 7)}</strong>
                        <i style={{ backgroundColor: parsedColor.cssColor }} />
                      </div>
                      <div>
                        <span>Tailwind</span>
                        <strong>{tailwindMatch.className}</strong>
                        <i style={{ backgroundColor: tailwindMatch.hex }} />
                      </div>
                    </div>

                    <p className="match-note">
                      {tailwindMatch.isExact
                        ? "Exact match"
                        : `Closest match (~${tailwindMatch.similarity}% similar)`}
                    </p>

                    <div className="tailwind-class-grid">
                      {["bg", "text", "border"].map((prefix) => {
                        const utility = `${prefix}-${tailwindMatch.className}`;

                        return (
                          <button
                            type="button"
                            className="tailwind-class-button"
                            key={utility}
                            onClick={() => handleCopy(`Tailwind ${utility}`, utility)}
                            title={
                              copiedKey === `Tailwind ${utility}`
                                ? "Copied!"
                                : `Copy ${utility}`
                            }
                          >
                            <code>{utility}</code>
                            <span className="copy-icon" aria-hidden="true">
                              {copiedKey === `Tailwind ${utility}` ? (
                                <svg viewBox="0 0 24 24" focusable="false">
                                  <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              ) : (
                                <svg viewBox="0 0 24 24" focusable="false">
                                  <rect x="9" y="9" width="10" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                                  <path d="M15 9V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                <div className="snippet-grid">
                  {primarySnippets.map((snippet) => (
                    <article className="snippet-card" key={snippet.label}>
                      <div className="snippet-top">
                        <span>{snippet.label}</span>
                        <CopyButton
                          label={snippet.label}
                          text={snippet.code}
                          copiedKey={copiedKey}
                          onCopy={handleCopy}
                        />
                      </div>
                      <code>{snippet.code}</code>
                    </article>
                  ))}
                </div>

                {extraSnippets.length > 0 ? (
                  <div className="more-snippets">
                    <button
                      type="button"
                      className="more-button"
                      onClick={() => setIsSnippetModalOpen(true)}
                      aria-haspopup="dialog"
                      aria-expanded={isSnippetModalOpen}
                    >
                      Show more snippets
                    </button>
                  </div>
                ) : null}
              </section>

              <section className="tool-section css-section" aria-labelledby="css-title">
                <div className="section-header">
                  <div>
                    <p className="section-kicker">CSS</p>
                    <h2 id="css-title" className="section-title">CSS snippets</h2>
                  </div>
                  <p>Copy common CSS declarations without rewriting them.</p>
                </div>

                <div className="snippet-grid css-snippet-grid">
                  {cssSnippets.map((snippet) => (
                    <article className="snippet-card" key={snippet.label}>
                      <div className="snippet-top">
                        <span>{snippet.label}</span>
                        <CopyButton
                          label={snippet.label}
                          text={snippet.code}
                          copiedKey={copiedKey}
                          onCopy={handleCopy}
                        />
                      </div>
                      <code>{snippet.code}</code>
                    </article>
                  ))}
                </div>
              </section>

              <section className="tool-section palette-section" aria-labelledby="palette-title">
                <div className="section-header">
                  <div>
                    <p className="section-kicker">Scale</p>
                    <h2 id="palette-title" className="section-title">Generate Tailwind palette</h2>
                  </div>
                  <p>Uses your color as the 500 base and shifts lightness for the full scale.</p>
                </div>

                <div className="palette-row">
                  {tailwindPalette.map((color) => (
                    <button
                      type="button"
                      className="palette-swatch"
                      key={color.stop}
                      onClick={() => handleCopy(`Palette ${color.stop}`, color.hex)}
                      title={
                        copiedKey === `Palette ${color.stop}`
                          ? "Copied!"
                          : `Copy ${color.hex}`
                      }
                    >
                      <span
                        className="palette-color"
                        style={{ backgroundColor: color.hex }}
                      />
                      <strong>{color.stop}</strong>
                      <span>{color.hex}</span>
                    </button>
                  ))}
                </div>

                <div className="palette-actions">
                  <button
                    type="button"
                    className="palette-copy-button"
                    onClick={() => handleCopy("Palette CSS variables", tailwindPaletteCss)}
                  >
                    Copy as CSS variables
                  </button>
                  <button
                    type="button"
                    className="palette-copy-button"
                    onClick={() => handleCopy("Palette Tailwind config", tailwindPaletteConfig)}
                  >
                    Copy as Tailwind config
                  </button>
                </div>
              </section>
            </>
          ) : (
            <div className="empty-workspace">
              <p className="section-kicker">Ready when you are</p>
              <h2>Start with any color format</h2>
              <p>
                Enter a valid <strong>rgb(...)</strong>, <strong>rgba(...)</strong>,
                {" "}<strong>hsl(...)</strong>, <strong>hsb(...)</strong>, or
                {" "}<strong>#hex</strong> value to unlock conversions, contrast,
                sharing, and code snippets.
              </p>
            </div>
          )}
        </div>

        <footer className="site-footer">
          <a href="/about.html" className="footer-link">
            About
          </a>
          <a href="/privacy.html">Privacy Policy</a>
          <a href="/terms.html">Terms</a>
        </footer>
      </section>

      {isSnippetModalOpen ? (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setIsSnippetModalOpen(false)}
        >
          <section
            className="snippet-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="extra-snippets-title"
            onClick={(event) => event.stopPropagation()}
            style={{
              backgroundColor: activeColor,
              color: textColor,
            }}
          >
            <div className="modal-header">
              <div>
                <p className="modal-eyebrow">Extra snippets</p>
                <h3 id="extra-snippets-title">More developer code</h3>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsSnippetModalOpen(false)}
                aria-label="Close extra snippets"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <div className="snippet-grid modal-snippet-grid">
              {extraSnippets.map((snippet) => (
                <article className="snippet-card" key={snippet.label}>
                  <div className="snippet-top">
                    <span>{snippet.label}</span>
                    <CopyButton
                      label={snippet.label}
                      text={snippet.code}
                      copiedKey={copiedKey}
                      onCopy={handleCopy}
                    />
                  </div>
                  <code>{snippet.code}</code>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {isAboutModalOpen ? (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setIsAboutModalOpen(false)}
        >
          <section
            className="snippet-modal about-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-modal-title"
            onClick={(event) => event.stopPropagation()}
            style={{
              backgroundColor: activeColor,
              color: textColor,
            }}
          >
            <div className="modal-header">
              <div>
                <p className="modal-eyebrow">About</p>
                <h3 id="about-modal-title">About ColorDevKit</h3>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsAboutModalOpen(false)}
                aria-label="Close about dialog"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <div className="about-copy">
              <p>
                ColorDevKit is a fast and developer-friendly color code converter
                designed to simplify working with colors across platforms. It allows
                you to instantly convert between HEX, RGB, and RGBA values and
                generate ready-to-use code for modern development frameworks.
              </p>
              <p>
                Whether you're building mobile apps, websites, or design systems,
                ColorDevKit helps you work with colors more efficiently.
              </p>

              <h4>What You Can Do</h4>
              <p>ColorDevKit provides essential color conversion tools for developers:</p>
              <ul>
                <li>Convert HEX to RGB and RGBA in real time</li>
                <li>Convert RGB/RGBA to HEX instantly</li>
                <li>Copy ready-to-use color code for SwiftUI</li>
                <li>Copy Kotlin code for Android development</li>
                <li>Copy React and React Native color values</li>
                <li>Copy Flutter color code</li>
                <li>Use snippets for other popular frameworks</li>
              </ul>
              <p>
                All conversions are accurate, fast, and optimized for developer workflows.
              </p>

              <h4>Built for Developers & Designers</h4>
              <p>ColorDevKit is ideal for:</p>
              <ul>
                <li>iOS developers using SwiftUI</li>
                <li>Android developers working with Kotlin</li>
                <li>Web developers using React</li>
                <li>Flutter developers building cross-platform apps</li>
                <li>UI/UX designers creating consistent color systems</li>
              </ul>

              <h4>Fast, Simple, and Efficient</h4>
              <ul>
                <li>Paste any color value and get instant results</li>
                <li>No login or setup required</li>
                <li>Clean interface focused on productivity</li>
                <li>Perfect for UI development, theming, and design systems</li>
              </ul>

              <h4>Why ColorDevKit</h4>
              <p>
                If you're looking for a reliable HEX to RGB converter, RGBA generator,
                or multi-platform color code tool, ColorDevKit provides everything you
                need in one place: fast, simple, and built for developers.
              </p>
            </div>
          </section>
        </div>
      ) : null}

      {isShortcutsModalOpen ? (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setIsShortcutsModalOpen(false)}
        >
          <section
            className="snippet-modal shortcuts-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-modal-title"
            onClick={(event) => event.stopPropagation()}
            style={{
              backgroundColor: activeColor,
              color: textColor,
            }}
          >
            <div className="modal-header">
              <div>
                <p className="modal-eyebrow">Keyboard</p>
                <h3 id="shortcuts-modal-title">Shortcuts</h3>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsShortcutsModalOpen(false)}
                aria-label="Close shortcuts dialog"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <div className="shortcut-list">
              <div>
                <kbd>Esc</kbd>
                <span>Clear the input while typing</span>
              </div>
              <div>
                <kbd>⌘ / Ctrl + C</kbd>
                <span>Copy HEX when focus is outside the input</span>
              </div>
              <div>
                <kbd>⌘ / Ctrl + Shift + C</kbd>
                <span>Copy RGB when focus is outside the input</span>
              </div>
              <div>
                <kbd>?</kbd>
                <span>Open this shortcuts dialog</span>
              </div>
            </div>
          </section>
        </div>
      ) : null}

      <div
        className={`copy-toast ${copyToastMessage ? "copy-toast-visible" : ""}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="copy-toast-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>{copyToastMessage}</span>
      </div>
    </main>
  );
}
