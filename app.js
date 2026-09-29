/* ============================================================
   VEDHAL — THE CORPSE RIDDLER · experience engine
   "He is no mere ghost — he is a cosmic anomaly."
   ============================================================ */
"use strict";
const $ = (s) => document.querySelector(s);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const MAX_LIVES = 5;   // five links to mortality
const WIN_TRUTHS = 5;  // survive five descents
const TOTAL_TIME = 25000;

/* ---------------- riddle bank — three tiers of difficulty ---------------- */
const RIDDLES = [
  /* — TIER I : the shallow grave — */
  { tier: 1, q: "I have a bed yet never sleep, a mouth yet never eat. I run all night and run all day, though I have no legs nor feet. What am I?",
    a: ["river"], chips: ["Wind", "River", "Serpent", "Time"] },
  { tier: 1, q: "I follow you through noonday light and dance when the sun is high, but when the moon climbs up the sky, I die. What am I?",
    a: ["shadow", "a shadow"], chips: ["Dream", "Shadow", "Footprint", "Echo"] },
  { tier: 1, q: "Feed me and I live; give me drink and I die. I dance on your grave if you let me climb. What am I?",
    a: ["fire", "flame"], chips: ["Fire", "Hunger", "Rust", "Weed"] },
  { tier: 1, q: "I have hands that cannot clap, a face that cannot smile, and I will count the very seconds until your body joins the pile. What am I?",
    a: ["clock", "a clock", "watch"], chips: ["Skeleton", "Clock", "Priest", "Drum"] },
  { tier: 1, q: "I have many teeth but cannot eat, and I run through hair from dawn to night. What am I?",
    a: ["comb", "a comb"], chips: ["Comb", "Saw", "Key", "Harrow"] },
  { tier: 1, q: "The more I dry, the wetter I grow. I comfort the living and never complain. What am I?",
    a: ["towel", "a towel"], chips: ["Rain", "Towel", "Sponge", "Tear"] },
  { tier: 1, q: "When the rain comes down I go up, and when the sun returns I am banished. What am I?",
    a: ["umbrella", "an umbrella"], chips: ["Umbrella", "Smoke", "Ladder", "Kite"] },
  { tier: 1, q: "I have a neck but no head, I wear a cap but have no hair, and I keep what the dead once drank. What am I?",
    a: ["bottle", "a bottle"], chips: ["Bottle", "Rope", "Well", "Axe"] },
  /* — TIER II : the twisting root — */
  { tier: 2, q: "The more of me you take, the larger I grow. I swallow coins, kings and bones alike, and never let them go. What am I?",
    a: ["grave", "graves", "a grave", "hole"], chips: ["Grave", "Shadow", "River", "Memory"] },
  { tier: 2, q: "The maker does not want me, the buyer does not use me, the user does not see me. What am I?",
    a: ["coffin", "a coffin"], chips: ["Coffin", "Shroud", "Mirror", "Poison"] },
  { tier: 2, q: "Alive without breath, cold as death; never hungry, never thirsty, clad in mail that never clinks. What am I?",
    a: ["fish"], chips: ["Stone", "Ghost", "Fish", "Statue"] },
  { tier: 2, q: "I have cities, but no houses live; forests, but no trees; water, but no fish. What am I?",
    a: ["map", "a map"], chips: ["Map", "Graveyard", "Desert", "Sky"] },
  { tier: 2, q: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind and stone. What am I?",
    a: ["echo", "an echo"], chips: ["Whisper", "Bell", "Echo", "Crow"] },
  { tier: 2, q: "I fly all night without a wing, I cry all day without an eye. Wherever I pass, the light must die. What am I?",
    a: ["cloud", "clouds", "a cloud"], chips: ["Bat", "Cloud", "Smoke", "Moon"] },
  { tier: 2, q: "I have no doors, no windows, no floor and no roof, yet I guard a golden treasure no thief has ever taken. What am I?",
    a: ["egg", "an egg"], chips: ["Egg", "Chest", "Seed", "Coin"] },
  { tier: 2, q: "The more of me you shine your light upon, the less you see. What am I?",
    a: ["darkness", "dark", "the dark"], chips: ["Darkness", "Fog", "Mirror", "Sleep"] },
  { tier: 2, q: "I can be made, I can be played, I can be told, and I can be cracked — yet I have no body at all. What am I?",
    a: ["joke", "a joke"], chips: ["Joke", "Bell", "Vow", "Bone"] },
  { tier: 2, q: "I have a single eye but cannot see, and I drag my one long tail through every wound I make. What am I?",
    a: ["needle", "a needle"], chips: ["Needle", "Storm", "Well", "Thread"] },
  /* — TIER III : the hungry crown — */
  { tier: 3, q: "I am the beginning of eternity, the end of time and space, the beginning of every end, and the end of every place. What am I?",
    a: ["the letter e", "letter e", "e"], chips: ["The letter E", "The letter A", "The moon", "Zero"] },
  { tier: 3, q: "You may hold me without ever touching me, yet the moment you name me, I break. What am I?",
    a: ["silence"], chips: ["Silence", "Glass", "Promise", "Ice"] },
  { tier: 3, q: "I weigh nothing at all, yet the strongest man alive cannot hold me for long. What am I?",
    a: ["breath", "your breath"], chips: ["Breath", "Shadow", "Coin", "Regret"] },
  { tier: 3, q: "I am wholly yours, yet the tree and every tongue will use me far more than you ever will. What am I?",
    a: ["name", "your name", "my name"], chips: ["Your name", "Your shadow", "Your soul", "Your grave"] },
  { tier: 3, q: "Feed me and I die; keep me buried and I live, growing heavier every year. What am I?",
    a: ["secret", "a secret"], chips: ["A secret", "A flame", "A river", "A wound"] },
  { tier: 3, q: "I am always before you, always promised, always coming — yet we shall never meet. What am I?",
    a: ["tomorrow", "the future", "future"], chips: ["Tomorrow", "The wind", "Death", "A dream"] },
];
const REWARDS = [
  { i: "🏺", n: "The Golden Idol of Kali", d: "It watches you sleep. It is grateful to be freed." },
  { i: "🪙", n: "The Vedhal's Black Coin", d: "Spend it once, and the change is years of your life." },
  { i: "🦴", n: "A Shard of Moonlit Bone", d: "Hum to it at midnight and something hums back." },
  { i: "📿", n: "Rudraksha of the Sealed Door", d: "The beads count themselves when no one is looking." },
  { i: "🕯️", n: "The Undying Wick", d: "It burned for a thousand years. It remembers the way home." },
];
/* Vedhal's venomous reactions — homages to Hollywood's great villains */
const TAUNTS_CORRECT = ["taunt1", "taunt5", "taunt6", "taunt7", "taunt8", "taunt9"];
const TAUNTS_WRONG = ["wrong1", "wrong2", "wrong3", "wrong4", "wrong5", "taunt3", "taunt4", "taunt10"];
/* on-screen sarcasm for failures */
const SARCASMS = [
  "The worms applauded. In pity.",
  "A crown of failures, tailor-made for you.",
  "Delicious certainty. Zero substance.",
  "New ways to disappoint — collected, archived, admired.",
  "Even the moths answered faster.",
  "The tree sends its thanks for the meal.",
];
/* no-repeat draw bags */
function makeBag(arr) { const b = shuffle([...arr]); return () => (b.length ? b.pop() : null); }
let bagCorrect = null, bagWrong = null;
function drawFrom(get, set, all) {
  let bag = get(); let v = bag ? bag() : null;
  if (!v) { bag = makeBag(all); set(bag); v = bag(); }
  return v;
}
const usedRiddles = new Set();
const tierFor = (descent) => (descent <= 2 ? 1 : descent <= 4 ? 2 : 3);
function pickRiddle(tier) {
  let pool = RIDDLES.map((r, i) => ({ r, i })).filter((x) => x.r.tier === tier && !usedRiddles.has(x.i));
  if (!pool.length) pool = RIDDLES.map((r, i) => ({ r, i })).filter((x) => x.r.tier === tier);
  const x = pick(pool);
  usedRiddles.add(x.i);
  return x.r;
}
/* cinematic captions — what the corpse says, shown as subtitles */
const VOICE_LINES = {
  "audio/awakening.mp3": "Who creeps among my roots? I smell living thought... Come closer, little clay creature. The tree has waited a thousand years to taste you.",
  "audio/riddle-intro.mp3": "Answer me this, little mind. Speak your answer clearly into the abyss... and the abyss shall judge you.",
  "audio/laugh.mp3": "Heh heh heh... the little light is gone, and I am still here. Hehehe!",
  "audio/timeout.mp3": "Silence! The candle dies... and the tree leans closer to collect.",
  "audio/whisper1.mp3": "Come closer...",
  "audio/whisper2.mp3": "I can smell your thoughts.",
  "audio/finale-win.mp3": "Five truths in the dark. You slip the noose, little clay... Return when the moon is black.",
  "audio/finale-loss.mp3": "Five fractures. Five sweet bites of soul. Your memory belongs to the tree now.",
  "audio/taunt1.mp3": "Conceited dust! Do not think a single spark of logic can pierce my shadow!",
  "audio/taunt2.mp3": "It is the smell of your petty mortal satisfaction that I find... disappointing.",
  "audio/taunt3.mp3": "Do you fear the void, flesh-bag? The tree always collects its debt!",
  "audio/taunt4.mp3": "There is no right or wrong in this chamber — there is only my hunger!",
  "audio/taunt5.mp3": "You choose your words with tiny, pathetic precision. Reality is often disappointing!",
  "audio/taunt6.mp3": "Your fragile mind has merely scratched the surface of my design.",
  "audio/taunt7.mp3": "A remarkably sharp answer... but I can smell the mounting panic beneath your tongue!",
  "audio/taunt8.mp3": "You have broken the loop once — but a thousand years of dark realities await!",
  "audio/taunt9.mp3": "Your insolence irritates me to the bone! You will bleed for my amusement!",
  "audio/taunt10.mp3": "My vault! My riddles! My hunger! Savor your breath, little one... for it belongs to me!",
};

