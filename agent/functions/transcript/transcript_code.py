from typing import Dict, List, Optional
import time
import datetime
import json
import os
import re

ISO_FMT = "%Y-%m-%dT%H:%M:%S"

# Resolve absolute path to agent/ directory regardless of current working directory
BASE_AGENT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LOCAL_TRANSCRIPT_PATH = os.path.join(BASE_AGENT_DIR, "local_db", "transcript.json")
LOCAL_LIVE_PATH = os.path.join(BASE_AGENT_DIR, "local_db", "live_call.json")


def _save_local_json(filepath: str, data) -> None:
    """Safely saves data to local JSON file."""
    try:
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Transcript: Local JSON save notice: {e}")


def reset_transcript_file() -> None:
    """
    Explicitly resets agent/local_db/transcript.json to an empty JSON list [].
    Called whenever a call starts or when resetting the session.
    """
    _save_local_json(LOCAL_TRANSCRIPT_PATH, [])
    print("Transcript: Reset local_db/transcript.json to []")


def evaluate_turn_sentiment(text: str) -> Dict:
    """
    Evaluates real-time sentiment for an utterance using an enhanced lexicon
    optimized for healthcare, symptoms, customer service, and emotional state.
    
    Returns a dict with:
      - sentiment: 'Positive' | 'Negative' | 'Neutral'
      - score: float between -1.0 and +1.0
      - tone: detected emotional tone / intent
    """
    if not text or not text.strip():
        return {"sentiment": "Neutral", "score": 0.0, "tone": "Neutral"}

    lower = text.lower()

    # Words signaling gratitude, relief, satisfaction, or improvement
    pos_words = [
        "thank", "thanks", "great", "good", "perfect", "appreciate", "helpful",
        "awesome", "relieved", "fine", "better", "nice", "ok", "okay",
        "sure", "glad", "excellent", "wonderful", "satisfied", "pleased",
        "relief", "recovering", "recovered", "healed", "cleared", "super",
        "definitely", "yes", "understood", "clear", "bless"
    ]

    # Words signaling illness, discomfort, symptoms, or dissatisfaction
    neg_words = [
        "bad", "wrong", "upset", "angry", "terrible", "late", "error", "cancel",
        "pain", "hurt", "hurts", "severe", "worst", "unhappy", "problem", "difficult",
        "disappointed", "sick", "ill", "ache", "awful", "fever", "cold", "cough",
        "headache", "vomit", "vomiting", "nausea", "dizzy", "dizziness", "infection",
        "emergency", "urgent", "frustrated", "annoyed", "useless", "ridiculous",
        "poor", "waste", "horrible", "hate", "unbearable", "weak", "exhausted",
        "burning", "bleeding", "swelling", "suffering", "issue"
    ]

    # Detect negations like "not feeling good", "no relief", "don't like"
    negations = ["not", "no", "never", "hardly", "barely", "don't", "dont", "cannot", "can't"]
    words = re.findall(r"\b\w+\b", lower)

    pos_count = 0
    neg_count = 0

    for i, w in enumerate(words):
        # Look behind up to 3 words for negation
        is_negated = any(words[j] in negations for j in range(max(0, i - 3), i))
        
        if w in pos_words:
            if is_negated:
                neg_count += 1
            else:
                pos_count += 1
        elif w in neg_words:
            if is_negated:
                pos_count += 1  # e.g., "no pain", "no fever"
            else:
                neg_count += 1

    # Tone detection
    symptom_words = ["fever", "cold", "cough", "headache", "pain", "hurt", "sick", "ill", "vomit", "nausea", "dizzy"]
    gratitude_words = ["thank", "thanks", "appreciate", "helpful", "great", "wonderful", "glad"]

    if any(sw in lower for sw in symptom_words):
        detected_tone = "Symptom / Health Distress"
    elif any(gw in lower for gw in gratitude_words):
        detected_tone = "Gratitude / Satisfaction"
    elif neg_count > pos_count:
        detected_tone = "Dissatisfied / Concerned"
    elif pos_count > neg_count:
        detected_tone = "Positive / Cooperative"
    else:
        detected_tone = "Inquiry / Neutral"

    if pos_count > neg_count and pos_count >= 1:
        score = min(round(0.35 + 0.2 * pos_count, 2), 1.0)
        return {"sentiment": "Positive", "score": score, "tone": detected_tone}
    elif neg_count > pos_count and neg_count >= 1:
        score = max(round(-0.35 - 0.2 * neg_count, 2), -1.0)
        return {"sentiment": "Negative", "score": score, "tone": detected_tone}
    else:
        return {"sentiment": "Neutral", "score": 0.0, "tone": detected_tone}


