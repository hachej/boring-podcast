#!/usr/bin/env python3
"""
Live control panel for AI Engineering Podcast OBS scene.

Run: uv run obs_live_control.py
  → Control panel: http://localhost:8080
  → Topic ticker:  http://localhost:8080/overlay/ticker  (OBS browser source)
"""

import sys
import threading
import uvicorn
import obsws_python as obs
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse

OBS_HOST = "localhost"
OBS_PORT = 4455
OBS_PASS = ""
SERVER_PORT = 8080

app = FastAPI()

# ── Live state ────────────────────────────────────────────────────────────────
SCENE_GUEST = "AI Eng Podcast — Guest"
SCENE_SOLO  = "AI Eng Podcast — Solo"

state = {
    "episode":     "S01E14",
    "guest_name":  "GUEST NAME",
    "guest_title": "Co-founder & CEO",
    "theme":       "CURRENT THEME",
    "topics":      ["AI agents", "Claude 4", "Tokenmaxxing", "Prompt caching"],
    "mode":        "guest",
}

obs_client = None


def obs_set_text(name, value):
    if obs_client is None:
        return
    try:
        obs_client.set_input_settings(name, {"text": value}, True)
    except Exception as e:
        print(f"  OBS '{name}': {e}")


# ── Rolling ticker HTML ───────────────────────────────────────────────────────

def _ticker_html(topics):
    return """\
<!DOCTYPE html>
<html>
<head>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
html, body {
  background: transparent;
  overflow: hidden;
  height: 52px;
  width: 100%;
}
.scroller {
  width: 100%;
  height: 52px;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.track {
  display: flex;
  white-space: nowrap;
  will-change: transform;
  animation: march 40s linear infinite;
}
.copy {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding-right: 0;
}
.item {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.3px;
  white-space: nowrap;
  padding: 0 4px;
}
.bullet {
  display: inline-block;
  font-size: 14px;
  color: #9D3374;
  padding: 0 26px;
  white-space: nowrap;
  position: relative;
  top: -1px;
}
@keyframes march {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-50%, 0, 0); }
}
</style>
</head>
<body>
<div class="scroller">
  <div class="track" id="ticker"></div>
</div>
<script>
const PIXELS_PER_SEC = 90;  // scroll speed (consistent across topic counts)
const BULLET = '<span class="bullet">&#9670;</span>';

function buildCopy(topics) {
  const items = topics.map(t => `<span class="item">${t}</span>`).join(BULLET);
  return '<div class="copy">' + items + BULLET + '</div>';
}

function nextFrame() {
  return new Promise(r => requestAnimationFrame(r));
}

async function load() {
  const s = await fetch('/state').then(r => r.json());
  const topics = s.topics && s.topics.length ? s.topics : ['—'];
  const track = document.getElementById('ticker');

  // Inflate the topics list so ONE rendered copy is wider than the viewport.
  // With one copy >= viewport, two copies in the track give continuous content
  // through the whole -50% scroll → no visible gap.
  let multiplied = topics.slice();
  track.innerHTML = buildCopy(multiplied) + buildCopy(multiplied);
  await nextFrame();

  const viewport = window.innerWidth || 1920;
  let copyEl = track.querySelector('.copy');
  let copyWidth = copyEl ? copyEl.offsetWidth : 0;

  let guard = 0;
  while (copyWidth > 0 && copyWidth < viewport && guard < 12) {
    multiplied = multiplied.concat(topics);
    track.innerHTML = buildCopy(multiplied) + buildCopy(multiplied);
    await nextFrame();
    copyEl = track.querySelector('.copy');
    copyWidth = copyEl ? copyEl.offsetWidth : 0;
    guard++;
  }

  const duration = Math.max(10, copyWidth / PIXELS_PER_SEC);
  track.style.animation = 'none';
  void track.offsetWidth;  // force reflow → restart animation cleanly
  track.style.animation = `march ${duration}s linear infinite`;
}
load();
setInterval(load, 5000);
</script>
</body>
</html>"""


# ── Control panel HTML ────────────────────────────────────────────────────────

