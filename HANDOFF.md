# HANDOFF — resume point for the Clawd "Mannered Prose" video

**Read this first in each new session. Then read `TASKS.md` (checklist) and `implementation-plan.html` (the full spec).**
There is no project `CLAUDE.md`. The global `~/.claude/CLAUDE.md` rules apply (ASD-STE100 replies, dark HTML).
This folder is not a git repo, so there are no commit hashes. The state is the files listed below.

## Current state (2026-09-24)
- Preflight: done. All checks passed (see `TASKS.md` → Preflight).
- The owner's 3 decisions (2026-09-24):
  1. Audio: all-code synth, music and SFX. Pixabay has no audio API, and no Pixabay key is set.
  2. Length: exactly 15 s. The beat-2 gags overlap.
  3. Engine: written from scratch. The repo `aadil6971/clawd-video` is reference only. Copy no code from it.
- Plan: done. `implementation-plan.html` (+ `plan-smoke-frame.png`).
- Build: DONE (2026-09-24), all 8 phases in one run. Deliverable: `clawd-prose/out/clawd-prose.mp4`. Source + README in `clawd-prose/`.
- Check images kept in `clawd-prose/out/`: `sheet.png` (contact sheet), `assets.png`, `poses.png`, `wave.png`.

## Fixes made during the check passes (phase 2–7)
Paper-colour paint background (pigment mixes with it); brush scale 3→6; glasses/face line art moved to 2D; ribbon letters were reversed; wedge and hammer made larger and moved; key/UNLOCK tag moved off the paragraph; "..." moved off the beam; magnifier centred on the eye; vacuum nozzle tilted so its label is on screen; pulled-by-vacuum pose made smaller; raised "finger" made longer; grain 0.5→0.35; screen text hidden while the machine is out; lever fades as the switch sinks; last suck cue 11.90→11.86; Clawd moved to x 1530 so the switch/button show; arm follow-through (3-frame blend); lean + squash eased at the 12.05 s landing.
Remaining pose jumps (motion check) are deliberate impacts: 2.79 s lever pull, 3.33 s hop landing, 8.08 s slam, 8.46 s stamp grab, 14.21–14.38 s vacuum grab.

## Development journey
- `DEVELOPMENT-JOURNEY.html` (images in `journey/`) documents sessions 1–3. It found new evidence on the grid: the saved terminal text in `.ignore/cc1_cartoon.txt` shows a different logo (`▐▛███▛█ / ▝▜██████▀ / ▝▝ ▝▝`, grid B in the doc).

## Next task
- The owner watches and listens to the MP4. Apply his notes. Most timing changes are one number in `cues.json` (picture and sound both read it).
- Open: the Clawd grid was never compared with the live terminal logo.
- Re-render: `cd clawd-prose && node score.mjs && node render.mjs` (about 6 min).

## Where to read things (open them, do not re-derive)
- `implementation-plan.html`: all specs. Section 7 has the shot list with frame numbers, section 8 the score and SFX cue times, section 10 the file layout and phases, section 11 the pitfalls.
- `TASKS.md`: the checklist. Tick items as you go.
- `my_storyboard.txt`: the storyboard. Its beat times are fixed.
- `my_prompts.txt` and `README.txt`: the original prompt, and notes on the reference video.

## Session-transient scratch (gone after clear; regenerate if needed)
- The scratchpad `pf/` folder had a smoke test:
  - `index.html`: WEBGL p5 with `brush.load()`, `brush.fill` / `fillBleed` / `fillTexture` / `rect`, `brush.set('pen')`, `brush.wash`.
  - `t.mjs`: a Node http server plus puppeteer-core with `executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'`, `headless: 'new'`, args `--use-angle=d3d11 --enable-webgl --ignore-gpu-blocklist`. It takes an element screenshot of the canvas.
  - The durable record of the test is `plan-smoke-frame.png`.

## How to work (essentials)
- FFmpeg is not on the Bash PATH. Use `~/AppData/Local/Microsoft/WinGet/Links/ffmpeg.exe` (and `ffprobe.exe`).
- Each frame is a pure function of `t = i/24`. Paint the p5.brush assets one time and seed them with `brush.seed(n)`.
- End each multi-part reply with the headings Blocked on me / Changed / Found. Keep `TASKS.md` current.
