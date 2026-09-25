// scene.js: part 1 paints the world one time (p5.brush); part 2 composes each frame on the 2D stage.

// ---------- palette ----------
const COL = {
  paper: '#f3e6cf', ink: '#3a2a24', wall: '#e8c496', wallLow: '#d49a6a', deskTop: '#c4834f', deskFront: '#9c5f37',
  lidDark: '#4b4f5c', screen: '#252a36', metal: '#b9bdc8', brass: '#cfa24a', brassDark: '#8c6a2c', iron: '#4a4648',
  red: '#d6453a', green: '#4fa259', blue: '#9cc6e4', steel: '#8193a6', wood: '#c98f55', clawd: '#D77757',
};

// ---------- part 1: sprites, painted one time ----------
const rr = (g, x, y, w, h, r) => { g.roundRect(x, y, w, h, r); };
const pts = (g, a) => { g.moveTo(a[0][0], a[0][1]); for (const p of a.slice(1)) g.lineTo(p[0], p[1]); g.closePath(); };

addSprite('room', 1920, 1080, () => {
  wc(COL.wall, 190, 0.08, 0.55, 0.25); brush.rect(-40, -40, 2000, 700);
  tex('#f8e2b0', 160, 0.15, 0.4, 0.2); brush.rect(1260, 70, 520, 420);          // window light
  ink('#8a6446', 1.2); brush.rect(1290, 100, 460, 360); brush.line(1520, 100, 1520, 460); brush.line(1290, 280, 1750, 280);
  wc(COL.wallLow, 170, 0.06, 0.5, 0.3); brush.rect(-40, 560, 2000, 170);        // wainscot
  ink('#7a5236', 1.4); brush.line(0, 560, 1920, 562);
  wc(COL.deskTop, 220, 0.05, 0.5, 0.35); poly([[-40, 712], [1960, 712], [1960, 812], [-40, 812]]);
  wc(COL.deskFront, 230, 0.05, 0.55, 0.4); brush.rect(-40, 806, 2000, 320);
  brush.set('2B', '#6b3e22', 1.2);
  for (let k = 0; k < 7; k++) brush.line(-10, 850 + k * 34 + (k % 3) * 6, 1930, 846 + k * 34 + (k % 2) * 9);
  ink('#4e2e1a', 1.6); brush.line(0, 712, 1920, 712); brush.line(0, 808, 1920, 808);
});

addSprite('grain', 1920, 1080, () => {
  for (let k = 0; k < 9; k++) {
    tex(k % 2 ? '#c9b9a0' : '#d8c8ae', 55);
    brush.circle(random(0, 1920), random(0, 1080), random(260, 520), true);
  }
}, null, '#ffffff');

addSprite('clawdtex', 300, 240, () => {
  for (let k = 0; k < 6; k++) { tex(k % 2 ? '#9a9a9a' : '#6a6a6a', 90); brush.circle(random(0, 300), random(0, 240), random(60, 120), true); }
}, null, '#808080');

addSprite('laptop', 800, 540, () => {
  wc(COL.lidDark, 235, 0.03, 0.35, 0.3); brush.rect(70, 0, 660, 445);
  wc(COL.screen, 250, 0.02, 0.25, 0.2); brush.rect(100, 30, 600, 385);
  wc(COL.metal, 225, 0.04, 0.4, 0.35); poly([[40, 440], [760, 440], [800, 522], [0, 522]]);
  brush.set('pen', '#6d717c', 1);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 14; c++) {
    const y = 452 + r * 21, sh = r * 7;
    brush.rect(80 - sh + c * 46, y, 36, 14);
  }
  ink(COL.ink, 1.3); brush.rect(70, 0, 660, 445); brush.polygon([[40, 440], [760, 440], [800, 522], [0, 522]]);
}, (g) => { rr(g, 70, 0, 660, 446, 10); pts(g, [[40, 440], [760, 440], [800, 522], [0, 522]]); });

addSprite('machine', 900, 640, () => {
  wc(COL.brass, 235, 0.05, 0.55, 0.45); brush.rect(80, 220, 740, 400);
  wc(COL.brassDark, 200, 0.05, 0.5, 0.4); brush.rect(80, 580, 740, 40);
  wc(COL.iron, 240, 0.04, 0.4, 0.3); brush.rect(150, 20, 90, 205); brush.rect(130, 0, 130, 34);
  wc('#a8743a', 220, 0.05, 0.5, 0.35); poly([[640, 110], [830, 110], [770, 225], [700, 225]]);        // hopper
  wc(COL.iron, 230, 0.04, 0.4, 0.3); poly([[0, 300], [85, 280], [85, 420], [0, 400]]);               // chute
  wc('#6c5a44', 230, 0.04, 0.4, 0.3); brush.rect(740, 520, 160, 90);                                 // typewriter block
  wc('#b07a3c', 210, 0.05, 0.5, 0.35); brush.rect(300, 150, 36, 75); brush.rect(300, 150, 260, 30);  // pipe
  ink(COL.ink, 1.3);
  brush.rect(80, 220, 740, 400); brush.rect(150, 20, 90, 205); brush.rect(130, 0, 130, 34);
  brush.polygon([[640, 110], [830, 110], [770, 225], [700, 225]]); brush.polygon([[0, 300], [85, 280], [85, 420], [0, 400]]);
  brush.rect(740, 520, 160, 90);
  for (let k = 0; k < 8; k++) { brush.circle(110 + k * 100, 245, 5); brush.circle(110 + k * 100, 595, 5); }
  wc('#2e2a28', 220, 0.02, 0.3, 0.2);
  for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) brush.circle(762 + c * 29, 545 + r * 35, 11);
}, (g) => {
  g.rect(80, 220, 740, 400); g.rect(150, 20, 90, 205); g.rect(130, 0, 130, 34);
  pts(g, [[640, 110], [830, 110], [770, 225], [700, 225]]); pts(g, [[0, 300], [85, 280], [85, 420], [0, 400]]);
  g.rect(740, 520, 160, 90); g.rect(300, 150, 36, 75); g.rect(300, 150, 260, 30);
});

function gearPts(cx, cy, r1, r2, n) {
  const a = [];
  for (let k = 0; k < n * 2; k++) { const ang = (k / (n * 2)) * Math.PI * 2, r = k % 2 ? r2 : r1; a.push([cx + r * Math.cos(ang), cy + r * Math.sin(ang)]); }
  return a;
}
addSprite('gear', 180, 180, () => {
  wc('#b8862f', 240, 0.03, 0.5, 0.45); poly(gearPts(90, 90, 84, 66, 12));
  wc('#7a5a22', 220, 0.02, 0.4, 0.3); brush.circle(90, 90, 20);
  ink(COL.ink, 1.1); brush.polygon(gearPts(90, 90, 84, 66, 12));
}, (g) => pts(g, gearPts(90, 90, 84, 66, 12)));

addSprite('puff', 160, 130, () => {
  tex('#cfc9c0', 230, 0.25, 0.6, 0.4); brush.circle(60, 70, 45, true); brush.circle(100, 60, 42, true); brush.circle(85, 90, 35, true);
}, (g) => { g.ellipse(80, 68, 76, 58, 0, 0, Math.PI * 2); });

addSprite('switch', 180, 300, () => {
  wc(COL.brass, 235, 0.03, 0.5, 0.4); brush.rect(20, 210, 140, 90);
  wc('#7c5b25', 220, 0.02, 0.4, 0.3); brush.rect(70, 190, 40, 25);
  ink(COL.ink, 1.2); brush.rect(20, 210, 140, 90);
}, (g) => { g.rect(20, 210, 140, 90); g.rect(70, 190, 40, 25); });
addSprite('lever', 60, 220, () => {
  wc('#5a5553', 240, 0.02, 0.3, 0.2); brush.rect(22, 40, 16, 180);
  wc(COL.red, 245, 0.04, 0.5, 0.4); brush.circle(30, 30, 26);
  ink(COL.ink, 1); brush.circle(30, 30, 26);
}, (g) => { g.rect(22, 40, 16, 180); g.moveTo(56, 30); g.arc(30, 30, 26, 0, Math.PI * 2); });

addSprite('button', 200, 170, () => {
  wc('#3b3a40', 240, 0.03, 0.35, 0.3); brush.rect(10, 95, 180, 75);
  wc(COL.red, 245, 0.05, 0.55, 0.5); poly([[30, 100], [30, 60], [60, 30], [140, 30], [170, 60], [170, 100]]);
  ink(COL.ink, 1.2); brush.rect(10, 95, 180, 75); brush.polygon([[30, 100], [30, 60], [60, 30], [140, 30], [170, 60], [170, 100]]);
}, (g) => { g.rect(10, 95, 180, 75); pts(g, [[30, 100], [30, 60], [60, 30], [140, 30], [170, 60], [170, 100]]); });

