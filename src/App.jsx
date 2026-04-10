import { useEffect, useMemo, useState } from "react";

const INITIAL_COLOR = "rgb(255, 99, 71)";
const PRIMARY_SNIPPETS = ["SwiftUI", "Kotlin", "React", "Flutter"];

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

  return {
    mode: hasAlpha ? "hex-alpha" : "hex",
    red,
    green,
    blue,
    alpha,
    cssColor:
      alpha === null
        ? `rgb(${red}, ${green}, ${blue})`
        : `rgba(${red}, ${green}, ${blue}, ${formatAlpha(alpha)})`,
    hex: `#${hex.toUpperCase()}`,
    rgbText: `rgb(${red}, ${green}, ${blue})`,
    rgbaText:
      alpha === null
        ? `rgba(${red}, ${green}, ${blue}, 1)`
        : `rgba(${red}, ${green}, ${blue}, ${formatAlpha(alpha)})`,
  };
}

function parseColor(input) {
  return parseRgbLike(input) ?? parseHex(input);
}

function getContrastColor(parsedColor) {
  const { red, green, blue } = parsedColor;
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;
  return brightness > 160 ? "#111111" : "#FFFFFF";
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
    { label: "CSS", code: alpha === null ? cssHex : parsedColor.rgbaText },
    { label: "Android XML", code: argbHex },
  ];
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

export default function App() {
  const [value, setValue] = useState("");
  const [copiedKey, setCopiedKey] = useState("");
  const [isSnippetModalOpen, setIsSnippetModalOpen] = useState(false);
  const parsedColor = useMemo(() => parseColor(value), [value]);
  const activeColor = parsedColor?.cssColor ?? INITIAL_COLOR;
  const textColor = parsedColor ? getContrastColor(parsedColor) : "#FFFFFF";
  const codeSnippets = useMemo(
    () => (parsedColor ? getCodeSnippets(parsedColor) : []),
    [parsedColor],
  );
  const primarySnippets = useMemo(
    () => codeSnippets.filter((snippet) => PRIMARY_SNIPPETS.includes(snippet.label)),
    [codeSnippets],
  );
  const extraSnippets = useMemo(
    () => codeSnippets.filter((snippet) => !PRIMARY_SNIPPETS.includes(snippet.label)),
    [codeSnippets],
  );

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
  }, [value]);

  useEffect(() => {
    if (!isSnippetModalOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsSnippetModalOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSnippetModalOpen]);

  return (
    <main
      className="app-shell"
      style={{
        backgroundColor: activeColor,
        color: textColor,
      }}
    >
      <div className="overlay" />

      <section className="converter-card">
        <p className="eyebrow">RGB / RGBA / HEX</p>
        <h1>Color code converter</h1>
        <p className="intro">
          Paste a color like <span>rgb(255, 99, 71)</span>,{" "}
          <span>rgba(255, 99, 71, 0.6)</span>, or <span>#FF6347</span>.
        </p>
          
        <label className="input-wrap" htmlFor="color-input">
          <input
            id="color-input"
            type="text"
            inputMode="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Enter RGB, RGBA, or HEX"
            autoComplete="off"
            spellCheck="false"
            autoFocus
          />
          {value ? (
            <button
              type="button"
              className="clear-input-button"
              onClick={() => setValue("")}
              aria-label="Clear color input"
              title="Clear"
            >
              <span aria-hidden="true">×</span>
            </button>
          ) : null}
        </label>

        {parsedColor ? (
          <>
            <div className="result-panel">
              <div className="result-row">
                <div className="result-top">
                  <span>HEX</span>
                  <CopyButton
                    label="HEX"
                    text={parsedColor.hex}
                    copiedKey={copiedKey}
                    onCopy={handleCopy}
                  />
                </div>
                <strong>{parsedColor.hex}</strong>
              </div>

              <div className="result-row">
                <div className="result-top">
                  <span>RGB</span>
                  <CopyButton
                    label="RGB"
                    text={parsedColor.rgbText}
                    copiedKey={copiedKey}
                    onCopy={handleCopy}
                  />
                </div>
                <strong>{parsedColor.rgbText}</strong>
              </div>
            </div>

            <div className="developer-panel">
              <h2 className="developer-title">Developer snippets</h2>

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
            </div>
          </>
        ) : (
          <p className="error-text">
            Enter a valid <strong>rgb(...)</strong>, <strong>rgba(...)</strong>,
            {" "}or <strong>#hex</strong> value to see the conversion.
          </p>
        )}
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
    </main>
  );
}
