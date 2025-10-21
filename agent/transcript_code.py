# transcript_code.py
import time
import json
from typing import Dict, List, Optional

TRANSCRIPTS: List[Dict[str, Optional[str]]] = []
TRANSCRIPTS_JSON_FILE = "transcript.json"
SKIP_HISTORY_EVENTS = True
DEDUP_WINDOW = 1.0  # seconds


def _now_iso() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%S", time.localtime(time.time()))


def _make_entry(decoded: Dict) -> Dict[str, Optional[str]]:
    return {
        "role": decoded.get("role"),
        "timestamp_iso": _now_iso(),
        "content": decoded.get("content"),
    }


def _ts_to_epoch(ts_str: str) -> Optional[float]:
    try:
        t = time.strptime(ts_str, "%Y-%m-%dT%H:%M:%S")
        return time.mktime(t)
    except Exception:
        return None


def _is_duplicate(prev: Optional[Dict], new: Dict, window_seconds: float = DEDUP_WINDOW) -> bool:
    if not prev:
        return False
    try:
        same_role = prev.get("role") == new.get("role")
        same_content = prev.get("content") == new.get("content")
        prev_ts = prev.get("timestamp_iso")
        new_ts = new.get("timestamp_iso")
        if prev_ts and new_ts:
            p = _ts_to_epoch(prev_ts)
            n = _ts_to_epoch(new_ts)
            if p is not None and n is not None:
                time_close = abs(n - p) < window_seconds
            else:
                time_close = False
        else:
            time_close = False
        return same_role and same_content and time_close
    except Exception:
        return False


def save_transcripts() -> None:
    try:
        with open(TRANSCRIPTS_JSON_FILE, "w", encoding="utf-8") as f:
            json.dump(TRANSCRIPTS, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"[transcript_code] failed to save {TRANSCRIPTS_JSON_FILE}: {e}")


def append_transcript(decoded: Dict) -> None:
    try:
        if not isinstance(decoded, dict):
            return
        if SKIP_HISTORY_EVENTS and decoded.get("type") == "History":
            return

        role = decoded.get("role")
        content = decoded.get("content")

        if role not in ("user", "assistant") or not content or content.strip() == "":
            return

        entry = _make_entry(decoded)
        prev = TRANSCRIPTS[-1] if TRANSCRIPTS else None
        if _is_duplicate(prev, entry):
            return

        TRANSCRIPTS.append(entry)
        save_transcripts()
    except Exception as e:
        print(f"[transcript_code] append_transcript error: {e}")