addSprite('stamp', 140, 170, () => {
  wc('#8b5a33', 240, 0.03, 0.5, 0.4); brush.circle(70, 32, 30); brush.rect(58, 55, 24, 60);
  wc('#5b3a22', 240, 0.03, 0.4, 0.3); brush.rect(15, 112, 110, 30);
  wc(COL.red, 240, 0.02, 0.3, 0.2); brush.rect(20, 142, 100, 18);
  ink(COL.ink, 1); brush.rect(15, 112, 110, 30); brush.circle(70, 32, 30);
}, (g) => { g.moveTo(100, 32); g.arc(70, 32, 30, 0, Math.PI * 2); g.rect(58, 55, 24, 60); g.rect(15, 112, 110, 48); });

addSprite('card', 1180, 300, () => {
  wc('#fbf6ea', 250, 0.03, 0.3, 0.3); brush.rect(10, 10, 1160, 280);
  wc('#c7d3e3', 200, 0.03, 0.4, 0.3); brush.rect(10, 10, 1160, 64);
  ink('#2c3e57', 1.8); brush.rect(10, 10, 1160, 280); brush.line(10, 74, 1170, 74);
}, (g) => g.rect(10, 10, 1160, 280));

addSprite('vacuum', 620, 320, () => {
  wc(COL.steel, 240, 0.04, 0.5, 0.45); poly([[40, 20], [330, 110], [620, 110], [620, 210], [330, 210], [40, 300]]);
  wc('#1f1f24', 250, 0.02, 0.3, 0.2); poly([[18, 30], [62, 30], [62, 290], [18, 290]]);
  wc('#e0b43c', 230, 0.03, 0.4, 0.3); brush.rect(400, 110, 26, 100); brush.rect(470, 110, 26, 100);
  ink(COL.ink, 1.5); brush.polygon([[40, 20], [330, 110], [620, 110], [620, 210], [330, 210], [40, 300]]);
}, (g) => { pts(g, [[40, 20], [330, 110], [620, 110], [620, 210], [330, 210], [40, 300]]); g.rect(14, 26, 52, 268); });

addSprite('avatar', 200, 200, () => {
  wc(COL.blue, 235, 0.06, 0.5, 0.45); brush.circle(100, 100, 82);
  ink(COL.ink, 1.3); brush.circle(100, 100, 82);
}, (g) => { g.moveTo(186, 100); g.arc(100, 100, 86, 0, Math.PI * 2); });

addSprite('magnifier', 300, 300, () => {
  wc('#dff0fb', 150, 0.02, 0.3, 0.3); brush.circle(120, 120, 95);
  wc('#6b4527', 240, 0.02, 0.4, 0.3); poly([[180, 200], [200, 180], [290, 270], [270, 290]]);
}, (g) => { g.moveTo(222, 120); g.arc(120, 120, 102, 0, Math.PI * 2); pts(g, [[180, 200], [200, 180], [292, 272], [272, 292]]); });

addSprite('thumb', 170, 170, () => {
  wc(COL.green, 245, 0.05, 0.5, 0.45); brush.circle(85, 85, 78);
  ink('#23512b', 1.3); brush.circle(85, 85, 78);
}, (g) => { g.moveTo(167, 85); g.arc(85, 85, 82, 0, Math.PI * 2); });

addSprite('beam', 960, 110, () => {
  wc(COL.wood, 245, 0.03, 0.55, 0.45); brush.rect(10, 10, 940, 90);
  brush.set('2B', '#7a4a24', 1.2); for (let k = 0; k < 4; k++) brush.line(20, 28 + k * 18, 940, 26 + k * 19);
  wc('#55504c', 240, 0.01, 0.3, 0.2); for (const x of [40, 920]) { brush.circle(x, 32, 8); brush.circle(x, 78, 8); }
  ink(COL.ink, 1.4); brush.rect(10, 10, 940, 90);
}, (g) => g.rect(10, 10, 940, 90));

addSprite('wedge', 230, 120, () => {
  wc('#d9a45f', 245, 0.03, 0.55, 0.45); poly([[10, 10], [220, 60], [10, 110]]);
  ink(COL.ink, 1.3); brush.polygon([[10, 10], [220, 60], [10, 110]]);
}, (g) => pts(g, [[10, 10], [220, 60], [10, 110]]));

addSprite('hammer', 260, 110, () => {
  wc('#a0703f', 240, 0.03, 0.5, 0.4); brush.rect(20, 45, 200, 20);
  wc('#5b5d66', 245, 0.03, 0.4, 0.3); brush.rect(200, 10, 50, 90);
  ink(COL.ink, 1.2); brush.rect(200, 10, 50, 90);
}, (g) => { g.rect(20, 45, 200, 20); g.rect(200, 10, 50, 90); });

addSprite('key', 260, 110, () => {
  wc('#e2b845', 245, 0.04, 0.5, 0.45); brush.circle(50, 55, 40); brush.rect(85, 45, 160, 20); brush.rect(200, 60, 18, 30); brush.rect(228, 60, 14, 22);
  ink(COL.ink, 1.1); brush.circle(50, 55, 40);
}, (g) => { g.moveTo(92, 55); g.arc(50, 55, 42, 0, Math.PI * 2); g.rect(85, 45, 160, 20); g.rect(200, 60, 18, 30); g.rect(228, 60, 14, 22); });

addSprite('pile', 900, 520, () => {
  for (let k = 0; k < 7; k++) {
    const y = 60 + k * 62, dx = (k % 2 ? 18 : -14);
    wc(k % 2 ? '#fbf3e2' : '#f1e6cf', 250, 0.02, 0.35, 0.35);
    poly([[40 + dx, y], [860 + dx, y + 6], [870 + dx, y + 70], [30 + dx, y + 64]]);
    ink('#7c6a55', 0.9); brush.polygon([[40 + dx, y], [860 + dx, y + 6], [870 + dx, y + 70], [30 + dx, y + 64]]);
  }
}, (g) => { for (let k = 0; k < 7; k++) { const y = 60 + k * 62, dx = (k % 2 ? 18 : -14); pts(g, [[40 + dx, y], [860 + dx, y + 6], [870 + dx, y + 70], [30 + dx, y + 64]]); } });

addSprite('sheet', 840, 580, () => {
  wc('#fdf8ec', 250, 0.02, 0.3, 0.3); brush.rect(10, 10, 820, 560);
  ink('#7c6a55', 1); brush.rect(10, 10, 820, 560);
}, (g) => g.rect(10, 10, 820, 560));

addSprite('bubble', 700, 130, () => {
  wc('#fffaf0', 250, 0.02, 0.3, 0.3); brush.rect(40, 10, 650, 110);
  ink(COL.ink, 1.2); brush.rect(40, 10, 650, 110);
}, (g) => { g.rect(40, 10, 650, 110); pts(g, [[40, 70], [0, 100], [44, 96]]); });

// ---------- part 2: the stage ----------
// Every frame is a pure function of t = i / 24. Nothing carries over from the previous frame.
const S = document.getElementById('stage').getContext('2d');
const FPS = 24;
let C = null;                                   // cues.json, loaded by paint.js
window.onAssetsReady = () => { C = CUES; };

// ----- time helpers -----
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const seg = (t, a, b) => clamp01((t - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;
const eOutBack = (k) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (k - 1) ** 3 + c1 * (k - 1) ** 2; };
const eInOut = (k) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);
const eOut = (k) => 1 - (1 - k) ** 3;
const eIn = (k) => k * k * k;
const pop = (t, t0, d = 0.22) => (t < t0 ? 0 : eOutBack(seg(t, t0, t0 + d)));
const within = (t, a, b) => t >= a && t < b;
const TAU = Math.PI * 2;
function shakeAt(t, t0, A) { if (t < t0 || t > t0 + 0.6) return 0; const k = t - t0; return A * Math.exp(-k * 9) * Math.sin(k * TAU * 14); }
function rng(seed) { return () => { seed = (seed + 0x6D2B79F5) | 0; let x = Math.imul(seed ^ (seed >>> 15), 1 | seed); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; }

// ----- drawing helpers -----
function spr(name, x, y, o = {}) {
  const c = SPRITES[name]; if (!c) return;
  const { sx = 1, sy = sx, rot = 0, ax = 0.5, ay = 0.5, alpha = 1, w = c.width, h = c.height } = o;
  if (alpha <= 0 || sx === 0 || sy === 0) return;
  S.save(); S.globalAlpha *= alpha; S.translate(x, y); S.rotate(rot); S.scale(sx, sy);
  S.drawImage(c, -ax * w, -ay * h, w, h); S.restore();
}
function txt(s, x, y, font, color, o = {}) {
  S.save(); S.font = font; S.fillStyle = color; S.textAlign = o.align || 'left'; S.textBaseline = o.base || 'alphabetic';
  if (o.alpha !== undefined) S.globalAlpha *= o.alpha;
  if (o.outline) { S.lineWidth = o.outlineW || 6; S.strokeStyle = o.outline; S.lineJoin = 'round'; S.strokeText(s, x, y); }
  S.fillText(s, x, y); S.restore();
}
function wrap(s, font, maxW) {
  S.save(); S.font = font; const out = []; let line = '';
  for (const w of s.split(' ')) { const tryL = line ? line + ' ' + w : w; if (S.measureText(tryL).width > maxW && line) { out.push(line); line = w; } else line = tryL; }
  if (line) out.push(line); S.restore(); return out;
}
function star(x, y, r, color, rot = 0) {
  S.save(); S.translate(x, y); S.rotate(rot); S.fillStyle = color; S.beginPath();
  for (let k = 0; k < 8; k++) { const rr2 = k % 2 ? r * 0.35 : r; const a = (k / 8) * TAU; S.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); }
  S.closePath(); S.fill(); S.restore();
}
const typed = (s, t, a, b) => s.slice(0, Math.round(s.length * seg(t, a, b)));

