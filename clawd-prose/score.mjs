// score.mjs: the whole soundtrack, synthesized in code. No samples, no library.
// Reads the same cues.json as the picture, so every hit lands on its frame. Writes out/score.wav (48 kHz, mono, 16-bit).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const C = JSON.parse(fs.readFileSync(path.join(ROOT, 'cues.json'), 'utf8'));
const SR = 48000, N = SR * 15;                    // 720,000 samples; 1 video frame = 2,000 samples
const mix = new Float32Array(N);
const TAU = Math.PI * 2;
const hz = (m) => 440 * 2 ** ((m - 69) / 12);
let seed = 12345;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 * 2 - 1; };

// generic voice: freq can be a number or a function of time; env is attack/decay-to-zero or ADSR
function voice(t0, dur, freq, amp, { wave = 'sine', a = 0.005, d = 0, sus = 1, r = 0.05, lp = 0, vib = 0 } = {}) {
  const s0 = Math.round(t0 * SR), n = Math.round((dur + r) * SR);
  let ph = 0, y = 0;
  for (let i = 0; i < n && s0 + i < N; i++) {
    const t = i / SR, f = (typeof freq === 'function' ? freq(t) : freq) * (1 + vib * Math.sin(TAU * 5.5 * t));
    ph = (ph + f / SR) % 1;
    let w = wave === 'saw' ? 2 * ph - 1 : wave === 'square' ? (ph < 0.5 ? 1 : -1) : wave === 'tri' ? 4 * Math.abs(ph - 0.5) - 1 : wave === 'noise' ? rnd() : Math.sin(TAU * ph);
    if (lp) { y += lp * (w - y); w = y; }
    let env = t < a ? t / a : d ? Math.max(sus, Math.exp(-(t - a) / d)) : 1;
    if (t > dur) env *= Math.max(0, 1 - (t - dur) / r);
    if (s0 + i >= 0) mix[s0 + i] += amp * w * env;
  }
}
// plucked or struck note: exponential decay
const pluck = (t0, midi, amp, decay = 0.35, wave = 'sine', lp = 0) => voice(t0, decay * 3, hz(midi), amp, { wave, a: 0.003, d: decay, sus: 0, r: 0.02, lp });
const musicBox = (t0, midi, amp) => { pluck(t0, midi, amp, 0.4); pluck(t0, midi + 12, amp * 0.25, 0.15); pluck(t0, midi + 19, amp * 0.08, 0.08); };
const harpsi = (t0, midi, amp) => pluck(t0, midi, amp, 0.18, 'saw', 0.25);
const tuba = (t0, midi, amp, dur = 0.22) => voice(t0, dur, hz(midi), amp, { wave: 'saw', a: 0.02, r: 0.06, lp: 0.03 });
const noise = (t0, dur, amp, lp = 0.3, a = 0.002) => voice(t0, dur, 1, amp, { wave: 'noise', a, d: dur / 3, sus: 0, r: 0.01, lp });
const sweep = (t0, dur, f0, f1, amp, wave = 'sine') => voice(t0, dur, (t) => f0 * (f1 / f0) ** (t / dur), amp, { wave, a: 0.005, r: 0.03 });
const click = (t0, amp = 0.12) => noise(t0, 0.012, amp, 0.8);
const thud = (t0, amp = 0.6) => { amp *= 0.45; sweep(t0, 0.18, 120, 45, amp); noise(t0, 0.1, amp * 0.8, 0.08); };
const ding = (t0, amp = 0.25) => { pluck(t0, 88, amp, 0.5); pluck(t0, 95, amp * 0.5, 0.4); };

// ---------------- music ----------------
// 0.0–1.2 "innocent" music-box motif, C major, 120 bpm eighths
[[0, 72], [0.25, 76], [0.5, 79], [0.75, 76], [1.0, 72]].forEach(([t, m]) => musicBox(t, m, 0.22));
// 1.2 the freeze: music stops, low two-note sting
tuba(C.freeze, 36, 0.35, 0.2); tuba(C.freeze + 0.22, 30, 0.35, 0.35);

