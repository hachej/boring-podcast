# OBS Scene — AI Engineering Podcast

OBS scene + live web control panel for the show.

## Files

- `scene-collection.json` — the OBS scene collection. Import in OBS, no Python needed.
- `obs_tbpn_scene.py` — Python script that builds the same scenes via the OBS WebSocket API.
- `obs_live_control.py` — FastAPI control panel at `http://localhost:8080` for live updates
  (episode / guest / theme / topics) and Guest ↔ Solo mode switching.

The bottom-bar ticker is a browser source pointing at `http://localhost:8080/overlay/ticker`.

## What the scenes look like

Both scenes share: left host cam, right host cam, top-left show badge,
top-right episode badge, bottom bar with current theme + scrolling topics
ticker, footer with handles.

- **Guest mode** — center pane shows the guest (Zoom/Meet/Teams window),
  with a dark name overlay (`GUEST NAME` + `Co-founder & CEO`).
- **Solo mode** — center pane is a clean screen share, no overlay.

Switch modes from the control panel or by double-clicking the scene in OBS.

---

## Two ways to get the scenes into OBS

Both produce identical scenes. Pick one.

### Option A — Import the JSON (easiest, no Python)

1. Open OBS.
2. **Scene Collection → Import** → pick `obs/scene-collection.json` from this repo.
3. **Scene Collection → switch to the imported collection** (named *Untitled*).
4. The scenes **AI Eng Podcast — Guest** and **— Solo** appear in the Scenes list.

Pros: zero dependencies, just OBS.
Cons: if `obs_tbpn_scene.py` is edited and the JSON isn't re-exported, the
imported scene drifts from code. Re-import to refresh.

### Option B — Build with the Python script

```bash
cd boring-podcast/obs
curl -LsSf https://astral.sh/uv/install.sh | sh   # install uv (one-time)
uv run obs_tbpn_scene.py
```

The script connects to OBS via WebSocket (port 4455) and creates/replaces both scenes.

Pros: tweak constants at the top of the script (colors, host names, episode
number, etc.) then re-run to apply changes — no manual OBS edits.
Cons: needs OBS WebSocket enabled and `uv` installed.

After running, you can also export back to JSON via OBS:
**Scene Collection → Export** → overwrite `obs/scene-collection.json` and commit.

---

## One-time setup (both options)

```bash
# Clone the repo (you're a collaborator on hachej/boring-podcast)
git clone git@github.com:hachej/boring-podcast.git
cd boring-podcast/obs

# Install OBS Studio
brew install --cask obs        # macOS
# or download from https://obsproject.com
```

### Enable OBS WebSocket (needed for option B and for the live control panel)

In OBS: **Tools → WebSocket Server Settings**
- ✅ Enable WebSocket server
- Port: `4455`
- Uncheck **Enable Authentication** (or keep auth on and set the same
  password in `OBS_PASS` at the top of `obs_live_control.py` and `PASSWORD`
  in `obs_tbpn_scene.py`)

---

## Each show

```bash
cd boring-podcast/obs
uv run obs_live_control.py
```

Then open **<http://localhost:8080>**. The scenes are already in OBS from
whichever import method you used.

## Configure the OBS sources (one-time per machine)

OBS will have the scenes but the camera / screen sources need to be pointed
at real devices on this machine. Right-click each source → **Properties**:

| Source                  | Pick                                          |
| ----------------------- | --------------------------------------------- |
| `Cam Left (Christophe)` | Christophe's camera                           |
| `Cam Right (Julien)`    | Julien's camera                               |
| `Guest Camera`          | Zoom / Meet / Teams window showing the guest  |
| `Screen Share`          | Slides / code / whatever the solo segment is  |

(Device IDs in the JSON are machine-specific, so importing the JSON does
not carry cameras over from another machine.)

## Live control panel (`http://localhost:8080`)

- **Scene Mode** — toggle Guest / Solo (changes the OBS active scene).
- **Episode** — e.g. `S01E14`.
- **Guest Name** + **Title** — shown on the dark overlay over the guest cam.
- **Current Theme** — the big white text dominating the bottom bar.
- **All Session Topics** — one per line; renders as a TV-news-style rolling
  ticker (right-to-left, seamless loop, content auto-duplicates to fill the
  full screen width so there are no gaps).

Hit **Update Overlay** and the changes hit OBS instantly.

## Sharing the control panel with the co-host

The panel binds to `0.0.0.0`, so anything that can reach the host machine
can hit it.

- **Tailscale (easiest)** — co-host opens `http://<your-mac>:8080` from
  inside your tailnet.
- **Cloudflare tunnel** — quick public URL:
  ```bash
  cloudflared tunnel --url http://localhost:8080
  ```
- **Deploy** — copy `obs_live_control.py` onto a server. Note: OBS still
  has to be on the same machine the WebSocket connection targets, so
  usually it's simpler to just run the control panel on the streaming host.

## Per-episode defaults

Open `obs_tbpn_scene.py` and edit the constants at the top:

```python
EPISODE     = "S01E14"
GUEST_NAME  = "GUEST NAME"
GUEST_TITLE = "Co-founder & CEO"
THEME       = "CURRENT THEME"
HOST_NAMES  = "CHRISTOPHE BLEFARI  ·  JULIEN HURAULT"
```

These are just the initial values — they're overridden live by whatever
you type into the control panel.

## Tweaking the look

Colors live near the top of `obs_tbpn_scene.py`:

```python
ACCENT      = rgb(157, 51, 116)   # wine-magenta #9D3374
ACCENT_MID  = rgb(108, 36, 80)
MAG_TEXT    = rgb(180, 80, 140)
```

The ticker styling (font sizes, scroll speed, bullet character) is in the
`_ticker_html` function inside `obs_live_control.py`.

## Troubleshooting

- **`✗ OBS not reachable`** — check that OBS is open and WebSocket is enabled
  on port `4455`.
- **Ticker is blank** — `obs_live_control.py` must be running; the OBS
  browser source loads it from `http://localhost:8080/overlay/ticker`.
- **Sources duplicate / fail to create** (option B) — re-run
  `obs_tbpn_scene.py`; it cleans up old sources before rebuilding.
