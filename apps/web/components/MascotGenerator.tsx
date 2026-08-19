"use client";

import { useMemo, useState, useId, useEffect, useRef } from "react";
import { buildMascotSvg, type MascotConfig } from "@/lib/svgBuilder";
import type { ExpressionName } from "lookie";

const COLOR_PRESETS = [
  { name: "Blue", body: "#2563eb", stroke: "#1d4ed8" },
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

const chipBase =
  "rounded-full border px-3 py-1.5 text-xs transition-colors capitalize " +
  "focus-visible:outline-2 focus-visible:outline-accent";
const chipIdle = "border-border bg-surface text-muted hover:border-ink/40 hover:text-ink";
const chipActive = "border-ink bg-ink text-surface";

export function MascotGenerator({ initialSvg }: { initialSvg: string }) {
  const [bodyColor, setBodyColor] = useState("#2563eb");
  const [strokeColor, setStrokeColor] = useState("#1d4ed8");
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

  const exprDesc =
    AVAILABLE_EXPRESSIONS.find((e) => e.name === selectedExpr)?.desc ?? "";

  return (
    <div>
      {/* STUDIO: heavy preview frame left, editorial controls right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT: LIVE PREVIEW */}
        <figure className="lg:col-span-7">
          <div className="bg-surface border-8 border-ink shadow-[8px_8px_0_rgba(15,23,42,.14)] p-6 md:p-10">
            <div className="h-64 md:h-80 relative overflow-hidden flex items-center justify-center">
              {/* Live rig: server-rendered initial SVG (no blank frame pre-hydration),
              lookie drives it via Lookie.setSvg once ready */}
              <div className="lookie w-40 h-40" aria-hidden="true">
                <div className="bob-wrap" dangerouslySetInnerHTML={{ __html: initialSvg }} />
              </div>
            </div>
          </div>
          <figcaption className="flex items-baseline justify-between mt-3 text-xs">
            <span className="font-semibold text-ink">Live rig</span>
            <span className="text-muted">
              {selectedExpr} · {eyeSize} eyes
            </span>
          </figcaption>
          <p className="mt-2 text-xs leading-relaxed text-muted max-w-sm">
            Keeps the layer contract classes (<code className="font-mono">body</code>,{" "}
            <code className="font-mono">eyes</code>, <code className="font-mono">pupils</code>,{" "}
            <code className="font-mono">mouths</code>, <code className="font-mono">m-*</code>,{" "}
            <code className="font-mono">hand</code>) so any custom SVG animates out of the box.
          </p>
        </figure>

        {/* RIGHT: EDITORIAL CONTROL LIST */}
        <div className="lg:col-span-5 lg:border-l lg:border-border lg:pl-8 lg:py-1">
          {/* 01 · COLOR */}
          <div className="py-6 border-b border-border">
            <p className="font-serif text-accent text-lg leading-none">01</p>
            <h3 className="mt-1.5 font-semibold text-sm text-ink">Color</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setBodyColor(preset.body);
                    setStrokeColor(preset.stroke);
                  }}
                  aria-pressed={bodyColor === preset.body && strokeColor === preset.stroke}
                  className={`${chipBase} flex items-center gap-1.5 ${
                    bodyColor === preset.body && strokeColor === preset.stroke
                      ? chipActive
                      : chipIdle
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: preset.body }}
                  />
                  {preset.name}
                </button>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor={bodyInputId}
                  className="text-xs text-muted font-medium block"
                >
                  Body fill
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id={bodyInputId}
                    type="color"
                    value={bodyColor}
                    onChange={(e) => setBodyColor(e.target.value)}
                    className="w-8 h-8 p-0.5 rounded border border-border bg-surface cursor-pointer"
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
                  className="text-xs text-muted font-medium block"
                >
                  Stroke outline
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id={strokeInputId}
                    type="color"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    className="w-8 h-8 p-0.5 rounded border border-border bg-surface cursor-pointer"
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
          </div>

          {/* 02 · EYES */}
          <div className="py-6 border-b border-border">
            <p className="font-serif text-accent text-lg leading-none">02</p>
            <h3 className="mt-1.5 font-semibold text-sm text-ink">Eye proportion</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["small", "medium", "large"] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setEyeSize(size)}
                  aria-pressed={eyeSize === size}
                  className={`${chipBase} ${eyeSize === size ? chipActive : chipIdle}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* 03 · MOUTH */}
          <div className="py-6 border-b border-border">
            <p className="font-serif text-accent text-lg leading-none">03</p>
            <h3 className="mt-1.5 font-semibold text-sm text-ink">Resting mouth</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["happy", "flat", "o", "big", "sad", "slant"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMouthStyle(m)}
                  aria-pressed={mouthStyle === m}
                  className={`${chipBase} ${mouthStyle === m ? chipActive : chipIdle}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* 04 · EXPRESSION RIG */}
          <div className="py-6">
            <p className="font-serif text-accent text-lg leading-none">04</p>
            <h3 className="mt-1.5 font-semibold text-sm text-ink">Expression rig</h3>
            <p className="mt-1 text-xs text-muted">{exprDesc}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {AVAILABLE_EXPRESSIONS.map((expr) => (
                <button
                  key={expr.name}
                  type="button"
                  onClick={() => setSelectedExpr(expr.name)}
                  aria-pressed={selectedExpr === expr.name}
                  className={`${chipBase} ${selectedExpr === expr.name ? chipActive : chipIdle}`}
                >
                  {expr.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* EXPORT */}
      <div className="mt-14 pt-8 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8 items-end">
          <div>
            <p className="font-serif text-accent text-lg leading-none">05</p>
            <h3 className="mt-1.5 font-semibold text-sm text-ink">Export</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted max-w-md">
              The generated file follows the layer contract and works with the
              Lookie rig the moment it is loaded.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
            <button
              type="button"
              onClick={handleDownload}
              className="px-5 py-2.5 rounded bg-ink hover:bg-black text-surface text-sm font-medium transition-colors"
            >
              Download mascot.svg
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="px-5 py-2.5 rounded bg-transparent hover:bg-surface-2 border border-border text-ink text-sm font-medium transition-colors"
            >
              {copied ? "Copied to clipboard" : "Copy SVG source"}
            </button>
          </div>
        </div>
        <div className="mt-6 bg-surface-2/70 border border-border rounded p-4">
          <div className="flex items-baseline justify-between mb-2">
            <span className="font-mono text-xs text-muted">mascot.svg</span>
            <span className="font-mono text-xs text-muted">{svgCode.length} chars</span>
          </div>
          <pre className="font-mono text-xs leading-relaxed text-ink whitespace-pre-wrap break-all max-h-56 overflow-y-auto">
            {svgCode}
          </pre>
        </div>
      </div>
    </div>
  );
}