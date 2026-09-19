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
    resetTimer: null,
    transitioning: false
  };

  const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
  const SLOT_CUES = {
    "1": "✦",
    "2": "☾",
    "3": "◇",
    "4": "☼",
    "5": "✧",
    "6": "◈",
    "7": "⬡",
    "8": "⟡",
    "9": "✺"
  };


  const INACTIVITY_RESET_MS = 100000;
  const INACTIVITY_EXCLUDED_SCREENS = new Set(["home", "final", "admin"]);
  let inactivityTimer = null;

  function clearInactivityTimer() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = null;
  }

  function inactivityResetDue() {
    if (INACTIVITY_EXCLUDED_SCREENS.has(state.screen)) {
      clearInactivityTimer();
      return;
    }

    if (document.querySelector(".kt-overlay")) {
      inactivityTimer = setTimeout(inactivityResetDue, 1000);
      return;
    }

    resetGame();
  }

  function restartInactivityTimer() {
    clearInactivityTimer();
    if (INACTIVITY_EXCLUDED_SCREENS.has(state.screen)) return;
    inactivityTimer = setTimeout(inactivityResetDue, INACTIVITY_RESET_MS);
  }


  function clearResetTimer() {
    if (state.resetTimer) clearTimeout(state.resetTimer);
    state.resetTimer = null;
  }

  function go(screen) {
    clearResetTimer();
    state.screen = screen;
    render();
    restartInactivityTimer();
  }

  function resetGame() {
    clearResetTimer();
    clearInactivityTimer();
    Object.assign(state, {
      screen: "home", persona: null, candle: null, answer: null,
      result: null, playerName: "", instagram: "", savedPlayId: null,
      transitioning: false
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

    document.querySelectorAll(".persona-card").forEach(btn => btn.onclick = async () => {
      if (state.transitioning) return;
      state.transitioning = true;
      state.persona = cfg.personas.find(p => p.id === btn.dataset.id);
      const eligible = cfg.candles.filter(c => c.active && c.mappedPersonas.includes(state.persona.id));
      state.candle = eligible[Math.floor(Math.random() * eligible.length)] || cfg.candles.find(c => c.active);

      let transitionPromise = null;
      try {
        if (window.KNDLE_TRANSITION) {
          transitionPromise = window.KNDLE_TRANSITION.play(state.persona);
        }

        // Prepare the challenge underneath the transition overlay so its fade-out
        // reveals the next screen directly, instead of briefly exposing personas.
        state.screen = "challenge";
        render();
        restartInactivityTimer();

        if (transitionPromise) await transitionPromise;
      } catch (err) {
        console.warn("KNDLÉ transition skipped:", err);
        if (state.screen !== "challenge") {
          state.screen = "challenge";
          render();
        }
      } finally {
        state.transitioning = false;
      }
    });
  }


  function renderChallenge() {
    const selected = state.candle;
    const slots = cfg.candles.map(c => `
      <div class="slot ${c.id === selected.id ? "selected" : "muted"}">
        <span class="slot-icon">${SLOT_CUES[c.slot] || c.slot}</span>
        <small>${c.slotLabel}</small>
      </div>`).join("");

    shell(`
      <div class="content-wrap narrow">
        <p class="eyebrow">${state.persona.name} has chosen your challenge</p>
        <h2>Find this candle below the iPad</h2>
        <div class="shelf-grid">${slots}</div>
        <div class="selected-candle">
          <span class="selected-icon">${SLOT_CUES[selected.slot] || selected.slot}</span>
          <strong>${selected.slotLabel}</strong>
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
    clearInactivityTimer();
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

  document.addEventListener("pointerdown", restartInactivityTimer, { capture: true, passive: true });
  document.addEventListener("keydown", restartInactivityTimer, true);
  document.addEventListener("input", restartInactivityTimer, true);

  window.addEventListener("online", () => cloud?.syncPending().catch(() => {}));
  cloud?.syncPending().catch(() => {});
  render();
  restartInactivityTimer();
})();
