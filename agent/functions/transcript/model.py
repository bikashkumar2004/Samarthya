# model.py
import os
import json
import datetime
from typing import List, Dict, Optional, Tuple
from pathlib import Path

# The transcript entries are expected to be dicts with:
# { "role": "user"|"assistant", "timestamp_iso": "YYYY-MM-DDTHH:MM:SS", "content": "..." }

ISO_FMT = "%Y-%m-%dT%H:%M:%S"

def _now_iso() -> str:
    return datetime.datetime.now().strftime(ISO_FMT)

def _parse_iso(ts: str) -> datetime.datetime:
    # Fallback to now on parse error to keep pipeline resilient
    try:
        return datetime.datetime.strptime(ts, ISO_FMT)
    except Exception:
        return datetime.datetime.now()

def _safe_parent(path: str) -> None:
    p = Path(path)
    if p.parent:
        p.parent.mkdir(parents=True, exist_ok=True)

def _atomic_write_json(path: str, data) -> None:
    _safe_parent(path)
    p = Path(path)
    tmp = p.with_suffix(p.suffix + ".tmp")
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.flush()
        os.fsync(f.fileno())
    os.replace(tmp, p)

def _turn_counts(transcript: List[Dict]) -> Dict[str, int]:
    counts = {"user": 0, "assistant": 0}
    for t in transcript:
        r = t.get("role")
        if r in counts:
            counts[r] += 1
    return counts

def _first_agent_utterance(transcript: List[Dict]) -> Optional[str]:
    for t in transcript:
        if t.get("role") == "assistant" and t.get("content"):
            return str(t.get("content"))
    return None

def _last_user_utterance(transcript: List[Dict]) -> Optional[str]:
    for t in reversed(transcript):
        if t.get("role") == "user" and t.get("content"):
            return str(t.get("content"))
    return None

def _compute_times(transcript: List[Dict]) -> Tuple[str, str, float]:
    if not transcript:
        now = _now_iso()
        return now, now, 0.0
    start_iso = str(transcript[0].get("timestamp_iso")) or _now_iso()
    end_iso = str(transcript[-1].get("timestamp_iso")) or start_iso
    start_dt = _parse_iso(start_iso)
    end_dt = _parse_iso(end_iso)
    duration = max((end_dt - start_dt).total_seconds(), 0.0)
    return start_iso, end_iso, duration

def _summarize_and_sentiment(transcript: List[Dict]) -> Tuple[str, str]:
    # Lightweight, dependency-free fallback:
    # Build a brief summary from the first user and last assistant turns,
    # and set sentiment to Neutral unless clear cues exist.
    first_user = next((t["content"] for t in transcript if t.get("role") == "user" and t.get("content")), None)
    last_agent = next((t["content"] for t in reversed(transcript) if t.get("role") == "assistant" and t.get("content")), None)
    if first_user and last_agent:
        summary = f"Caller asked: {first_user[:120]}. Agent responded: {last_agent[:120]}."
    elif first_user:
        summary = f"Caller asked: {first_user[:160]}."
    elif last_agent:
        summary = f"Agent responded: {last_agent[:160]}."
    else:
        summary = "No content."
    sentiment = "Neutral"
    return summary, sentiment

def build_call_record(
    call_id: str,
    customer_id: Optional[str],
    transcript: List[Dict],
    call_start_iso_override: Optional[str] = None,
    last_partial_sentiment: Optional[str] = None,
    last_partial_updated_iso: Optional[str] = None,
) -> Dict:
    call_start_iso, call_end_iso, call_duration_seconds = _compute_times(transcript)
    if call_start_iso_override:
        # If provided, use override for start but recompute duration accordingly.
        call_start_iso = call_start_iso_override
        # Recompute duration with overridden start
        sdt = _parse_iso(call_start_iso)
        edt = _parse_iso(call_end_iso)
        call_duration_seconds = max((edt - sdt).total_seconds(), 0.0)

    turn_counts = _turn_counts(transcript)
    first_agent = _first_agent_utterance(transcript)
    last_user = _last_user_utterance(transcript)
    summary, sentiment_overall = _summarize_and_sentiment(transcript)

    created_at_iso = call_start_iso
    updated_at_iso = call_end_iso

    record = {
        "call_id": call_id,
        "customer_id": customer_id,
        "call_start_iso": call_start_iso,
        "call_end_iso": call_end_iso,
        "call_duration_seconds": call_duration_seconds,
        "summary": summary,
        "sentiment_overall": sentiment_overall,
        "turn_counts": {"user": turn_counts.get("user", 0), "assistant": turn_counts.get("assistant", 0)},
        "first_agent_utterance": first_agent,
        "last_user_utterance": last_user,
        "transcript": transcript,
        "realtime": {
            "last_partial_sentiment": last_partial_sentiment,
            "last_partial_updated_iso": last_partial_updated_iso,
        },
        "created_at_iso": created_at_iso,
        "updated_at_iso": updated_at_iso,
    }
    return record

def store_call_to_db(
    call_id: str,
    customer_id: Optional[str],
    transcript: List[Dict],
    call_start_iso: Optional[str] = None,
    last_partial_sentiment: Optional[str] = None,
    last_partial_updated_iso: Optional[str] = None,
    db_file: str = "local_db/db.json",
    write_per_call_file: bool = False,
) -> Dict:
    """
    Replace db.json with the latest call record.
    Optionally still write a per-call artifact under local_db/calls/{call_id}.json.
    """
    record = build_call_record(
        call_id=call_id,
        customer_id=customer_id,
        transcript=transcript,
        call_start_iso_override=call_start_iso,
        last_partial_sentiment=last_partial_sentiment,
        last_partial_updated_iso=last_partial_updated_iso,
    )  # [attached_file:5]

    # Always replace the file with the latest record
    _atomic_write_json(db_file, record)  # [attached_file:5]

    if write_per_call_file:
        per_call_path = f"local_db/calls/{call_id}.json"
        _atomic_write_json(per_call_path, record)  # [attached_file:5]

    print(f"[model] Saved call {call_id} to {db_file}")
    return record
