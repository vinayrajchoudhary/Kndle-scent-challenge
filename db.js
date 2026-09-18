window.KNDLE_DB = (() => {
  const DB_NAME = "kndle_scent_game";
  const DB_VERSION = 1;
  const STORE = "plays";

  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: "id" });
          store.createIndex("createdAt", "createdAt", { unique: false });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function addPlay(play) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(play);
      tx.oncomplete = () => resolve(play);
      tx.onerror = () => reject(tx.error);
    });
  }

  async function getAllPlays() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction(STORE, "readonly").objectStore(STORE).getAll();
      req.onsuccess = () => resolve(req.result.sort((a,b) => a.createdAt.localeCompare(b.createdAt)));
      req.onerror = () => reject(req.error);
    });
  }

  async function clearAll() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction(STORE, "readwrite").objectStore(STORE).clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async function importBackup(payload, mode = "merge") {
    if (!payload || payload.app !== "KNDLE Scent Challenge" || !Array.isArray(payload.plays)) {
      throw new Error("Invalid KNDLÉ backup file.");
    }
    if (mode === "replace") await clearAll();
    for (const play of payload.plays) {
      if (!play.id || !play.createdAt) continue;
      await addPlay(play);
    }
  }

  async function exportBackup() {
    const plays = await getAllPlays();
    return {
      app: "KNDLE Scent Challenge",
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      plays
    };
  }

  return { addPlay, getAllPlays, clearAll, importBackup, exportBackup };
})();
