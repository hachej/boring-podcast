# Publish Podcast Episode

Publish a podcast episode end to end for this repo.

In this project, "published" means all of the following are true:
- the episode directory exists and `metadata.toml` is correct
- `audio.mp3` exists locally
- `feed/podcast.xml` includes the episode
- the feed and MP3 objects are uploaded to the Cloudflare R2 bucket
- the public `r2.dev` URLs return `200 OK`

## Trigger

Use this skill when the user asks to publish, release, ingest, or troubleshoot a podcast episode for Spotify, Apple Podcasts, or the RSS feed.

## Scope

This skill is specific to `boring-podcast`.

Key files:
- `tools/ingest_youtube.py`
- `tools/publish.py`
- `tools/rss_feed.py`
- `podcast.toml`
- `feed/podcast.xml`
- `workflows/publish-episode.md`

Related skill in `boring-master`:
- `devops-download-youtube` — use it when authenticated YouTube download or cookie retrieval needs to be handled outside this repo

## Important Constraint

`python -m tools.publish ... --steps rss` only regenerates the local RSS file.

It does **not** upload anything to Cloudflare R2.

If you stop after the local RSS step, Spotify and Apple Podcasts will not see the new episode.

## Prerequisites

Local tools:
- `python` / `python3`
- `ffmpeg`
- `yt-dlp`
- `wrangler`
- `vault`

Python packages needed for RSS generation and pipeline steps:
- `feedgen`
- `tomli` on Python < 3.11
- other packages from `requirements.txt` for transcript/show-notes/youtube flows

Secrets / auth:
- `VAULT_TOKEN` and `VAULT_ADDR` for YouTube cookies and API secrets
- `OPENAI_API_KEY` for transcript generation
- `ANTHROPIC_API_KEY` for show notes generation
- Cloudflare auth for `wrangler`

Common environment bootstrap on Julien's machine:

```bash
source ~/.zshrc
```

## Standard Workflow

### 1. Ingest from YouTube if needed

```bash
python tools/ingest_youtube.py "<youtube-url>" [--episode NUM] [--slug SLUG]
```

What this does:
- fetches YouTube metadata
- creates `episodes/epXXX-.../`
- downloads `video.mp4` unless `--no-download`
- writes `metadata.toml`

Notes:
- `tools/ingest_youtube.py` already tries to fetch YouTube cookies from Vault
- if ingestion/auth is failing, use the `devops-download-youtube` skill from `boring-master` to debug the download side first

### 2. Review metadata before publishing

Check at minimum:
- `episode.number`
- `episode.title`
- `episode.slug`
- `publish.youtube`
- `publish.spotify`
- `publish.apple`
- `podcast.season`
- `podcast.episode_type`

Do not publish with duplicate or incorrect episode numbers.

### 3. Run the local pipeline

Full pipeline:

```bash
python -m tools.publish episodes/<ep-dir>/
```

Selective runs:

```bash
python -m tools.publish episodes/<ep-dir>/ --steps audio
python -m tools.publish episodes/<ep-dir>/ --steps transcript
python -m tools.publish episodes/<ep-dir>/ --steps show_notes
python -m tools.publish episodes/<ep-dir>/ --steps youtube
python -m tools.publish episodes/<ep-dir>/ --steps rss
```

Step behavior:
- `audio`: extract `audio.mp3` from `video.mp4`
- `transcript`: create `transcript.md`
- `show_notes`: create `show-notes.md`
- `youtube`: upload the video if enabled in metadata
- `rss`: regenerate local `feed/podcast.xml`

### 4. Verify the local feed before upload

Check that the local feed contains the expected episode numbers:

```bash
rg -o '<itunes:episode>[0-9]+</itunes:episode>' feed/podcast.xml
```

Check the specific episode is present:

```bash
rg -n 'ep00X|<itunes:episode>X</itunes:episode>' feed/podcast.xml
```

### 5. Upload to Cloudflare R2

First identify the bucket:

```bash
wrangler r2 bucket list
```

For this repo, the bucket is typically:

```bash
ai-eng-podcast
```

Upload the feed:

```bash
wrangler r2 object put ai-eng-podcast/feed/podcast.xml --file=feed/podcast.xml --remote
```

Upload the episode audio:

```bash
wrangler r2 object put 'ai-eng-podcast/episodes/<ep-dir>/audio.mp3' --file='episodes/<ep-dir>/audio.mp3' --remote
```

If multiple episodes are newly missing from R2, upload each missing `audio.mp3`.

### 6. Verify the public URLs

Feed:

```bash
curl -I -L https://pub-4ff2e85593bd4bee9df83cd32bec10ca.r2.dev/feed/podcast.xml
```

Audio:

```bash
curl -I -L "https://pub-4ff2e85593bd4bee9df83cd32bec10ca.r2.dev/episodes/<ep-dir>/audio.mp3"
```

Expected result:
- `200 OK`
- recent `Last-Modified`

Verify the live feed content, not just headers:

```bash
curl -s -L https://pub-4ff2e85593bd4bee9df83cd32bec10ca.r2.dev/feed/podcast.xml | rg -o '<itunes:episode>[0-9]+</itunes:episode>'
```

## Troubleshooting Rules

If Spotify or Apple Podcasts do not show an episode:

1. Check the live feed URL, not the local file.
2. Check the live MP3 URL returns `200 OK`.
3. Check the episode appears in the live XML.
4. Check for duplicate episode numbers in `episodes/*/metadata.toml`.
5. Regenerate the RSS locally, then re-upload with `--remote`.

## Repo-Specific Notes

- `tools/rss_feed.py` now deduplicates by `episode.number` to avoid duplicate feed entries when stale directories exist.
- The feed is built from episode directories that contain both `metadata.toml` and `audio.mp3`.
- An episode directory without `audio.mp3` will be skipped from the RSS.
- `publish.log` is useful for local pipeline status, but it is not proof of live publication.

## Definition of Done

Do not claim success until all of these are true:
- the episode is present in local `feed/podcast.xml`
- the feed has been uploaded to R2 with `--remote`
- the episode MP3 has been uploaded to R2 with `--remote`
- the public feed URL returns `200 OK`
- the public MP3 URL returns `200 OK`
- the live XML shows the episode number and enclosure URL
