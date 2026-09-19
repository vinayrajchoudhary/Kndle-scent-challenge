/*
 * KNDLÉ Scent Challenge: "the blend" transition
 * ------------------------------------------------
 * Shown for about 4.5 seconds after a player chooses a persona.
 * Wax melts, three fragrance drops in the persona's colours fall and bloom,
 * the scent rises, and the candle lights.
 *
 * Self-contained: injects its own CSS, needs no images or libraries, works offline.
 * Styled to match styles.css (--bg #f3ede4, --paper #fffaf4, --ink #171513, Georgia headings).
 *
 * Usage:
 *   await window.KNDLE_TRANSITION.play(persona);   // persona = { id, name } or just the id string
 *   go("challenge");
 *
 * Options (optional second argument):
 *   { speed: 1 }        1 = standard (~4.5 s), 0.8 = quick (~3.6 s), 1.15 = relaxed (~5.2 s)
 *   { allowSkip: true } tap anywhere to skip after the first second
 */
window.KNDLE_TRANSITION = (() => {
  // Colours per persona id (matches persona ids in config.js: fresh, romantic, serene). Three shades: main, light, deep.
  const PALETTES = {
    fresh:    ["#9CC46B", "#F2CF3D", "#5FBFC9"], // lemongrass green, daffodil yellow, aqua
    romantic: ["#E58FA3", "#C58BD0", "#F2B8C6"], // tea rose, orchid, jasmine blush
    serene:   ["#A79BC9", "#C4A88A", "#8FA58A"]  // lavender, cedar, vetiver
  };
  const DEFAULT_PALETTE = PALETTES.serene;

  // Captions: [text, start seconds, end seconds] at standard speed.
  const CAPTIONS = [
    ["Melting the wax…", 0, 1.2],
    ["Pouring in your notes…", 1.35, 2.55],
    ["Blending the fragrance…", 2.7, 3.55],
    ["Your candle is ready.", 3.7, null]
  ];
  const TOTAL_SECONDS = 4.9; // animation ends ~4.4 s, plus a short beat on the lit candle

  let cssInjected = false;
  function injectCss() {
    if (cssInjected) return;
    cssInjected = true;
    const style = document.createElement("style");
    style.id = "kndle-transition-css";
    style.textContent = `
.kt-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;
  background:var(--bg,#f3ede4);padding:24px;animation:kt-fadein .25s ease both}
.kt-overlay.kt-out{animation:kt-fadeout .3s ease both}
@keyframes kt-fadein{from{opacity:0}to{opacity:1}}
@keyframes kt-fadeout{from{opacity:1}to{opacity:0}}
.kt-card{width:min(100%,560px);text-align:center;background:var(--paper,#fffaf4);border:1px solid var(--line,#d8cfc3);
  border-radius:34px;padding:28px 28px 30px;box-shadow:var(--shadow,0 14px 40px rgba(28,22,16,.08))}
.kt-eyebrow{text-transform:uppercase;letter-spacing:.16em;font-size:.76rem;font-weight:800;color:var(--muted,#7b746b);margin:0}
.kt-title{font-family:Georgia,"Times New Roman",serif;font-size:clamp(1.8rem,3.4vw,2.6rem);margin:6px 0 8px;color:var(--ink,#171513);line-height:1.05}
.kt-stage{width:min(100%,380px);margin:0 auto}
.kt-stage svg{display:block;width:100%;height:auto;overflow:visible}
.kt-cap{position:relative;height:1.7em;margin-top:6px;font-family:Georgia,"Times New Roman",serif;font-style:italic;
  font-size:clamp(1.15rem,2.4vw,1.4rem);color:var(--ink,#171513)}
.kt-cap span{position:absolute;left:0;right:0;opacity:0}
.kt-bar{width:min(220px,70%);height:4px;border-radius:4px;background:var(--line,#d8cfc3);margin:14px auto 0;overflow:hidden}
.kt-bar i{display:block;height:100%;width:0;background:var(--ink,#171513);border-radius:4px}

.kt-overlay [class*="kt-x-"]{transform-box:fill-box}
.kt-x-chunk{transform-origin:50% 100%}
.kt-x-liquid{transform:translateY(100px)}
.kt-x-drop,.kt-x-ripple,.kt-x-bloom,.kt-x-tint,.kt-x-wick,.kt-x-glow,.kt-x-heat{opacity:0}
.kt-x-ripple,.kt-x-bloom{transform-origin:50% 50%}
.kt-x-vap{stroke-dasharray:200;stroke-dashoffset:200;opacity:0}
.kt-x-flame{transform-origin:50% 100%;transform:scale(0)}

.kt-overlay .kt-x-heat{animation:kt-heat calc(1.9s*var(--kt-s)) both}
.kt-overlay .kt-x-chunk{animation:kt-melt calc(1.3s*var(--kt-s)) calc(.15s*var(--kt-s)) cubic-bezier(.5,0,.7,1) both}
.kt-overlay .kt-ch2{animation-delay:calc(.3s*var(--kt-s))}
.kt-overlay .kt-ch3{animation-delay:calc(.05s*var(--kt-s))}
.kt-overlay .kt-x-liquid{animation:kt-rise calc(1.3s*var(--kt-s)) calc(.2s*var(--kt-s)) cubic-bezier(.3,.6,.4,1) both}
.kt-overlay .kt-x-drop{animation:kt-drop calc(.42s*var(--kt-s)) cubic-bezier(.55,0,1,.6) both}
.kt-overlay .kt-d1{animation-delay:calc(1.4s*var(--kt-s))}
.kt-overlay .kt-d2{animation-delay:calc(1.75s*var(--kt-s))}
.kt-overlay .kt-d3{animation-delay:calc(2.1s*var(--kt-s))}
.kt-overlay .kt-x-ripple{animation:kt-ripple calc(.8s*var(--kt-s)) ease-out both}
.kt-overlay .kt-r1{animation-delay:calc(1.8s*var(--kt-s))}
.kt-overlay .kt-r2{animation-delay:calc(2.15s*var(--kt-s))}
.kt-overlay .kt-r3{animation-delay:calc(2.5s*var(--kt-s))}
.kt-overlay .kt-x-bloom{animation:kt-bloom calc(1.7s*var(--kt-s)) ease-out both}
.kt-overlay .kt-b1{animation-delay:calc(1.8s*var(--kt-s))}
.kt-overlay .kt-b2{animation-delay:calc(2.15s*var(--kt-s))}
.kt-overlay .kt-b3{animation-delay:calc(2.5s*var(--kt-s))}
.kt-overlay .kt-x-tint{animation:kt-tint calc(1.1s*var(--kt-s)) calc(2.7s*var(--kt-s)) ease-in-out both}
.kt-overlay .kt-x-vap{animation:kt-vap calc(1.5s*var(--kt-s)) ease-out both}
.kt-overlay .kt-v1{animation-delay:calc(2.8s*var(--kt-s))}
.kt-overlay .kt-v2{animation-delay:calc(2.95s*var(--kt-s))}
.kt-overlay .kt-v3{animation-delay:calc(3.1s*var(--kt-s))}
.kt-overlay .kt-x-wick{animation:kt-fade calc(.3s*var(--kt-s)) calc(3.55s*var(--kt-s)) both}
.kt-overlay .kt-x-glow{animation:kt-glow calc(.7s*var(--kt-s)) calc(3.8s*var(--kt-s)) both}
.kt-overlay .kt-x-flame{animation:kt-flame-in calc(.5s*var(--kt-s)) calc(3.8s*var(--kt-s)) both, kt-flick 1.4s calc(4.3s*var(--kt-s)) infinite}
.kt-overlay .kt-bar i{animation:kt-bar calc(4.4s*var(--kt-s)) linear both}

@keyframes kt-heat{0%{opacity:0}25%{opacity:.75}70%{opacity:.6}100%{opacity:0}}
@keyframes kt-melt{0%{transform:scale(1,1);opacity:1}55%{transform:scale(1.08,.55);opacity:1}100%{transform:scale(1.25,.08);opacity:0}}
@keyframes kt-rise{from{transform:translateY(100px)}to{transform:translateY(0)}}
@keyframes kt-drop{0%{opacity:0;transform:translateY(0)}8%{opacity:1;transform:translateY(8px)}92%{opacity:1;transform:translateY(256px)}100%{opacity:0;transform:translateY(262px)}}
@keyframes kt-ripple{0%{opacity:0;transform:scale(.3)}10%{opacity:.8;transform:scale(.5)}100%{opacity:0;transform:scale(3.2)}}
@keyframes kt-bloom{0%{opacity:0;transform:scale(0) translateY(0)}20%{opacity:.95}100%{opacity:.85;transform:scale(3.1) translateY(10px)}}
@keyframes kt-tint{from{opacity:0}to{opacity:.55}}
@keyframes kt-vap{0%{stroke-dashoffset:200;opacity:.8}70%{opacity:.5}100%{stroke-dashoffset:0;opacity:0}}
@keyframes kt-fade{from{opacity:0}to{opacity:1}}
@keyframes kt-glow{from{opacity:0}to{opacity:.85}}
@keyframes kt-flame-in{0%{transform:scale(0)}70%{transform:scale(1.18)}100%{transform:scale(1)}}
@keyframes kt-flick{0%,100%{transform:rotate(-2deg) scaleY(1)}30%{transform:rotate(2deg) scaleY(1.07)}60%{transform:rotate(-1deg) scaleY(.95)}}
@keyframes kt-bar{from{width:0}to{width:100%}}
@keyframes kt-cap-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes kt-cap-out{from{opacity:1}to{opacity:0}}
@media (prefers-reduced-motion: reduce){
  .kt-overlay *{animation-duration:.01s!important;animation-delay:0s!important}
}`;
    document.head.appendChild(style);
  }

  function svgMarkup() {
    return `
<svg viewBox="0 0 400 440" role="img" aria-label="Wax melting and fragrance blending into a candle">
<defs>
  <linearGradient id="kt-wax" x1="0" x2="1"><stop offset="0" stop-color="#EADBC8"/><stop offset=".45" stop-color="#FBF4EA"/><stop offset="1" stop-color="#E4D3BE"/></linearGradient>
  <linearGradient id="kt-chunk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFDF9"/><stop offset="1" stop-color="#E8D9C6"/></linearGradient>
  <clipPath id="kt-inside"><rect x="118" y="198" width="164" height="194" rx="16"/></clipPath>
  <filter id="kt-soft" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="kt-haze" x="-50%" y="-20%" width="200%" height="140%"><feGaussianBlur stdDeviation="1.6"/></filter>
  <radialGradient id="kt-heatG"><stop offset="0" stop-color="#F4833A" stop-opacity=".8"/><stop offset="1" stop-color="#F4833A" stop-opacity="0"/></radialGradient>
  <radialGradient id="kt-glowG"><stop offset="0" stop-color="#F4B34A" stop-opacity=".5"/><stop offset="1" stop-color="#F4B34A" stop-opacity="0"/></radialGradient>
  <radialGradient id="kt-flameG" cx=".5" cy=".75" r=".6"><stop offset="0" stop-color="#FFF8E6"/><stop offset=".35" stop-color="#FFD877"/><stop offset="1" stop-color="#EE9A2E"/></radialGradient>
</defs>

<ellipse class="kt-x-heat" cx="200" cy="414" rx="130" ry="24" fill="url(#kt-heatG)"/>
<ellipse cx="200" cy="404" rx="96" ry="8" fill="rgba(23,21,19,.07)"/>

<g clip-path="url(#kt-inside)">
  <g transform="rotate(-8 154 366)"><rect class="kt-x-chunk kt-ch1" x="128" y="342" width="52" height="48" rx="10" fill="url(#kt-chunk)" stroke="rgba(23,21,19,.14)" stroke-width="1.5"/></g>
  <g transform="rotate(6 209 360)"><rect class="kt-x-chunk kt-ch2" x="180" y="330" width="58" height="60" rx="12" fill="url(#kt-chunk)" stroke="rgba(23,21,19,.14)" stroke-width="1.5"/></g>
  <g transform="rotate(-4 258 368)"><rect class="kt-x-chunk kt-ch3" x="236" y="346" width="44" height="44" rx="10" fill="url(#kt-chunk)" stroke="rgba(23,21,19,.14)" stroke-width="1.5"/></g>

  <g class="kt-x-liquid">
    <rect x="110" y="300" width="180" height="110" fill="url(#kt-wax)"/>
    <rect class="kt-x-tint" x="110" y="300" width="180" height="110" style="fill:var(--kt-t1)"/>
    <g>
      <animateTransform attributeName="transform" type="rotate" from="0 200 348" to="360 200 348" dur="6s" repeatCount="indefinite"/>
      <circle class="kt-x-bloom kt-b1" cx="174" cy="318" r="12" style="fill:var(--kt-t1)" filter="url(#kt-soft)"/>
      <circle class="kt-x-bloom kt-b2" cx="202" cy="322" r="12" style="fill:var(--kt-t2)" filter="url(#kt-soft)"/>
      <circle class="kt-x-bloom kt-b3" cx="228" cy="318" r="12" style="fill:var(--kt-t3)" filter="url(#kt-soft)"/>
    </g>
    <ellipse cx="200" cy="300" rx="84" ry="9" fill="#FFF9F1" stroke="rgba(23,21,19,.1)" stroke-width="1"/>
    <ellipse class="kt-x-tint" cx="200" cy="300" rx="84" ry="9" style="fill:var(--kt-t1)"/>
  </g>
</g>

<ellipse class="kt-x-ripple kt-r1" cx="174" cy="300" rx="16" ry="4" fill="none" stroke="rgba(23,21,19,.35)" stroke-width="2"/>
<ellipse class="kt-x-ripple kt-r2" cx="202" cy="300" rx="16" ry="4" fill="none" stroke="rgba(23,21,19,.35)" stroke-width="2"/>
<ellipse class="kt-x-ripple kt-r3" cx="228" cy="300" rx="16" ry="4" fill="none" stroke="rgba(23,21,19,.35)" stroke-width="2"/>

<rect x="110" y="190" width="180" height="210" rx="22" fill="rgba(255,255,255,.35)" stroke="rgba(23,21,19,.38)" stroke-width="2.5"/>
<line x1="123" y1="210" x2="123" y2="370" stroke="rgba(255,255,255,.95)" stroke-width="5" stroke-linecap="round"/>

<circle class="kt-x-drop kt-d1" cx="174" cy="44" r="7" style="fill:var(--kt-t1)"/>
<circle class="kt-x-drop kt-d2" cx="202" cy="44" r="7" style="fill:var(--kt-t2)"/>
<circle class="kt-x-drop kt-d3" cx="228" cy="44" r="7" style="fill:var(--kt-t3)"/>

<path class="kt-x-vap kt-v1" d="M176 290 C166 258,192 238,180 204 S166 160,184 128" fill="none" stroke="rgba(123,116,107,.6)" stroke-width="3" stroke-linecap="round" filter="url(#kt-haze)"/>
<path class="kt-x-vap kt-v2" d="M226 290 C236 258,212 240,226 206 S242 168,222 132" fill="none" stroke="rgba(123,116,107,.6)" stroke-width="3" stroke-linecap="round" filter="url(#kt-haze)"/>
<path class="kt-x-vap kt-v3" d="M200 288 C210 262,190 244,202 214 S214 180,198 150" fill="none" style="stroke:var(--kt-t3)" stroke-opacity=".7" stroke-width="3" stroke-linecap="round" filter="url(#kt-haze)"/>

<circle class="kt-x-glow" cx="200" cy="262" r="80" fill="url(#kt-glowG)"/>
<line class="kt-x-wick" x1="200" y1="280" x2="200" y2="300" stroke="#3a2a22" stroke-width="3.5" stroke-linecap="round"/>
<path class="kt-x-flame" d="M200 230 Q214 252 207 263 Q200 273 193 263 Q186 252 200 230Z" fill="url(#kt-flameG)"/>
</svg>`;
  }

  function escapeHtml(str = "") {
    return String(str).replace(/[&<>'"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));
  }

  let active = null;

  function play(persona, options = {}) {
    injectCss();
    if (active) active.finish();

    const id = typeof persona === "string" ? persona : persona?.id;
    const name = typeof persona === "object" && persona?.name ? persona.name : "";
    const [t1, t2, t3] = PALETTES[id] || DEFAULT_PALETTE;
    const speed = Number(options.speed) > 0 ? Number(options.speed) : 1;
    const allowSkip = options.allowSkip !== false;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const overlay = document.createElement("div");
    overlay.className = "kt-overlay";
    overlay.setAttribute("role", "status");
    overlay.setAttribute("aria-live", "polite");
    overlay.style.setProperty("--kt-s", speed);
    overlay.style.setProperty("--kt-t1", t1);
    overlay.style.setProperty("--kt-t2", t2);
    overlay.style.setProperty("--kt-t3", t3);

    const caps = CAPTIONS.map(([text, start, end]) => {
      const inAnim = `kt-cap-in .25s ${start * speed}s both`;
      const outAnim = end == null ? "" : `, kt-cap-out .25s ${end * speed}s forwards`;
      return `<span style="animation:${inAnim}${outAnim}">${text}</span>`;
    }).join("");

    overlay.innerHTML = `
      <div class="kt-card">
        ${name ? `<p class="kt-eyebrow">${escapeHtml(name)}</p>` : ""}
        <h2 class="kt-title">Making your scent</h2>
        <div class="kt-stage">${svgMarkup()}</div>
        <div class="kt-cap">${caps}</div>
        <div class="kt-bar"><i></i></div>
      </div>`;
    document.body.appendChild(overlay);

    return new Promise(resolve => {
      let done = false;
      const startedAt = Date.now();
      const finish = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        overlay.classList.add("kt-out");
        setTimeout(() => { overlay.remove(); if (active === handle) active = null; resolve(); }, 300);
      };
      const handle = { finish };
      active = handle;
      const timer = setTimeout(finish, (reduced ? 1.2 : TOTAL_SECONDS * speed) * 1000);
      if (allowSkip) {
        overlay.addEventListener("pointerdown", () => { if (Date.now() - startedAt > 1000) finish(); });
      }
    });
  }

  return { play, palettes: PALETTES };
})();