/* ---------------- DOM refs ---------------- */
const gate = $("#gate"), enterBtn = $("#enterBtn");
const headCanvas = $("#headCanvas"), hctx = headCanvas.getContext("2d");
const faceOpen = new Image(); faceOpen.src = "assets/corpse-face.png";
const faceClosed = new Image(); faceClosed.src = "assets/corpse-face-closed.png";
const approachHint = $("#approachHint");
const panel = $("#panel"), riddleText = $("#riddleText"), chipsEl = $("#chips");
const wax = $("#wax"), timeNum = $("#timeNum");
const answerInput = $("#answerInput"), micBtn = $("#micBtn"), submitBtn = $("#submitBtn");
const transcript = $("#transcript"), verdict = $("#verdict"), nextBtn = $("#nextBtn");
const compartment = $("#compartment");
const heartEl = $("#heart"), sanityFill = $("#sanityFill");
const descentNum = $("#descentNum"), lifelinesEl = $("#lifelines");
const finale = $("#finale");
const legendImg = document.querySelector(".legend-img img");

/* ---------------- game state ---------------- */
const G = {
  entered: false, awoken: false, phase: "idle", // idle|waking|riddle|result|dark|done
  right: 0, wrong: 0, lives: MAX_LIVES,
  deadline: 0, lastSec: -1, bpm: 64, nextBeat: 0,
  prox: 0, proxHold: 0, sanity: 100, t0: 0, current: null,
};