// 3.0–10.0 pompous Victorian march: oom-pah tuba + harpsichord arpeggios
const chords = [[48, [60, 64, 67]], [43, [59, 62, 67]], [41, [60, 65, 69]], [43, [59, 62, 67]]];   // C G F G
for (let bar = 0; bar < 7; bar++) {
  const t0 = C.transform + bar * 1.0, [bass, ch] = chords[bar % 4], vol = t0 >= C.pile ? 0.5 : 1;
  if (t0 >= C.card[0]) break;
  for (let b = 0; b < 2; b++) {
    tuba(t0 + b * 0.5, b ? bass + 7 : bass, 0.3 * vol);                         // oom
    ch.forEach((m) => harpsi(t0 + b * 0.5 + 0.25, m, 0.07 * vol));               // pah
  }
  const step = t0 >= C.typeFast && t0 < C.pile ? 0.125 : 0.25;                 // notes double in speed at 5.5 s
  for (let k = 0, t = t0; t < t0 + 1 - 1e-6; k++, t += step) {
    if (t >= C.compress[0] && t < C.compress[0] + 0.4) continue;                // room for the compressed melody
    harpsi(t, ch[k % 3] + 12, 0.08 * vol);
  }
}
// 8.1 "same content, compressed": the march melody at double speed, one octave up, in 0.4 s
[72, 76, 79, 76, 77, 81, 84, 79].forEach((m, k) => harpsi(C.compress[0] + k * 0.05, m + 12, 0.1));

// 10.0 heavenly choir chord: stacked sines with slow vibrato
[60, 64, 67, 72, 76].forEach((m) => voice(C.card[0], 1.0, hz(m), 0.07, { a: 0.25, r: 0.4, vib: 0.006 }));

// 13.0–14.4 the motif comes back, happy
[[13.2, 72], [13.35, 76], [13.5, 79], [13.65, 84], [13.8, 79], [13.95, 84], [14.1, 88]].forEach(([t, m]) => musicBox(t, m, 0.18));
// 14.4 one soft resolved C under "Be direct."
voice(C.beDirect, 0.45, hz(60), 0.14, { a: 0.03, r: 0.07 }); voice(C.beDirect, 0.45, hz(72), 0.07, { a: 0.03, r: 0.07 });