// ----- layout -----
const CX = 1530, DESK = 760;                        // Clawd's feet
const LAP = { x: 420, y: 250 };                     // laptop sprite top-left
const SCREEN = { x: 520, y: 280, w: 600, h: 385 };  // inner screen
const MACH = { x: 340, y: 130 };
const HOPPER = [1075, 250], CHUTE = [345, 480], CHIMNEY = [535, 130];
const AV = [190, 170];                              // avatar centre
const SW = [1268, 765];                             // switch / button base centre
const VAC1 = [1700, 330], VAC1A = -0.6;             // vacuum mouth + tilt, beat 4 (points down-left)
const VAC2 = [1790, 520], VAC2A = -0.3;             // beat 5

const LINE1 = 'Change the parameter.';
const LINE3 = "The real lesson isn't brevity. It's—";
const RIBBON = "It's not merely a parameter — it's a LOAD-BEARING dial worth turning...";
const PARA = "It's not merely a parameter — it's a LOAD-BEARING dial worth turning. And that matters. Here's the real unlock: the SEAMS between intent and outcome are where meaning QUIETLY lives. Not a tweak — a WEDGE. Not a value — a vision. Change isn't just change; it's a journey, a posture, a promise. We don't simply adjust — we attune. And that matters. Because in the end, every parameter tells a story — and this one? This one is load-bearing.";

// ----- Clawd's pose over time -----
// Follow-through: the arm nubs trail the body by blending the raw pose of the last 3 frames.
// This stays a pure function of t, because it only re-evaluates rawPose at earlier times.
function clawdPose(t) {
  const w = [0.55, 0.3, 0.15], ps = w.map((_, k) => rawPose(Math.max(0, t - k / FPS))), p = ps[0];
  for (const key of ['armL', 'armR', 'armLenL', 'armLenR']) p[key] = ps.reduce((a, q, k) => a + w[k] * (q[key] || 0), 0);
  return p;
}
function rawPose(t) {
  const p = { x: CX, y: DESK, sx: 1, sy: 1, lean: 0, armL: 0, armR: 0, eye: 'normal', eyeDx: -7, eyeDy: 0, blink: 0, legLift: [0, 0, 0, 0], sweat: 0, bang: 0 };
  const bob = Math.sin(t * TAU * 1.4);
  p.sy = 1 + 0.015 * bob; p.sx = 1 / Math.sqrt(p.sy);
  const tap = (fr) => (Math.floor(t * FPS / fr) % 2);
  const squash = (k) => { p.sy = k; p.sx = 1 / Math.sqrt(k); };
  const blinkAt = (t0, d = 0.12) => { if (within(t, t0, t0 + d)) p.blink = Math.sin(seg(t, t0, t0 + d) * Math.PI); };
  blinkAt(C.blink1);

  // beat 1
  if (within(t, C.bubble1, C.type1[0])) { p.eyeDx = -9; p.eyeDy = -9; }
  if (within(t, C.type1[0], C.freeze)) { p.armL = -25 + tap(2) * 18; p.armR = -25 + (1 - tap(2)) * 18; p.eye = 'normal'; p.y -= tap(2) * 2; }
  if (within(t, C.freeze, C.del1[0])) {
    const k = eOutBack(seg(t, C.freeze, C.freeze + 0.12)); squash(1 + 0.15 * k);
    p.eye = 'wide'; p.eyeDx = -3; p.sweat = k; p.bang = k; p.armL = 35 * k; p.armR = 35 * k;
  }
  if (within(t, C.del1[0], C.bowtie[0])) { p.eye = 'squint'; p.armL = -30 + tap(3) * 15; p.armR = -10; p.sweat = 1; squash(1.05); }
  if (within(t, C.bowtie[0], C.bowtie[1])) {
    p.eye = 'squint'; p.eyeDx = 0; p.eyeDy = 4; const tw = Math.sin(t * TAU * 12) * 6;
    p.armL = -65 + tw; p.armR = -65 - tw; p.armLenL = 14; p.armLenR = 14;
  }
  if (within(t, C.bowtie[1], C.switchRise)) {
    const k = seg(t, C.bowtie[1], C.crack), push = within(t, C.crack, C.crack + 0.06) || within(t, C.crack + 0.09, C.crack + 0.15) ? 18 : 6;
    p.eye = 'squint'; p.eyeDx = -3; p.armL = -5; p.armR = -5; p.armLenL = push * (0.4 + k); p.armLenR = push * (0.4 + k); squash(1 - 0.05 * k);
  }
  if (within(t, C.switchRise, C.transform)) {
    const ant = seg(t, C.switchRise + 0.1, C.switchPull - 0.03), pull = seg(t, C.switchPull, C.switchPull + 0.08);
    p.lean = 9 * eInOut(ant) - 16 * eOut(pull); p.eye = pull > 0 ? 'happy' : 'normal';
    p.armL = 25 + 25 * ant - 40 * pull; p.armLenL = 10;
    if (pull > 0) squash(1 - 0.08 * Math.sin(pull * Math.PI));
  }
  // beat 2
  if (within(t, C.transform, C.feed[0])) {
    const k = seg(t, C.transform, C.transform + 0.35); p.y -= 70 * Math.sin(k * Math.PI); p.x += 30 * eOut(k);
    p.eye = 'happy'; p.armL = 50; p.armR = 50; squash(k < 1 ? 1 + 0.12 * Math.sin(k * Math.PI) : 1);
    if (within(t, C.transform + 0.33, C.transform + 0.45)) squash(0.86);
  }
  if (within(t, C.feed[0], C.feed[1])) {
    const k = seg(t, C.feed[0], C.feed[1]); p.x += 30 * (1 - k); p.y -= 50 * Math.sin(seg(t, C.feed[0], C.feed[0] + 0.25) * Math.PI);
    p.eye = 'happy'; p.eyeDy = -8; p.armL = 75 - 40 * k; p.armR = 75 - 40 * k;
  }
  if (within(t, C.shake, C.ribbon[0])) { p.y -= Math.abs(Math.sin(t * TAU * 4)) * 14; p.eye = 'normal'; p.eyeDy = -10; p.eyeDx = -9; p.armL = 15; p.armR = 15; }
  if (within(t, C.ribbon[0], C.pile - 0.12)) {
    const fr = t < C.typeFast ? 4 : 2;
    p.armL = -28 + tap(fr) * 22; p.armR = -28 + (1 - tap(fr)) * 22; p.y -= tap(fr) * 4;
    p.eye = t < 5.0 ? 'normal' : 'happy'; p.eyeDx = -9; p.lean = -4;
  }
  // beat 3
  if (within(t, C.pile - 0.12, C.bubble2)) { p.eye = 'happy'; squash(1.06); p.lean = -2; p.armL = 20; p.armR = 20; }
  if (within(t, C.bubble2, C.windup)) { p.eye = 'normal'; p.eyeDx = -9; p.eyeDy = -10; p.lean = -3 * Math.sin(seg(t, 7.5, 7.75) * TAU); }
  if (within(t, C.windup, C.slam)) { const k = eInOut(seg(t, C.windup, C.slam - 0.03)); squash(1 - 0.15 * k); p.lean = 10 * k; p.armL = 70 * k; p.eye = 'squint'; }
  if (within(t, C.slam, C.compress[1])) {
    const k = seg(t, C.slam, C.slam + 0.1); p.lean = lerp(-20, -8, k); p.armL = -55; p.armLenL = 20; squash(lerp(0.8, 1, eOutBack(k)));
    p.eye = t < C.compress[0] ? 'squint' : 'happy';
  }
  if (within(t, C.compress[1], C.glasses[0])) {
    const out = seg(t, C.compress[1], C.stamp), back = seg(t, C.stamp + 0.05, C.stamp + 0.25);
    p.lean = -14 * eOut(out) * (1 - back); p.armL = lerp(80, 10, out) * (1 - back) + 10 * back; p.armR = lerp(80, 10, out) * (1 - back) + 10 * back;
    p.armLenL = 20 * out * (1 - back); p.eye = 'happy';
    if (within(t, C.stamp, C.stamp + 0.08)) squash(0.9);
  }
  if (within(t, C.glasses[0], C.card[0])) { p.eye = 'happy'; p.eyeDx = -9; p.eyeDy = -6; p.y -= Math.abs(Math.sin(t * TAU * 1.5)) * 6; blinkAt(9.5); }
  // beat 4
  if (within(t, C.card[0], C.siren[0])) { const k = eOutBack(seg(t, C.card[0], C.card[0] + 0.15)); squash(1 + 0.12 * k); p.eye = 'wide'; p.eyeDx = -4; p.eyeDy = -12; p.armL = 20 * k; p.armR = 20 * k; }
  if (within(t, C.siren[0], C.vacuum[0] + 0.1)) {
    const run = Math.floor(t * 16) % 2; p.legLift = run ? [14, 0, 14, 0] : [0, 14, 0, 14];
    p.x += Math.sin(t * TAU * 7) * 6; p.eye = 'shake'; p.sweat = 1; p.armL = 50 + run * 30; p.armR = 80 - run * 30; p.y -= run * 6;
  }
  if (within(t, C.vacuum[0] + 0.1, C.reveal)) {
    const k = eOut(seg(t, C.vacuum[0] + 0.1, C.vacuum[0] + 0.4)), wob = Math.sin(t * TAU * 9) * 2;
    p.lean = 16 * k + wob; p.sx = 1 + 0.14 * k; p.sy = 1 - 0.08 * k; p.armL = -60 * k; p.armLenL = 20 * k; p.armR = 30;
    p.eye = 'squint'; p.eyeDx = 6; p.sweat = 1; p.y -= 14 * k;
  }
  if (within(t, C.reveal, C.silence[0])) {
    const k = seg(t, C.reveal, C.reveal + 0.12); p.y -= 14 * (1 - eIn(k)); p.lean = 16 * (1 - eOut(k));
    const land = seg(t, C.reveal + 0.1, C.reveal + 0.25); if (land > 0 && land < 1) squash(1 - 0.15 * Math.sin(land * Math.PI)); p.eye = 'normal';
  }
  if (within(t, C.silence[0], C.send)) { p.eye = 'stare'; p.eyeDx = -9; p.sy = 1; p.sx = 1; blinkAt(C.slowBlink, 0.26); }
  // beat 5
  if (within(t, C.send, C.astonished)) { p.eye = 'squint'; p.eyeDx = -9; p.armL = -45 + 25 * seg(t, C.send + 0.08, C.send + 0.18); p.lean = -4; squash(0.97); }
  if (within(t, C.astonished, C.pleased)) { const k = seg(t, C.astonished, C.pleased); p.y -= 40 * Math.sin(k * Math.PI); squash(1 + 0.12 * Math.sin(k * Math.PI)); p.eye = 'wide'; p.eyeDx = -9; p.eyeDy = -8; p.armL = 60; p.armR = 60; }
  if (within(t, C.pleased, C.turn)) { p.eye = 'happy'; p.eyeDx = -8; p.y -= 6 * Math.abs(Math.sin(t * TAU * 3)); }
  if (within(t, C.turn, C.vac2)) {
    const k = seg(t, C.turn, C.turn + 0.1); p.eyeDx = lerp(-8, 0, k); p.y -= 20 * Math.sin(k * Math.PI);
    p.armR = 90 * eOutBack(seg(t, C.turn, C.turn + 0.08)); p.armLenR = 95;   // one raised "finger": the nub grows above the head p.eye = 'happy';
    if (t >= C.type3[0]) { p.armL = -28 + tap(2) * 20; p.eye = 'normal'; p.eyeDx = -2; }
  }
  if (within(t, C.vac2, C.gone)) {
    const k = seg(t, C.vac2 + 0.04, C.vac2 + 0.1), fly = eIn(seg(t, C.vac2 + 0.1, C.gone));
    p.eye = 'wide'; p.eyeDx = 6; p.lean = 22 * k; p.sx = (1 + 0.35 * k + 0.5 * fly) * (1 - 0.85 * fly); p.sy = (1 - 0.25 * k) * (1 - 0.85 * fly);
    p.x = lerp(CX + 20 * k, VAC2[0] + 10, fly); p.y = lerp(DESK, VAC2[1] + 60, fly); p.armL = 70; p.armR = 70; p.smear = k; p.shadow = fly < 0.3;
  }
  if (t >= C.gone) p.alpha = 0;
  return p;
}

