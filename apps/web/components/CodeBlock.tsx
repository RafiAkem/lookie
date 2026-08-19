"use client";

import { useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import markup from "react-syntax-highlighter/dist/esm/languages/prism/markup";
import ghcolors from "react-syntax-highlighter/dist/esm/styles/prism/ghcolors";

SyntaxHighlighter.registerLanguage("markup", markup);

const tokenStyle = {
  margin: 0,
  background: "#ffffff",
  padding: "1rem 1.125rem",
  fontSize: "0.75rem",
  lineHeight: 1.7,
};

export function CodeBlock({ code, filename }: { code: string; filename: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded border border-border bg-surface">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-surface-2 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-border" />
            <span className="w-2.5 h-2.5 rounded-full bg-border" />
            <span className="w-2.5 h-2.5 rounded-full bg-border" />
          </span>
          <span className="font-mono text-xs text-muted truncate">{filename}</span>
        </div>
        <button
          onClick={handleCopy}
          type="button"
          aria-label={`Copy ${filename} source`}
          className="shrink-0 px-2.5 py-1 rounded text-xs font-medium text-ink border border-border bg-surface hover:bg-surface-2 transition-colors"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language="markup"
        style={ghcolors}
        customStyle={tokenStyle}
        codeTagProps={{ style: { fontFamily: "var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)" } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}