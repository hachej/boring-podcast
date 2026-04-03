# Publish Podcast Episode

Publish a podcast episode to YouTube, Spotify, and Apple Podcasts.

## Trigger

When the user asks to publish, release, or process a podcast episode.

## Dependencies

- **[download-youtube-video](../../../boring-master/skills/download-youtube-video/SKILL.md)** — Downloads YouTube videos with authenticated cookies from Vault. Used by `ingest_youtube.py` to fetch source video.

## Steps

### 1. Ingest from YouTube

Download the source video using `ingest_youtube.py` (uses the `download-youtube-video` skill under the hood):

```bash
cd /podcast
python tools/ingest_youtube.py "<youtube-url>" [--episode NUM] [--slug SLUG]
```

This creates the episode directory, downloads video, extracts audio, and writes `metadata.toml`.

### 2. Publish

```bash
cd /podcast
python -m tools.publish episodes/<ep-dir>/ [--steps audio,transcript,show_notes,youtube,rss]
```

### Individual steps

| Step | Command | What it does |
|------|---------|-------------|
| audio | `--steps audio` | Extract MP3 from video.mp4 (ffmpeg) |
| transcript | `--steps transcript` | Transcribe via OpenAI Whisper |
| show_notes | `--steps show_notes` | Generate show notes via Claude API |
| youtube | `--steps youtube` | Upload to YouTube |
| rss | `--steps rss` | Update RSS feed (Spotify & Apple auto-poll) |

## New episode checklist

1. Ingest: `python tools/ingest_youtube.py "<youtube-url>"`
2. Review `metadata.toml` in the created episode directory
3. Publish: `python -m tools.publish episodes/epXXX-slug/`

## Required secrets

| Secret | Source | Used for |
|--------|--------|----------|
| `OPENAI_API_KEY` | env | Whisper transcription |
| `ANTHROPIC_API_KEY` | env | Show notes generation |
| `CLOUDFLARE_API_TOKEN` | env | R2 media hosting |
| `secret/agent/youtube` | Vault | YouTube cookies for yt-dlp (auto-fetched) |

## Config

Podcast metadata is in `/podcast/podcast.toml`.
