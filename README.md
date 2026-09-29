# 💀 VEDHAL — The Corpse Riddler

An interactive cinematic horror ritual. A corpse hangs in a tomb between two worlds; approach it
and the **Vedhal** wakes — a cosmic anomaly, a primordial consumer of human consciousness.
He grants you **five links to your mortality**. Answer his riddles aloud, or your memory
belongs to the tree.

## Run
```bash
python3 -m http.server 8000 --bind 0.0.0.0   # open http://localhost:8000 (headphones on)
```

## Test
```bash
npm i && node test/smoke.js   # headless jsdom run of the full state machine (34 assertions)
```

## The experience
- **Gate** — warnings, audio unlock, candle flicker, silent-entry option.
- **Cinematic scroll** — Ken Burns tomb backdrop, fog, dust, film grain, marquee, staggered
  scroll reveals, parallax relic, letterbox bars in the chamber.
- **Proximity sensor** — bring your light close (or touch the corpse): eyes ignite, chains creak,
  a Gollum-cracked voice speaks — one line at a time, never overlapping (voice bus).
- **Animatronic mouth** — two-state photoreal morph (closed ↔ open) driven by spring-smoothed
  voice amplitude, plus speaking nod and amplitude-reactive eye glow.
- **24 riddles, 3 tiers** — descents 1–2 easy, 3–4 medium, 5 the hungry crown.
  Never repeated, win or lose.
- **Voice answers** — Web Speech API, typed input, or whispered option chips; fuzzy matching
  tolerates articles, punctuation and recognition typos.
- **Five links to mortality** — wrong/silence rips a link (crack SFX, HUD fracture).
  0 links → *YOUR MEMORY BELONGS TO THE TREE*. 5 truths → *YOU SLIP THE NOOSE*.
- **Correct** — the entity is irritated to its core: non-repeating Hollywood-villain venom
  (Sauron, Smith, Davy Jones, Voldemort, Thanos, Cthulhu, Hannibal, the epics, Commodus,
  Harkonnen), then the vault grinds open over a glowing relic.
- **Wrong / silent** — every candle dies, the tomb goes black, his sneaky laugh circles you,
  then non-repeating sarcasm aimed at your confidence.
- **Cinematic captions** on every voiced line; ambient whispers never talk over dialogue.

## Audio
All ambience synthesized live (Web Audio): drone, wind, thunder, creaks, heartbeat, link-snap,
candle snuff, chimes + generated cathedral reverb. 23 recorded voice lines in `audio/`.

## Structure
- `index.html` / `style.css` / `app.js`
- `assets/` — tomb set, open + closed mouth faces
- `audio/` — the Vedhal's voice lines
- `test/smoke.js` — headless end-to-end assertions
- `DEPLOY.md` — GitHub Pages upload guide
