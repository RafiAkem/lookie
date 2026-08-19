/* demo.js — logika halaman demo lookie (preview ekspresi + interaksi) */
(() => {
  "use strict";
  const L = window.Lookie;
  if (!L) return;

  /* preview ekspresi: clone mascot.svg sekali, taruh 8x dengan class ekspresi */
  fetch("mascot.svg")
    .then(r => r.text())
    .then(t => {
      const list = document.getElementById("expr-list");
      for (const e of L.EXPRESSIONS) {
        const svg = new DOMParser().parseFromString(t, "image/svg+xml").documentElement;
        const row = document.createElement("div");
        row.className = "expr-row";
        row.dataset.expr = e.name;
        const prev = document.createElement("div");
        prev.className = "x-preview x-" + e.name;
        prev.setAttribute("aria-hidden", "true");
        prev.appendChild(svg);
        const name = document.createElement("span");
        name.className = "x-name";
        name.textContent = e.name;
        const desc = document.createElement("p");
        desc.className = "x-desc";
        desc.innerHTML = e.desc + ' Trigger: <code>data-mascot-expr="' + e.name + '"</code>';
        row.append(prev, name, desc);
        list.appendChild(row);
      }
    })
    .catch(() => {});

  /* klik row → lookie.set() (override), reset → balik mode scroll */
  document.getElementById("expr-list").addEventListener("click", e => {
    const row = e.target.closest(".expr-row");
    if (!row) return;
    L.set(row.dataset.expr);
    document.querySelectorAll(".expr-row.active").forEach(r => r.classList.remove("active"));
    row.classList.add("active");
  });
  document.getElementById("reset").addEventListener("click", () => {
    L.set();
    document.querySelectorAll(".expr-row.active").forEach(r => r.classList.remove("active"));
  });

  /* tombol demo: Lookie melompat di tempat */
  document.getElementById("pop").addEventListener("click", () => {
    const bob = document.querySelector(".lookie .bob-wrap");
    bob.classList.remove("x-arrive");
    void bob.offsetWidth;
    bob.classList.add("x-arrive");
  });
})();