// ----- layers -----
function drawLaptop(t) {
  let vis = t < C.transform + 0.15 || t >= C.reveal - 0.05;
  if (!vis) return;
  let sc = 1;
  if (within(t, C.transform, C.transform + 0.15)) sc = 1 - eIn(seg(t, C.transform, C.transform + 0.15));
  if (t >= C.reveal - 0.05) sc = pop(t, C.reveal - 0.05, 0.2);
  spr('laptop', LAP.x + 400, LAP.y + 540, { ax: 0.5, ay: 1, sx: sc, sy: sc });
  if (sc > 0.95) drawScreen(t);
}

function drawScreen(t) {
  S.save(); S.beginPath(); S.rect(SCREEN.x, SCREEN.y, SCREEN.w, SCREEN.h); S.clip();
  const mono = '38px Consolas', fg = '#f3e6cf', x = SCREEN.x + 36, y = SCREEN.y + 200;
  const cursorOn = Math.floor(t * 3) % 2 === 0;
  let line = '', showPrompt = true;
  if (t < C.freeze) line = typed(LINE1, t, C.type1[0], C.type1[1]);
  else if (t < C.del1[0]) line = LINE1;
  else if (t < C.transform) line = LINE1.slice(0, Math.round(LINE1.length * (1 - seg(t, C.del1[0], C.del1[1]))));
  else if (t < C.reveal - 0.1) line = '';
  else if (t < C.send) line = LINE1;
  else if (t < C.type3[0]) line = '';
  else if (t < C.beDirect) line = typed(LINE3, t, C.type3[0], C.type3[1]);
  else showPrompt = false;
  // header: the chat
  if (showPrompt) {
    txt('claude', SCREEN.x + 30, SCREEN.y + 50, '24px Consolas', '#D77757');
    S.fillStyle = 'rgba(243,230,207,0.25)'; S.fillRect(SCREEN.x + 30, SCREEN.y + 66, SCREEN.w - 60, 2);
    if (t >= C.freeze && t < C.del1[0] && Math.floor(t * 12) % 2) { S.fillStyle = 'rgba(255,90,70,0.25)'; S.fillRect(SCREEN.x, SCREEN.y, SCREEN.w, SCREEN.h); }
    const lines = line.length > 24 ? wrap(line, mono, SCREEN.w - 110) : [line];
    lines.forEach((l, k) => txt((k === 0 ? '> ' : '  ') + l, x, y + k * 52, mono, fg));
    const last = lines[lines.length - 1], cw = (S.font = mono, S.measureText('> ' + last).width);
    if (cursorOn || (t > C.type1[0] && t < C.type1[1])) { S.fillStyle = fg; S.fillRect(x + cw + 4, y + (lines.length - 1) * 52 - 32, 18, 38); }
  } else {
    const k = eOut(seg(t, C.beDirect, C.beDirect + 0.1));
    txt('Be direct.', SCREEN.x + SCREEN.w / 2, SCREEN.y + SCREEN.h / 2 + 34, `bold ${Math.round(lerp(60, 96, k))}px Georgia`, fg, { align: 'center', alpha: k });
  }
  S.restore();
  // sent line flies to the user
  if (within(t, C.send, C.thumbs + 0.05)) {
    const k = eInOut(seg(t, C.send + 0.02, C.thumbs));
    txt(LINE1, lerp(x + 40, 470, k), lerp(y, 180, k), `${Math.round(lerp(38, 28, k))}px Consolas`, '#3a2a24', { alpha: 1 - seg(t, C.thumbs - 0.03, C.thumbs + 0.05), outline: '#fffaf0', outlineW: 8 });
  }
}

function drawMachine(t) {
  if (t < C.transform + 0.05 || t >= C.pile + 0.05) return;
  const k = seg(t, C.transform + 0.05, C.transform + 0.4);
  const sy = eOutBack(k), sx = 0.6 + 0.4 * eOutBack(seg(t, C.transform + 0.05, C.transform + 0.3));
  const intensity = t >= C.shake ? 1 : t >= C.feed[1] - 0.1 ? 0.3 : 0;
  const shx = intensity * 6 * Math.sin(TAU * 11 * t), shy = intensity * 3 * Math.sin(TAU * 17 * t + 1);
  S.save(); S.translate(shx, shy);
  spr('machine', MACH.x + 450, MACH.y + 640, { ax: 0.5, ay: 1, sx, sy });
  if (k >= 1) {
    const g = pop(t, C.transform + 0.3, 0.2), spin = (t - 3.3) * (t > C.shake ? 4 : 1);
    spr('gear', 650, 560, { sx: g * 0.9, rot: spin });
    spr('gear', 860, 500, { sx: g * 0.62, rot: -spin * 1.4 + 0.2 });
    txt('PROSE-O-MATIC', 790, 690, 'bold 30px Georgia', '#5b3f16', { align: 'center', alpha: g });
  }
  S.restore();
  // chimney smoke
  const puffs = t >= C.shake ? 1 : 0;
  if (puffs) for (let n = 0; n < 8; n++) {
    const born = C.shake + n * 0.3 + ((t - C.shake) > 2.4 ? 0 : 0), age = ((t - C.shake - n * 0.3) % 2.4 + 2.4) % 2.4;
    if (t - C.shake < n * 0.3 || born > 7) continue;
    const a = clamp01(1 - age / 1.3); if (a <= 0) continue;
    spr('puff', CHIMNEY[0] + 20 * Math.sin(age * 3 + n) + age * 50, CHIMNEY[1] - age * 160, { sx: 0.5 + age * 0.8, alpha: a * 0.9 });
  }
}

