# 🕯 Deploying VEDHAL to GitHub Pages

The site is 100% static (HTML/CSS/JS + assets), and **every path is relative**, so it works
under any GitHub Pages sub-path with zero configuration. GitHub Pages serves HTTPS, which the
microphone (Web Speech API) requires.

## One-time setup

1. **Create the repository** on github.com → **New repository**
   - Name: e.g. `vedhal` (any name works — your site URL follows it)
   - **Public**, no README, no .gitignore template (one is included here).

2. **Push the folder** (run inside this `corpse-riddler` directory):

```bash
git init
git add .
git commit -m "VEDHAL — the corpse riddler"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/vedhal.git
git push -u origin main
```

3. **Enable Pages**: repository → **Settings** → **Pages**
   - *Source:* **Deploy from a branch**
   - *Branch:* `main` · *Folder:* `/ (root)` → **Save**

4. Wait ~1–2 minutes, then open:

```
https://<YOUR-USERNAME>.github.io/vedhal/
```

## Updating later

```bash
git add .
git commit -m "the tree grows"
git push
```

Pages re-deploys automatically (1–2 min).

## Good to know

- `node_modules/` is git-ignored — it's only for the headless test (`npm i && node test/smoke.js`)
  and is **not** needed on Pages.
- Don't open `index.html` via `file://` locally — browsers block audio/mic without http(s).
  Use `python3 -m http.server 8000` and visit `http://localhost:8000`.
- Total repo weight is a few MB of PNG/MP3 — far under GitHub's limits.
- Optional custom domain: add a `CNAME` file + DNS record, then set it under Settings → Pages.
- First visit can take a couple of minutes while GitHub's CDN propagates; hard-refresh after deploys.

## Smoke test before you ship

```bash
npm i          # installs jsdom (dev-only)
node test/smoke.js
```

40+ assertions cover: gate & silent entry, proximity awakening, captions, riddle flow with
difficulty tiers and no-repeat riddles/dialogue, correct → irritated taunt + open vault,
wrong → candles-out + sneaky laugh + sarcastic verdict + fracture HUD, both finales,
and fuzzy voice matching.
