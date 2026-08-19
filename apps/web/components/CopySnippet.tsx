"use client";

import { useState } from "react";

export function CopySnippet({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group bg-ink text-surface rounded p-4 font-mono text-xs overflow-x-auto border border-ink/20">
      <button
        onClick={handleCopy}
        type="button"
        className="absolute top-3 right-3 px-2.5 py-1 rounded bg-surface/10 hover:bg-surface/20 text-surface/90 text-xs transition-colors"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="pr-16 text-surface-2/90 leading-relaxed">{code}</pre>
    </div>
  );
}
