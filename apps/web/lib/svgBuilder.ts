export interface MascotConfig {
  bodyColor: string;
  strokeColor: string;
  eyeSize: "small" | "medium" | "large";
  mouthStyle: "happy" | "flat" | "o" | "big" | "sad" | "slant";
  highlightColor?: string;
  blushOpacity?: number;
}

/** Validate a #hex color; falls back to a safe default otherwise. */
export function safeHex(value: string, fallback: string): string {
  return /^#[0-9a-fA-F]{3,8}$/.test(value) ? value : fallback;
}

export function buildMascotSvg(config: Partial<MascotConfig> = {}): string {
  const {
    bodyColor = "#2563eb",
    strokeColor = "#1d4ed8",
    eyeSize = "medium",
    mouthStyle = "happy",
    blushOpacity = 0.16,
  } = config;

  const body = safeHex(bodyColor, "#1b5e20");
  const stroke = safeHex(strokeColor, "#144c1a");

  let rx = 13;
  let ry = 16;
  let pupilR = 6;

  if (eyeSize === "small") {
    rx = 10;
    ry = 13;
    pupilR = 5;
  } else if (eyeSize === "large") {
    rx = 16;
    ry = 19;
    pupilR = 7.5;
  }

  // All mouth paths stay inside the layer contract so Lookie expressions work seamlessly
  const allMouths = `
    <path class="m-happy" d="M88 121 Q100 133 112 121" stroke="${stroke}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path class="m-flat" d="M88 125 H112" stroke="${stroke}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path class="m-o" d="M93 118 Q100 112 107 118 Q100 130 93 118 Z" fill="${stroke}"/>
    <path class="m-big" d="M84 114 Q100 144 116 114" stroke="${stroke}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path class="m-sad" d="M88 132 Q100 118 112 132" stroke="${stroke}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path class="m-slant" d="M90 127 Q100 121 110 123" stroke="${stroke}" stroke-width="5" stroke-linecap="round" fill="none"/>
  `;

  return `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- LAYER CONTRACT lookie: body (plus .hand .hand-l .hand-r), eyes, pupils,
       eye-arc, eye-closed, eye-x, eye-wink, mouths (m-happy m-flat m-o m-big
       m-sad m-slant), blush. Keep these classes in custom templates. -->
  <g class="body" stroke="${stroke}" stroke-width="5" stroke-linejoin="round">
    <rect x="74" y="156" width="22" height="28" rx="11" fill="${body}"/>
    <rect x="106" y="156" width="22" height="28" rx="11" fill="${body}"/>
    <circle class="hand hand-l" cx="40" cy="126" r="13" fill="${body}"/>
    <circle class="hand hand-r" cx="160" cy="126" r="13" fill="${body}"/>
    <path d="M100 26 C138 22 178 44 180 88 C182 132 150 172 104 174 C58 176 18 142 22 94 C26 48 62 30 100 26 Z" fill="${body}"/>
    <ellipse cx="74" cy="58" rx="24" ry="14" fill="#ffffff" fill-opacity=".14" stroke="none" transform="rotate(-14 74 58)"/>
  </g>
  <g class="eye-arc" stroke="${stroke}" stroke-width="5" stroke-linecap="round" fill="none">
    <path d="M64 92 Q74 80 84 92"/>
    <path d="M118 92 Q128 80 138 92"/>
  </g>
  <g class="eye-closed" stroke="${stroke}" stroke-width="5" stroke-linecap="round" fill="none">
    <path d="M64 92 Q74 98 84 92"/>
    <path d="M118 92 Q128 98 138 92"/>
  </g>
  <g class="eye-x" stroke="${stroke}" stroke-width="5" stroke-linecap="round">
    <path d="M64 84 L84 104 M84 84 L64 104"/>
    <path d="M118 84 L138 104 M138 84 L118 104"/>
  </g>
  <g class="eye-wink" stroke="${stroke}" stroke-width="5" stroke-linecap="round" fill="none">
    <path d="M62 92 Q74 100 86 92"/>
  </g>
  <g class="eyes">
    <ellipse cx="74" cy="94" rx="${rx}" ry="${ry}" fill="#ffffff" stroke="${stroke}" stroke-width="4"/>
    <ellipse cx="128" cy="94" rx="${rx}" ry="${ry}" fill="#ffffff" stroke="${stroke}" stroke-width="4"/>
  </g>
  <g class="pupils">
    <circle cx="76" cy="95" r="${pupilR}" fill="#0f172a"/>
    <circle cx="130" cy="95" r="${pupilR}" fill="#0f172a"/>
  </g>
  <g class="blush" stroke="none">
    <circle cx="54" cy="114" r="7" fill="${stroke}" fill-opacity="${blushOpacity}"/>
    <circle cx="148" cy="114" r="7" fill="${stroke}" fill-opacity="${blushOpacity}"/>
  </g>
  <g class="mouths">${allMouths}
  </g>
</svg>`;
}