/* ============================================================
   AUDIO ENGINE — the tomb's soundtrack is synthesized live
   ============================================================ */
let ctx = null, master = null, comp = null, conv = null, voiceTap = null;
let noiseBuf = null; const bufCache = new Map();
let voiceLive = null; // one voice at a time — new lines duck the old
const td = new Uint8Array(512);

function ensureAudio() {
  if (ctx) return;
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  master = ctx.createGain(); master.gain.value = 0.9;
  comp = ctx.createDynamicsCompressor();
  master.connect(comp); comp.connect(ctx.destination);
  conv = ctx.createConvolver(); conv.buffer = impulse(2.6, 3.2);
  const convG = ctx.createGain(); convG.gain.value = 0.55;
  conv.connect(convG); convG.connect(master);
  voiceTap = ctx.createAnalyser(); voiceTap.fftSize = 512;
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = (w * 0.35 + last * 3) * 0.6; }
}
function impulse(sec, decay) {
  const len = ctx.sampleRate * sec, b = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) { const ch = b.getChannelData(c);
    for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay); }
  return b;
}
function distCurve(k) {
  const n = 1024, c = new Float32Array(n);
  for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 2 - 1; c[i] = Math.tanh(k * x) / Math.tanh(k); }
  return c;
}
async function loadBuf(url) {
  if (bufCache.has(url)) return bufCache.get(url);
  const r = await fetch(url);
  if (!r.ok) throw new Error("missing clip " + url);
  const b = await ctx.decodeAudioData(await r.arrayBuffer());
  bufCache.set(url, b); return b;
}
/* The Vedhal's voice — Gollum-cracked: pitched up, gurgling tremolo,
   raspy distortion, sibilant hiss bed, drowned in tomb reverb.
   Fails silently if a clip is missing. */
