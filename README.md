# Lookie

![ci](https://github.com/rafiakem/lookie/actions/workflows/ci.yml/badge.svg)
![lighthouse](https://github.com/rafiakem/lookie/actions/workflows/lighthouse.yml/badge.svg)

An SVG mascot that follows the section you are reading while its eyes track
your cursor. One JavaScript file plus one SVG file, installed in a couple of
lines.

Live demo: https://lookie.rafiakem.tech

## Install

```html
<link rel="stylesheet" href="lookie.css">

<div class="lookie" data-lookie-src="mascot.svg" data-lookie-auto aria-hidden="true">
  <div class="bob-wrap"></div>
</div>

<script src="lookie.js" defer></script>
```

## Per-section expressions

Add an attribute to any section. When that section covers the 80% viewport
mark, Lookie glides over and switches its expression:

```html
<section data-mascot-expr="loading">
```

| Expression  | Use it for                                       |
|-------------|--------------------------------------------------|
| `happy`     | default state                                    |
| `thinking`  | thought delays, option picking, search           |
| `loading`   | data fetches, order checks, rendering            |
| `processing`| form submits, uploads, transactions              |
| `typing`    | text input, chat, search boxes                   |
| `secret`    | passwords, PINs, private data                    |
| `success`   | completed actions, checkout, login               |
| `error`     | failures, 404s, validation errors                |
| `wave`      | footers, greetings                               |

## API

```js
Lookie.set("success"); // override the expression (stays until reset)
Lookie.set();          // back to scroll mode (sections)
Lookie.EXPRESSIONS     // expression catalog + descriptions
```

## Auto loading from fetches

`data-lookie-auto` (optional): fetches pending longer than 300 ms
automatically show the `loading` expression and switch back when they settle.
Anti-flicker, single-level, and it never overrides a manual `Lookie.set`.

## Custom colors & designs

Change colors right in the SVG (the shipped `mascot.svg` is the template):
body fill is the main color, strokes use the darker shade. Or draw your own
blob shape — just keep the **layer contract** classes, because expressions
work by toggling classes:

| Class         | Contents                                  |
|---------------|-------------------------------------------|
| `.body`       | body + feet (plus `.hand .hand-l .hand-r` for hands) |
| `.eyes`       | white eyeballs (auto-blinking)            |
| `.pupils`     | pupils (shifted by the library, clamped ±6px x / ±8px y) |
| `.eye-arc` `eye-closed` `eye-x` `eye-wink` | eye variants (hidden by default) |
| `.mouths`     | mouth container                           |
| `.m-happy` `m-flat` `m-o` `m-big` `m-sad` `m-slant` | mouth variants (hidden by default) |
| `.blush`      | optional                                  |

Free-form blobs are fine: move the eyes/pupils coordinates, redraw the mouth
paths. All motion (bob, blink, wave, tap, arrive) and expressions live in
`lookie.css` — tweak timings there.

## Behavior & accessibility

- Pupils: `mousemove` on desktop, `touchmove` on touch devices, smooth lerp,
  clamped inside the eyeballs
- Position: scroll-spy inside a `requestAnimationFrame` loop, lerped glide
  between sections
- Decorative only: `pointer-events: none`, `aria-hidden`, never blocks clicks
  or screen readers
- `prefers-reduced-motion`: all animations off (blink, bob, wave, tap, arrive)

## Repo layout

```
lookie.js      library (~7 KB, zero dependencies)
lookie.css     expressions + animation
mascot.svg     default template
index.html     demo page
demo.js        demo page logic
```

MIT © 2026 Rafi Akem. Inspired by bloub.vercel.app and the pet ecosystem for
coding agents — but rendered with a vector rig, not a spritesheet, so the
animation stays fluid.