CONTROL_HTML = """\
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AI Eng Podcast — Live Control</title>
<style>
* { box-sizing:border-box; margin:0; padding:0; }
body {
  background:#12081A; color:#fff;
  font-family:Arial,sans-serif;
  padding:20px; max-width:600px; margin:0 auto;
}
h1 { color:#9D3374; font-size:22px; margin-bottom:4px; }
.sub { color:#555; font-size:13px; margin-bottom:24px; }
label {
  display:block; color:#9D3374; font-size:11px;
  font-weight:700; text-transform:uppercase;
  letter-spacing:1px; margin-bottom:6px; margin-top:18px;
}
input, textarea {
  width:100%; padding:10px 14px;
  background:#1E0B28; border:2px solid #3A1A4A;
  color:#fff; font-size:16px; border-radius:8px; outline:none;
}
input:focus, textarea:focus { border-color:#9D3374; }
textarea { height:80px; resize:vertical; font-size:14px; }
button {
  width:100%; margin-top:24px; padding:16px;
  background:#9D3374; color:#fff; font-size:18px;
  font-weight:900; border:none; border-radius:8px;
  cursor:pointer; text-transform:uppercase; letter-spacing:2px;
}
button:hover { background:#B83C88; }
button:active { background:#7A285A; }
.mode-row { display:flex; gap:10px; margin-top:8px; }
.mode-row button {
  margin:0; flex:1; padding:14px 8px; font-size:14px;
  background:#1E0B28; color:#9D3374; border:2px solid #3A1A4A;
  letter-spacing:1.5px;
}
.mode-row button.active {
  background:#9D3374; color:#fff; border-color:#9D3374;
}
.mode-row button:hover { border-color:#9D3374; }
.toast {
  margin-top:10px; padding:10px 14px; border-radius:8px;
  font-size:14px; text-align:center;
  opacity:0; transition:opacity .3s;
}
.toast.show { opacity:1; }
.toast.ok  { background:#0A2A15; color:#00CC66; border:1px solid #00CC66; }
.toast.err { background:#2A0A0A; color:#FF4444; border:1px solid #FF4444; }
.preview { margin-top:14px; padding:10px 14px; background:#1E0B28; border-radius:8px; font-size:13px; }
.pill {
  display:inline-block; background:#14090F; color:#fff;
  font-size:13px; font-weight:700; padding:3px 10px;
  border-radius:6px; margin:2px 4px 2px 0; border:1.5px solid #9D3374;
}
hr { border:none; border-top:1px solid #2A1A3A; margin:20px 0; }
</style>
</head>
<body>
<h1>🎙 Live Control</h1>
<p class="sub">Updates OBS instantly via WebSocket + browser source polling.</p>

<label>Scene Mode</label>
<div class="mode-row">
  <button id="mode-guest" onclick="setMode('guest')">With Guest</button>
  <button id="mode-solo"  onclick="setMode('solo')">Solo / Screen</button>
</div>

<hr>

<label>Episode</label>
<input id="episode" type="text" placeholder="S01E14">

<hr>

<label>Guest Name</label>
<input id="guest_name" type="text" placeholder="Sam Altman">

<label>Guest Title / Role</label>
<input id="guest_title" type="text" placeholder="CEO, OpenAI">

<hr>

<label>Current Theme <span style="color:#555;font-weight:400">(shown big in bottom bar)</span></label>
<input id="theme" type="text" placeholder="AI AGENTS AT SCALE">

<label>All Session Topics <span style="color:#555;font-weight:400">(one per line — rolling ticker)</span></label>
<textarea id="topics" placeholder="AI agents&#10;Claude 4&#10;Tokenmaxxing&#10;Prompt caching"></textarea>

<button onclick="doUpdate()">Update Overlay</button>
<div class="toast" id="toast"></div>

<div class="preview">
  <div style="color:#555;font-size:11px;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px">Topic ticker preview</div>
  <div id="preview"></div>
</div>

<script>
async function loadState() {
  const s = await fetch('/state').then(r => r.json());
  document.getElementById('episode').value    = s.episode;
  document.getElementById('guest_name').value  = s.guest_name;
  document.getElementById('guest_title').value = s.guest_title;
  document.getElementById('theme').value       = s.theme;
  document.getElementById('topics').value      = s.topics.join('\\n');
  renderPreview(s.topics);
  highlightMode(s.mode || 'guest');
}

function highlightMode(mode) {
  document.getElementById('mode-guest').classList.toggle('active', mode === 'guest');
  document.getElementById('mode-solo').classList.toggle('active', mode === 'solo');
}

async function setMode(mode) {
  highlightMode(mode);
  const r = await fetch('/scene', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({mode}),
  });
  const toast = document.getElementById('toast');
  toast.className = 'toast show ' + (r.ok ? 'ok' : 'err');
  toast.textContent = r.ok ? `✓ Switched to ${mode}` : '✗ Mode switch failed';
  setTimeout(() => toast.className = 'toast', 2000);
}

function renderPreview(topics) {
  document.getElementById('preview').innerHTML =
    topics.map(t => `<span class="pill">${t}</span>`).join('');
}

document.getElementById('topics').addEventListener('input', () => {
  const topics = document.getElementById('topics').value
    .split('\\n').map(t => t.trim()).filter(Boolean);
  renderPreview(topics);
});

async function doUpdate() {
  const body = {
    episode:     document.getElementById('episode').value.trim(),
    guest_name:  document.getElementById('guest_name').value.trim(),
    guest_title: document.getElementById('guest_title').value.trim(),
    theme:       document.getElementById('theme').value.trim(),
    topics:      document.getElementById('topics').value
                   .split('\\n').map(t => t.trim()).filter(Boolean),
  };

  const r = await fetch('/update', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  });

  const toast = document.getElementById('toast');
  toast.className = 'toast show ' + (r.ok ? 'ok' : 'err');
  toast.textContent = r.ok ? '✓ Overlay updated' : '✗ Update failed';
  renderPreview(body.topics);
  setTimeout(() => toast.className = 'toast', 2500);
}

loadState();
</script>
</body>
</html>
"""


