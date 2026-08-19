# Lookie

Mascot SVG yang ngikutin section dan matanya ngawasin cursor. Satu file JavaScript plus satu file SVG — dipasang dengan dua baris.

Demo live: https://lookie.rafiakem.tech

## Pasang

```html
<link rel="stylesheet" href="lookie.css">

<div class="lookie" data-lookie-src="mascot.svg" data-lookie-auto aria-hidden="true">
  <div class="bob-wrap"></div>
</div>

<script src="lookie.js" defer></script>
```

## Ekspresi per section

Tambah atribut ke section mana pun. Pas section itu menutupi titik 80% layar,
Lookie meluncur ke sana dan ganti ekspresi:

```html
<section data-mascot-expr="loading">
```

| Ekspresi     | Kapan dipakai                                    |
|--------------|--------------------------------------------------|
| `happy`      | default, keadaan awal                            |
| `thinking`   | delay mikir, memilih opsi, pencarian             |
| `loading`    | fetch data, cek pesanan, render                  |
| `processing` | submit form, upload, transaksi                   |
| `typing`     | input teks, chat, search box                     |
| `secret`     | password, PIN, data rahasia                      |
| `success`    | aksi berhasil, checkout, login                   |
| `error`      | kegagalan, 404, validasi error                   |
| `wave`       | footer, ucapan                                   |

## API

```js
Lookie.set("success"); // override ekspresi (tetap sampai di-reset)
Lookie.set();          // balik ke mode scroll (section)
Lookie.EXPRESSIONS     // katalog ekspresi + deskripsi
```

## Auto loading dari fetch

`data-lookie-auto` (opsional): fetch yang molor lebih dari 300 ms otomatis
nampilin ekspresi `loading`, balik sendiri pas selesai. Anti-flicker, satu level
saja, dan tidak mengganggu override manual (`Lookie.set`).

## Ganti warna & bentuk (custom design)

Ganti warna lewat atribut di SVG kamu (`mascot.svg` adalah template): isi body
pakai warna utama, stroke pakai warna gelap. Atau gambar bentuk blob sendiri —
yang penting **class layer contract-nya tetap ada**, karena ekspresi bekerja
dengan men-toggle class:

| Class          | Isi                                   |
|----------------|---------------------------------------|
| `.body`        | badan + kaki (dan `.hand .hand-l .hand-r` untuk tangan) |
| `.eyes`        | bola mata putih (di-blink otomatis)   |
| `.pupils`      | pupil (digeser library mengikuti cursor, maks ±6px/x ±8px/y) |
| `.eye-arc` `eye-closed` `eye-x` `eye-wink` | varian mata (default `display:none`) |
| `.mouths`      | container mulut                       |
| `.m-happy` `m-flat` `m-o` `m-big` `m-sad` `m-slant` | varian mulut (default `display:none`) |
| `.blush`       | opsional                              |

Blob bentuk bebas boleh: eyes/pupils tinggal digeser koordinatnya, mouth
path digambar ulang. Semua gerak (bob, blink, wave, tap, arrive) dan ekspresi
ada di `lookie.css` — ubah di sana kalau mau tempo berbeda.

## Behavior & aksesibilitas

- Pupil: `mousemove` desktop, `touchmove` mobile, lerp halus, dikunci di bola mata
- Posisi: scroll-spy di loop `requestAnimationFrame`, lerp meluncur antar section
- Mascot dekoratif murni: `pointer-events: none`, `aria-hidden`, tidak menghalangi klik
- `prefers-reduced-motion`: semua animasi mati (blink, bob, wave, tap, arrive)

## Repo

```
lookie.js      library (7 KB, tanpa dependency)
lookie.css     ekspresi + animasi
mascot.svg     template default
index.html     demo (halaman ini)
```

MIT © 2026 Rafi Akem. Terinspirasi dari bloub.vercel.app dan ekosistem pet
untuk coding agents — tapi render pakai vector rig, bukan spritesheet, biar
animasinya fluid.