async function playClip(url, { rate = 1.08, gain = 1, wet = 0.7, tremor = 26, hiss = 0.035 } = {}) {
  if (!ctx) return;
  try {
    const buf = await loadBuf(url);
    showCaption(url);
    const src = ctx.createBufferSource(); src.buffer = buf; src.playbackRate.value = rate;
    const sh = ctx.createWaveShaper(); sh.curve = distCurve(4);
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2400; lp.Q.value = 1.2;
    const trem = ctx.createGain(); trem.gain.value = 0.8;           // gurgly AM tremolo
    const tOsc = ctx.createOscillator(); tOsc.frequency.value = tremor;
    const tDep = ctx.createGain(); tDep.gain.value = 0.22;
    tOsc.connect(tDep); tDep.connect(trem.gain);
    const g = ctx.createGain(); g.gain.value = gain;
    src.connect(sh); sh.connect(lp); lp.connect(trem); trem.connect(g);
    let h = null;
    if (hiss) {                                                      // sibilant breath hiss
      h = ctx.createBufferSource(); h.buffer = noiseBuf; h.loop = true;
      const hf = ctx.createBiquadFilter(); hf.type = "highpass"; hf.frequency.value = 3200;
      const hg = ctx.createGain(); hg.gain.value = hiss * gain;
      h.connect(hf); hf.connect(hg); hg.connect(g);
    }
    g.connect(master); g.connect(voiceTap);
    const w = ctx.createGain(); w.gain.value = wet; g.connect(w); w.connect(conv);
    const dur = buf.duration / rate + 0.4;
    // voice bus: duck whatever the corpse was saying before
    if (voiceLive) {
      const old = voiceLive; voiceLive = null;
      try { old.g.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.06); } catch (e) {}
      setTimeout(() => { try { old.src.stop(); old.tOsc.stop(); if (old.h) old.h.stop(); } catch (e) {} }, 260);
    }
    const live = { src, tOsc, h, g };
    voiceLive = live;
    return new Promise((res) => {
      src.onended = () => {
        if (voiceLive === live) voiceLive = null;
        try { if (h) h.stop(); } catch (e) {} try { tOsc.stop(); } catch (e) {} res();
      };
      src.start(); tOsc.start(); if (h) { h.start(); h.stop(ctx.currentTime + dur); }
      src.stop(ctx.currentTime + dur + 0.1);
    });
  } catch (e) { /* the tomb stays silent */ }
}
/* cinematic captions */
const captionsEl = $("#captions");
let capT = 0;
function showCaption(url) {
  const t = VOICE_LINES[url];
  if (!t || !captionsEl) return;
  captionsEl.textContent = "“" + t + "”";
  captionsEl.classList.add("on");
  clearTimeout(capT);
  capT = setTimeout(() => captionsEl.classList.remove("on"), 1400 + t.length * 60);
}
function env(g, t, a, peak, dec) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec);
}
function sfxThunder() {
  if (!ctx) return; const t = ctx.currentTime;
  const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
  const f = ctx.createBiquadFilter(); f.type = "lowpass";
  f.frequency.setValueAtTime(160, t); f.frequency.exponentialRampToValueAtTime(45, t + 2.4);
  const g = ctx.createGain(); env(g, t, 0.04, 0.9, 2.6);
  s.connect(f); f.connect(g); g.connect(master); g.connect(conv);
  s.start(t); s.stop(t + 3);
}
function sfxCreak() {
  if (!ctx) return; const t = ctx.currentTime;
  const o = ctx.createOscillator(); o.type = "sawtooth";
  o.frequency.setValueAtTime(78, t); o.frequency.exponentialRampToValueAtTime(41, t + 1.5);
  const lfo = ctx.createOscillator(); lfo.frequency.value = 6.3;
  const lg = ctx.createGain(); lg.gain.value = 7; lfo.connect(lg); lg.connect(o.frequency);
  const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 320; f.Q.value = 4;
  const g = ctx.createGain(); env(g, t, 0.25, 0.32, 1.5);
  o.connect(f); f.connect(g); g.connect(master); g.connect(conv);
  o.start(t); lfo.start(t); o.stop(t + 1.8); lfo.stop(t + 1.8);
}
function thump(when, vol) {
  const o = ctx.createOscillator(); o.type = "sine";
  o.frequency.setValueAtTime(62, when); o.frequency.exponentialRampToValueAtTime(38, when + 0.22);
  const g = ctx.createGain(); env(g, when, 0.008, vol, 0.24);
  o.connect(g); g.connect(master); o.start(when); o.stop(when + 0.35);
}
function sfxTick() {
  if (!ctx) return; const t = ctx.currentTime;
  const o = ctx.createOscillator(); o.type = "square"; o.frequency.value = 1900;
  const g = ctx.createGain(); env(g, t, 0.002, 0.12, 0.05);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.08);
}
function sfxSnuff() { // a candle flame dying
  if (!ctx) return; const t = ctx.currentTime;
  const n = ctx.createBufferSource(); n.buffer = noiseBuf;
  const f = ctx.createBiquadFilter(); f.type = "lowpass";
  f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(110, t + 0.5);
  const g = ctx.createGain(); env(g, t, 0.01, 0.5, 0.55);
  n.connect(f); f.connect(g); g.connect(master); g.connect(conv);
  n.start(t); n.stop(t + 0.7);
}
function sfxChime() {
  if (!ctx) return; const t = ctx.currentTime;
  [523, 659, 784, 1046, 1318].forEach((fr, i) => {
    const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = fr;
    const g = ctx.createGain(); env(g, t + i * 0.09, 0.01, 0.22, 1.4);
    o.connect(g); g.connect(master); g.connect(conv); o.start(t + i * 0.09); o.stop(t + i * 0.09 + 1.6);
  });
}
function sfxCrack() { // a link to mortality snapping
  if (!ctx) return; const t = ctx.currentTime;
  const n = ctx.createBufferSource(); n.buffer = noiseBuf;
  const f = ctx.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 1400;
  const g = ctx.createGain(); env(g, t, 0.004, 0.6, 0.22);
  n.connect(f); f.connect(g); g.connect(master); g.connect(conv);
  n.start(t); n.stop(t + 0.3);
  const o = ctx.createOscillator(); o.type = "triangle";
  o.frequency.setValueAtTime(900, t); o.frequency.exponentialRampToValueAtTime(180, t + 0.3);
  const og = ctx.createGain(); env(og, t, 0.004, 0.4, 0.35);
  o.connect(og); og.connect(master); o.start(t); o.stop(t + 0.4);
}
function sfxWhoosh() {
  if (!ctx) return; const t = ctx.currentTime;
  const n = ctx.createBufferSource(); n.buffer = noiseBuf;
  const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.Q.value = 1.2;
  f.frequency.setValueAtTime(220, t); f.frequency.exponentialRampToValueAtTime(3200, t + 0.55);
  const g = ctx.createGain(); env(g, t, 0.05, 0.4, 0.6);
  n.connect(f); f.connect(g); g.connect(master); n.start(t); n.stop(t + 0.8);
}
let droneNodes = null;
function startAmbience() {
  if (!ctx || droneNodes) return;
  const g = ctx.createGain(); g.gain.value = 0.0; g.connect(master);
  g.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 4);
  const o1 = ctx.createOscillator(); o1.type = "sine"; o1.frequency.value = 52;
  const o2 = ctx.createOscillator(); o2.type = "sine"; o2.frequency.value = 54.7;
  const o3 = ctx.createOscillator(); o3.type = "sawtooth"; o3.frequency.value = 26;
  const o3f = ctx.createBiquadFilter(); o3f.type = "lowpass"; o3f.frequency.value = 90;
  o1.connect(g); o2.connect(g); o3.connect(o3f); o3f.connect(g);
  const w = ctx.createBufferSource(); w.buffer = noiseBuf; w.loop = true;
  const wf = ctx.createBiquadFilter(); wf.type = "bandpass"; wf.frequency.value = 420; wf.Q.value = 0.6;
  const wg = ctx.createGain(); wg.gain.value = 0.05;
  const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
  const lg = ctx.createGain(); lg.gain.value = 0.035; lfo.connect(lg); lg.connect(wg.gain);
  w.connect(wf); wf.connect(wg); wg.connect(master);
  o1.start(); o2.start(); o3.start(); w.start(); lfo.start();
  droneNodes = { g };
}

