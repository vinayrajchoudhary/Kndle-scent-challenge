window.KNDLE_CLOUD = (() => {
  const SUPABASE_URL = "https://iukyljyklgykayolhaax.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1a3lsanlrbGd5a2F5b2xoYWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3MDgzOTgsImV4cCI6MjEwNTI4NDM5OH0.OhvmxhgsC3K17hipUuhmuMzVV26U1QytWvo2v4dHGTA";
  const db = () => window.KNDLE_DB;

  function deviceId() {
    const key = "kndle_device_id";
    let value = localStorage.getItem(key);
    if (!value) {
      value = (crypto.randomUUID ? crypto.randomUUID() : `device-${Date.now()}-${Math.random().toString(16).slice(2)}`);
      localStorage.setItem(key, value);
    }
    return value;
  }

  async function request(path, options = {}) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      ...options,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error("KNDLÉ Supabase error", response.status, body || response.statusText);\n      const error = new Error(`Supabase ${response.status}: ${body || response.statusText}`);
      error.status = response.status;
      throw error;
    }
    return response;
  }

  function privateRow(play) {
    return {
      play_id: play.id,
      device_id: deviceId(),
      played_at: play.createdAt,
      persona_id: play.personaId,
      persona_name: play.personaName,
      candle_id: play.candleId,
      candle_name: play.fragrance,
      selected_answer: play.answer,
      correct: !!play.correct,
      reward: play.correct ? window.KNDLE_CONFIG.settings.correctReward : window.KNDLE_CONFIG.settings.wrongReward,
      nickname: play.playerName || null,
      instagram: play.instagram || null
    };
  }

  function leaderboardRow(play) {
    if (!play.correct || !play.playerName) return null;
    return {
      play_id: play.id,
      nickname: play.playerName,
      persona_name: play.personaName,
      candle_name: play.fragrance,
      correct: true,
      played_at: play.createdAt
    };
  }

  async function insertIgnoringDuplicate(table, row) {
    if (!row) return;
    try {
      await request(`${table}?on_conflict=play_id`, {
        method: "POST",
        headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
        body: JSON.stringify(row)
      });
    } catch (err) {
      if (err.status !== 409) throw err;
    }
  }

  async function syncPlay(play) {
    if (!navigator.onLine) return false;
    try {
      await insertIgnoringDuplicate("game_plays", privateRow(play));
      await insertIgnoringDuplicate("leaderboard_entries", leaderboardRow(play));
      play.cloudSynced = true;
      play.cloudSyncedAt = new Date().toISOString();
      play.lastSyncError = "";
      await db().addPlay(play);
      return true;
    } catch (err) {
      play.cloudSynced = false;
      play.lastSyncError = String(err.message || err).slice(0, 300);
      await db().addPlay(play);
      return false;
    }
  }

  async function syncPending() {
    if (!navigator.onLine) return { attempted: 0, synced: 0 };
    const plays = await db().getAllPlays();
    const pending = plays.filter(p => !p.cloudSynced);
    let synced = 0;
    for (const play of pending) {
      if (await syncPlay(play)) synced += 1;
    }
    return { attempted: pending.length, synced };
  }

  async function getLeaderboard(limit = 10) {
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
    try {
      const response = await request(
        `leaderboard_entries?select=play_id,nickname,persona_name,candle_name,played_at&order=played_at.desc&limit=${safeLimit}`,
        { method: "GET" }
      );
      return await response.json();
    } catch {
      const plays = await db().getAllPlays();
      return plays
        .filter(p => p.correct && p.playerName)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, safeLimit)
        .map(p => ({
          play_id: p.id,
          nickname: p.playerName,
          persona_name: p.personaName,
          candle_name: p.fragrance,
          played_at: p.createdAt
        }));
    }
  }

  return { deviceId, syncPlay, syncPending, getLeaderboard, version: "4" };
})();