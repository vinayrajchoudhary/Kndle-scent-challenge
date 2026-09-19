(() => {
  const cfg = window.KNDLE_CONFIG;
  const db = window.KNDLE_DB;
  const cloud = window.KNDLE_CLOUD;
  const app = document.getElementById("app");

  const state = {
    screen: "home",
    persona: null,
    candle: null,
    answer: null,
    result: null,
    playerName: "",
    instagram: "",
    savedPlayId: null,
    adminUnlocked: false,
    resetTimer: null
  };

  const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

  function clearResetTimer() {
    if (state.resetTimer) clearTimeout(state.resetTimer);
    state.resetTimer = null;
  }

  function go(screen) {
    clearResetTimer();
    state.screen = screen;
    render();
  }

  function resetGame() {
    clearResetTimer();
    Object.assign(state, {
      screen: "home", persona: null, candle: null, answer: null,
      result: null, playerName: "", instagram: "", savedPlayId: null
    });
    render();
  }

  function topBar(step = "") {
    return `
      <header class="topbar">
        <button class="brand-button" id="brandButton" aria-label="KNDLÉ admin">${cfg.brand.name}</button>
        <div class="step-label">${step}</div>
        <button class="ghost small" id="homeButton">Home</button>
      </header>`;
  }

  async function latestStats() {
    try {
      const plays = await db.getAllPlays();
      return { count: plays.length, latest: plays.at(-1) || null };
    } catch {
      return { count: 0, latest: null };
    }
  }

  async function renderFooter() {
    const footer = document.getElementById("liveFooter");
    if (!footer) return;
    const stats = await latestStats();
    footer.textContent = stats.latest
      ? `🏆 ${stats.count} played • Latest: ${stats.latest.playerName || "Guest"} — ${stats.latest.fragrance}`
      : "🏆 Be the first Scent Detective today";
  }

  function shell(content, step = "", showFooter = true) {
    app.innerHTML = `${topBar(step)}<section class="screen">${content}</section>${showFooter ? '<footer id="liveFooter" class="live-footer"></footer>' : ''}`;
    bindGlobal();
    if (showFooter) renderFooter();
  }

  function bindGlobal() {
    document.getElementById("homeButton")?.addEventListener("click", resetGame);
    let pressTimer;
    const brand = document.getElementById("brandButton");
    brand?.addEventListener("pointerdown", () => { pressTimer = setTimeout(() => openAdmin(), 1200); });
    ["pointerup", "pointerleave", "pointercancel"].forEach(evt => brand?.addEventListener(evt, () => clearTimeout(pressTimer)));
  }

  function renderHome() {
    shell(`
      <div class="hero">
        <div class="flame">✦</div>
        <p class="eyebrow">${cfg.brand.name}</p>
        <h1>${cfg.brand.gameTitle}</h1>
        <p class="lede">${cfg.brand.tagline}</p>
        <button class="primary xl" id="playButton">PLAY THE GAME</button>
        <p class="hint">Choose your vibe • smell a candle • make your guess</p>
      </div>`, "", true);
    document.getElementById("playButton").onclick = () => go("personas");
  }

  function renderPersonas() {
    shell(`
      <div class="content-wrap">
        <p class="eyebrow">Step 1</p>
        <h2>What’s your vibe?</h2>
        <div class="persona-grid">
          ${cfg.personas.map(p => `
            <button class="persona-card" data-id="${p.id}">
              <span class="persona-icon">${p.icon}</span>
              <strong>${p.name}</strong>
              <small>${p.descriptor}</small>
            </button>`).join("")}
        </div>
      </div>`, "① Your vibe → ② Smell → ③ Guess");

    document.querySelectorAll(".persona-card").forEach(btn => btn.onclick = () => {
      state.persona = cfg.personas.find(p => p.id === btn.dataset.id);
      const eligible = cfg.candles.filter(c => c.active && c.mappedPersonas.includes(state.persona.id));
      state.candle = eligible[Math.floor(Math.random() * eligible.length)] || cfg.candles.find(c => c.active);
      go("challenge");
    });
  }


  function renderVesselThumb(candle, large = false) {
    const cls = large ? "vessel-svg large" : "vessel-svg";
    const n = candle.slot;
    const common = `class="${cls}" viewBox="0 0 100 100" role="img" aria-label="Candle ${n} thumbnail"`;

    switch (candle.vessel) {
      case "amber-lidded":
        return `<svg ${common}>
          <defs><linearGradient id="amber-${n}" x1="0" x2="1"><stop stop-color="#8e5b2a"/><stop offset=".5" stop-color="#d89962"/><stop offset="1" stop-color="#7a4b24"/></linearGradient></defs>
          <path d="M25 35 Q18 50 24 72 Q30 86 50 88 Q70 86 76 72 Q82 50 75 35 Z" fill="url(#amber-${n})"/>
          <ellipse cx="50" cy="36" rx="27" ry="9" fill="#9b744e"/><rect x="26" y="29" width="48" height="8" rx="4" fill="#9b744e"/>
          <path d="M42 26 q7-8 14 0 l6 3 -5 4 -6-3 -7 4 -7-4z" fill="#8c6a3d"/>
        </svg>`;
      case "green-pedestal":
        return `<svg ${common}>
          <defs><linearGradient id="ped-${n}" x1="0" x2="1"><stop stop-color="#374b2d"/><stop offset=".5" stop-color="#8c9a5c"/><stop offset="1" stop-color="#2f3c27"/></linearGradient></defs>
          <path d="M18 22 Q20 54 50 61 Q80 54 82 22 Z" fill="url(#ped-${n})"/>
          <ellipse cx="50" cy="22" rx="32" ry="9" fill="#d9dac0" stroke="#33432b" stroke-width="4"/>
          <rect x="45" y="58" width="10" height="17" rx="3" fill="#3d4d31"/><ellipse cx="50" cy="79" rx="22" ry="7" fill="#3b4930"/>
          <path d="M30 27v24M40 25v31M50 24v34M60 25v31M70 27v24" stroke="#314127" opacity=".55"/>
        </svg>`;
      case "ribbed-green":
        return `<svg ${common}>
          <defs><linearGradient id="rib-${n}" x1="0" x2="1"><stop stop-color="#647650"/><stop offset=".5" stop-color="#b2bd8d"/><stop offset="1" stop-color="#526343"/></linearGradient></defs>
          <path d="M29 20 Q25 52 34 78 Q50 86 66 78 Q75 52 71 20 Z" fill="url(#rib-${n})"/>
          <ellipse cx="50" cy="20" rx="21" ry="7" fill="#e7e5cf" stroke="#506144" stroke-width="3"/>
          <path d="M36 26l2 46M44 24l1 52M52 24v53M60 24l-1 50M68 26l-3 45" stroke="#4e6041" opacity=".5"/>
        </svg>`;
      case "lime-bowl":
        return `<svg ${common}>
          <defs><radialGradient id="lime-${n}"><stop stop-color="#9fc43d"/><stop offset="1" stop-color="#4f7414"/></radialGradient></defs>
          <path d="M22 42 Q19 69 34 80 Q50 88 66 80 Q81 69 78 42 Z" fill="url(#lime-${n})"/>
          <ellipse cx="50" cy="42" rx="28" ry="11" fill="#f0ead4" stroke="#57751c" stroke-width="3"/>
          <g fill="#c4e877" opacity=".8"><circle cx="31" cy="59" r="2"/><circle cx="42" cy="72" r="1.7"/><circle cx="61" cy="63" r="2"/><circle cx="69" cy="73" r="1.6"/></g>
        </svg>`;
      case "floral-glass":
        return `<svg ${common}>
          <rect x="29" y="18" width="42" height="65" rx="11" fill="#f1efe6" stroke="#95a08d" stroke-width="2"/>
          <ellipse cx="50" cy="20" rx="20" ry="7" fill="#fffdf5" stroke="#9aa28e" stroke-width="2"/>
          <path d="M40 72 Q45 55 49 39 M58 72 Q54 56 53 43" stroke="#4e8a48" stroke-width="2.5" fill="none"/>
          <g fill="#d896b8"><circle cx="39" cy="62" r="6"/><circle cx="62" cy="48" r="6"/></g>
          <g fill="#f1c2d6"><circle cx="36" cy="59" r="3"/><circle cx="43" cy="65" r="3"/><circle cx="59" cy="45" r="3"/><circle cx="65" cy="51" r="3"/></g>
        </svg>`;
      case "teal-bowl":
        return `<svg ${common}>
          <defs><radialGradient id="teal-${n}"><stop stop-color="#52b3a0"/><stop offset="1" stop-color="#1f6d67"/></radialGradient></defs>
          <path d="M22 42 Q19 69 34 80 Q50 88 66 80 Q81 69 78 42 Z" fill="url(#teal-${n})"/>
          <ellipse cx="50" cy="42" rx="28" ry="11" fill="#efe9d6" stroke="#326e68" stroke-width="3"/>
          <g fill="#a8e1d5" opacity=".85"><circle cx="31" cy="61" r="2"/><circle cx="46" cy="74" r="1.6"/><circle cx="62" cy="64" r="2"/><circle cx="69" cy="72" r="1.7"/></g>
        </svg>`;
      case "white-face":
        return `<svg ${common}>
          <path d="M26 20 Q18 28 23 43 L29 80 Q45 88 66 78 L77 35 Q78 23 67 20 Q57 25 48 20 Q36 25 26 20Z" fill="#f4f2ed" stroke="#c7c4bc" stroke-width="2"/>
          <path d="M38 44 q6-4 12 0 M54 44 q6-4 11 0 M51 47 q-3 8 2 11 M42 66 q9 5 18 0" fill="none" stroke="#9f9b93" stroke-width="2" stroke-linecap="round"/>
          <path d="M69 13 Q64 26 64 42" stroke="#d7d3cb" stroke-width="2"/>
        </svg>`;
      case "large-floral-bowl":
        return `<svg ${common}>
          <defs><linearGradient id="big-${n}" x1="0" x2="1"><stop stop-color="#32494d"/><stop offset=".5" stop-color="#6e8080"/><stop offset="1" stop-color="#283d42"/></linearGradient></defs>
          <path d="M12 42 Q15 79 50 84 Q85 79 88 42 Z" fill="url(#big-${n})"/>
          <ellipse cx="50" cy="42" rx="38" ry="15" fill="#f2edda" stroke="#354d52" stroke-width="4"/>
          <g fill="#7ca56c"><circle cx="24" cy="61" r="2"/><circle cx="73" cy="66" r="2"/><circle cx="35" cy="74" r="2"/></g>
          <g fill="#e8ede5"><circle cx="29" cy="58" r="2.5"/><circle cx="68" cy="60" r="2.5"/><circle cx="55" cy="76" r="2.5"/></g>
        </svg>`;
      case "aqua-green":
        return `<svg ${common}>
          <defs><linearGradient id="aqua-${n}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#bcd96a"/><stop offset=".55" stop-color="#8bc555"/><stop offset="1" stop-color="#e6e7d5"/></linearGradient></defs>
          <path d="M24 35 Q18 62 31 78 Q50 88 69 78 Q82 62 76 35 Z" fill="url(#aqua-${n})"/>
          <ellipse cx="50" cy="35" rx="26" ry="10" fill="#f2edd9" stroke="#87b34f" stroke-width="3"/>
          <path d="M61 73 h12" stroke="#607f37" stroke-width="2" opacity=".65"/>
        </svg>`;
      default:
        return `<div class="vessel-fallback">${candle.slot}</div>`;
    }
  }

  function renderChallenge() {
    const selected = state.candle;
    const slots = cfg.candles.map(c => `
      <div class="slot ${c.id === selected.id ? "selected" : "muted"}">
        <span class="slot-number">${c.slot}</span>
        ${renderVesselThumb(c)}
      </div>`).join("");

    shell(`
      <div class="content-wrap narrow">
        <p class="eyebrow">${state.persona.name} has chosen your challenge</p>
        <h2>Find candle ${selected.slot} below the iPad</h2>
        <div class="shelf-grid">${slots}</div>
        <div class="selected-candle">
          ${renderVesselThumb(selected, true)}
          <strong>Candle ${selected.slot}</strong>
        </div>
        <p class="lede">Pick it up. Take a good sniff.</p>
        <button class="primary" id="smelledButton">I’VE SMELLED IT</button>
      </div>`, "① Your vibe → ② Smell → ③ Guess");
    document.getElementById("smelledButton").onclick = () => go("guess");
  }

  function renderGuess() {
    const options = shuffle(state.candle.options);
    shell(`
      <div class="content-wrap narrow">
        <p class="eyebrow">Step 3</p>
        <h2>What fragrance do you think it is?</h2>
        <div class="answer-grid">
          ${options.map(o => `<button class="answer-card" data-answer="${o}">${o}</button>`).join("")}
        </div>
      </div>`, "① Your vibe → ② Smell → ③ Guess");

    document.querySelectorAll(".answer-card").forEach(btn => btn.onclick = async () => {
      state.answer = btn.dataset.answer;
      state.result = state.answer === state.candle.fragrance ? "correct" : "wrong";
      await savePlay();
      go("result");
    });
  }

  async function savePlay() {
    const play = {
      id: uid(),
      createdAt: new Date().toISOString(),
      playerName: "",
      instagram: "",
      personaId: state.persona.id,
      personaName: state.persona.name,
      candleId: state.candle.id,
      slot: state.candle.slot,
      slotLabel: state.candle.slotLabel,
      fragrance: state.candle.fragrance,
      answer: state.answer,
      correct: state.result === "correct",
      cloudSynced: false,
      cloudSyncedAt: null,
      lastSyncError: ""
    };
    state.savedPlayId = play.id;
    await db.addPlay(play);
  }

  function renderResult() {
    const correct = state.result === "correct";
    shell(`
      <div class="result-card ${correct ? "success" : "almost"}">
        <div class="result-icon">${correct ? "🎉" : "✨"}</div>
        <p class="eyebrow">${correct ? cfg.settings.correctReward : cfg.settings.wrongReward}</p>
        <h2>${correct ? "YOU NAILED IT!" : "SO CLOSE!"}</h2>
        <div class="fragrance-name">${state.candle.fragrance}</div>
        <p>${state.candle.descriptor}</p>
        ${!correct ? `<p class="hint">Smell it once more — can you catch it now?</p>` : ""}
        <button class="primary" id="joinButton">JOIN THE SCENT DETECTIVES</button>
        <button class="ghost" id="skipButton">Skip</button>
      </div>`, "Result", false);

    document.getElementById("joinButton").onclick = () => go("player");
    document.getElementById("skipButton").onclick = async () => { await finalizePlay(); go("final"); };
  }

  function renderPlayer() {
    shell(`
      <div class="content-wrap narrow">
        <p class="eyebrow">Optional</p>
        <h2>Join today’s Scent Detectives</h2>
        <label class="field">Name / nickname<input id="playerName" autocomplete="off" maxlength="30" placeholder="Your name" /></label>
        <label class="field">Instagram <span>(optional)</span><input id="instagram" autocomplete="off" maxlength="40" placeholder="@handle" /></label>
        <button class="primary" id="savePlayer">ADD ME</button>
        <button class="ghost" id="skipPlayer">Skip</button>
      </div>`, "Almost done", false);
    document.getElementById("savePlayer").onclick = async () => {
      state.playerName = document.getElementById("playerName").value.trim();
      state.instagram = document.getElementById("instagram").value.trim();
      const plays = await db.getAllPlays();
      const play = plays.find(p => p.id === state.savedPlayId);
      if (play) {
        play.playerName = state.playerName;
        play.instagram = state.instagram;
        await db.addPlay(play);
      }
      await finalizePlay();
      go("final");
    };
    document.getElementById("skipPlayer").onclick = async () => { await finalizePlay(); go("final"); };
  }

  async function finalizePlay() {
    const plays = await db.getAllPlays();
    const play = plays.find(p => p.id === state.savedPlayId);
    if (!play) return false;
    play.playerName = state.playerName || play.playerName || "";
    play.instagram = state.instagram || play.instagram || "";
    await db.addPlay(play);
    return cloud ? cloud.syncPlay(play) : false;
  }

  async function renderFinal() {
    const recent = cloud
      ? await cloud.getLeaderboard(5)
      : [...(await db.getAllPlays())].reverse().filter(p => p.correct && p.playerName).slice(0, 5)
          .map(p => ({ nickname: p.playerName, candle_name: p.fragrance }));
    shell(`
      <div class="content-wrap narrow center">
        <p class="eyebrow">KNDLÉ Scent Detectives</p>
        <h2>${state.playerName ? `Welcome, ${escapeHtml(state.playerName)} ✨` : "Thanks for playing ✨"}</h2>
        <div class="mini-board">
          ${recent.length ? recent.map(p => `<div><strong>${escapeHtml(p.nickname)}</strong><span>${escapeHtml(p.candle_name)}</span></div>`).join("") : "<p>No named winners yet.</p>"}
        </div>
        <p class="hint">Returning to the start…</p>
        <button class="ghost" id="playAgain">Play again now</button>
      </div>`, "Finished", false);
    document.getElementById("playAgain").onclick = resetGame;
    state.resetTimer = setTimeout(resetGame, cfg.settings.autoResetSeconds * 1000);
  }

  function escapeHtml(str = "") {
    return str.replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  }

  function openAdmin() {
    clearResetTimer();
    if (!state.adminUnlocked) {
      const pin = prompt("Admin PIN");
      if (pin !== cfg.settings.adminPin) return;
      state.adminUnlocked = true;
    }
    state.screen = "admin";
    render();
  }

  async function renderAdmin() {
    const plays = await db.getAllPlays();
    const correct = plays.filter(p => p.correct).length;
    const pending = plays.filter(p => !p.cloudSynced).length;
    shell(`
      <div class="content-wrap narrow">
        <p class="eyebrow">Admin</p>
        <h2>Local database</h2>
        <div class="stats-grid">
          <div><strong>${plays.length}</strong><span>Total plays</span></div>
          <div><strong>${correct}</strong><span>Correct</span></div>
          <div><strong>${pending}</strong><span>Pending sync</span></div>
        </div>
        <div class="admin-actions">
          <button class="primary" id="syncNow">Sync now</button>
          <button class="primary" id="exportJson">Export JSON</button>
          <label class="file-button">Import JSON<input id="importJson" type="file" accept="application/json,.json" /></label>
          <button class="ghost" id="resetAll">Reset all data</button>
        </div>
        <p class="hint">Import currently merges records by unique play ID.</p>
      </div>`, "Admin", false);

    document.getElementById("syncNow").onclick = async () => {
      if (cloud) await cloud.syncPending();
      renderAdmin();
    };
    document.getElementById("exportJson").onclick = exportJson;
    document.getElementById("importJson").onchange = importJson;
    document.getElementById("resetAll").onclick = async () => {
      if (!confirm("Delete all local game data on this device?")) return;
      await db.clearAll();
      renderAdmin();
    };
  }

  async function exportJson() {
    const payload = await db.exportBackup();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kndle-scent-game-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function importJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const payload = JSON.parse(await file.text());
      await db.importBackup(payload, "merge");
      alert("JSON database imported successfully.");
      renderAdmin();
    } catch (err) {
      alert(err.message || "Could not import this JSON file.");
    } finally {
      event.target.value = "";
    }
  }

  function render() {
    switch (state.screen) {
      case "home": renderHome(); break;
      case "personas": renderPersonas(); break;
      case "challenge": renderChallenge(); break;
      case "guess": renderGuess(); break;
      case "result": renderResult(); break;
      case "player": renderPlayer(); break;
      case "final": renderFinal(); break;
      case "admin": renderAdmin(); break;
      default: renderHome();
    }
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js").catch(() => {}));
  }

  window.addEventListener("online", () => cloud?.syncPending().catch(() => {}));
  cloud?.syncPending().catch(() => {});
  render();
})();
