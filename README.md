# KNDLÉ Scent Challenge

An offline-first exhibition scent-game prototype for an iPad. Plain HTML, CSS and JavaScript; no build step, backend or online customer database.

## Prototype flow

Play → choose one of six personas → find one of twelve mapped candle slots → smell the physical candle → choose from four fragrance options → result → optional name/Instagram → finish and automatic reset.

All fragrances and persona artwork are placeholders. This version demonstrates the mechanics, not the final exhibition content or discount policy.

## Edit the game

- `config.js`: personas, candle slots, fragrances, options, mappings, PIN and reset delay.
- `app.js`: screens and game behaviour.
- `styles.css`: appearance and responsive layout.
- `db.js`: local IndexedDB and JSON backup/import.
- `manifest.webmanifest` and `service-worker.js`: Home Screen app and offline caching.

## Admin and JSON backup

Hold the KNDLÉ wordmark for about 1.2 seconds. Prototype PIN: **2468**.

Export creates a single JSON file containing play records. Import merges records by their unique IDs. No CSV is produced. The PIN is only a casual kiosk guard, not encryption or a server-side security boundary.

Customer records stay in browser storage on the device. Do not commit customer JSON backups to this repository. Export a backup before changing devices, clearing browser data or changing the app's web address. Browser-local data is not a substitute for backups.

## Publish for iPad testing

In GitHub: **Settings → Pages → Deploy from a branch → main → /(root) → Save**. Use the published HTTPS address shown there.

Open that address in iPad Safari, then **Share → Add to Home Screen**; enable **Open as Web App** when offered. Open the Home Screen app online first, then test reopening it with Wi-Fi off. Also test JSON export and import on the actual iPad before exhibition use.

Publishing a Pages site is separate from uploading the source code. GitHub Pages from a private personal repository requires an eligible paid plan; keep repository visibility unchanged unless the owner chooses otherwise. A private source repository does not itself make the published website private.

## Computer testing

From this directory, run `python -m http.server 8000` and open `http://localhost:8000`.

## Updating the prototype

When changing cached app files, change the cache version in `service-worker.js` so installed copies can receive the new assets. Do not clear IndexedDB as part of a code update.
