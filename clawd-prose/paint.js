// paint.js: paints every watercolor sprite ONE time with p5.brush, then hands off to the 2D stage.
// p5.brush flushes its paint at the end of setup()/draw(), so the loop paints one sprite per draw()
// call and copies it on the next call. Each sprite gets its own seed, so every render is identical.

const SPRITES = {};      // name -> HTMLCanvasElement (2D, transparent outside the mask)
const JOBS = [];         // { name, w, h, paint(), mask(ctx) }
let CUES = null;
let pending = null;

const PAPER = '#f3e6cf';
// bg: the colour p5.brush mixes pigment with. Paper for props; grey or white for overlay textures.
function addSprite(name, w, h, paint, mask, bg = PAPER) { JOBS.push({ name, w, h, paint, mask, bg, seed: 1000 + JOBS.length * 17 }); }

function setup() {
  createCanvas(1920, 1080, WEBGL);
  pixelDensity(1);
  angleMode(DEGREES);
  brush.scaleBrushes(6);
}

function draw() {
  if (pending) { copySprite(pending); pending = null; }
  const job = JOBS.shift();
  if (!job) { noLoop(); finish(); return; }
  background(job.bg);
  push();
  translate(-width / 2, -height / 2);   // WEBGL origin is the centre; sprites use top-left coordinates
  randomSeed(job.seed); noiseSeed(job.seed);
  job.paint();
  pop();
  pending = job;
}

function copySprite(job) {
  const c = document.createElement('canvas');
  c.width = job.w; c.height = job.h;
  const g = c.getContext('2d');
  if (job.mask) {
    g.beginPath(); job.mask(g);
    g.fillStyle = '#000'; g.fill();
    g.lineWidth = 8; g.lineJoin = 'round'; g.stroke();
    g.globalCompositeOperation = 'source-in';
  }
  g.drawImage(document.querySelector('canvas.p5Canvas'), 0, 0, job.w, job.h, 0, 0, job.w, job.h);
  SPRITES[job.name] = c;
}

async function finish() {
  CUES = await (await fetch('cues.json')).json();
  await document.fonts.load('48px Georgia'); await document.fonts.load('48px Consolas');
  await document.fonts.ready;
  if (window.onAssetsReady) window.onAssetsReady();
  window.renderFrame(0);
  window.READY = true;
}

// small painting helpers (p5.brush, top-left coordinates)
// wc: a flat wash for solid colour, plus a watercolor fill on top for bleed, grain and a darker rim.
function wc(color, alpha, bleed = 0.12, tex = 0.4, border = 0.35) {
  brush.noStroke(); brush.noHatch();
  brush.wash(color, 170);
  brush.fill(color, alpha); brush.fillBleed(bleed); brush.fillTexture(tex, border);
}
// tex: watercolor only, no wash (for overlay textures)
function tex(color, alpha, bleed = 0.3, t = 0.8, border = 0.5) {
  brush.noStroke(); brush.noHatch(); brush.noWash();
  brush.fill(color, alpha); brush.fillBleed(bleed); brush.fillTexture(t, border);
}
function ink(color = '#3a2a24', w = 1.1) { brush.noFill(); brush.noWash(); brush.set('pen', color, w); }
function poly(pts) { brush.polygon(pts); }
