"use client";

import { useMemo, useState, useId, useEffect, useRef } from "react";
import { buildMascotSvg, type MascotConfig } from "@/lib/svgBuilder";
import type { ExpressionName } from "lookie";

const COLOR_PRESETS = [
  { name: "Forest", body: "#1b5e20", stroke: "#144c1a" },
  { name: "Clay", body: "#9a4f2e", stroke: "#6e331b" },
  { name: "Ochre", body: "#8a6d3b", stroke: "#614924" },
  { name: "Indigo", body: "#2a4365", stroke: "#1a2a40" },
  { name: "Charcoal", body: "#374151", stroke: "#1f2937" },
  { name: "Plum", body: "#702459", stroke: "#4d153c" },
];

const AVAILABLE_EXPRESSIONS: Array<{ name: ExpressionName; desc: string }> = [
  { name: "happy", desc: "Default state" },
  { name: "thinking", desc: "Thinking state" },
  { name: "loading", desc: "Loading state" },
  { name: "processing", desc: "Processing state" },
  { name: "typing", desc: "Typing state" },
  { name: "secret", desc: "Secret state" },
  { name: "success", desc: "Success state" },
  { name: "error", desc: "Error state" },
];

/** Normalize a text input to a clean #hex value (never lets payloads through). */
function hexOnly(value: string, fallback: string): string {
  const clean = "#" + value.replace(/^#/, "").replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
  return /^#[0-9a-fA-F]{3,6}$/.test(clean) ? clean.toLowerCase() : fallback;
}

export function MascotGenerator() {
  const [bodyColor, setBodyColor] = useState("#1b5e20");
  const [strokeColor, setStrokeColor] = useState("#144c1a");
  const [eyeSize, setEyeSize] = useState<MascotConfig["eyeSize"]>("medium");
  const [mouthStyle, setMouthStyle] = useState<MascotConfig["mouthStyle"]>("happy");
  const [selectedExpr, setSelectedExpr] = useState<ExpressionName>("happy");
  const [copied, setCopied] = useState(false);

  const svgCode = useMemo(
    () =>
      buildMascotSvg({
        bodyColor,
        strokeColor,
        eyeSize,
        mouthStyle,
      }),
    [bodyColor, strokeColor, eyeSize, mouthStyle]
  );

  // Keep the page mascot in sync with the generator output. Waits for the
  // initial SVG load (whenReady) so a slow mascot.svg fetch can never
  // overwrite the generated design.
  const readyRef = useRef(false);
  useEffect(() => {
    let disposed = false;
    import("lookie").then(({ Lookie }) => {
      if (disposed || !Lookie?.el) return;
      const apply = () => {
        readyRef.current = true;
        Lookie.setSvg(svgCode);
        Lookie.set(selectedExpr);
      };
      if (readyRef.current) {
        apply();
        return;
      }
      Lookie.whenReady(apply);
    });
    return () => {
      disposed = true;
    };
  }, [svgCode, selectedExpr]);

  const handleDownload = () => {
    const blob = new Blob([svgCode], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mascot.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(svgCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bodyInputId = useId();
  const strokeInputId = useId();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT: CONTROLS */}
      <div className="lg:col-span-6 space-y-6">
        <div className="bg-surface p-6 rounded border border-border/80 shadow-sm space-y-6">
          <h2 className="font-serif text-xl font-semibold text-ink border-b border-border/60 pb-3">
            Customization Parameters
          </h2>

          {/* COLOR PRESETS */}
          <div className="space-y-2.5">
            <label className="text-xs uppercase tracking-wider text-muted font-medium block">
              Color Palette Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setBodyColor(preset.body);
                    setStrokeColor(preset.stroke);
                  }}
                  className={`flex items-center gap-2 p-2 rounded border text-xs text-left transition-all ${
                    bodyColor === preset.body && strokeColor === preset.stroke
                      ? "border-accent bg-accent-soft text-ink font-medium ring-1 ring-accent"
                      : "border-border hover:border-ink/30 bg-surface text-muted"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: preset.body }}
                  />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* CUSTOM COLOR INPUTS */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label
                htmlFor={bodyInputId}
                className="text-xs uppercase tracking-wider text-muted font-medium block"
              >
                Body Fill
              </label>
              <div className="flex items-center gap-2">
                <input
                  id={bodyInputId}
                  type="color"
                  value={bodyColor}
                  onChange={(e) => setBodyColor(e.target.value)}
                  className="w-9 h-9 p-0.5 rounded border border-border bg-surface cursor-pointer"
                />
                <input
                  type="text"
                  value={bodyColor}
                  onChange={(e) => setBodyColor(hexOnly(e.target.value, bodyColor))}
                  aria-label="Body fill hex color"
                  className="flex-1 font-mono text-xs px-2.5 py-2 rounded border border-border bg-surface text-ink uppercase"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor={strokeInputId}
                className="text-xs uppercase tracking-wider text-muted font-medium block"
              >
                Stroke Outline
              </label>
              <div className="flex items-center gap-2">
                <input
                  id={strokeInputId}
                  type="color"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="w-9 h-9 p-0.5 rounded border border-border bg-surface cursor-pointer"
                />
                <input
                  type="text"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(hexOnly(e.target.value, strokeColor))}
                  aria-label="Stroke outline hex color"
                  className="flex-1 font-mono text-xs px-2.5 py-2 rounded border border-border bg-surface text-ink uppercase"
                />
              </div>
            </div>
          </div>

          {/* EYE SIZE */}
          <div className="space-y-2 pt-2">
            <label className="text-xs uppercase tracking-wider text-muted font-medium block">
              Eye Proportion
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["small", "medium", "large"] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setEyeSize(size)}
                  className={`py-2 px-3 rounded text-xs capitalize border text-center transition-all ${
                    eyeSize === size
                      ? "border-accent bg-accent-soft text-ink font-semibold ring-1 ring-accent"
                      : "border-border bg-surface hover:border-ink/30 text-muted"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* BASE MOUTH STYLE */}
          <div className="space-y-2 pt-2">
            <label className="text-xs uppercase tracking-wider text-muted font-medium block">
              Resting Mouth Form
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["happy", "flat", "o", "big", "sad", "slant"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMouthStyle(m)}
                  className={`py-2 px-3 rounded text-xs capitalize border text-center transition-all ${
                    mouthStyle === m
                      ? "border-accent bg-accent-soft text-ink font-semibold ring-1 ring-accent"
                      : "border-border bg-surface hover:border-ink/30 text-muted"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* PREVIEW EXPRESSION TESTER */}
          <div className="space-y-2 pt-2">
            <label className="text-xs uppercase tracking-wider text-muted font-medium block">
              Test Rig Expression
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVAILABLE_EXPRESSIONS.map((expr) => (
                <button
                  key={expr.name}
                  type="button"
                  onClick={() => setSelectedExpr(expr.name)}
                  className={`py-1.5 px-2 rounded text-xs capitalize border text-center transition-all ${
                    selectedExpr === expr.name
                      ? "border-accent bg-accent text-surface font-semibold"
                      : "border-border bg-surface hover:border-ink/30 text-muted"
                  }`}
                >
                  {expr.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LAYER CONTRACT NOTICE */}
        <div className="p-4 rounded bg-surface-2/60 border border-border/80 text-xs text-ink/70 space-y-2">
          <p className="font-semibold text-ink">Bring your own design note</p>
          <p className="leading-relaxed">
            Keep the layer contract classes intact (<code className="font-mono text-ink font-medium">body</code>, <code className="font-mono text-ink font-medium">eyes</code>, <code className="font-mono text-ink font-medium">pupils</code>, <code className="font-mono text-ink font-medium">mouths</code>, <code className="font-mono text-ink font-medium">m-*</code>, <code className="font-mono text-ink font-medium">hand</code>). Any custom SVG containing these classes will animate properly.
          </p>
        </div>
      </div>

      {/* RIGHT: LIVE PREVIEW + EXPORT */}
      <div className="lg:col-span-6 space-y-6">
        <div className="bg-surface p-6 rounded border border-border/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h2 className="font-serif text-xl font-semibold text-ink">
              Live Preview
            </h2>
            <span className="text-xs font-mono text-muted uppercase">
              SVG Rig Output
            </span>
          </div>

          {/* PREVIEW CONTAINER */}
          <div className="w-full h-64 bg-cream rounded border border-border/60 flex items-center justify-center p-6 relative overflow-hidden">
            <div
              className="w-40 h-40"
              dangerouslySetInnerHTML={{ __html: svgCode }}
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded bg-accent hover:bg-accent-hover text-surface text-sm font-medium transition-colors shadow-sm"
            >
              Download mascot.svg
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded bg-surface hover:bg-surface-2 border border-border text-ink text-sm font-medium transition-colors"
            >
              {copied ? "Copied SVG to Clipboard" : "Copy SVG Source"}
            </button>
          </div>
        </div>

        {/* RAW SVG SOURCE VIEW */}
        <div className="bg-surface p-6 rounded border border-border/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-sm font-semibold text-ink">
              Generated SVG Markup
            </h3>
            <span className="font-mono text-xs text-muted">
              {svgCode.length} characters
            </span>
          </div>
          <div className="bg-ink text-surface rounded p-3.5 font-mono text-xs overflow-x-auto max-h-56 overflow-y-auto border border-ink/20">
            <pre className="text-surface-2/90 leading-relaxed whitespace-pre-wrap break-all">
              {svgCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