# ── API routes ────────────────────────────────────────────────────────────────

@app.get("/", response_class=HTMLResponse)
def control_panel():
    return CONTROL_HTML


@app.get("/overlay/ticker", response_class=HTMLResponse)
def overlay_ticker():
    return _ticker_html(state["topics"])


@app.get("/state")
def get_state():
    return JSONResponse(state)


@app.post("/scene")
async def set_scene(request: Request):
    body = await request.json()
    mode = body.get("mode", "guest")
    scene_name = SCENE_GUEST if mode == "guest" else SCENE_SOLO
    state["mode"] = mode
    if obs_client is None:
        return {"ok": False, "error": "OBS not connected"}
    try:
        obs_client.set_current_program_scene(scene_name)
        return {"ok": True, "mode": mode, "scene": scene_name}
    except Exception as e:
        return {"ok": False, "error": str(e)}


@app.post("/update")
async def update(request: Request):
    body = await request.json()

    state["episode"]     = body.get("episode",     state["episode"]).strip()
    state["guest_name"]  = body.get("guest_name",  state["guest_name"]).strip()
    state["guest_title"] = body.get("guest_title", state["guest_title"]).strip()
    state["theme"]       = body.get("theme",        state["theme"]).strip()
    state["topics"]      = [t.strip() for t in body.get("topics", state["topics"]) if t.strip()]

    def push():
        obs_set_text("Episode",          state["episode"])
        obs_set_text("Guest Name Text",  state["guest_name"])
        obs_set_text("Guest Title Text", state["guest_title"])
        obs_set_text("Current Theme",    state["theme"])
        # Host Names includes episode — update it too
        obs_set_text("Host Names",
                     f"CHRISTOPHE BLEFARI  ·  JULIEN HURAULT  ·  {state['episode']}")

    threading.Thread(target=push, daemon=True).start()
    return {"ok": True, "state": state}


# ── Startup ───────────────────────────────────────────────────────────────────

def main():
    global obs_client
    print("Connecting to OBS…")
    try:
        obs_client = obs.ReqClient(host=OBS_HOST, port=OBS_PORT, password=OBS_PASS)
        print("✓ Connected to OBS")
    except Exception as e:
        print(f"⚠ OBS not reachable ({e}) — overlay still works, text sources won't sync")

    print(f"\nControl panel → http://localhost:{SERVER_PORT}")
    print(f"Ticker overlay → http://localhost:{SERVER_PORT}/overlay/ticker\n")
    uvicorn.run(app, host="0.0.0.0", port=SERVER_PORT, log_level="warning")


if __name__ == "__main__":
    main()