function transformPuffs(t) {
  const burst = (t0, cx, cy, n, spread, seed) => {
    if (!within(t, t0, t0 + 0.6)) return; const r = rng(seed), age = t - t0;
    for (let k = 0; k < n; k++) { const a = r() * TAU, d = spread * (0.4 + r() * 0.6) * eOut(clamp01(age / 0.5)); spr('puff', cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.6, { sx: 0.6 + age, alpha: clamp01(1 - age / 0.6) }); }
  };
  burst(C.transform, 800, 520, 9, 360, 7);
  burst(C.pile - 0.05, 780, 600, 10, 420, 11);
  burst(C.reveal - 0.05, 820, 520, 7, 300, 13);
}

function drawSwitch(t) {
  if (!within(t, C.switchRise, C.feed[0])) return;
  const up = eOutBack(seg(t, C.switchRise, C.switchRise + 0.15)) * (1 - eIn(seg(t, 3.35, 3.55)));
  if (up <= 0.01) return;
  const s = 0.9, baseTop = SW[1] - 300 * s * up;
  S.save(); S.beginPath(); S.rect(SW[0] - 100, 0, 200, SW[1]); S.clip();
  const pivot = [SW[0], baseTop + 200 * s];
  const pull = eOut(seg(t, C.switchPull, C.switchPull + 0.08)), ant = seg(t, C.switchRise + 0.1, C.switchPull);
  const ang = lerp(-35, -50, ant) + 60 * pull;
  spr('lever', pivot[0], pivot[1], { ax: 0.5, ay: 0.92, sx: s, rot: ang * Math.PI / 180, alpha: clamp01((up - 0.2) / 0.3) });
  spr('switch', SW[0], baseTop, { ax: 0.5, ay: 0, sx: s });
  txt('PROSE', SW[0], baseTop + 252 * s, 'bold 30px Georgia', '#3b2708', { align: 'center' });
  S.restore();
  if (within(t, C.switchPull, C.switchPull + 0.3)) {
    const age = t - C.switchPull, r = rng(5), kx = pivot[0] + Math.sin(45 * Math.PI / 180) * 150 * s, ky = pivot[1] - Math.cos(45 * Math.PI / 180) * 150 * s;
    S.save(); S.strokeStyle = '#ffd24a'; S.lineWidth = 5; S.lineCap = 'round';
    for (let k = 0; k < 10; k++) { const a = r() * TAU, d0 = 20 + age * 300 * r(), d1 = d0 + 30; S.globalAlpha = 1 - age / 0.3; S.beginPath(); S.moveTo(kx + Math.cos(a) * d0, ky + Math.sin(a) * d0); S.lineTo(kx + Math.cos(a) * d1, ky + Math.sin(a) * d1); S.stroke(); }
    S.restore();
  }
}

function drawButton(t) {
  if (!within(t, C.buttonRise, C.glasses[0])) return;
  const up = eOutBack(seg(t, C.buttonRise, C.buttonRise + 0.2)) * (1 - eIn(seg(t, 8.65, 8.85)));
  if (up <= 0.01) return;
  const s = 0.8, press = within(t, C.slam, C.slam + 0.2) ? 1 - seg(t, C.slam + 0.08, C.slam + 0.2) : 0;
  S.save(); S.beginPath(); S.rect(SW[0] - 120, 0, 240, SW[1] + 4); S.clip();
  const y = SW[1] + 170 * s * (1 - up);
  spr('button', SW[0], y, { ax: 0.5, ay: 1, sx: s, sy: s * (1 - 0.25 * press) });
  txt('CONCISE', SW[0], y - 22, 'bold 24px Georgia', '#fbe9d8', { align: 'center' });
  S.restore();
  if (within(t, C.slam, C.slam + 0.3)) { const a = t - C.slam; for (let k = 0; k < 6; k++) star(SW[0] + Math.cos(k * 1.05) * (60 + a * 300), SW[1] - 130 - Math.sin(k * 1.05) * (40 + a * 150), 18 * (1 - a / 0.3), '#ffcf3f', k); }
}

// ----- beat 2 gags -----
const RPATH = [[345, 480], [305, 420], [300, 300], [380, 205], [560, 160], [800, 175], [1050, 140], [1300, 172], [1550, 140], [1800, 168], [2100, 150]];
const RSEG = (() => { const a = [0]; for (let k = 1; k < RPATH.length; k++) a.push(a[k - 1] + Math.hypot(RPATH[k][0] - RPATH[k - 1][0], RPATH[k][1] - RPATH[k - 1][1])); return a; })();
function rAt(s) {
  s = Math.max(0, Math.min(RSEG[RSEG.length - 1] - 0.01, s));
  let k = 1; while (RSEG[k] < s) k++;
  const f = (s - RSEG[k - 1]) / (RSEG[k] - RSEG[k - 1]), a = RPATH[k - 1], b = RPATH[k];
  return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), Math.atan2(b[1] - a[1], b[0] - a[0])];
}
function drawRibbon(t) {
  if (!within(t, C.ribbon[0], C.pile)) return;
  const head = 1000 * (t - C.ribbon[0]);
  // the paper strip
  S.save(); S.lineCap = 'butt'; S.lineJoin = 'round';
  const path = () => { S.beginPath(); for (let s = 0; s <= head; s += 12) { const [x, y] = rAt(s); s === 0 ? S.moveTo(x, y) : S.lineTo(x, y); } };
  path(); S.strokeStyle = '#6d5a44'; S.lineWidth = 70; S.stroke();
  path(); S.strokeStyle = '#fbf4e4'; S.lineWidth = 64; S.stroke();
  S.restore();
  // letters: the strip unrolls like a scroll, so the text reads from the chute outward
  S.save(); S.font = 'italic 40px Georgia'; S.fillStyle = '#3a2a24'; S.textBaseline = 'middle';
  let off = 330;
  for (const ch of RIBBON) {
    const w = S.measureText(ch).width, s = off + w / 2; off += w;
    if (s > head - 20) break;
    const [x, y, a] = rAt(s);
    S.save(); S.translate(x, y); S.rotate(a); S.fillText(ch, -w / 2, 2); S.restore();
  }
  S.restore();
}

