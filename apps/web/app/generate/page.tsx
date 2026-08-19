import { SiteNav } from "@/components/SiteNav";
import { MascotGenerator } from "@/components/MascotGenerator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mascot Generator - Lookie",
  description:
    "Customize and export your own Lookie mascot SVG with custom body hues, strokes, eye proportions, and mouth shapes.",
};

export default function GeneratePage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink">
      <SiteNav current="generate" />

      <main className="flex-1 max-w-5xl mx-auto px-5 w-full">
        {/* HERO: bloop-style asymmetric grid */}
        <section className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8 items-end pt-14 md:pt-20 pb-14 md:pb-16">
          <div>
            <p className="text-[13px] font-semibold tracking-[.08em] uppercase text-accent mb-4">
              Client-side studio
            </p>
            <h1 className="font-serif font-medium text-[clamp(2.4rem,6vw,3.8rem)] leading-[1.04] tracking-[-.02em] text-balance">
              Design a mascot that <em className="italic text-accent">watches</em> your users.
            </h1>
          </div>
          <div className="md:border-l md:border-border md:pl-8 flex flex-col gap-5">
            <p className="text-[17px] leading-relaxed text-muted max-w-[36ch]">
              Pick a palette, shape the eyes and mouth, then export an SVG
              that works with the Lookie rig out of the box. Runs entirely in
              your browser.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="#studio"
                className="px-5 py-2.5 rounded bg-transparent border border-border text-ink text-sm font-semibold transition-colors hover:border-ink"
              >
                Open the studio
              </a>
              <span className="text-[13px] text-muted">No uploads, no server</span>
            </div>
          </div>
        </section>

        <MascotGenerator />
      </main>

      <footer className="max-w-5xl mx-auto w-full px-5 py-7 mt-20 border-t border-border text-[13px] text-muted flex flex-col sm:flex-row items-center justify-between gap-3">
        <span>
          Lookie · Client-side generator · {"Authored by Rafi Akem"}
        </span>
        <a
          href="https://github.com/rafiakem/lookie"
          target="_blank"
          rel="noreferrer"
          className="hover:text-ink transition-colors"
        >
          GitHub Repository
        </a>
      </footer>
    </div>
  );
}