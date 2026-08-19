import Link from "next/link";

export function SiteNav({ current = "home" }: { current?: "home" | "generate" }) {
  return (
    <header className="border-b border-border/80 bg-cream/90 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-surface font-serif font-semibold text-sm shadow-sm transition-transform group-hover:scale-105">
            L
          </span>
          <span className="font-serif font-semibold text-lg text-ink tracking-tight">
            lookie
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className={`transition-colors ${
              current === "home"
                ? "text-ink font-semibold"
                : "text-muted hover:text-ink"
            }`}
          >
            Overview
          </Link>
          <Link
            href="/generate"
            className={`transition-colors ${
              current === "generate"
                ? "text-ink font-semibold"
                : "text-muted hover:text-ink"
            }`}
          >
            Generator
          </Link>
          <a
            href="https://github.com/rafiakem/lookie"
            target="_blank"
            rel="noreferrer"
            className="text-muted hover:text-ink transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