function beamPos(t) {
  if (t < C.beam - 0.15) return null;
  if (t < C.pile - 0.15) { const k = seg(t, C.beam - 0.15, C.beam); return { x: 1085, y: lerp(-200, 292, eIn(k)) - (t > C.beam ? 12 * Math.abs(Math.sin((t - C.beam) * 18)) * Math.exp(-(t - C.beam) * 10) : 0), rot: -0.03 }; }
  const k = eOut(seg(t, C.pile - 0.15, C.pile + 0.05)); return { x: 1085, y: lerp(292, 172, k), rot: lerp(-0.03, 0.01, k) };
}
function drawBeam(t, pos) {
  if (!pos) return;
  S.save(); S.translate(pos.x, pos.y); S.rotate(pos.rot);
  spr('beam', 0, 0, { sx: 0.95 });
  txt('LOAD-BEARING', 0, 18, 'bold 54px Georgia', '#3b230f', { align: 'center' });
  S.restore();
}
function drawSeams(t) {
  if (t < C.seams[0]) return;
  const k = eInOut(seg(t, C.seams[0], C.seams[1])), x0 = 40, x1 = 1880, y = 868, xe = lerp(x0, x1, k);
  S.save(); S.strokeStyle = '#e8413a'; S.lineWidth = 5; S.lineCap = 'round';
  for (let x = x0; x < xe; x += 44) { S.beginPath(); S.moveTo(x, y - 12); S.lineTo(x + 24, y + 12); S.moveTo(x + 24, y - 12); S.lineTo(x, y + 12); S.stroke(); }
  S.setLineDash([14, 10]); S.beginPath(); S.moveTo(x0, y); S.lineTo(xe, y); S.stroke(); S.restore();
  if (k < 1) { S.save(); S.strokeStyle = '#d8d8e0'; S.lineWidth = 5; S.beginPath(); S.moveTo(xe, y); S.lineTo(xe + 60, y - 22); S.stroke(); S.restore(); }
  txt('SEAMS', 60, 842, 'bold italic 56px Georgia', '#e8413a', { alpha: seg(t, C.seams[0], C.seams[0] + 0.1), outline: '#fbf4e4', outlineW: 8 });
}
function drawWedge(t) {
  if (t < C.wedge - 0.3) return;
  const hit = eOutBack(seg(t, C.wedge, C.wedge + 0.15)), inx = eIn(seg(t, C.wedge - 0.3, C.wedge));
  const sentences = t < C.pile;
  if (sentences) {
    txt("It's not a tweak.", 40, lerp(545, 470, hit), 'italic 42px Georgia', '#3a2a24', { outline: '#fbf4e4', outlineW: 6 });
    txt("It's a reckoning.", 40, lerp(612, 705, hit), 'italic 42px Georgia', '#3a2a24', { outline: '#fbf4e4', outlineW: 6 });
  }
  const wx = lerp(-150, 300, inx) + 60 * hit;
  spr('wedge', wx, 585, { sx: 1.2, ax: 0.5, ay: 0.5 });
  txt('WEDGE', wx - 35, 597, 'bold 34px Georgia', '#3b230f', { align: 'center' });
  if (within(t, C.wedge - 0.3, C.wedge + 0.3)) {                 // hammer: in, hit, bounce out
    const hx = t < C.wedge ? lerp(-500, -270, eOut(seg(t, C.wedge - 0.3, C.wedge))) : lerp(-270, -620, eOut(seg(t, C.wedge + 0.04, C.wedge + 0.3)));
    spr('hammer', hx + wx, 585, { sx: 1.1, ax: 0.5, ay: 0.5, rot: t < C.wedge ? -0.2 : 0.08 });
  }
  if (within(t, C.wedge, C.wedge + 0.2)) for (let k = 0; k < 5; k++) star(wx - 140 + 30 * Math.cos(k), 585 + 50 * Math.sin(k * 1.3), 20 * (1 - seg(t, C.wedge, C.wedge + 0.2)), '#ffcf3f', k);
}
const DASH_REST = [[560, 640, -0.5], [1060, 700, 0.35]];
function dashPos(t, k) {
  if (t < C.dashes[0] + k * 0.25) return null;
  const a0 = C.dashes[0] + k * 0.25, u = t - a0;
  const ex = 1000 + 460 * Math.cos(u * 4.2 + k * 2.4), ey = 520 + 190 * Math.sin(u * 4.2 + k * 2.4), rot = u * 14;
  const land = seg(t, C.dashes[1] - 0.1, C.dashes[1] + 0.05);
  if (land <= 0) return [ex, ey, rot, 0.4 + 0.6 * seg(t, a0, a0 + 0.15)];
  const r = DASH_REST[k]; return [lerp(ex, r[0], eOut(land)), lerp(ey, r[1], eOut(land)), lerp(rot % TAU, r[2], land), 1];
}
function drawDash(pos) {
  if (!pos) return; const [x, y, r, s] = pos;
  S.save(); S.translate(x, y); S.rotate(r); S.scale(s, s); S.fillStyle = '#2b1d17'; S.beginPath(); S.roundRect(-110, -14, 220, 28, 14); S.fill(); S.restore();
}
function drawQuietly(t, override) {
  if (t < C.quietly[0]) return;
  const k = seg(t, C.quietly[0], C.quietly[1]), x = override ? override[0] : lerp(60, 1330, k), step = Math.floor(t * 10) % 2, walking = k < 1;
  const y = 1000 - (walking ? Math.abs(Math.sin(t * TAU * 5)) * 10 : 0);
  S.save(); S.strokeStyle = '#2b1d17'; S.lineWidth = 3; S.lineCap = 'round';
  for (const [lx, ph] of [[40, step], [95, 1 - step]]) { S.beginPath(); S.moveTo(x + lx, y + 6); S.lineTo(x + lx + (walking ? (ph ? 10 : -10) : 0), y + 36); S.stroke(); }
  S.restore();
  txt('quietly', x, y, 'italic 44px Georgia', '#2b1d17', { outline: '#fbf4e4', outlineW: 5 });
}
function drawBullets(t, hide) {
  if (t < C.bullets[0]) return;
  const ys = [262, 322, 382];
  for (let k = 0; k < 3; k++) {
    if (hide && hide[k]) continue;
    if (t < C.bullets[k]) continue;
    const kk = eOutBack(seg(t, C.bullets[k], C.bullets[k] + 0.18)), y = lerp(ys[Math.max(0, k - 1)], ys[k], kk);
    txt('• And that matters.', 1565, y, 'bold 34px Georgia', '#2b1d17', { outline: '#fbf4e4', outlineW: 6, alpha: k === 0 ? pop(t, C.bullets[0], 0.15) : 1 });
  }
}

// ----- beat 3 -----
function drawPile(t) {
  if (t < C.pile - 0.15 || t >= C.suck[10] + 0.25) return;
  const drop = eIn(seg(t, C.pile - 0.15, C.pile)), land = within(t, C.pile, C.pile + 0.12) ? Math.sin(seg(t, C.pile, C.pile + 0.12) * Math.PI) : 0;
  const suck = eIn(seg(t, C.suck[10], C.suck[10] + 0.22));
  S.save();
  if (suck > 0) { const cx = 780, cy = 510; S.translate(lerp(cx, VAC1[0], suck), lerp(cy, VAC1[1], suck)); S.scale(1 - 0.95 * suck, 1 - 0.97 * suck); S.translate(-cx, -cy); }
  S.translate(0, lerp(-900, 0, drop) + 12 * land);
  spr('pile', 330, 250, { ax: 0, ay: 0 });
  drawParagraph(t);
  S.restore();
}
function drawParagraph(t) {
  const k = eInOut(seg(t, C.compress[0], C.compress[1]));
  const sc = lerp(1, 0.34, k), cx = lerp(780, 1030, k), cy = lerp(480, 560, k);
  S.save(); S.translate(cx, cy); S.scale(sc, sc);
  if (within(t, C.compress[0], C.compress[1])) S.scale(1 + 0.08 * Math.sin(k * Math.PI), 1 - 0.08 * Math.sin(k * Math.PI));
  spr('sheet', 0, 0);
  const font = '30px Georgia', lines = wrap(PARA, font, 740);
  lines.forEach((l, n) => txt(l, -370, -205 + n * 40, font, '#2b1d17'));
  // flourishes in the corners
  if (t < C.suck[7]) {
    S.strokeStyle = '#7a4a24'; S.lineWidth = 4;
    for (const [fx, fy, m] of [[-380, -245, 1], [380, -245, -1], [-380, 250, 1], [380, 250, -1]]) {
      S.beginPath(); S.moveTo(fx, fy); S.bezierCurveTo(fx + 60 * m, fy - 30, fx + 90 * m, fy + 40, fx + 40 * m, fy + 30); S.bezierCurveTo(fx + 10 * m, fy + 20, fx + 30 * m, fy, fx + 50 * m, fy + 8); S.stroke();
    }
  }
  S.restore();
  if (t >= C.stamp) {
    const a = eOutBack(seg(t, C.stamp, C.stamp + 0.1));
    S.save(); S.translate(1085, 640); S.rotate(-0.12); S.scale(1.3 - 0.3 * a, 1.3 - 0.3 * a); S.globalAlpha = a;
    S.strokeStyle = '#d6453a'; S.lineWidth = 4; S.strokeRect(-150, -26, 300, 50);
    txt('AND THAT MATTERS.', 0, 11, 'bold 30px Georgia', '#d6453a', { align: 'center' }); S.restore();
  }
}
function drawStamp(t, p) {
  if (!within(t, C.compress[1], C.stamp + 0.3)) return;
  const [hx, hy] = clawdToStage(p, 0, -300);
  const out = eInOut(seg(t, C.compress[1], C.stamp)), back = eInOut(seg(t, C.stamp + 0.06, C.stamp + 0.3));
  const k = out * (1 - back), x = lerp(hx, 1085, k), y = lerp(hy, 590, k) - 120 * Math.sin(k * Math.PI);
  spr('stamp', x, y, { sx: 0.9, sy: 0.9 * (within(t, C.stamp, C.stamp + 0.06) ? 0.85 : 1), ax: 0.5, ay: 0.95, alpha: 1 - seg(t, C.stamp + 0.2, C.stamp + 0.3) });
}
function drawKey(t, hidden) {
  if (t < C.pile || hidden) return;
  spr('key', 225, 360, { sx: 0.7, rot: -0.15, alpha: seg(t, C.pile, C.pile + 0.1) });
  txt('THE REAL UNLOCK', 225, 318, 'bold 22px Georgia', '#6b4a10', { align: 'center', outline: '#fbf4e4', outlineW: 5 });
}
function drawDots(t, hidden) { if (t < C.pile || hidden) return; txt('...', 1330, 280, 'bold 90px Georgia', '#2b1d17', { align: 'center' }); }