// ---------------- sound effects ----------------
sweep(C.bubble1, 0.08, 400, 900, 0.25);                                          // bubble pop
for (let k = 0; k < 10; k++) click(C.type1[0] + k * 0.05);                         // key clicks
for (let k = 0; k < 6; k++) click(C.del1[0] + k * 0.05, 0.09);                    // backspace
voice(C.bowtie[0], 0.3, 1, 0.08, { wave: 'noise', a: 0.05, r: 0.05, lp: 0.05 });  // cloth rustle
click(C.crack, 0.4); click(C.crack + 0.09, 0.4);                                  // knuckle crack
for (let k = 0; k < 6; k++) click(C.switchRise + k * 0.03, 0.15);                 // ratchet
thud(C.switchPull, 0.35); noise(C.switchPull, 0.25, 0.15, 0.9);                  // clunk + spark
sweep(C.transform, 0.3, 200, 1200, 0.12, 'noise'); noise(C.transform, 0.3, 0.3, 0.15);
[0.3, 0.38].forEach((d) => pluck(C.transform + d, 50, 0.25, 0.08, 'square', 0.2)); // gear clanks
sweep(C.feed[1] - 0.15, 0.15, 900, 300, 0.1, 'noise');                           // paper swish
for (let t = C.shake; t < C.pile; t += 1 / 11) noise(t, 0.05, 0.07, 0.2);         // machine rattle, 11 Hz
for (let t = C.shake; t < C.pile; t += 0.3) noise(t, 0.2, 0.05, 0.9, 0.03);       // steam hiss
thud(C.beam, 0.8);                                                                 // beam thud
for (let t = C.seams[0]; t < C.seams[1]; t += 1 / 30) noise(t, 0.012, 0.06, 0.6);  // stitch zip
pluck(C.wedge, 96, 0.2, 0.12); pluck(C.wedge, 103, 0.1, 0.1);                    // hammer tink
for (let t = C.dashes[0]; t < C.dashes[1]; t += 0.35) sweep(t, 0.3, 300, 1400, 0.05, 'noise'); // boomerang whoosh
for (let t = C.quietly[0]; t < C.quietly[1]; t += 0.1) pluck(t, 91 + ((t * 10) % 2 > 1 ? 2 : 0), 0.04, 0.04); // tiptoe
C.bullets.forEach((t) => { pluck(t, 84, 0.08, 0.05, 'square', 0.4); pluck(t + 0.07, 88, 0.08, 0.05, 'square', 0.4); });
thud(C.pile, 0.6); noise(C.pile, 0.3, 0.2, 0.2);                                   // paper avalanche
ding(C.bubble2, 0.18);                                                             // user message ping
thud(C.slam, 0.9); noise(C.slam, 0.08, 0.4, 0.6);                                  // slam
sweep(C.compress[0], 0.35, 1200, 200, 0.12, 'saw');                                // compressor zip
thud(C.stamp, 0.6); click(C.stamp, 0.3);                                           // stamp thunk
C.glasses.forEach((t, k) => { click(t, 0.25); pluck(t, 84 + k * 5, 0.08, 0.05); }); // 3 glasses clicks, rising
thud(C.card[1], 0.4);                                                              // card lands
voice(C.siren[0], C.siren[1] - C.siren[0], (t) => 900 - 300 * Math.cos(TAU * 2 * t), 0.13, { wave: 'tri', a: 0.05, r: 0.05 }); // siren 600–1200 Hz, 2×/s
voice(C.vacuum[0], C.vacuum[1] - C.vacuum[0], 1, 0.7, { wave: 'noise', a: 0.2, r: 0.1, lp: 0.12 });   // vacuum roar
C.suck.forEach((t, k) => sweep(t, 0.12, 500 + k * 90, 1500 + k * 200, 0.07));                          // one fwip per word
sweep(C.send, 0.2, 300, 1500, 0.1, 'noise');                                       // send whoosh
ding(C.thumbs, 0.28);                                                              // thumbs-up ding
sweep(C.astonished, 0.18, 300, 900, 0.12, 'tri');                                  // boing
for (let k = 0; k < 9; k++) click(C.type3[0] + k * 0.05);                          // key clicks
voice(C.vac2 - 0.08, 0.5, 1, 0.7, { wave: 'noise', a: 0.05, r: 0.08, lp: 0.15 }); // vacuum again
sweep(C.vac2 + 0.08, 0.14, 300, 2200, 0.16); sweep(C.gone - 0.02, 0.06, 900, 200, 0.12); // fwip + pop

// ---------------- mix ----------------
for (let i = 0; i < N; i++) mix[i] = Math.tanh(mix[i] * 1.2);                    // soft limit
let peak = 0; for (const v of mix) peak = Math.max(peak, Math.abs(v));
const g = 10 ** (-1 / 20) / peak;                                                 // loudest point = −1 dBFS
for (let i = 0; i < N; i++) mix[i] *= g;
// hard silence 12.3–13.0 s and after 14.92 s, each edge faded over 10 ms to prevent a click
const gate = (i) => { const t = i / SR, f = 0.01;
  const inS = (a, b) => (t >= a && t < b ? 0 : t >= a - f && t < a ? (a - t) / f : t >= b && t < b + f ? (t - b) / f : 1);
  return inS(C.silence[0], C.silence[1]) * (t >= C.black ? 0 : t >= C.black - f ? (C.black - t) / f : 1); };
for (let i = 0; i < N; i++) mix[i] *= gate(i);

const buf = Buffer.alloc(44 + N * 2);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 2, 4); buf.write('WAVE', 8); buf.write('fmt ', 12);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22); buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 2, 40);
for (let i = 0; i < N; i++) buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, mix[i])) * 32767), 44 + i * 2);
fs.mkdirSync(path.join(ROOT, 'out'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'out', 'score.wav'), buf);
console.log(`wrote out/score.wav: ${N} samples, ${N / SR} s, gain ${g.toFixed(2)}`);