/* ============================================================
   THE ANIMATRONIC HEAD
   Two-state photoreal morph: closed ↔ open mouth crossfaded by a
   spring-smoothed voice amplitude — fluid, organic, no seams.
   ============================================================ */
const EYES = [{ x: 258, y: 133, r: 31 }, { x: 381, y: 130, r: 30 }];
let mouth = 0, mouthV = 0;
function getAmp() {
  if (!voiceTap) return 0;
  voiceTap.getByteTimeDomainData(td);
  let s = 0;
  for (let i = 0; i < td.length; i++) { const v = (td[i] - 128) / 128; s += v * v; }
  return clamp(Math.sqrt(s / td.length) * 4.5, 0, 1);
}
function flick(t, speed) { return 0.6 + 0.4 * Math.abs(Math.sin(t / speed) * Math.sin(t / (speed * 0.37) + 1.7)); }
function drawHead(t, dt) {
  const w = 640, h = 360;
  hctx.clearRect(0, 0, w, h);
  if (!faceOpen.complete || !faceOpen.naturalWidth) return;
  const amp = getAmp();
  // critically-damped-ish spring toward the voice amplitude
  const k = clamp((dt || 16) * 0.0016, 0, 1);
  mouthV += (amp - mouth) * k * 26;
  mouthV *= 0.74;
  mouth = clamp(mouth + mouthV * (G.awoken ? 1 : 0.25), 0, 1);

  const hasClosed = faceClosed.complete && faceClosed.naturalWidth;
  const base = hasClosed ? faceClosed : faceOpen;
  hctx.save();
  hctx.translate(0, mouth * 5); // subtle speaking nod
  hctx.drawImage(base, 0, 0, w, h);
  if (hasClosed && mouth > 0.01) {          // open-mouth state fades in with the voice
    hctx.globalAlpha = mouth;
    hctx.drawImage(faceOpen, 0, 0, w, h);
    hctx.globalAlpha = 1;
  }
  if (!G.awoken) { // dead-state dimming via source-atop (works where ctx.filter doesn't)
    hctx.globalCompositeOperation = "source-atop";
    hctx.fillStyle = "rgba(2,3,2,.62)";
    hctx.fillRect(0, 0, w, h);
    hctx.globalCompositeOperation = "source-over";
  }
  // eyes ignite
  const glow = G.awoken ? (0.5 + 0.5 * flick(t, 300)) * (0.55 + 0.45 * Math.max(amp, mouth)) : G.prox * 0.4 * flick(t, 140);
  if (glow > 0.03) {
    hctx.globalCompositeOperation = "lighter";
    for (const e of EYES) {
      const gr = hctx.createRadialGradient(e.x, e.y, 1, e.x, e.y, e.r * (1.4 + amp));
      gr.addColorStop(0, `rgba(255,150,40,${0.9 * glow})`);
      gr.addColorStop(0.4, `rgba(229,56,59,${0.5 * glow})`);
      gr.addColorStop(1, "rgba(164,22,26,0)");
      hctx.fillStyle = gr;
      hctx.beginPath(); hctx.arc(e.x, e.y, e.r * (1.6 + amp), 0, 7); hctx.fill();
    }
    hctx.globalCompositeOperation = "source-over";
  }
  hctx.restore();
}

