# Clawd: Mannered Prose

A 15-second cartoon that stars Clawd, the Claude Code mascot. Code makes every pixel and every sound. The project uses no animation program, no video editor and no stock audio.

Output: `out/clawd-prose.mp4`. The video is 1920×1080, 24 fps, 360 frames and 15.000 s. It has H.264 yuv420p video with bt709 colour tags and AAC audio.

## Run it (3 commands)

```
npm install
node score.mjs
node render.mjs
```

1. `npm install` installs p5 2.2, p5.brush 2.2.3 and puppeteer-core 25.
2. `node score.mjs` synthesizes the soundtrack and writes `out/score.wav` (48 kHz, 720,000 samples).
3. `node render.mjs` paints the sprites, captures 360 frames in headless Chrome, encodes the video, adds `out/score.wav` and prints the ffprobe result. A full render takes about 6 minutes (about 1 s per frame).

Requirements: Node 22, Google Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe`, and FFmpeg at `%USERPROFILE%/AppData/Local/Microsoft/WinGet/Links/ffmpeg.exe`. To use other paths, change `CHROME` and `BIN` at the top of `render.mjs`. Port 8765 must be free.

## Check tools

| Command | Output |
|---|---|
| `node render.mjs --stills 1.4,5.5,8.6` | Single frames at those times, in `out/stills/`, plus one tiled `out/stills.png` |
| `node render.mjs --sheet assets` | `out/assets.png`, all painted sprites |
| `node render.mjs --sheet poses` | `out/poses.png`, 8 Clawd poses. It also logs Clawd's mean colour (target 215,119,87) |
| `node render.mjs --motion` | A list of pose jumps between two frames larger than a set limit |
| `node render.mjs --from 72 --to 167` | Only that frame range, with no encode |

Preview in a browser: serve this folder with any static server (for example `npx serve`), then open `index.html`. The page does not play by itself. Call `renderFrame(i)` in the console to show frame i.

## Files

| File | What it does |
|---|---|
| `cues.json` | Every cue time in seconds. The picture and the sound both read it. Move a cue here and the picture and sound move together. |
| `paint.js` | Paints each watercolor sprite one time with p5.brush (one seed per sprite, so every render is identical). Then it cuts each sprite out along its shape. |
| `scene.js` | Part 1: the sprite paintings. Part 2: the stage. `renderFrame(i)` draws frame i as a pure function of t = i/24. |
| `clawd.js` | The pixel grid decoded from the terminal logo, and the drawing code for the eyes, arms and squash. |
| `render.mjs` | Local server, headless Chrome, frame capture, FFmpeg, ffprobe. |
| `score.mjs` | The synthesizer: music box, tuba, harpsichord, choir, siren, vacuum and about 30 sound effects. It writes a WAV file with no library. |

## Known limits

- The Clawd grid was decoded by hand from `▐▛███▜▌ / ▝▜█████▛▘ / ▘▘ ▝▝`. It was not compared with the logo in a live terminal.
- Fonts come from the machine that renders (Georgia, Consolas). On another OS the text can look different.
- The sound was checked only as numbers and a waveform picture: peak −1.0 dBFS, mean −14.5 dB, and zero from 12.3 s to 13.0 s. No person has listened to it yet.
