from typing import Dict, List, Optional
import time
import datetime


class CallTranscript:
    def __init__(self, call_id: str, customer_id: str):
        self.call_id = call_id
        self.customer_id = customer_id
        self.entries: List[Dict] = []
        self.start_time = time.time()
    
    def append(self, role: str, content: str) -> None:
        entry = {
            "role": role,
            "timestamp_iso": datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
            "content": content
        }
        self.entries.append(entry)
    
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
    return ACTIVE_CALLS.pop(call_id, None)
