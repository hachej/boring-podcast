"""Generate transcript from audio using OpenRouter Whisper API."""

import base64
import subprocess
from pathlib import Path


def get_openrouter_key() -> str:
    import os
    if key := os.environ.get("OPENROUTER_API_KEY"):
        return key
    result = subprocess.run(
        ["vault", "kv", "get", "-field=api_key", "secret/agent/openrouter"],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        raise RuntimeError(f"Failed to get OpenRouter key from Vault: {result.stderr}")
    return result.stdout.strip()


def generate_transcript(audio_path: Path, output_path: Path, language: str = "en"):
    audio_path = Path(audio_path)
    output_path = Path(output_path)

    if not audio_path.exists():
        raise FileNotFoundError(f"Audio not found: {audio_path}")

    api_key = get_openrouter_key()

    # Whisper has a 25MB limit - split large files if needed
    file_size = audio_path.stat().st_size
    if file_size > 24 * 1024 * 1024:
        transcript_text = _transcribe_chunked(api_key, audio_path, language)
    else:
        transcript_text = _transcribe_single(api_key, audio_path, language)

    with open(output_path, "w") as f:
        f.write("# Transcript\n\n")
        f.write(f"*Auto-generated from {audio_path.name}*\n\n")
        f.write(transcript_text)

    return output_path


def _transcribe_single(api_key: str, audio_path: Path, language: str) -> str:
    """Transcribe a single audio file via OpenRouter JSON API."""
    import requests

    with open(audio_path, "rb") as f:
        audio_b64 = base64.b64encode(f.read()).decode()

    resp = requests.post(
        "https://openrouter.ai/api/v1/audio/transcriptions",
        headers={"Authorization": f"Bearer {api_key}"},
        json={
            "model": "openai/whisper-large-v3-turbo",
            "input_audio": {"data": audio_b64, "format": "mp3"},
            "language": language,
        },
        timeout=300,
    )
    resp.raise_for_status()
    data = resp.json()
    return data.get("text", "")


def _transcribe_chunked(api_key: str, audio_path: Path, language: str) -> str:
    """Split large audio and transcribe in chunks."""
    import tempfile
    import os

    chunk_dir = Path(tempfile.mkdtemp())
    chunk_duration = 600  # 10 min chunks

    cmd = [
        "ffmpeg", "-i", str(audio_path),
        "-f", "segment",
        "-segment_time", str(chunk_duration),
        "-c", "copy",
        "-y",
        str(chunk_dir / "chunk_%03d.mp3")
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"ffmpeg split failed: {result.stderr[:500]}")

    chunks = sorted(chunk_dir.glob("chunk_*.mp3"))
    transcript_parts = []
    for i, chunk in enumerate(chunks):
        print(f"  Transcribing chunk {i+1}/{len(chunks)}...")
        text = _transcribe_single(api_key, chunk, language)
        transcript_parts.append(text)

    for chunk in chunks:
        os.unlink(chunk)
    os.rmdir(chunk_dir)

    return "\n\n".join(transcript_parts)
