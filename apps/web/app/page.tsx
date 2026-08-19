import { SiteNav } from "@/components/SiteNav";
import { MascotMount } from "@/components/MascotMount";
import { ExpressionCatalog } from "@/components/ExpressionCatalog";
import { CopySnippet } from "@/components/CopySnippet";
import Link from "next/link";

const EXPRESSIONS_DATA = [
  { name: "happy", desc: "Default resting state with gentle smile, blush, and pupil tracking." },
  { name: "thinking", desc: "Hand placed on chin and tilted mouth. Ideal for search, delays, and decision steps." },
  { name: "loading", desc: "Line eyes and faster bobbing. Triggered during async requests and data fetching." },
  { name: "processing", desc: "Focused O mouth with steady posture. Great for submissions and upload states." },
  { name: "typing", desc: "Eyes directed downward with tapping left hand. For text inputs and search bars." },
  { name: "secret", desc: "Playful wink with one hand shielding. For password fields and private tokens." },
  { name: "success", desc: "Cheering arc eyes with raised right hand. For confirmations, login, and saves." },
  { name: "error", desc: "Crossed eyes and tilted body. For validation failures, 404 pages, and alerts." },
] as const;

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink">
      <SiteNav current="home" />
      <MascotMount src="/mascot.svg" />

      <main className="flex-1 max-w-5xl mx-auto px-5 py-12 md:py-20 w-full space-y-24">
        {/* HERO SECTION */}
        <section
          data-mascot-expr="happy"
          className="pt-4 pb-10 border-b border-border/60"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-accent-soft text-accent text-xs font-semibold tracking-wide">
                v0.2.0 Open Source Mascot Rig
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-ink text-balance leading-[1.1]">
                Your cursor has a new friend.
              </h1>
              <p className="text-muted text-base sm:text-lg max-w-xl leading-relaxed">
                An ultra-lightweight SVG mascot that glides between page sections while its pupils follow your pointer. Zero dependencies.
              </p>
            </div>

            <div className="md:col-span-4 md:border-l md:border-border/60 md:pl-8 flex flex-col justify-between self-stretch gap-6 pt-2">
              <div className="space-y-2 text-xs text-muted">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span>Bundle size</span>
                  <span className="font-mono text-ink font-medium">2.1 KB gzip</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span>Dependencies</span>
                  <span className="font-mono text-ink font-medium">0 deps</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span>Rendering</span>
                  <span className="font-mono text-ink font-medium">Vector SVG</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-2.5">
                <Link
                  href="/generate"
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded bg-accent hover:bg-accent-hover text-surface text-sm font-medium transition-colors shadow-sm text-center"
                >
                  Custom Mascot Generator
                </Link>
                <a
                  href="https://github.com/rafiakem/lookie"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded bg-surface hover:bg-surface-2 border border-border text-ink text-sm font-medium transition-colors text-center"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK INSTALL SECTION */}
        <section
          data-mascot-expr="typing"
          className="space-y-6 pt-4 border-b border-border/60 pb-16"
        >
          <div className="flex items-baseline justify-between border-b border-border/60 pb-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-ink">
              Quick Setup
            </h2>
            <span className="font-mono text-xs text-muted">HTML or Modern Bundler</span>
          </div>

          <p className="text-muted text-sm sm:text-base max-w-2xl">
            Drop the mascot container into your HTML, add the stylesheet, and load the script. Lookie automatically registers scroll tracking and cursor listeners.
          </p>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wider text-muted font-medium">
              1. HTML Markup
            </p>
            <CopySnippet
              code={`<!-- 1. Stylesheet -->
<link rel="stylesheet" href="lookie.css">

<!-- 2. Mascot Container -->
<div class="lookie" data-lookie-src="mascot.svg" data-lookie-auto aria-hidden="true">
  <div class="bob-wrap"></div>
</div>

<!-- 3. Zero-dependency Engine -->
<script src="lookie.js" defer></script>`}
            />
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-xs uppercase tracking-wider text-muted font-medium">
              2. Add Section Hooks
            </p>
            <CopySnippet
              code={`<!-- Lookie glides here and triggers thinking expression -->
<section data-mascot-expr="thinking">
  <h2>Smart Analysis</h2>
</section>`}
            />
          </div>
        </section>

        {/* EXPRESSION RIG SECTION */}
        <section
          data-mascot-expr="thinking"
          className="space-y-6 pt-4 border-b border-border/60 pb-16"
        >
          <div className="flex items-baseline justify-between border-b border-border/60 pb-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-ink">
              Expression Catalog
            </h2>
            <span className="font-mono text-xs text-muted">8 built-in states</span>
          </div>

          <p className="text-muted text-sm sm:text-base max-w-2xl">
            Lookie ships with 8 vector expressions covering user workflows from async queries to secret inputs. Test them live below to see Lookie change on the right.
          </p>

          <ExpressionCatalog expressions={[...EXPRESSIONS_DATA]} />
        </section>

        {/* HOW IT WORKS EDITORIAL SECTION */}
        <section
          data-mascot-expr="processing"
          className="space-y-8 pt-4 border-b border-border/60 pb-16"
        >
          <div className="flex items-baseline justify-between border-b border-border/60 pb-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-ink">
              How It Works
            </h2>
            <span className="font-mono text-xs text-muted">Architecture breakdown</span>
          </div>

          <div className="divide-y divide-border/60 border-t border-border/60">
            <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              <span className="md:col-span-2 font-serif text-2xl font-semibold text-accent">
                01
              </span>
              <div className="md:col-span-4">
                <h3 className="font-serif text-lg font-semibold text-ink">
                  Pure SVG Vector Asset
                </h3>
                <p className="text-xs font-mono text-muted mt-1">
                  Layer-contract based rig
                </p>
              </div>
              <p className="md:col-span-6 text-sm text-muted leading-relaxed">
                Rendered with clean SVG geometry instead of heavy spritesheets or canvas pixels. Scales crisply to any DPI while remaining lightweight.
              </p>
            </div>

            <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              <span className="md:col-span-2 font-serif text-2xl font-semibold text-accent">
                02
              </span>
              <div className="md:col-span-4">
                <h3 className="font-serif text-lg font-semibold text-ink">
                  Viewport Scroll-Spy
                </h3>
                <p className="text-xs font-mono text-muted mt-1">
                  requestAnimationFrame loop
                </p>
              </div>
              <p className="md:col-span-6 text-sm text-muted leading-relaxed">
                Sections tagged with <code className="font-mono text-xs bg-surface-2 px-1 py-0.5 rounded text-ink">data-mascot-expr</code> trigger smooth lerp repositioning as soon as they intersect the 80% viewport guideline.
              </p>
            </div>

            <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              <span className="md:col-span-2 font-serif text-2xl font-semibold text-accent">
                03
              </span>
              <div className="md:col-span-4">
                <h3 className="font-serif text-lg font-semibold text-ink">
                  Pointer Eye Tracking
                </h3>
                <p className="text-xs font-mono text-muted mt-1">
                  Bounded pupil offset
                </p>
              </div>
              <p className="md:col-span-6 text-sm text-muted leading-relaxed">
                Captures mousemove and touchmove events, calculating target angles and translating pupil elements smoothly while clamping coordinates inside eyeballs.
              </p>
            </div>

            <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              <span className="md:col-span-2 font-serif text-2xl font-semibold text-accent">
                04
              </span>
              <div className="md:col-span-4">
                <h3 className="font-serif text-lg font-semibold text-ink">
                  Automatic Fetch Interceptor
                </h3>
                <p className="text-xs font-mono text-muted mt-1">
                  Optional data-lookie-auto
                </p>
              </div>
              <p className="md:col-span-6 text-sm text-muted leading-relaxed">
                Wraps native window.fetch to automatically toggle the loading expression during requests taking longer than 300 milliseconds, preventing UI flicker.
              </p>
            </div>

            <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              <span className="md:col-span-2 font-serif text-2xl font-semibold text-accent">
                05
              </span>
              <div className="md:col-span-4">
                <h3 className="font-serif text-lg font-semibold text-ink">
                  Accessibility & Safety
                </h3>
                <p className="text-xs font-mono text-muted mt-1">
                  Non-blocking overlay
                </p>
              </div>
              <p className="md:col-span-6 text-sm text-muted leading-relaxed">
                Runs with <code className="font-mono text-xs bg-surface-2 px-1 py-0.5 rounded text-ink">pointer-events: none</code> and <code className="font-mono text-xs bg-surface-2 px-1 py-0.5 rounded text-ink">aria-hidden=&quot;true&quot;</code> so it never interferes with user interactions or screen readers. Honors reduced-motion media queries.
              </p>
            </div>
          </div>
        </section>

        {/* INTERACTIVE PLAYGROUND CTA */}
        <section
          data-mascot-expr="success"
          className="p-8 sm:p-10 rounded bg-surface border border-border/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-semibold text-ink">
              Design your custom mascot
            </h3>
            <p className="text-sm text-muted max-w-lg">
              Adjust body hues, stroke outlines, eye sizes, and mouth shapes in our client-side generator. Export compliant SVG files instantly.
            </p>
          </div>
          <Link
            href="/generate"
            className="px-5 py-3 rounded bg-accent hover:bg-accent-hover text-surface text-sm font-medium transition-colors shrink-0 shadow-sm"
          >
            Launch Generator
          </Link>
        </section>
      </main>

      {/* FOOTER */}
      <footer
        data-mascot-expr="wave"
        className="border-t border-border/80 bg-surface/50 py-10 mt-16"
      >
        <div className="max-w-5xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div className="flex items-center gap-2">
            <span className="font-serif font-semibold text-ink">Lookie</span>
            <span>-</span>
            <span>MIT License</span>
            <span>-</span>
            <span>Authored by Rafi Akem</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/generate" className="hover:text-ink transition-colors">
              Generator Tool
            </Link>
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