/* ============================================================
   PROXIMITY SENSOR + CURSOR
   ============================================================ */
const glowc = $("#cursorGlow");
let mx = innerWidth / 2, my = innerHeight / 2, gx = mx, gy = my;
addEventListener("mousemove", (e) => {
  mx = e.clientX; my = e.clientY;
  const r = headCanvas.getBoundingClientRect();
  if (r.height && !G.awoken && G.entered) {
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    G.prox = clamp(1 - Math.hypot(mx - cx, my - cy) / 480, 0, 1);
  } else if (G.awoken) G.prox = 0;
});
headCanvas.addEventListener("click", () => { if (G.entered && !G.awoken) awaken(); });

/* ============================================================
   GAME FLOW
   ============================================================ */
enterBtn.addEventListener("click", () => {
  ensureAudio(); ctx.resume();
  G.entered = true; G.t0 = performance.now();
  gate.classList.add("open");
  startAmbience(); sfxThunder();
  setTimeout(() => sfxCreak(), 900);
});
/* accessibility: enter without sound */
$("#silentBtn").addEventListener("click", () => {
  ensureAudio(); ctx.resume();
  master.gain.value = 0;
  G.entered = true; G.t0 = performance.now();
  gate.classList.add("open");
});

function awaken() {
  if (G.awoken) return;
  G.awoken = true; G.phase = "waking";
  approachHint.style.display = "none";
  sfxCreak();
  playClip("audio/awakening.mp3", { rate: 1.0 }).then(() => startRound());
}

function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function startRound() {
  const r = pickRiddle(tierFor(G.right + 1)); // difficulty climbs as you descend; never repeats
  G.current = r; G.phase = "riddle";
  document.body.classList.add("descend");
  setTimeout(() => document.body.classList.remove("descend"), 450);
  panel.classList.remove("hidden");
  verdict.textContent = ""; verdict.className = "";
  transcript.textContent = "";
  nextBtn.classList.add("hidden");
  compartment.classList.remove("open");
  answerInput.value = "";
  descentNum.textContent = `DESCENT ${["I", "II", "III", "IV", "V"][Math.min(G.right, 4)]} / V`;
  typewrite(r.q);
  chipsEl.innerHTML = "";
  shuffle([...r.chips]).forEach((c) => {
    const b = document.createElement("button");
    b.className = "chip"; b.textContent = c;
    b.addEventListener("click", () => submit(c));
    chipsEl.appendChild(b);
  });
  playClip("audio/riddle-intro.mp3", { rate: 1.05, gain: 0.9 });
  G.deadline = performance.now() + TOTAL_TIME + 2500;
  G.lastSec = -1; G.sanity = 100;
  document.body.classList.remove("danger");
}

function typewrite(text) {
  riddleText.innerHTML = "";
  let i = 0;
  const span = document.createElement("span");
  const caret = document.createElement("span"); caret.className = "caret";
  riddleText.append(span, caret);
  const iv = setInterval(() => {
    span.textContent = text.slice(0, ++i);
    if (i >= text.length) { clearInterval(iv); caret.remove(); }
  }, 26);
}

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\b(a|an|the)\b/g, "").replace(/\s+/g, " ").trim();
function lev(a, b) {
  const m = a.length, n = b.length;
  if (!m || !n) return m || n;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++)
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] !== b[j - 1]));
    prev = cur;
  }
  return prev[n];
}
function isCorrect(ans) {
  const n = norm(ans);
  if (!n) return false;
  return G.current.a.some((a) => {
    const na = norm(a);
    return n === na || n.includes(na) || (n.length > 3 && na.includes(n)) || lev(n, na) <= 2;
  });
}

