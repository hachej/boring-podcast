#!/usr/bin/env python3
"""
OBS scene creator — AI Engineering Podcast
3-panel: left host | guest cam (center) | right host
Bottom bar: current theme (big) + rolling topics ticker
Run: uv run obs_tbpn_scene.py
"""

import sys
import obsws_python as obs

HOST        = "localhost"
PORT        = 4455
PASSWORD    = ""
SCENE_GUEST = "AI Eng Podcast — Guest"
SCENE_SOLO  = "AI Eng Podcast — Solo"
SCENES      = [SCENE_GUEST, SCENE_SOLO]

# ── Per-episode config ───────────────────────────────────────────────────────
EPISODE     = "S01E14"
GUEST_NAME  = "GUEST NAME"
GUEST_TITLE = "Co-founder & CEO"
THEME       = "CURRENT THEME"
HOST_NAMES  = "CHRISTOPHE BLEFARI  ·  JULIEN HURAULT"
# ────────────────────────────────────────────────────────────────────────────

W, H = 1920, 1080

BAR_H    = 230
BAR_Y    = H - BAR_H        # 850

CAM_W    = 465               # wider host panels
GAP      = 5                 # dark gap between panels
CENTER_W = W - 2*CAM_W - 2*GAP   # 980
CENTER_X = CAM_W + GAP           # 470
RIGHT_X  = W - CAM_W             # 1455

BORDER   = 4

L_TOP    = 78                # left cam top (below show badge)
R_TOP    = 52                # right cam top (below episode badge)

# ── Colors (OBS format: 0xAABBGGRR) ─────────────────────────────────────────
def rgb(r, g, b, a=255):
    return (a << 24) | (b << 16) | (g << 8) | r

BG          = rgb(12,  6,  14)
PANEL_BG    = rgb(16,  8,  18)
ACCENT      = rgb(157, 51, 116)   # wine-magenta #9D3374
ACCENT_MID  = rgb(108, 36, 80)    # darker variant for badge bg
WHITE       = rgb(255, 255, 255)
MAG_TEXT    = rgb(180, 80, 140)   # lighter variant for labels
DARK_BAR    = rgb(8,   4,  10)
OVERLAY_BG  = rgb(0,   0,   0, 200)  # semi-transparent for name overlay


# ── OBS helpers ──────────────────────────────────────────────────────────────

ALL_SOURCES = [
    "BG", "Left Border", "Left Cam BG", "Cam Left (Christophe)",
    "Center BG", "Guest Camera", "Screen Share",
    "Guest Name BG", "Guest Name Accent", "Guest Name Line",
    "Guest Name Text", "Guest Title Text",
    "Right Border", "Right Cam BG", "Cam Right (Julien)",
    "Show Badge BG", "Show Badge Dot", "Show Name", "Episode Badge BG", "Episode",
    "Bar BG", "Bar Line", "Host Names", "Current Theme",
    "Ticker Line", "Ticker Band", "Rolling Topics", "Footer Strip", "Footer",
    # legacy names from previous runs
    "Bar Sep", "Topic Pills", "Guest Title", "Timestamp",
    "Timestamp BG", "Show Logo BG", "Show Logo Text", "Portfolio Logo",
    "Portfolio Logo Text", "Bar Top Line", "Schedule BG", "Schedule",
    "Footer BG", "Stock Ticker", "Cam Left", "Cam Right",
]


def _cleanup(cl):
    """Remove all sources from our scenes, then delete the scenes.
    Prevents OBS source orphaning across runs."""
    # Step 1: remove inputs while they're still in their scenes
    for scene in SCENES + ["AI Eng Podcast"]:  # include legacy single-scene name
        try:
            items = cl.get_scene_item_list(scene).scene_items
            for item in items:
                name = item.get("sourceName") or item.get("inputName")
                if name:
                    try: cl.remove_input(name)
                    except Exception: pass
        except Exception:
            pass
    # Step 2: also remove by name (catches any orphans)
    try:
        existing = {i["inputName"] for i in cl.get_input_list().inputs}
        for name in ALL_SOURCES:
            if name in existing:
                try: cl.remove_input(name)
                except Exception: pass
    except Exception:
        pass
    # Step 3: delete the scenes
    for scene in SCENES + ["AI Eng Podcast"]:
        try: cl.remove_scene(scene)
        except Exception: pass


def xform(cl, s, iid, x, y, w, h, bounds="OBS_BOUNDS_STRETCH"):
    cl.set_scene_item_transform(s, iid, {
        "positionX": float(x), "positionY": float(y),
        "rotation": 0.0, "scaleX": 1.0, "scaleY": 1.0,
        "alignment": 5,
        "boundsType": bounds, "boundsAlignment": 5,
        "boundsWidth": float(w), "boundsHeight": float(h),
    })


