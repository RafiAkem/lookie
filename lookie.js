/* ============================================================
   lookie.js — mascot yang ngikutin section, mata ngawasin cursor
   v0.1.0 — MIT — https://github.com/rafiakem/lookie

   Pasang:
     <link rel="stylesheet" href="lookie.css">
     <div class="lookie" data-lookie-src="mascot.svg" data-lookie-auto></div>
     <script src="lookie.js" defer></script>

   Ekspresi per section: data-mascot-expr="happy|thinking|loading|..."
   API: Lookie.set('success')  → override sementara
        Lookie.set()           → balik ke mode scroll (section)
   data-lookie-auto            → fetch yang pending >300ms otomatis "loading"
   ============================================================ */
(function (global) {
  "use strict";

  var EXPRESSIONS = [
    { name: "happy",     desc: "Keadaan awal. Senyum kecil, blush, pupil mengawasi cursor." },
    { name: "thinking",  desc: "Tangan menopang dagu, mulut miring. Buat delay mikir, memilih opsi, pencarian." },
    { name: "loading",   desc: "Mata garis, badan bekerja keras. Buat fetch data, cek pesanan, render." },
    { name: "processing",desc: "Mulut O, fokus penuh. Buat submit form, upload, transaksi." },
    { name: "typing",    desc: "Pupil menunduk, tangan mengetik. Buat input teks, chat, search box." },
    { name: "secret",    desc: "Shh, satu mata terpejam. Buat input password, PIN, data rahasia." },
    { name: "success",   desc: "Mata ^^, senyum lebar, tangan terangkat. Buat aksi berhasil, checkout, login." },
    { name: "error",     desc: "Mata X, mulut cemberut. Buat kegagalan, 404, validasi error." }
  ];

  var el = document.querySelector(".lookie");
  if (!el) { global.Lookie = { EXPRESSIONS: EXPRESSIONS }; return; }

  var bob = el.querySelector(".bob-wrap");
  if (!bob) {
    bob = document.createElement("div");
    bob.className = "bob-wrap";
    el.appendChild(bob);
  }

  /* ---- muat SVG mascot (layer contract: body, eyes, pupils, mouths, hand) ---- */
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

  /* ---- pupil mengawasi cursor ---- */
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

  /* ---- scroll-spy: section yang menutupi titik 80% viewport ---- */
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

  /* ---- auto loading dari fetch (data-lookie-auto) ---- */
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

  /* ---- loop utama ---- */
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
  /* ekspresi awal langsung tampil (tanpa tunggu ganti section) */
  if (active && active.dataset.mascotExpr) setClass(active.dataset.mascotExpr);

  /* ---- API ---- */
  global.Lookie = {
    EXPRESSIONS: EXPRESSIONS,
    set: function (name) {
      if (!name) {            // kembali ke mode scroll
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
