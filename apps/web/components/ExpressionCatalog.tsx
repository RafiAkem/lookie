"use client";

import { useState } from "react";
import type { ExpressionName } from "lookie";

interface CatalogProps {
  expressions: Array<{ name: ExpressionName; desc: string }>;
}

export function ExpressionCatalog({ expressions }: CatalogProps) {
  const [activeExpr, setActiveExpr] = useState<string>("");

  const handleSelect = async (name: ExpressionName) => {
    const { Lookie } = await import("lookie");
    if (activeExpr === name) {
      Lookie.set("");
      setActiveExpr("");
    } else {
      Lookie.set(name);
      setActiveExpr(name);
    }
  };

  const handleReset = async () => {
    const { Lookie } = await import("lookie");
    Lookie.set("");
    setActiveExpr("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-muted font-medium">
          Interactive Expression Rig (Click to test)
        </p>
        {activeExpr && (
          <button
            onClick={handleReset}
            className="text-xs text-accent hover:underline font-medium"
          >
            Reset to scroll mode
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {expressions.map((e) => {
          const isSelected = activeExpr === e.name;
          return (
            <button
              key={e.name}
              type="button"
              onClick={() => handleSelect(e.name)}
              className={`text-left p-3.5 rounded border transition-all ${
                isSelected
                  ? "bg-surface border-accent shadow-sm ring-1 ring-accent"
                  : "bg-surface/80 hover:bg-surface border-border hover:border-ink/30"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-semibold text-ink">
                  {e.name}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? "bg-accent" : "bg-border"
                  }`}
                />
              </div>
              <p className="text-xs text-muted leading-snug line-clamp-2">
                {e.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
