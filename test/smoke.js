/* Headless smoke test — executes the real app.js code paths in jsdom */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const appJs = fs.readFileSync(path.join(root, "app.js"), "utf8");

const dom = new JSDOM(html, { runScripts: "outside-only", pretendToBeVisual: true, url: "http://localhost:8000/" });
const w = dom.window, d = w.document;

/* ---- stubs: canvas 2d ---- */
function fake2d() {
  const grad = { addColorStop() {} };
  const t = {};
  return new Proxy(t, {
    get(o, p) {
      if (p === "createRadialGradient") return () => grad;
      if (!(p in o)) o[p] = () => grad;
      return o[p];
    },
    set(o, p, v) { o[p] = v; return true; },
  });
}
w.HTMLCanvasElement.prototype.getContext = function () { return fake2d(); };

/* ---- stub: IntersectionObserver ---- */
w.IntersectionObserver = class { constructor() {} observe() {} unobserve() {} };

/* ---- stub: fetch (voice clips) ---- */
w.fetch = async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(16) });

/* ---- stub: WebAudio graph ---- */
function node(extra = {}) {
  return Object.assign({
    connect(n) { return n; },
    start() { if (this.onended) setTimeout(this.onended, 60); },
    stop() {},
    gain: { value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} },
    frequency: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} },
    Q: { value: 1 },
  }, extra);
}
w.AudioContext = w.webkitAudioContext = class {
  constructor() { this.currentTime = 0; this.sampleRate = 44100; this.destination = {}; }
  resume() { return Promise.resolve(); }
  createGain() { return node(); }
  createDynamicsCompressor() { return node(); }
  createConvolver() { return node({ buffer: null }); }
  createBufferSource() { return node({ buffer: null, loop: false, playbackRate: { value: 1 } }); }
  createOscillator() { return node({ type: "sine" }); }
  createBiquadFilter() { return node({ type: "lowpass" }); }
  createWaveShaper() { return node({ curve: null }); }
  createAnalyser() { return { fftSize: 512, getByteTimeDomainData(a) { a.fill(128); } }; }
  createBuffer(ch, len) { return { getChannelData: () => new Float32Array(len) }; }
  async decodeAudioData() { return { duration: 1 }; }
};

const normOf = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\b(a|an|the)\b/g, "").replace(/\s+/g, " ").trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failures = 0;
function assert(cond, msg) {
  if (cond) console.log("  ✔ " + msg);
  else { failures++; console.error("  ✘ FAIL: " + msg); }
}
const lostCount = () => d.querySelectorAll("#lifelines i.lost").length;

(async () => {
  w.eval(appJs);
  const B = w.__BETAAL;
  assert(!!B, "app.js evaluated and exposed __BETAAL hook");

  console.log("— gate & entry —");
  d.getElementById("enterBtn").click();
  assert(d.getElementById("gate").classList.contains("open"), "gate opens on ENTER click");
  assert(B.state.entered === true && B.state.lives === 5, "entered with five links to mortality");

  assert(!!d.getElementById("silentBtn"), "silent entry offered at the gate");

  console.log("— proximity awakening —");
  d.getElementById("headCanvas").click();
  assert(B.state.awoken === true, "Vedhal awakens on approach");
  await sleep(120); // caption appears once the clip decodes
  assert(d.getElementById("captions").classList.contains("on"), "cinematic caption shows the awakening line");
  await sleep(250);
  assert(B.state.phase === "riddle", "riddle presented after awakening line");
  assert(d.getElementById("chips").children.length === 4, "four whispered answer options rendered");
  assert(d.getElementById("descentNum").textContent === "DESCENT I / V", "descent counter shows I / V");

  console.log("— correct answer: irritated entity + open vault —");
  B.submit(B.state.current.a[0]);
  assert(B.state.phase === "result" && B.state.right === 1, "truth accepted (1/5)");
  assert(d.getElementById("compartment").classList.contains("open"), "secret compartment opened");
  assert(d.getElementById("verdict").className === "good", "venomous-but-accepted verdict");
  assert(d.getElementById("nextBtn").textContent === "Descend Again", "next descent offered");

  d.getElementById("nextBtn").click();
  assert(B.state.phase === "riddle", "descent II begins");

  console.log("— wrong answer: candles out + the sneaky laugh —");
  B.submit("banana");
  assert(B.state.phase === "dark", "wrong answer kills the light (dark phase)");
  assert(d.body.classList.contains("lights-out"), "blackout falls over the tomb");
  await sleep(3200);
  assert(!d.body.classList.contains("lights-out"), "candles return once the laugh has circled");
  assert(lostCount() === 1 && B.state.lives === 4, "one link to mortality ripped away (4 remain)");
  assert(d.getElementById("verdict").className === "bad", "bad verdict shown");

  console.log("— five truths → victory finale —");
  d.getElementById("nextBtn").click(); // descend after the fracture
  for (let i = 2; i <= 5; i++) {
    B.submit(B.state.current.a[0]);
    assert(B.state.right === i, `truth ${i}/5 accepted`);
    if (i < 5) d.getElementById("nextBtn").click();
  }
  assert(d.getElementById("nextBtn").textContent === "Claim Your Freedom", "freedom offered at 5/5");
  d.getElementById("nextBtn").click();
  assert(d.getElementById("finale").classList.contains("show"), "victory finale shown");
  assert(d.getElementById("finaleTitle").textContent === "YOU SLIP THE NOOSE", "victory title correct");
  assert(d.getElementById("statRight").textContent === "5", "stats: truths = 5");
  assert(d.getElementById("statWrong").textContent === "1", "stats: fractures = 1");

  console.log("— five fractures → loss finale —");
  d.getElementById("againBtn").click();
  assert(B.state.lives === 5 && lostCount() === 0 && B.state.awoken === false, "restart restores all five links");
  B.awaken();
  await sleep(250);
  for (let i = 1; i <= 5; i++) {
    B.submit("banana");
    await sleep(3200);
    assert(lostCount() === i, `fracture ${i} marked in the lifeline HUD`);
    if (i < 5) d.getElementById("nextBtn").click();
  }
  assert(d.getElementById("nextBtn").textContent === "Face the Tree", "the tree demands you at 0 links");
  d.getElementById("nextBtn").click();
  assert(d.getElementById("finaleTitle").textContent === "YOUR MEMORY BELONGS TO THE TREE", "loss title correct");

  console.log("— commune chatbox —");
  B.sendChat("Who are you?");
  assert(d.querySelectorAll("#chatLog .msg.user").length === 1, "user bubble posted");
  await sleep(2100);
  const vm = d.querySelectorAll("#chatLog .msg.vedhal");
  assert(vm.length === 1 && /Vedhal/.test(vm[0].textContent), "Vedhal answers in character (voiced)");

  console.log("— fuzzy voice matching —");
  d.getElementById("againBtn").click();
  B.startRound();
  const acc = B.state.current.a[0];
  B.submit("the " + acc + "!");
  assert(B.state.phase === "result", `articles/punctuation stripped: "the ${acc}!" accepted`);
  B.startRound();
  const na = normOf(B.state.current.a[0]);
  const typo = na.slice(0, -2) + na.slice(-1) + na.slice(-2, -1);
  B.submit(typo);
  assert(B.state.phase === "result", `speech-style typo "${typo}" (for "${na}") accepted via levenshtein`);

  if (failures) { console.error(`SMOKE FAIL — ${failures} assertion(s) failed`); process.exit(1); }
  console.log("SMOKE OK — all code paths executed cleanly");
  process.exit(0);
})().catch((e) => { console.error("SMOKE FAIL — uncaught:", e); process.exit(1); });
