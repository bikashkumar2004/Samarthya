# transcript_code.py
# Purpose: Manage a running list of transcript entries (user/assistant messages),
# write them to a JSON file, and avoid saving near-duplicate entries.

import time
import json
import os
from pathlib import Path
from typing import Dict, List, Optional

# In-memory list holding transcript entries for the current run
# Each entry is a dict like: {"role": "user"|"assistant", "timestamp_iso": "...", "content": "..."}
TRANSCRIPTS: List[Dict[str, Optional[str]]] = []

# File path where transcripts will be saved in JSON format
# Keep the relative path to avoid breaking callers; ensure directory exists before writing
TRANSCRIPTS_JSON_FILE = "local_db/transcript.json"

# If True, skip any decoded messages with type == "History" to avoid cluttering the log
SKIP_HISTORY_EVENTS = True

# Time window (in seconds) used to treat two entries with same role+content as duplicates if very close in time
DEDUP_WINDOW = 1.0  # seconds


def _now_iso() -> str:
    # Return current local time as an ISO-like string: YYYY-MM-DDTHH:MM:SS
    # Matches prior format to avoid breaking any downstream consumers
    return time.strftime("%Y-%m-%dT%H:%M:%S", time.localtime(time.time()))


def _make_entry(decoded: Dict) -> Dict[str, Optional[str]]:
    # Build a normalized transcript entry from an incoming decoded message dict
    # Only the fields used elsewhere are included to keep entries uniform and compact
    return {
        "role": decoded.get("role"),            # "user" or "assistant"
        "timestamp_iso": _now_iso(),            # Local time in fixed format
        "content": decoded.get("content"),      # Text content
    }


def _ts_to_epoch(ts_str: str) -> Optional[float]:
    # Convert a timestamp string (YYYY-MM-DDTHH:MM:SS) into epoch seconds
    # Returns None if parsing fails for any reason
    try:
        t = time.strptime(ts_str, "%Y-%m-%dT%H:%M:%S")
        return time.mktime(t)
    except Exception:
        return None


def _is_duplicate(prev: Optional[Dict], new: Dict, window_seconds: float = DEDUP_WINDOW) -> bool:
    # Decide whether 'new' entry is a duplicate of 'prev' entry
    # Criteria: same role, same content, and timestamps within a small time window
    if not prev:
        return False
    try:
        same_role = prev.get("role") == new.get("role")
        same_content = prev.get("content") == new.get("content")

        prev_ts = prev.get("timestamp_iso")
        new_ts = new.get("timestamp_iso")

        # Compare timestamps only if both are present and parseable
        if prev_ts and new_ts:
            p = _ts_to_epoch(prev_ts)
            n = _ts_to_epoch(new_ts)
            if p is not None and n is not None:
                time_close = abs(n - p) < window_seconds
            else:
                time_close = False
        else:
            time_close = False

        # Treat as duplicate only if all three conditions match
        return same_role and same_content and time_close
    except Exception:
        # If anything goes wrong, fail open (consider it not a duplicate)
        return False


def _ensure_parent_dir(filepath: str) -> None:
    # Make sure the parent directory exists (no error if it already exists)
    path = Path(filepath)
    if path.parent:
        path.parent.mkdir(parents=True, exist_ok=True)


def _atomic_write_json(filepath: str, data) -> None:
    # Write JSON atomically: write to a temporary file in the same directory and replace
    path = Path(filepath)
    _ensure_parent_dir(filepath)
    tmp_path = path.with_suffix(path.suffix + ".tmp")
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.flush()
        os.fsync(f.fileno())
    os.replace(tmp_path, path)


def save_transcripts() -> None:
    # Write the current TRANSCRIPTS list to the JSON file on disk safely
    try:
        _atomic_write_json(TRANSCRIPTS_JSON_FILE, TRANSCRIPTS)
    except Exception as e:
        # Log an error instead of raising, to avoid interrupting the main application flow
        print(f"[transcript_code] failed to save {TRANSCRIPTS_JSON_FILE}: {e}")


def append_transcript(decoded: Dict) -> None:
    # Safely process an incoming decoded message and append a normalized entry to TRANSCRIPTS
    # Skips history events, non-dict inputs, blank content, and near-duplicates
    try:
        # Ignore anything that is not a dictionary
        if not isinstance(decoded, dict):
            return

        # Optionally ignore historical backfill messages to keep transcripts focused on live conversation
        if SKIP_HISTORY_EVENTS and decoded.get("type") == "History":
            return

        # Only keep messages explicitly from "user" or "assistant" and with non-empty content
        role = decoded.get("role")
        content = decoded.get("content")
        if role not in ("user", "assistant") or not content or str(content).strip() == "":
            return

        # Create a normalized entry and compare with the last one to deduplicate
        entry = _make_entry(decoded)
        prev = TRANSCRIPTS[-1] if TRANSCRIPTS else None

        # If the new entry is a near-duplicate, skip it
        if _is_duplicate(prev, entry):
            return

        # Otherwise, store it and persist to disk
        TRANSCRIPTS.append(entry)
        save_transcripts()
    except Exception as e:
        # Never break the caller; just log what went wrong
        print(f"[transcript_code] append_transcript error: {e}")