def _create(cl, s, name, kind, settings):
    """Create input or reuse existing one, always returning scene_item_id."""
    try:
        return cl.create_input(s, name, kind, settings, True).scene_item_id
    except Exception:
        # Source already exists — add it to this scene and update settings
        try: cl.set_input_settings(name, settings, True)
        except Exception: pass
        return cl.create_scene_item(s, name, True).scene_item_id


def color(cl, s, name, c, x, y, w, h):
    iid = _create(cl, s, name, "color_source_v3",
                  {"color": c, "width": w, "height": h})
    xform(cl, s, iid, x, y, w, h)
    print(f"  + {name}")


def text(cl, s, name, txt, x, y, w, h, size=28, c=WHITE, bold=False):
    settings = {
        "text": txt,
        "font": {"face": "Helvetica Neue", "size": size,
                 "flags": 1 if bold else 0},
        "color1": c, "color2": c,
        "extents": True, "extents_wrap": False,
        "extents_cx": w, "extents_cy": max(h, size + 20),
    }
    iid = _create(cl, s, name, "text_ft2_source_v2", settings)
    xform(cl, s, iid, x, y, w, h, "OBS_BOUNDS_SCALE_INNER")
    print(f"  + {name}")


def cam(cl, s, name, x, y, w, h):
    iid = _create(cl, s, name, "av_capture_input_v2", {})
    xform(cl, s, iid, x, y, w, h, "OBS_BOUNDS_SCALE_INNER")
    print(f"  + {name}  ← pick camera in OBS Properties")


def screen(cl, s, name, x, y, w, h):
    iid = _create(cl, s, name, "screen_capture", {})
    xform(cl, s, iid, x, y, w, h, "OBS_BOUNDS_SCALE_INNER")
    print(f"  + {name}  ← pick display/window in OBS Properties")


def browser(cl, s, name, url, x, y, w, h):
    settings = {"url": url, "width": w, "height": h,
                "css": "body{background:transparent;margin:0;overflow:hidden}"}
    iid = _create(cl, s, name, "browser_source", settings)
    xform(cl, s, iid, x, y, w, h, "OBS_BOUNDS_STRETCH")
    print(f"  + {name}")


# ── Scene builder ─────────────────────────────────────────────────────────────

