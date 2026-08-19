/* ============================================================
   lookie — mascot that follows sections, eyes track the cursor
   TypeScript source. Built with tsup → dist/lookie.js (IIFE),
   dist/lookie.mjs (ESM), index.d.ts.
   MIT — https://github.com/rafiakem/lookie

   Usage:
     <link rel="stylesheet" href="lookie.css">
     <div class="lookie" data-lookie-src="mascot.svg" data-lookie-auto></div>
     <script src="lookie.js" defer></script>

   Per-section expressions: data-mascot-expr="happy|thinking|loading|..."
   API: Lookie.set('success')  → temporary override
        Lookie.set()           → back to scroll mode (sections)
        Lookie.setSvg(string)  → replace the mascot SVG at runtime
   data-lookie-auto            → fetches pending >300ms auto-show "loading"
   data-lookie-debug           → logs avg frame time every 60 frames
   ============================================================ */

export type ExpressionName =
  | "happy"
  | "thinking"
  | "loading"
  | "processing"
  | "typing"
  | "secret"
  | "success"
  | "error"
  | "wave";

export interface Expression {
  name: ExpressionName;
  desc: string;
}

export const EXPRESSIONS: Expression[] = [
  { name: "happy", desc: "Default state. Small smile, blush, pupils tracking the cursor." },
  { name: "thinking", desc: "Hand on chin, tilted mouth. For thought delays, option picking, search." },
  { name: "loading", desc: "Line eyes, body working hard. For data fetches, order checks, rendering." },
  { name: "processing", desc: "O mouth, full focus. For form submits, uploads, transactions." },
  { name: "typing", desc: "Looking down, fingers typing. For text input, chat, search boxes." },
  { name: "secret", desc: "Shh, one eye closed. For passwords, PINs, private data." },
  { name: "success", desc: "^^ eyes, wide smile, raised hand. For completed actions, checkout, login." },
  { name: "error", desc: "X eyes, pouting mouth. For failures, 404s, validation errors." },
];

const ALL_CLASSES = [...EXPRESSIONS.map((e) => "x-" + e.name), "x-wave"];

const clamp = (v: number, a: number, b: number): number => Math.min(b, Math.max(a, v));
/** Lerp factor normalized to 60fps so motion is frame-rate independent. */
const frameK = (ratePerFrame: number, dtMs: number): number =>
  1 - Math.pow(1 - ratePerFrame, clamp(dtMs, 0, 50) / 16.7);

type Mode = "section" | "manual";

interface LookieInstance {
  el: HTMLElement;
  bob: HTMLElement;
  whenReady(cb: () => void): void;
  set(name: ExpressionName | ""): void;
  setSvg(svgText: string): void;
}

function exprOf(el: HTMLElement): ExpressionName {
  const d = el.dataset.mascotExpr as ExpressionName | undefined;
  return d || "happy";
}