function submit(ans) {
  if (G.phase !== "riddle") return;
  if (isCorrect(ans)) correct(); else fail("wrong");
}
submitBtn.addEventListener("click", () => submit(answerInput.value));
answerInput.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(answerInput.value); });

/* Correct → the entity is IRRITATED to its core; it spits venom, the vault opens */
function correct() {
  G.phase = "result"; G.right++;
  document.body.classList.remove("danger");
  sfxWhoosh(); sfxChime();
  playClip(`audio/${drawFrom(() => bagCorrect, (b) => (bagCorrect = b), TAUNTS_CORRECT)}.mp3`, { rate: 1.08 });
  setTimeout(() => sfxCreak(), 500);
  const rw = pick(REWARDS);
  $("#rewardIcon").textContent = rw.i;
  $("#rewardName").textContent = rw.n;
  $("#rewardDesc").textContent = rw.d;
  compartment.classList.add("open");
  verdict.textContent = "THE TRUTH IS ACCEPTED — AND RESENTED.";
  verdict.className = "good";
  nextBtn.textContent = G.right >= WIN_TRUTHS ? "Claim Your Freedom" : "Descend Again";
  nextBtn.classList.remove("hidden");
}

/* Wrong / silent → the candles go out, and the Vedhal laughs in the dark */
function fail(reason) {
  if (G.phase !== "riddle") return;
  G.phase = "dark"; G.wrong++; G.lives--;
  document.body.classList.remove("danger");
  const icons = lifelinesEl.children;
  if (icons[G.lives]) icons[G.lives].classList.add("lost");
  sfxCrack();   // the link snaps
  sfxSnuff();   // the flame dies
  document.body.classList.add("lights-out");
  // the sneaky laugh first; the sarcasm follows once the laugh is done — never overlapping
  playClip("audio/laugh.mp3", { rate: 1.12, wet: 0.95 })
    .then(() => playClip(`audio/${drawFrom(() => bagWrong, (b) => (bagWrong = b), TAUNTS_WRONG)}.mp3`, { rate: 1.08, gain: 0.95 }));
  setTimeout(() => {
    document.body.classList.remove("lights-out");
    verdict.textContent = G.lives <= 0
      ? "THE LAST LINK SNAPS. YOUR MEMORY BELONGS TO THE TREE."
      : (reason === "timeout" ? "SILENCE. " + pick(SARCASMS) : "WRONG. " + pick(SARCASMS));
    verdict.className = "bad";
    G.phase = "result";
    nextBtn.textContent = G.lives <= 0 ? "Face the Tree" : "Descend Again";
    nextBtn.classList.remove("hidden");
  }, 3000);
}

nextBtn.addEventListener("click", () => {
  if (G.lives <= 0) { doFinale(false); return; }
  if (G.right >= WIN_TRUTHS) { doFinale(true); return; }
  startRound();
});

function doFinale(win) {
  G.phase = "done";
  $("#finaleTitle").textContent = win ? "YOU SLIP THE NOOSE" : "YOUR MEMORY BELONGS TO THE TREE";
  $("#finaleSub").textContent = win
    ? "The Vedhal hisses your name into the dark — and the tree, for once, goes hungry."
    : "Five fractures. Five bites of soul. The Vedhal will wear your thoughts like a crown of flies.";
  $("#statRight").textContent = G.right;
  $("#statWrong").textContent = G.wrong;
  $("#statTime").textContent = Math.round((performance.now() - G.t0) / 1000) + "s";
  finale.classList.add("show");
  playClip(win ? "audio/finale-win.mp3" : "audio/finale-loss.mp3", { rate: 1.0 });
  if (win) sfxChime(); else sfxThunder();
}
$("#againBtn").addEventListener("click", () => {
  finale.classList.remove("show");
  Object.assign(G, { awoken: false, phase: "idle", right: 0, wrong: 0, lives: MAX_LIVES, sanity: 100, t0: performance.now() });
  usedRiddles.clear(); bagCorrect = null; bagWrong = null;
  [...lifelinesEl.children].forEach((i) => i.classList.remove("lost"));
  descentNum.textContent = "DESCENT I / V";
  compartment.classList.remove("open");
  panel.classList.add("hidden");
  approachHint.style.display = "";
});