def build(cl, scene, with_guest=True):
    s = scene
    print(f"\n=== Building '{scene}' (with_guest={with_guest}) ===")
    print("[Background]")
    color(cl, s, "BG", BG, 0, 0, W, H)

    # ── Left host camera ──────────────────────────────────────────────────────
    LH = BAR_Y - L_TOP   # 772
    print("[Left Camera — Christophe]")
    color(cl, s, "Left Border",   ACCENT,   0,              L_TOP - BORDER, CAM_W,            LH + BORDER)
    color(cl, s, "Left Cam BG",   PANEL_BG, BORDER,         L_TOP,          CAM_W - BORDER*2, LH - BORDER)
    cam(  cl, s, "Cam Left (Christophe)", BORDER, L_TOP,    CAM_W - BORDER*2, LH - BORDER)

    # ── Center: guest camera or screen share ─────────────────────────────────
    print(f"[Center — {'Guest Camera' if with_guest else 'Screen Share'}]")
    color(cl, s, "Center BG", PANEL_BG, CENTER_X, 0, CENTER_W, BAR_Y)

    if with_guest:
        screen(cl, s, "Guest Camera", CENTER_X, 0, CENTER_W, BAR_Y)
        # Guest name overlay: left accent bar + dark band + bottom accent line
        OV_H = 72
        color(cl, s, "Guest Name BG",     OVERLAY_BG, CENTER_X,      0,          CENTER_W, OV_H)
        color(cl, s, "Guest Name Accent", ACCENT,     CENTER_X,      0,          6,        OV_H)
        color(cl, s, "Guest Name Line",   ACCENT,     CENTER_X,      OV_H - 2,   CENTER_W, 2)
        text( cl, s, "Guest Name Text",   GUEST_NAME,
              CENTER_X + 16, 6,  CENTER_W - 24, 42, size=38, bold=True)
        text( cl, s, "Guest Title Text",  GUEST_TITLE,
              CENTER_X + 16, 48, CENTER_W - 24, 22, size=18, c=MAG_TEXT)
    else:
        # Solo mode: full clean screen share, no overlay
        screen(cl, s, "Screen Share", CENTER_X, 0, CENTER_W, BAR_Y)

    # ── Right host camera ─────────────────────────────────────────────────────
    RH = BAR_Y - R_TOP   # 798
    print("[Right Camera — Julien]")
    color(cl, s, "Right Border",  ACCENT,   RIGHT_X,              R_TOP - BORDER, CAM_W,            RH + BORDER)
    color(cl, s, "Right Cam BG",  PANEL_BG, RIGHT_X + BORDER,     R_TOP,          CAM_W - BORDER*2, RH - BORDER)
    cam(  cl, s, "Cam Right (Julien)", RIGHT_X + BORDER, R_TOP,   CAM_W - BORDER*2, RH - BORDER)

    # ── Top-left: show name badge ─────────────────────────────────────────────
    print("[Overlays]")
    BADGE_W, BADGE_H = 330, L_TOP - 2
    color(cl, s, "Show Badge BG",  ACCENT,     0,  0, 6,       BADGE_H)   # accent left bar
    color(cl, s, "Show Badge Dot", ACCENT_MID, 6,  0, BADGE_W - 6, BADGE_H)
    text( cl, s, "Show Name", "AI ENGINEERING PODCAST",
          18, 10, BADGE_W - 24, BADGE_H - 16, size=20, bold=True)

    # ── Top-right: episode badge ──────────────────────────────────────────────
    color(cl, s, "Episode Badge BG", rgb(12, 5, 18), RIGHT_X, 0, CAM_W, R_TOP - 2)
    text( cl, s, "Episode", EPISODE,
          RIGHT_X + 10, 10, CAM_W - 20, R_TOP - 20, size=24, bold=True, c=MAG_TEXT)

    # ── Bottom bar ────────────────────────────────────────────────────────────
    print("[Bottom Bar]")
    color(cl, s, "Bar BG",   DARK_BAR, 0, BAR_Y, W, BAR_H)
    color(cl, s, "Bar Line", ACCENT,   0, BAR_Y, W, 4)

    CX, CW = 18, W - 36

    # Row 1: host names + episode (small)
    text(cl, s, "Host Names",
         f"{HOST_NAMES}  ·  {EPISODE}",
         CX, BAR_Y + 10, CW, 28, size=19, c=MAG_TEXT)

    # Row 2: current theme (dominant)
    text(cl, s, "Current Theme", THEME,
         CX, BAR_Y + 42, CW, 100, size=82, c=WHITE, bold=True)

    # Thin accent line above ticker
    color(cl, s, "Ticker Line", ACCENT, 0, BAR_Y + 148, W, 2)

    # Row 3: TV news-style rolling ticker band
    TICKER_Y = BAR_Y + 150
    TICKER_H = 52
    color(cl, s, "Ticker Band", rgb(6, 2, 9), 0, TICKER_Y, W, TICKER_H)
    browser(cl, s, "Rolling Topics",
            "http://localhost:8080/overlay/ticker",
            0, TICKER_Y, W, TICKER_H)

    # Row 4: thin footer strip
    color(cl, s, "Footer Strip", rgb(4, 1, 7), 0, BAR_Y + 202, W, 28)
    text( cl, s, "Footer",
          "@blefari  ·  @hachej",
          CX, BAR_Y + 205, CW, 22, size=15, c=rgb(140, 70, 110))


def main():
    try:
        cl = obs.ReqClient(host=HOST, port=PORT, password=PASSWORD)
        print("✓ Connected to OBS\n")
    except Exception as e:
        sys.exit(f"✗ OBS not reachable: {e}")

    print("Cleaning up old sources…")
    _cleanup(cl)

    # Create both scenes
    cl.create_scene(SCENE_GUEST)
    print(f"Created '{SCENE_GUEST}'")
    build(cl, SCENE_GUEST, with_guest=True)

    cl.create_scene(SCENE_SOLO)
    print(f"Created '{SCENE_SOLO}'")
    build(cl, SCENE_SOLO, with_guest=False)

    cl.set_current_program_scene(SCENE_GUEST)

    # Save preview of both scenes
    for scene, suffix in [(SCENE_GUEST, "guest"), (SCENE_SOLO, "solo")]:
        shot = f"/tmp/obs_scene_{suffix}.png"
        try:
            cl.save_source_screenshot(scene, "png", shot, W, H, 90)
            print(f"  ✓ Preview ({suffix}) → {shot}")
        except Exception as e:
            print(f"  (screenshot failed: {e})")

    print("\nNext steps:")
    print(f"  • In OBS: select scene '{SCENE_GUEST}' for guest interviews")
    print(f"  •         select scene '{SCENE_SOLO}' for screen-share / no-guest segments")
    print("  • Guest Camera    → right-click > Properties > pick Zoom/Teams window")
    print("  • Screen Share    → right-click > Properties > pick screen/window (solo mode)")
    print("  • Cam Left/Right  → right-click > Properties > pick camera device")
    print("  • Use control panel to toggle modes & update content live")


if __name__ == "__main__":
    main()
