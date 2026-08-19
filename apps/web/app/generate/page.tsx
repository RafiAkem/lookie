import { SiteNav } from "@/components/SiteNav";
import { MascotMount } from "@/components/MascotMount";
import { MascotGenerator } from "@/components/MascotGenerator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mascot Generator - Lookie",
  description: "Customize and export your own Lookie mascot SVG with custom body hues, strokes, eye proportions, and mouth shapes.",
};

export default function GeneratePage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink">
      <SiteNav current="generate" />
      {/* No data-lookie-src on purpose: the generator owns the SVG via Lookie.setSvg */}
      <MascotMount />

      <main className="flex-1 max-w-5xl mx-auto px-5 py-12 md:py-16 w-full space-y-12">
        <section className="border-b border-border/60 pb-8 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-accent-soft text-accent text-xs font-semibold tracking-wide">
            Client-Side Studio v1
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-ink">
            Vector Mascot Generator
          </h1>
          <p className="text-muted text-base max-w-2xl leading-relaxed">
            Tune geometry parameters in real time. The generated file follows the Lookie layer contract classes and works out-of-the-box with the animation rig.
          </p>
        </section>

        <MascotGenerator />
      </main>

      <footer className="border-t border-border/80 bg-surface/50 py-10 mt-16">
        <div className="max-w-5xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div className="flex items-center gap-2">
            <span className="font-serif font-semibold text-ink">Lookie</span>
            <span>-</span>
            <span>Client-side Generator</span>
            <span>-</span>
            <span>Authored by Rafi Akem</span>
          </div>
          <div>
            <a
              href="https://github.com/rafiakem/lookie"
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink transition-colors"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
