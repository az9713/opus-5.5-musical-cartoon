# Clawd "Mannered Prose" video — tasks

## Preflight (done 2026-09-24)
- [x] Node v22.22.0, npm 9.9.4
- [x] ffmpeg 7.1.1 + ffprobe at `~/AppData/Local/Microsoft/WinGet/Links/` (not on Bash PATH — use absolute path)
- [x] System Chrome + puppeteer-core 24: WebGL on the local GPU (ANGLE D3D11)
- [x] p5 2.2 + p5.brush 2.2.3 render a watercolor frame at 1920×1080 (scratchpad smoke test)
- [x] ffmpeg encodes 1920×1080, 24 fps, H.264 yuv420p
- [x] Clawd colour confirmed in local `claude.exe`: `clawd_body: rgb(215,119,87)`
- [x] Clawd block-art pieces found in local binary (`█████`, `▘▘ ▝▝`, `▝▝ ▝▝`)
- [x] Reference repo aadil6971/clawd-video reachable (engine, pixel rig, synth audio)
- [ ] Pixabay key — NOT found in process, User or Machine env
- [x] Pixabay API has no music/SFX endpoint (`/api/music/` → 404; docs list only `/api/` and `/api/videos/`)

## Open decisions (the owner)
- [x] Audio source → all-code synth (music + SFX)
- [x] Storyboard density → keep 15 s, merge small beat-2 gags into overlapping chaos
- [x] Engine → write from scratch; repo is reference only

## Plan
- [x] `implementation-plan.html` (+ `plan-smoke-frame.png`) — explainer and step-by-step build plan
- [ ] Compare hand-decoded Clawd grid with the live terminal logo (not done; the owner chose option A)

## Build (done 2026-09-24, one run, the owner chose option A)
- [x] Phase 1: pipeline proof: 360 frames, 24/1, 1920x1080, 15.000 s (test scene 120 ms/frame; full scene ~1 s/frame)
- [x] Phase 2: sprites painted with p5.brush (`out/assets.png`); seeded, frame 0 byte-identical across 2 renders
- [x] Phase 3: Clawd rig + 8 poses (`out/poses.png`); mean colour 215,119,87
- [x] Phase 4: 5 beats animated, stills read after each beat
- [x] Phase 5: `score.mjs` synth: peak -1.0 dBFS, mean -14.5 dB, 12.3-13.0 s silent (-91 dB), 720,000 samples
- [x] Phase 6: full render with audio: h264 yuv420p bt709 + aac, both 15.000 s
- [x] Phase 7: contact sheet, key stills, motion check; fixed the visual errors listed in HANDOFF
- [x] Phase 8: README, frames deleted
- [ ] The owner: watch and listen to `clawd-prose/out/clawd-prose.mp4` (timing and sound are not verified by a person)
- [ ] Compare hand-decoded Clawd grid with the live terminal logo (still open)