// ----- avatar -----
function drawAvatar(t) {
  const [x, y] = AV, bob = Math.sin(t * TAU * 0.8) * 5;
  spr('avatar', x, y + bob);
  S.fillStyle = '#2a2a33';
  const ey = y + bob - 8;
  const mag = t >= C.glasses[2] && t < C.suck[10];
  for (const ex of [x - 28, x + 28]) { S.beginPath(); S.arc(ex, ey, mag && ex > x ? 20 : 9, 0, TAU); S.fill(); }
  S.strokeStyle = '#2a2a33'; S.lineWidth = 5; S.lineCap = 'round';
  S.beginPath(); S.arc(x, y + bob + 16, 26, 0.2 * Math.PI, 0.8 * Math.PI); S.stroke();
  // glasses, stronger glasses, magnifier
  if (t >= C.glasses[0] && t < C.suck[10]) {
    const g2 = t >= C.glasses[1], a = pop(t, g2 ? C.glasses[1] : C.glasses[0], 0.15);
    S.save(); S.translate(x, ey); S.scale(a, a);
    S.strokeStyle = '#1e1e24'; S.lineWidth = g2 ? 11 : 4; const r = g2 ? 34 : 24;
    if (g2) { S.fillStyle = 'rgba(220,240,255,0.55)'; for (const ex of [-28, 28]) { S.beginPath(); S.arc(ex, 0, r, 0, TAU); S.fill(); } }
    for (const ex of [-28, 28]) { S.beginPath(); S.arc(ex, 0, r, 0, TAU); S.stroke(); }
    S.restore();
    if (mag) {
      const m = pop(t, C.glasses[2], 0.2);
      // lens centred on the right eye; the eye behind it looks huge
      const lx = x + 28, ly = ey, sc = m * 0.8;
      spr('magnifier', lx + 30 * sc, ly + 30 * sc, { sx: sc, alpha: 0.85 });
      S.save(); S.fillStyle = '#2a2a33'; S.beginPath(); S.arc(lx, ly, 30 * m, 0, TAU); S.fill();
      S.fillStyle = '#fff'; S.beginPath(); S.arc(lx - 9 * m, ly - 10 * m, 8 * m, 0, TAU); S.fill();
      S.strokeStyle = '#4a4a52'; S.lineWidth = 12; S.beginPath(); S.arc(lx, ly, 95 * sc, 0, TAU); S.stroke(); S.restore();
    }
  }
  if (t >= C.thumbs) {
    const a = pop(t, C.thumbs, 0.2), tx = x + 190, ty = y + bob;
    spr('thumb', tx, ty, { sx: 0.75 * a });
    S.save(); S.translate(tx, ty); S.scale(a, a); S.fillStyle = '#fffaf0';
    S.beginPath(); S.roundRect(-26, -6, 50, 40, 8); S.fill(); S.beginPath(); S.roundRect(-22, -44, 20, 44, 9); S.fill(); S.restore();
  }
}
function bubble(t, s, t0, t1) {
  if (!within(t, t0, t1)) return;
  const a = pop(t, t0, 0.2) * (1 - seg(t, t1 - 0.12, t1)), font = 'italic 44px Georgia';
  S.font = font; const w = S.measureText(s).width + 90;
  S.save(); S.translate(290, 205); S.scale(a, a);
  spr('bubble', 0, 0, { ax: 0, ay: 100 / 130, w: w, h: 130 });
  txt(s, 70, -38, font, '#2b1d17'); S.restore();
}

// ----- beat 4 -----
function drawRays(t) {
  if (!within(t, C.card[0], C.reveal + 0.3)) return;
  const a = seg(t, C.card[0], C.card[0] + 0.3) * (1 - seg(t, C.reveal, C.reveal + 0.3));
  S.save(); S.globalAlpha = 0.35 * a; S.fillStyle = '#fff4c2'; S.translate(960, 40);
  for (let k = 0; k < 14; k++) { const ang = (k / 14) * Math.PI + t * 0.3; S.beginPath(); S.moveTo(0, 0); S.lineTo(Math.cos(ang) * 1600, Math.sin(ang) * 1600); S.lineTo(Math.cos(ang + 0.1) * 1600, Math.sin(ang + 0.1) * 1600); S.fill(); }
  S.restore();
}
function drawCard(t) {
  if (!within(t, C.card[0], C.reveal + 0.3)) return;
  const y = lerp(-340, 40, eOutBack(seg(t, C.card[0], C.card[1]))) - 420 * eIn(seg(t, C.reveal, C.reveal + 0.3));
  spr('card', 960, y, { ax: 0.5, ay: 0 });
  txt('SYSTEM MESSAGE', 400, y + 56, 'bold 30px Consolas', '#2c3e57');
  txt('PLEASE REMOVE ALL', 960, y + 170, 'bold 76px Georgia', '#1d2a3a', { align: 'center' });
  txt('MANNERED PROSE.', 960, y + 256, 'bold 76px Georgia', '#1d2a3a', { align: 'center' });
}
function vacuumMouth(t) {
  // the nozzle slides in and out along its own axis; returns [x, y, angle]
  const along = (m, a, off) => [m[0] + Math.cos(a) * off, m[1] + Math.sin(a) * off, a];
  if (within(t, C.vacuum[0], C.vacuum[1] + 0.2)) { const k = eOutBack(seg(t, C.vacuum[0], C.vacuum[0] + 0.18)), out = eIn(seg(t, C.vacuum[1] - 0.05, C.vacuum[1] + 0.15)); return along(VAC1, VAC1A, 800 * (1 - k) + 900 * out); }
  if (within(t, C.vac2 - 0.08, C.gone + 0.3)) { const k = eOutBack(seg(t, C.vac2 - 0.08, C.vac2 + 0.02)), out = eIn(seg(t, C.gone + 0.02, C.gone + 0.2)); return along(VAC2, VAC2A, 800 * (1 - k) + 900 * out); }
  return null;
}
function drawVacuum(t) {
  const m = vacuumMouth(t); if (!m) return;
  const [mx, my, ang] = m, rumble = Math.sin(t * TAU * 23) * 3;
  S.save(); S.translate(0, rumble);
  // suction lines, in the half-plane the mouth faces
  S.strokeStyle = 'rgba(60,60,70,0.45)'; S.lineWidth = 4; S.lineCap = 'round';
  for (let k = 0; k < 14; k++) { const a = ang + Math.PI - 1.2 + (k / 13) * 2.4, ph = ((t * 3 + k * 0.37) % 1), r0 = 440 * (1 - ph) + 70, r1 = r0 + 90; S.beginPath(); S.moveTo(mx + Math.cos(a) * r1, my + Math.sin(a) * r1); S.lineTo(mx + Math.cos(a) * r0, my + Math.sin(a) * r0); S.stroke(); }
  S.translate(mx, my); S.rotate(ang);
  S.fillStyle = COL.steel; S.fillRect(560, -50, 1200, 100); S.fillStyle = '#5d6b7a'; S.fillRect(560, 44, 1200, 6);
  spr('vacuum', -40, -160, { ax: 0, ay: 0 });
  txt('REMOVE', 190, -10, 'bold 30px Georgia', '#fbf4e4', { align: 'center' });
  txt('MANNERED PROSE', 190, 26, 'bold 24px Georgia', '#fbf4e4', { align: 'center' });
  S.restore();
}
// words flying into the nozzle
function flyWord(t, t0, label, from, font = 'bold 52px Georgia') {
  if (!within(t, t0, t0 + 0.3)) return;
  const k = eIn(seg(t, t0, t0 + 0.3)), m = vacuumMouth(t) || VAC1;
  const x = lerp(from[0], m[0], k), y = lerp(from[1], m[1], k), ang = Math.atan2(m[1] - from[1], m[0] - from[0]);
  S.save(); S.translate(x, y); S.rotate(ang * k); S.scale((1 + 1.2 * k) * (1 - 0.7 * k), 1 - 0.75 * k);
  txt(label, 0, 0, font, '#2b1d17', { align: 'center', base: 'middle', outline: '#fbf4e4', outlineW: 8 }); S.restore();
}
function drawSiren(t) {
  if (!within(t, C.siren[0], C.siren[1])) return;
  const a = 0.5 + 0.5 * Math.sin(TAU * 2 * (t - C.siren[0]) - Math.PI / 2);
  S.fillStyle = `rgba(230,40,40,${0.2 * a})`; S.fillRect(0, 0, 1920, 1080);
}

