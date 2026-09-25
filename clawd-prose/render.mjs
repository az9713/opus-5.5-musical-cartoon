// render.mjs: local server + headless Chrome + frame capture + FFmpeg.
// Usage:
//   node render.mjs                 all 360 frames -> out/video.mp4 (+ score.wav -> out/clawd-prose.mp4)
//   node render.mjs --stills 1.3,5.5   single frames -> out/stills/t_1.300.png
//   node render.mjs --sheet assets     painted sprite sheet -> out/assets.png
//   node render.mjs --sheet poses      Clawd pose sheet -> out/poses.png
//   node render.mjs --from 72 --to 167 frame range only, no encode
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, 'out');
const PORT = 8765, W = 1920, H = 1080, FPS = 24, N = 360;
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BIN = path.join(process.env.USERPROFILE || process.env.HOME, 'AppData/Local/Microsoft/WinGet/Links');
const FFMPEG = path.join(BIN, 'ffmpeg.exe'), FFPROBE = path.join(BIN, 'ffprobe.exe');

const args = process.argv.slice(2);
const arg = (k) => { const i = args.indexOf(k); return i < 0 ? null : args[i + 1]; };
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.map': 'application/json' };

const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { if (!req.url.includes('favicon')) console.log('[404]', req.url); res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise((ok, fail) => {
  server.once('error', (e) => fail(e.code === 'EADDRINUSE' ? new Error(`Port ${PORT} is in use. Stop that program or change PORT.`) : e));
  server.listen(PORT, ok);
});

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new',
  args: ['--use-angle=d3d11', '--enable-webgl', '--ignore-gpu-blocklist', `--window-size=${W},${H}`],
  defaultViewport: { width: W, height: H, deviceScaleFactor: 1 },
});
try {
  const page = await browser.newPage();
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warn') console.log('[page]', m.text()); });
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  const t0 = Date.now();
  await page.goto(`http://localhost:${PORT}/index.html?render`);
  await page.waitForFunction('window.READY === true', { timeout: 180000, polling: 100 });
  console.log(`assets painted in ${Date.now() - t0} ms`);
  const clip = { x: 0, y: 0, width: W, height: H };
  const shot = (file) => page.screenshot({ path: file, clip, type: 'png' });

  const sheet = arg('--sheet'), stills = arg('--stills');
  if (args.includes('--motion')) {
    const pops = await page.evaluate(() => window.motionCheck());
    console.log(pops.length ? pops.join('\n') : 'motion check: no pops');
  } else if (sheet) {
    await page.evaluate((s) => window.drawSheet(s), sheet);
    await shot(path.join(OUT, `${sheet}.png`));
    console.log(`wrote out/${sheet}.png`);
  } else if (stills) {
    const dir = path.join(OUT, 'stills'), files = [];
    fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    for (const t of stills.split(',').map(Number)) {
      await page.evaluate((i) => window.renderFrame(i), Math.round(t * FPS));
      files.push(path.join(dir, `t_${t.toFixed(3)}.png`)); await shot(files.at(-1));
    }
    // one tiled overview (3 columns) so a whole beat can be read as one image
    fs.writeFileSync(path.join(dir, 'list.txt'), files.map((f) => `file '${f.replaceAll('\\', '/')}'`).join('\n'));
    run(FFMPEG, ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(dir, 'list.txt'),
      '-vf', `scale=640:-1,tile=3x${Math.ceil(files.length / 3)}`, '-frames:v', '1', path.join(OUT, 'stills.png')]);
    console.log(`wrote ${files.length} stills to out/stills/ and out/stills.png`);
  } else {
    const from = Number(arg('--from') ?? 0), to = Number(arg('--to') ?? N - 1);
    const dir = path.join(OUT, 'frames');
    fs.mkdirSync(dir, { recursive: true });
    const r0 = Date.now();
    for (let i = from; i <= to; i++) {
      await page.evaluate((k) => window.renderFrame(k), i);
      await shot(path.join(dir, `f_${String(i).padStart(4, '0')}.png`));
    }
    const ms = (Date.now() - r0) / (to - from + 1);
    console.log(`${to - from + 1} frames, ${ms.toFixed(0)} ms per frame`);
    if (from === 0 && to === N - 1) encode();
  }
} finally {
  await browser.close();
  server.close();
}

function run(bin, a) { execFileSync(bin, a, { stdio: ['ignore', 'inherit', 'inherit'] }); }
function encode() {
  const video = path.join(OUT, 'video.mp4');
  run(FFMPEG, ['-y', '-v', 'error', '-framerate', String(FPS), '-i', path.join(OUT, 'frames', 'f_%04d.png'),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p',
    '-vf', 'scale=out_color_matrix=bt709:out_range=tv',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
    '-movflags', '+faststart', video]);
  let final = video;
  const wav = path.join(OUT, 'score.wav');
  if (fs.existsSync(wav)) {
    final = path.join(OUT, 'clawd-prose.mp4');
    run(FFMPEG, ['-y', '-v', 'error', '-i', video, '-i', wav, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
      '-t', '15', '-movflags', '+faststart', final]);
  }
  run(FFPROBE, ['-v', 'error', '-count_frames', '-show_entries',
    'stream=codec_name,width,height,pix_fmt,r_frame_rate,nb_read_frames,duration', '-of', 'compact', final]);
}