class CallTranscript:
    def __init__(self, call_id: str, customer_id: str):
        self.call_id = call_id
        self.customer_id = customer_id
        self.entries: List[Dict] = []
        self.start_time = time.time()
        # Immediately reset transcript.json and live_call.json for this fresh call!
        self._flush_to_disk()
        print(f"Transcript: Initialized fresh call {call_id} (reset local_db/transcript.json)")

    def append(self, role: str, content: str) -> None:
        sentiment_info = evaluate_turn_sentiment(content)
        turn_id = len(self.entries) + 1
        entry = {
            "turn_id": turn_id,
            "role": role,
            "content": content.strip(),
            "sentiment": sentiment_info["sentiment"],
            "sentiment_score": sentiment_info["score"],
            "tone": sentiment_info["tone"],
            "timestamp_iso": datetime.datetime.now().strftime(ISO_FMT)
        }
        self.entries.append(entry)
        # Flush live updates to disk in real time
        self._flush_to_disk()

    def _flush_to_disk(self) -> None:
        """Writes live transcript and rolling sentiment metrics to local JSON files."""
        # 1. Update local_db/transcript.json (the live array of turns with sentiment)
        _save_local_json(LOCAL_TRANSCRIPT_PATH, self.entries)

        # 2. Also update local_db/live_call.json with rich call-level metadata
        duration = round(time.time() - self.start_time, 1)
        user_scores = [e.get("sentiment_score", 0.0) for e in self.entries if e.get("role") == "user"]
        avg_score = round(sum(user_scores) / len(user_scores), 2) if user_scores else 0.0
        overall = "Positive" if avg_score > 0.1 else ("Negative" if avg_score < -0.1 else "Neutral")

        live_data = {
            "call_id": self.call_id,
            "customer_id": self.customer_id,
            "call_status": "in_progress",
            "duration_seconds": duration,
            "turns_count": len(self.entries),
            "live_overall_sentiment": overall,
            "live_sentiment_score": avg_score,
            "transcripts": self.entries
        }
        _save_local_json(LOCAL_LIVE_PATH, live_data)

    def mark_completed(self) -> None:
        """Updates live_call.json status to completed upon call hangup."""
        try:
            duration = round(time.time() - self.start_time, 1)
            user_scores = [e.get("sentiment_score", 0.0) for e in self.entries if e.get("role") == "user"]
            avg_score = round(sum(user_scores) / len(user_scores), 2) if user_scores else 0.0
            overall = "Positive" if avg_score > 0.1 else ("Negative" if avg_score < -0.1 else "Neutral")

            live_data = {
                "call_id": self.call_id,
                "customer_id": self.customer_id,
                "call_status": "completed",
                "duration_seconds": duration,
                "turns_count": len(self.entries),
                "live_overall_sentiment": overall,
                "live_sentiment_score": avg_score,
                "transcripts": self.entries
            }
            _save_local_json(LOCAL_LIVE_PATH, live_data)
        except Exception as e:
            print(f"Transcript mark_completed notice: {e}")

    def get_all(self) -> Dict:
        return {
            "call_id": self.call_id,
            "customer_id": self.customer_id,
            "transcripts": self.entries,
            "call_duration_seconds": round(time.time() - self.start_time, 2)
        }


ACTIVE_CALLS: Dict[str, CallTranscript] = {}


def create_transcript(call_id: str, customer_id: str) -> CallTranscript:
    transcript = CallTranscript(call_id, customer_id)
    ACTIVE_CALLS[call_id] = transcript
    return transcript


def get_transcript(call_id: str) -> Optional[CallTranscript]:
    return ACTIVE_CALLS.get(call_id)


def remove_transcript(call_id: str) -> Optional[CallTranscript]:
    transcript = ACTIVE_CALLS.pop(call_id, None)
    if transcript:
        transcript.mark_completed()
    return transcript
