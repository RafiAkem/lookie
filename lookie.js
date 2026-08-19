/* ============================================================
   lookie.js — mascot that follows sections, eyes track the cursor
   v0.1.0 — MIT — https://github.com/rafiakem/lookie

   Usage:
     <link rel="stylesheet" href="lookie.css">
     <div class="lookie" data-lookie-src="mascot.svg" data-lookie-auto></div>
     <script src="lookie.js" defer></script>

   Per-section expressions: data-mascot-expr="happy|thinking|loading|..."
   API: Lookie.set('success')  → temporary override
        Lookie.set()           → back to scroll mode (sections)
   data-lookie-auto            → fetches pending >300ms auto-show "loading"
   ============================================================ */
(function (global) {
  "use strict";

  var EXPRESSIONS = [
    { name: "happy",     desc: "Default state. Small smile, blush, pupils tracking the cursor." },
    { name: "thinking",  desc: "Hand on chin, tilted mouth. For thought delays, option picking, search." },
    { name: "loading",   desc: "Line eyes, body working hard. For data fetches, order checks, rendering." },
    { name: "processing",desc: "O mouth, full focus. For form submits, uploads, transactions." },
    { name: "typing",    desc: "Looking down, fingers typing. For text input, chat, search boxes." },
    { name: "secret",    desc: "Shh, one eye closed. For passwords, PINs, private data." },
    { name: "success",   desc: "^^ eyes, wide smile, raised hand. For completed actions, checkout, login." },
    { name: "error",     desc: "X eyes, pouting mouth. For failures, 404s, validation errors." }
  ];

  var el = document.querySelector(".lookie");
  if (!el) { global.Lookie = { EXPRESSIONS: EXPRESSIONS }; return; }

  var bob = el.querySelector(".bob-wrap");
  if (!bob) {
    bob = document.createElement("div");
    bob.className = "bob-wrap";
    el.appendChild(bob);
  }

  /* ---- load mascot SVG (layer contract: body, eyes, pupils, mouths, hand) ---- */
  var src = el.dataset.lookieSrc || "mascot.svg";
  fetch(src)
    .then(function (r) { if (!r.ok) throw new Error("lookie: " + src + " -> HTTP " + r.status); return r.text(); })
    .then(function (t) {
      var svg = new DOMParser().parseFromString(t, "image/svg+xml").documentElement;
      if (svg.tagName.toLowerCase() !== "svg") throw new Error("lookie: SVG tidak valid di " + src);
      bob.appendChild(svg);
      el.dispatchEvent(new CustomEvent("lookie:ready", { detail: { svg: svg } }));
    })
    .catch(function (e) { console.warn(e.message); });

  var all = EXPRESSIONS.map(function (e) { return "x-" + e.name; }).concat("x-wave");
  function setClass(name) {
    el.classList.remove.apply(el.classList, all);
    el.classList.add("x-" + name);
  }
  function arrive() {
    bob.classList.remove("x-arrive");
    void bob.offsetWidth;
    bob.classList.add("x-arrive");
  }
  bob.addEventListener("animationend", function (e) {
    if (e.animationName === "arrive") bob.classList.remove("x-arrive");
  });

  /* ---- pupils track the cursor ---- */
  var ex = 0, ey = 0, px = 0, py = 0, tx = 0, ty = 0;
  function measure() {
    var r = el.getBoundingClientRect();
    ex = r.x + r.width / 2;
    ey = r.y + r.height * 0.44;
  }
  measure();
  addEventListener("resize", measure);
  function setTarget(cx, cy) {
    tx = Math.min(6, Math.max(-6, (cx - ex) / 40)) * 1;
    ty = Math.min(8, Math.max(-8, (cy - ey) / 40)) * 1;
  }
  addEventListener("mousemove", function (e) { setTarget(e.clientX, e.clientY); }, { passive: true });
  addEventListener("touchmove", function (e) {
    var t = e.touches[0];
    if (t) setTarget(t.clientX, t.clientY);
  }, { passive: true });

  /* ---- scroll-spy: the section covering the 80% viewport mark ---- */
  var sects = Array.prototype.slice.call(document.querySelectorAll("[data-mascot-expr]"));
  var active = sects[0] || el;
  var mode = "section";          // 'section' | 'manual'
  var ay = 0, y = 0;
  var M = 16;

  function applyExpr(name) { setClass(name); arrive(); }

  function pickActive() {
    var mark = innerHeight * 0.8;
    for (var i = 0; i < sects.length; i++) {
      var r = sects[i].getBoundingClientRect();
      if (r.top <= mark && r.bottom > mark) return sects[i];
    }
    return sects[sects.length - 1];
  }

  /* ---- auto loading from fetches (data-lookie-auto) ---- */
  var autoOn = el.hasAttribute("data-lookie-auto");
  var pending = 0, loadTimer = null, inLoading = false;
  if (autoOn) {
    var origFetch = global.fetch;
    global.fetch = function () {
      pending++;
      scheduleLoading();
      var p = origFetch.apply(this, arguments);
      p.then(sync, sync);
      function sync() { pending--; scheduleLoading(); }
      return p;
    };
  }
  function scheduleLoading() {
    clearTimeout(loadTimer);
    if (pending > 0) {
      loadTimer = setTimeout(function () {
        if (mode === "section") { applyExpr("loading"); inLoading = true; }
      }, 300);
    } else if (inLoading) {
      inLoading = false;
      if (mode === "section" && active) applyExpr(active.dataset.mascotExpr || "happy");
    }
  }

  /* ---- main loop ---- */
  function loop() {
    var next = pickActive();
    if (next !== active) {
      active = next;
      if (mode === "section") applyExpr(active.dataset.mascotExpr || "happy");
    }
    var r = active.getBoundingClientRect();
    var H = el.offsetHeight;
    ay = Math.min(innerHeight - H - M, Math.max(M, r.top + r.height / 2 - H / 2));
    y += (ay - y) * 0.12;
    if (Math.abs(ay - y) < 0.4) y = ay;
    el.style.transform = "translate3d(0, " + y.toFixed(1) + "px, 0)";

    px += (tx - px) * 0.16;
    py += (ty - py) * 0.16;
    document.documentElement.style.setProperty("--lx", px.toFixed(2) + "px");
    document.documentElement.style.setProperty("--ly", py.toFixed(2) + "px");
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  /* expression shows immediately (no need to wait for a section change) */
  if (active && active.dataset.mascotExpr) setClass(active.dataset.mascotExpr);

  /* ---- API ---- */
  global.Lookie = {
    EXPRESSIONS: EXPRESSIONS,
    set: function (name) {
      if (!name) {            // back to scroll mode
        mode = "section";
        applyExpr(active.dataset.mascotExpr || "happy");
        return;
      }
      mode = "manual";
      applyExpr(name);
    },
    el: el
  };
})(window);
