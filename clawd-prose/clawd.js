// clawd.js: the pixel character. Grid decoded from the Claude Code terminal logo:
//    ▐▛███▜▌
//   ▝▜█████▛▘
//     ▘▘ ▝▝
// Each character cell = 2×2 quarters. 1 quarter = Q×2Q px. Grid: 18 quarters wide, 5 rows used.
// Body: cols 3–14, rows 0–3. Eyes: row 1, cols 5 and 12. Arms: row 2, cols 1–2 and 15–16. Legs: row 4, cols 4, 6, 11, 13.
// Local origin = centre of the feet (bottom of row 4, x between cols 8 and 9), so squash keeps the feet on the desk.

const Q = 22, QH = 44;                       // one quarter: 22 × 44 px
const CLAWD = '#D77757';                     // rgb(215,119,87), clawd_body in the local claude.exe
const EYE = '#231814';
const qx = (col) => (col - 9) * Q, qy = (row) => (row - 5) * QH;

const BODY = { x: qx(3), y: qy(0), w: 12 * Q, h: 4 * QH };       // x -132..132, y -220..-44
const LEGS = [4, 6, 11, 13];
const EYES = [5, 12];

// p: { x, y, sx, sy, lean, armL, armR, armLenL, armLenR, eye, eyeDx, eyeDy, blink, legLift:[4], alpha, smear }
function drawClawd(g, p, t) {
  g.save();
  // soft shadow on the desk (does not squash with the body)
  const lift = Math.max(0, 760 - p.y);
  if (p.shadow !== false) {
    g.fillStyle = `rgba(80,40,20,${0.22 * Math.max(0.2, 1 - lift / 300)})`;
    g.beginPath(); g.ellipse(p.x, 766, 150 * (1 - lift / 900), 14, 0, 0, Math.PI * 2); g.fill();
  }
  g.globalAlpha = p.alpha ?? 1;
  g.translate(p.x, p.y);
  g.rotate((p.lean || 0) * Math.PI / 180);
  g.scale(p.sx ?? 1, p.sy ?? 1);

  // body path: body block + legs
  const body = new Path2D();
  body.rect(BODY.x, BODY.y, BODY.w, BODY.h);
  LEGS.forEach((c, k) => { const up = (p.legLift ? p.legLift[k] : 0); body.rect(qx(c), qy(4) - 1 - up, Q, QH + 1); });

  // arms: pivot at the outer edge of the body (a pivot inside the body hides the arm: known bug)
  const arm = (side, ang, extra) => {
    const a = new Path2D();
    const len = 2 * Q + Q * Math.abs(Math.sin(ang * Math.PI / 180)) + (extra || 0);
    const m = new DOMMatrix().translate(side < 0 ? BODY.x : BODY.x + BODY.w, qy(2) + QH / 2)
      .rotate(side < 0 ? ang : -ang).scale(side, 1);
    a.addPath(roundRectPath(-10, -QH / 2, len + 10, QH, 3), m);
    return a;
  };
  const armL = arm(-1, p.armL || 0, p.armLenL), armR = arm(1, p.armR || 0, p.armLenR);

  for (const path of [armL, armR, body]) { g.fillStyle = CLAWD; g.fill(path); }
  // watercolor pigment texture inside the pixel shape (soft-light keeps the mean colour)
  if (SPRITES.clawdtex) {
    g.save(); g.clip(body); g.globalCompositeOperation = 'soft-light'; g.globalAlpha = 0.45 * (p.alpha ?? 1);
    g.drawImage(SPRITES.clawdtex, BODY.x - 10, BODY.y - 10, BODY.w + 20, BODY.h + QH + 20); g.restore();
  }

  // eyes
  const blink = p.blink || 0;
  g.fillStyle = EYE; g.strokeStyle = EYE;
  EYES.forEach((c, k) => {
    const cx = qx(c) + Q / 2 + (p.eyeDx || 0), cy = qy(1) + QH / 2 + (p.eyeDy || 0);
    let jx = 0, jy = 0;
    if (p.eye === 'shake') { jx = Math.sin(t * 90 + k * 2) * 4; jy = Math.cos(t * 77 + k) * 3; }
    const mode = blink > 0.5 ? 'closed' : p.eye;
    if (mode === 'happy') {
      g.lineWidth = 8; g.lineCap = 'round'; g.lineJoin = 'round';
      g.beginPath(); g.moveTo(cx - 12, cy + 8); g.lineTo(cx, cy - 10); g.lineTo(cx + 12, cy + 8); g.stroke();
    } else if (mode === 'closed') {
      g.fillRect(cx - Q / 2, cy - 3, Q, 6);
    } else {
      const [w, h] = { wide: [28, 62], squint: [Q, 14], shake: [Q, QH], stare: [Q, QH], normal: [Q, QH], small: [14, 24] }[mode] || [Q, QH];
      const hh = h * (1 - blink);
      g.fillRect(cx - w / 2 + jx, cy - hh / 2 + jy, w, Math.max(4, hh));
    }
  });
  g.restore();
}

function roundRectPath(x, y, w, h, r) { const p = new Path2D(); p.roundRect(x, y, w, h, r); return p; }

// Where a point in Clawd's local grid lands on the stage (for props held in the nubs).
function clawdToStage(p, lx, ly) {
  const a = (p.lean || 0) * Math.PI / 180, x = lx * (p.sx ?? 1), y = ly * (p.sy ?? 1);
  return [p.x + x * Math.cos(a) - y * Math.sin(a), p.y + x * Math.sin(a) + y * Math.cos(a)];
}
