# 💀 VEDHAL — The Corpse Riddler

An interactive cinematic horror ritual. A corpse hangs in a tomb between two worlds; approach it
and the **Vedhal** wakes — a cosmic anomaly, a primordial consumer of human consciousness.
He grants you **five links to your mortality**. Answer his riddles aloud, or your memory
belongs to the tree.

## Run
```bash
cd corpse-riddler && python3 -m http.server 8000 --bind 0.0.0.0
# open http://localhost:8000  (headphones on)
```

## Test
```bash
npm i && node test/smoke.js   # headless jsdom run of the full state machine (40+ assertions)
```

## The experience
- **Gate** — content warnings, audio unlock, candle flicker.
- **Cinematic scroll** — Ken Burns tomb backdrop, fog, dust, film grain, marquee, scroll reveals, letterbox bars in the chamber.
- **Proximity sensor** — move your candle-light close to the hanging corpse (or tap it): eyes ignite, chains creak, a Gollum-cracked voice (pitched up, gurgling tremolo, sibilant hiss, tomb reverb) speaks.
- **Animatronic mouth** — two-state photoreal morph (closed ↔ open face crossfaded by a spring-smoothed voice amplitude) + subtle speaking nod. No seams, no slicing.
- **Riddles** — 10 dark riddles. Answer by **voice** (Web Speech API), typing, or whispered option chips. Fuzzy matching tolerates articles, punctuation and speech typos.
- **Five links to mortality** — every wrong answer / timeout rips a link away (crack SFX, HUD fracture). Lose all five → *YOUR MEMORY BELONGS TO THE TREE*. Survive five truths → *YOU SLIP THE NOOSE*.
- **Correct answer** — the entity is irritated to its core: venomous Hollywood-villain taunts (Sauron, Agent Smith, Davy Jones, Voldemort, Thanos, Cthulhu, Hannibal, the old epics, Commodus, Baron Harkonnen), then the sealed compartment grinds open over a glowing relic.
- **Wrong / silent** — blood-red strobe, screen shake, synthesized shriek, full-face jump-scare, mocking commentary aimed at your confidence.
- **The candle is your life** — 25 s burn-down, accelerating heartbeat, sanity meter, red danger state.

## Audio
All ambience synthesized live (Web Audio): tomb drone, wind, thunder, creaks, heartbeat,
link-snap crack, jump-scare shriek, reward chimes + generated cathedral reverb.
Voice lines in `audio/` — taunts recorded with the Gollum-style voice; core lines re-record
pending (the engine fails silently on any missing clip).

## Structure
- `index.html` / `style.css` / `app.js`
- `assets/` — tomb set, open-mouth face, closed-mouth face
- `audio/` — the Vedhal's voice lines
- `test/smoke.js` — headless end-to-end assertions