/* ---------------- speech recognition ---------------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null, micOn = false;
if (SR) {
  rec = new SR();
  rec.lang = "en-IN"; rec.interimResults = true; rec.maxAlternatives = 1;
  rec.onresult = (e) => {
    let fin = "", interim = "";
    for (const r of e.results) (r.isFinal ? (fin += r[0].transcript) : (interim += r[0].transcript));
    transcript.textContent = "the abyss hears: “" + (fin || interim).trim() + "…”";
    if (fin.trim()) { answerInput.value = fin.trim(); submit(fin.trim()); }
  };
  rec.onend = () => { micOn = false; micBtn.classList.remove("live"); micBtn.textContent = "🎙 Speak"; };
  rec.onerror = () => { micOn = false; micBtn.classList.remove("live"); };
} else micBtn.style.display = "none";
micBtn.addEventListener("click", () => {
  if (!rec) return;
  if (micOn) { rec.stop(); return; }
  try { rec.start(); micOn = true; micBtn.classList.add("live"); micBtn.textContent = " Listening…"; } catch (e) {}
});

/* ---------------- ambient whispers on the hero (never over dialogue) ---------------- */
let lastWhisper = 0;
setInterval(() => {
  if (!G.entered || !ctx || voiceLive) return;
  if (G.phase === "riddle" || G.phase === "dark" || G.phase === "waking" || G.phase === "done") return;
  if (Math.random() < 0.3 && scrollY < innerHeight * 0.8) {
    lastWhisper = 1 - lastWhisper; // alternate, never the same twice running
    playClip(lastWhisper ? "audio/whisper2.mp3" : "audio/whisper1.mp3", { rate: 1.25, gain: 0.35, wet: 1, hiss: 0.02 });
  }
}, 14000);

/* ============================================================
   MAIN LOOP
   ============================================================ */
let lastT = 0;
function loop(t) {
  requestAnimationFrame(loop);
  const dt = Math.min(64, t - lastT); lastT = t;

  drawHead(t, dt);

  gx += (mx - gx) * 0.16; gy += (my - gy) * 0.16;
  glowc.style.left = gx + "px"; glowc.style.top = gy + "px";

  // parallax on the exhumed relic
  if (legendImg) {
    const r = legendImg.getBoundingClientRect();
    if (r.bottom > 0 && r.top < innerHeight)
      legendImg.style.transform = `translateY(${(r.top + r.height / 2 - innerHeight / 2) * -0.07}px)`;
  }

  if (G.entered && !G.awoken) {
    if (G.prox > 0.72) {
      G.proxHold += dt;
      if (G.proxHold > 800) awaken();
    } else G.proxHold = Math.max(0, G.proxHold - dt);
  }

  if (G.phase === "riddle" && ctx) {
    const rem = Math.max(0, G.deadline - performance.now());
    const frac = rem / TOTAL_TIME;
    wax.style.transform = `scaleX(${clamp(frac, 0, 1)})`;
    const sec = Math.ceil(rem / 1000);
    if (sec !== G.lastSec) {
      G.lastSec = sec; timeNum.textContent = sec;
      if (sec <= 5 && sec > 0) sfxTick();
    }
    if (rem <= 8000) document.body.classList.add("danger");
    G.bpm = 64 + (1 - frac) * 84;
    G.sanity = frac * 100;
    sanityFill.style.width = G.sanity + "%";
    if (t >= G.nextBeat) {
      const w = ctx.currentTime;
      thump(w, 0.5); thump(w + 0.26, 0.32);
      heartEl.classList.remove("beat"); void heartEl.offsetWidth; heartEl.classList.add("beat");
      G.nextBeat = t + 60000 / G.bpm;
    }
    if (rem <= 0) fail("timeout");
  }
}
requestAnimationFrame(loop);

/* ============================================================
   PAGE DRESSING
   ============================================================ */
(function dust() {
  const c = $("#dust");
  for (let i = 0; i < 26; i++) {
    const s = document.createElement("span");
    s.style.left = rand(0, 100) + "%";
    s.style.animationDuration = rand(9, 22) + "s";
    s.style.animationDelay = -rand(0, 22) + "s";
    s.style.opacity = rand(0.2, 0.7);
    const sz = rand(2, 4) + "px"; s.style.width = sz; s.style.height = sz;
    c.appendChild(s);
  }
})();
(function marquee() {
  const tr = $("#marqueeTrack");
  tr.innerHTML = tr.innerHTML.repeat(6);
})();
(function reveals() {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.18 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  const ch = new IntersectionObserver((es) => es.forEach((e) => {
    document.body.classList.toggle("in-chamber", e.isIntersecting);
    if (e.isIntersecting) sfxThunder();
  }), { threshold: 0.35 });
  ch.observe($("#chamber"));
})();
(function magnets() {
  document.querySelectorAll(".magnetic").forEach((b) => {
    b.addEventListener("mousemove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.12}px,${(e.clientY - r.top - r.height / 2) * 0.2}px)`;
    });
    b.addEventListener("mouseleave", () => (b.style.transform = ""));
  });
})();

/* debug / test hook */
window.__BETAAL = { get state() { return G; }, submit, startRound, awaken };