// ----- Clawd extras -----
function drawClawdExtras(t, p) {
  if (p.alpha === 0) return;
  if (p.sweat > 0) {
    const [sx, sy] = clawdToStage(p, 150, -230), fall = (t * 1.2) % 1;
    S.save(); S.globalAlpha = p.sweat; S.fillStyle = '#7ec8f0'; S.translate(sx, sy + fall * 30);
    S.beginPath(); S.moveTo(0, -18); S.quadraticCurveTo(14, 4, 0, 10); S.quadraticCurveTo(-14, 4, 0, -18); S.fill(); S.restore();
  }
  if (p.bang > 0) { const [bx, by] = clawdToStage(p, 0, -250); txt('!', bx, by - 20 * p.bang, `bold ${Math.round(90 * p.bang)}px Georgia`, '#d6453a', { align: 'center', outline: '#fbf4e4', outlineW: 6 }); }
  if (within(t, C.bowtie[0] + 0.03, C.bowtie[1])) {
    const [bx, by] = clawdToStage(p, 0, -58);
    S.save(); S.setLineDash([6, 6]); S.strokeStyle = 'rgba(58,42,36,0.8)'; S.lineWidth = 3; S.translate(bx, by);
    S.beginPath(); S.moveTo(0, 0); S.lineTo(-34, -18); S.lineTo(-34, 18); S.closePath(); S.moveTo(0, 0); S.lineTo(34, -18); S.lineTo(34, 18); S.closePath(); S.stroke(); S.restore();
  }
  for (const c of [C.crack, C.crack + 0.09]) if (within(t, c, c + 0.14)) {
    const a = seg(t, c, c + 0.14);
    for (const side of [-1, 1]) { const [sx, sy] = clawdToStage(p, side * 200, -110); star(sx, sy - 10, 22 * (1 - a) + 6, '#ffcf3f', a * 2); }
  }
  if (p.smear) {
    S.save(); S.strokeStyle = 'rgba(58,42,36,0.5)'; S.lineWidth = 5;
    for (let k = 0; k < 6; k++) { const y = p.y - 40 - k * 30; S.beginPath(); S.moveTo(p.x - 260 - k * 20, y); S.lineTo(p.x - 140, y); S.stroke(); }
    S.restore();
  }
}
function drawStrip(t, p) {
  if (!within(t, C.feed[0], C.feed[1] - 0.02)) return;
  const [hx, hy] = clawdToStage(p, 0, -300), k = eInOut(seg(t, C.feed[0] + 0.12, C.feed[1] - 0.04));
  const x = lerp(hx, HOPPER[0], k), y = lerp(hy, HOPPER[1] - 20, k) - 160 * Math.sin(k * Math.PI);
  S.save(); S.translate(x, y); S.rotate(-0.3 * k); S.scale(1 - 0.5 * k * k, 1 - 0.5 * k * k);
  S.fillStyle = '#fffaf0'; S.strokeStyle = '#6d5a44'; S.lineWidth = 2; S.fillRect(-150, -24, 300, 48); S.strokeRect(-150, -24, 300, 48);
  txt(LINE1, 0, 8, '24px Consolas', '#2b1d17', { align: 'center' }); S.restore();
}

// ----- the frame -----
window.renderFrame = (i) => {
  const t = i / FPS;
  S.setTransform(1, 0, 0, 1, 0, 0); S.globalAlpha = 1; S.globalCompositeOperation = 'source-over';
  if (t >= C.black) { S.fillStyle = '#000'; S.fillRect(0, 0, 1920, 1080); return; }
  const camX = shakeAt(t, C.beam, 16) + shakeAt(t, C.slam, 14) + shakeAt(t, C.pile, 10) + shakeAt(t, C.card[1], 10);
  const camY = shakeAt(t + 0.02, C.beam, 12) + shakeAt(t + 0.02, C.slam, 8) + shakeAt(t, C.pile, 8) + shakeAt(t + 0.03, C.card[1], 8);
  S.fillStyle = COL.paper; S.fillRect(0, 0, 1920, 1080);
  S.save(); S.translate(camX, camY);
  S.drawImage(SPRITES.room, 0, 0);
  drawRays(t);

  // which beat-2/3 gag objects are still here (removed one by one by the vacuum)
  const gone = (k) => t >= C.suck[k];
  const p = clawdPose(t);

  drawLaptop(t);
  drawMachine(t);
  drawSwitch(t);
  drawButton(t);
  drawPile(t);
  drawRibbon(t);
  if (!gone(3)) drawWedge(t);
  if (!gone(2)) drawSeams(t);
  if (!gone(0)) drawBeam(t, beamPos(t));
  drawKey(t, gone(1));
  drawDots(t, gone(8));
  drawBullets(t, [gone(10), gone(10), gone(9)]);
  if (!gone(5)) drawDash(dashPos(t, 0));
  if (!gone(6)) drawDash(dashPos(t, 1));
  if (!gone(4)) drawQuietly(t);
  transformPuffs(t);

  drawClawd(S, p, t);
  drawClawdExtras(t, p);
  drawStrip(t, p);
  drawStamp(t, p);

  drawAvatar(t);
  bubble(t, 'Explain this simply.', C.bubble1, C.transform);
  bubble(t, 'Can you be concise?', C.bubble2, C.card[0]);
  drawCard(t);
  drawVacuum(t);
  const bp = beamPos(t) || { x: 1085, y: 172 };
  flyWord(t, C.suck[0], 'LOAD-BEARING!', [bp.x, bp.y]);
  flyWord(t, C.suck[1], 'THE REAL UNLOCK!', [260, 340]);
  flyWord(t, C.suck[2], 'SEAMS!', [200, 850]);
  flyWord(t, C.suck[3], 'WEDGE!', [260, 590]);
  flyWord(t, C.suck[4], 'QUIETLY!', [1380, 1000]);
  flyWord(t, C.suck[5], '—', DASH_REST[0], 'bold 110px Georgia');
  flyWord(t, C.suck[6], '—', DASH_REST[1], 'bold 110px Georgia');
  flyWord(t, C.suck[7], '~ flourishes ~', [780, 230], 'italic 48px Georgia');
  flyWord(t, C.suck[8], '...', [1330, 260], 'bold 90px Georgia');
  flyWord(t, C.suck[9], '• third bullet', [1700, 382], 'bold 44px Georgia');
  S.restore();

  drawSiren(t);
  // paper finish over everything: grain + vignette
  S.save(); S.globalCompositeOperation = 'multiply'; S.globalAlpha = 0.35; S.drawImage(SPRITES.grain, 0, 0); S.restore();
  const vg = S.createRadialGradient(960, 540, 500, 960, 540, 1150);
  vg.addColorStop(0, 'rgba(60,30,10,0)'); vg.addColorStop(1, 'rgba(60,30,10,0.28)');
  S.fillStyle = vg; S.fillRect(0, 0, 1920, 1080);
};

// ----- check sheets -----
window.drawSheet = (kind) => {
  S.setTransform(1, 0, 0, 1, 0, 0);
  S.fillStyle = COL.paper; S.fillRect(0, 0, 1920, 1080);
  if (kind === 'assets') {
    let x = 10, y = 10, rowH = 0;
    const names = Object.keys(SPRITES).filter((n) => n !== 'room' && n !== 'grain');
    S.drawImage(SPRITES.room, 1440, 800, 480, 270);
    for (const n of names) {
      const c = SPRITES[n], sc = Math.min(1, 300 / c.width, 240 / c.height), w = c.width * sc, h = c.height * sc;
      if (x + w > 1430) { x = 10; y += rowH + 30; rowH = 0; }
      S.drawImage(c, x, y, w, h); txt(n, x, y + h + 18, '18px Consolas', '#000');
      x += w + 20; rowH = Math.max(rowH, h);
    }
  } else if (kind === 'poses') {
    const poses = [['neutral', 0.5], ['horrified', 1.35], ['delighted typing', 6.2], ['proud', 7.15], ['panic', 10.6], ['stare', 12.5], ['astonished', 13.45], ['pulled by vacuum', 14.3]];
    poses.forEach(([name, t], k) => {
      const p = clawdPose(t), ox = (k % 4) * 480 + 240 - p.x, oy = Math.floor(k / 4) * 520 + 420 - DESK;
      S.save(); S.translate(ox, oy); p.x += 0; drawClawd(S, p, t); drawClawdExtras(t, p); S.restore();
      txt(`${name}  (t=${t})`, (k % 4) * 480 + 240, Math.floor(k / 4) * 520 + 480, '24px Consolas', '#000', { align: 'center' });
    });
    // colour check: mean colour of a flat body area
    const d = S.getImageData(240 - 60, 420 - 200, 40, 40).data; let r = 0, g = 0, b = 0;
    for (let k = 0; k < d.length; k += 4) { r += d[k]; g += d[k + 1]; b += d[k + 2]; }
    const n = d.length / 4; console.warn(`clawd mean rgb ${Math.round(r / n)},${Math.round(g / n)},${Math.round(b / n)} (target 215,119,87)`);
  }
};

// ----- motion check: large pose jumps between two frames ("pops") -----
window.motionCheck = () => {
  const keys = ['x', 'y', 'sx', 'sy', 'lean', 'armL', 'armR'], lim = { x: 40, y: 40, sx: 0.15, sy: 0.15, lean: 12, armL: 45, armR: 45 };
  const out = []; let prev = clawdPose(0);
  for (let i = 1; i < 360; i++) {
    const p = clawdPose(i / FPS);
    for (const k of keys) { const d = Math.abs((p[k] || 0) - (prev[k] || 0)); if (d > lim[k] && p.alpha !== 0) out.push(`f${i} t=${(i / FPS).toFixed(3)} ${k} jumps ${d.toFixed(2)}`); }
    prev = p;
  }
  return out;
};
