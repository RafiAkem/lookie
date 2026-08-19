"use client";

import dynamic from "next/dynamic";

const CodeBlock = dynamic(() => import("./CodeBlock").then((m) => m.CodeBlock), {
  ssr: false,
  loading: () => (
    <div className="rounded border border-border bg-surface-2 h-40 animate-pulse" aria-hidden="true" />
  ),
});

export function CopySnippet({ code, filename = "index.html" }: { code: string; filename?: string }) {
  return <CodeBlock code={code} filename={filename} />;
}