function init(): LookieInstance | null {
  let el = document.querySelector<HTMLElement>(".lookie"); // runtime guard di bawah
  if (!el) return null;

  let bob: HTMLElement | null = null;
  function attachArrive(b: HTMLElement): void {
    b.addEventListener("animationend", (e) => {
      if ((e as AnimationEvent).animationName === "arrive") b.classList.remove("x-arrive");
    });
  }
  function readyBob(host: HTMLElement): HTMLElement {
    let b = host.querySelector<HTMLElement>(".bob-wrap");
    if (!b) {
      b = document.createElement("div");
      b.className = "bob-wrap";
      host.appendChild(b);
    }
    attachArrive(b);
    return b;
  }
  bob = readyBob(el);
  // SPA-safe: after client-side navigation the original .lookie node is gone;
  // re-query the live one so generator controls keep working (iOS reported).
  function ensure(): boolean {
    if (!el!.isConnected || !bob!.isConnected) {
      const next = document.querySelector<HTMLElement>(".lookie");
      if (!next || !next.isConnected) return false;
      el = next;
      bob = readyBob(next);
    }
    return true;
  }

  const debug = el.hasAttribute("data-lookie-debug");

  /* ---- load mascot SVG (layer contract: body, eyes, pupils, mouths, hand)
     Only fetches when data-lookie-src is present; without it the mascot is
     "ready" immediately and waits for Lookie.setSvg() (generator usage). ---- */
  let readyFired = false;
  const readyCbs: Array<() => void> = [];
  function fireReady(): void {
    if (readyFired) return;
    readyFired = true;
    for (const cb of readyCbs) cb();
    readyCbs.length = 0;
  }
  const src = el.dataset.lookieSrc;
  if (src) {
    fetch(src)
    .then((r) => {
      if (!r.ok) throw new Error("lookie: " + src + " -> HTTP " + r.status);
      return r.text();
    })
    .then((t) => {
      bobDocument(t);
      fireReady();
    })
    .catch((e: unknown) => console.warn(e instanceof Error ? e.message : e));
  } else {
    fireReady();
  }

  function bobDocument(svgText: string): void {
    if (!ensure()) return;
    let svg: SVGElement | null = null;
    try {
      const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
      if (doc.documentElement.tagName.toLowerCase() === "svg") {
        svg = doc.documentElement as unknown as SVGElement;
      }
    } catch {
      // fall through to template parsing
    }
    if (!svg) {
      // Robust fallback: template + innerHTML works in every engine
      // (Safari/WebKit included) and tolerates malformed input.
      const tpl = document.createElement("template");
      tpl.innerHTML = svgText;
      svg = tpl.content.querySelector("svg");
    }
    if (!svg) throw new Error("lookie: invalid SVG");
    bob!.querySelectorAll("svg").forEach((s) => s.remove());
    bob!.appendChild(svg);
  }

  function setClass(name: ExpressionName): void {
    el!.classList.remove(...ALL_CLASSES);
    el!.classList.add("x-" + name);
  }
  function arrive(): void {
    bob!.classList.remove("x-arrive");
    void bob!.offsetWidth;
    bob!.classList.add("x-arrive");
  }
  function applyExpr(name: ExpressionName): void {
    if (!ensure()) return;
    setClass(name);
    arrive();
  }

  /* ---- pupils track the cursor ---- */
  let ex = 0;
  let ey = 0;
  let px = 0;
  let py = 0;
  let tx = 0;
  let ty = 0;
  function measure(): void {
    const r = el!.getBoundingClientRect();
    ex = r.x + r.width / 2;
    ey = r.y + r.height * 0.44;
  }
  measure();
  addEventListener("resize", measure);
  function setTarget(cx: number, cy: number): void {
    tx = clamp((cx - ex) / 40, -1, 1) * 6;
    ty = clamp((cy - ey) / 40, -1, 1) * 8;
  }
  addEventListener("mousemove", (e) => setTarget(e.clientX, e.clientY), { passive: true });
  addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    if (t) setTarget(t.clientX, t.clientY);
  }, { passive: true });

  /* ---- scroll-spy: section covering the 80% viewport mark ---- */
  const sects = Array.from(document.querySelectorAll<HTMLElement>("[data-mascot-expr]"));
  let active = sects[0] || el!;
  let mode: Mode = "section";
  let ay = 0;
  let y = 0;
  const M = 16;

  function pickActive(): HTMLElement | null {
    const mark = innerHeight * 0.8;
    for (const s of sects) {
      const r = s.getBoundingClientRect();
      if (r.top <= mark && r.bottom > mark) return s;
    }
    return sects.length ? sects[sects.length - 1] : null;
  }

  /* ---- auto loading from fetches (data-lookie-auto) ---- */
  let pending = 0;
  let loadTimer: number | undefined;
  let inLoading = false;
  if (el.hasAttribute("data-lookie-auto")) {
    const origFetch = window.fetch.bind(window);
    const sync = (): void => {
      pending--;
      scheduleLoading();
    };
    window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
      pending++;
      scheduleLoading();
      const p = origFetch(input, init);
      p.then(sync, sync);
      return p;
    }) as typeof fetch;
  }
  function scheduleLoading(): void {
    window.clearTimeout(loadTimer);
    if (pending > 0) {
      loadTimer = window.setTimeout(() => {
        if (mode === "section") {
          applyExpr("loading");
          inLoading = true;
        }
      }, 300);
    } else if (inLoading) {
      inLoading = false;
      if (mode === "section" && active) applyExpr(exprOf(active));
    }
  }

  /* ---- main loop (frame-rate independent lerp) ---- */
  let last = performance.now();
  let frameCount = 0;
  let frameAcc = 0;
  function loop(now: number): void {
    if (!document.hidden) {
      const dt = now - last;
      const activeNow = pickActive();
      if (activeNow && activeNow !== active) {
        active = activeNow;
        if (mode === "section") applyExpr(exprOf(active));
      }

      if (active) {
        const r = active.getBoundingClientRect();
        const H = el.offsetHeight;
        ay = clamp(r.top + r.height / 2 - H / 2, M, innerHeight - H - M);
        const k = frameK(0.12, dt);
        y += (ay - y) * k;
        if (Math.abs(ay - y) < 0.4) y = ay;
        el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      }

      const kp = frameK(0.16, dt);
      px += (tx - px) * kp;
      py += (ty - py) * kp;
      document.documentElement.style.setProperty("--lx", px.toFixed(2) + "px");
      document.documentElement.style.setProperty("--ly", py.toFixed(2) + "px");

      if (debug) {
        frameAcc += dt;
        frameCount++;
        if (frameCount >= 60) {
          console.info(`lookie: avg frame ${(frameAcc / frameCount).toFixed(2)}ms (${(1000 * frameCount / frameAcc).toFixed(0)}fps)`);
          frameAcc = 0;
          frameCount = 0;
        }
      }
    }
    last = now;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* expression shows immediately (no need to wait for a section change) */
  applyExpr(exprOf(active));

  /* ---- public API ---- */
  return {
    el,
    bob,
    whenReady(cb: () => void): void {
      if (readyFired) cb();
      else readyCbs.push(cb);
    },
    set(name: ExpressionName | ""): void {
      if (!name) {
        // back to scroll mode
        mode = "section";
        applyExpr(exprOf(active));
        return;
      }
      mode = "manual";
      applyExpr(name);
    },
    setSvg(svgText: string): void {
      bobDocument(svgText);
    },
  };
}

const instance = init();

export const Lookie = {
  EXPRESSIONS,
  el: instance ? instance.el : null,
  set(name: ExpressionName | ""): void {
    if (instance) instance.set(name);
  },
  setSvg(svgText: string): void {
    if (instance) instance.setSvg(svgText);
  },
  whenReady(cb: () => void): void {
    if (instance) instance.whenReady(cb);
  },
};

declare global {
  interface Window {
    Lookie: typeof Lookie;
  }
}
window.Lookie = Lookie;