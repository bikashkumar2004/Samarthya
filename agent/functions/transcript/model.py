import os
import json
import datetime
from typing import Dict, Optional
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from bson import ObjectId
from .sentiment import analyze_transcript_data

ISO_FMT = "%Y-%m-%dT%H:%M:%S"
_client: Optional[MongoClient] = None

def _now_iso() -> str:
    return datetime.datetime.now().strftime(ISO_FMT)

def _save_local_json(filepath: str, data) -> None:
    """Saves call and transcript data locally in JSON format for easy inspection."""
    try:
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False, default=str)
    except Exception as e:
        print(f"Model: Local JSON save notice: {e}")

def get_db():
    """Returns a shared MongoDB database instance using environment variables."""
    global _client
    if _client is None:
        mongo_uri = os.getenv("MONGODB_URI") or os.getenv("MONGODB_URL")
        if not mongo_uri:
            raise ValueError("MONGODB_URI or MONGODB_URL not found in environment variables")
        _client = MongoClient(mongo_uri)
    
    db_name = os.getenv("MONGODB_DB", "whitespace-crm")
    return _client[db_name]

def save_transcript_to_mongodb(transcript_data: Dict) -> Optional[str]:
    """Step 1: Save raw transcript to MongoDB 'transcripts' collection"""
    try:
        db = get_db()
        collection = db["transcripts"]
        
        transcript_data["saved_at"] = _now_iso()
        transcript_data["status"] = "raw"
        
        result = collection.insert_one(transcript_data)
        print(f"Model: Saved to transcripts: {result.inserted_id}")
        
        # Save raw conversation JSON locally
        _save_local_json("local_db/transcript.json", transcript_data.get("transcripts", []))
        
        return str(result.inserted_id)
        
    except (PyMongoError, Exception) as e:
        print(f"Model: MongoDB error saving transcript: {e}")
        return None

def process_transcript(mongodb_transcript_id: str) -> Optional[Dict]:
    """Step 2: Fetch raw transcript, generate sentiment + summary, and update"""
    try:
        db = get_db()
        collection = db["transcripts"]
        
        print(f"Model: Fetching transcript {mongodb_transcript_id}...")
        transcript_doc = collection.find_one({"_id": ObjectId(mongodb_transcript_id)})
        
        if not transcript_doc:
            print(f"Model: Transcript {mongodb_transcript_id} not found")
            return None
        
        entries = transcript_doc.get("transcripts", [])
        print(f"Model: Analyzing {len(entries)} entries...")
        
        sentiment_result = analyze_transcript_data(entries)
        
        if isinstance(sentiment_result, tuple):
            overall_sentiment, summary = sentiment_result
            sentiment_scores = {}
        else:
            overall_sentiment = sentiment_result.get("sentiment", "Neutral")
            summary = sentiment_result.get("summary", "")
            sentiment_scores = sentiment_result.get("scores", {})
        
        processed_data = {
            "call_id": transcript_doc.get("call_id"),
            "customer_id": transcript_doc.get("customer_id"),
            "call_start_iso": entries[0]["timestamp_iso"] if entries else _now_iso(),
            "call_end_iso": entries[-1]["timestamp_iso"] if entries else _now_iso(),
            "call_duration_seconds": transcript_doc.get("call_duration_seconds", 0),
            "transcripts": entries,
            "summary": summary or "",
            "sentiment_overall": overall_sentiment or "Neutral",
            "sentiment_scores": sentiment_scores,
            "turn_counts": {
                "user": sum(1 for e in entries if e.get("role") == "user"),
                "assistant": sum(1 for e in entries if e.get("role") == "assistant")
            },
            "processed_at": _now_iso()
        }
        
        collection.update_one(
            {"_id": ObjectId(mongodb_transcript_id)},
            {"$set": {"processed_data": processed_data, "status": "processed"}}
        )
        
        print(f"Model: Processed - Sentiment: {overall_sentiment}")
        return processed_data
        
    except (PyMongoError, Exception) as e:
        print(f"Model: Error processing transcript: {e}")
        return None

def save_processed_to_mongodb(processed_data: Dict) -> bool:
    """Step 3: Save processed call summary into 'calls' collection"""
    try:
        db = get_db()
        collection = db["calls"]
        
        processed_data["imported_at"] = _now_iso()
        result = collection.insert_one(processed_data)
        
        print(f"Model: Saved to calls: {result.inserted_id}")
        print(f"Model: Call ID: {processed_data.get('call_id')}")
        print(f"Model: Customer: {processed_data.get('customer_id')}")
        print(f"Model: Sentiment: {processed_data.get('sentiment_overall')}")
        print(f"Model: Duration: {processed_data.get('call_duration_seconds')}s")
        
        # Save local JSON files for immediate offline viewing
        _save_local_json("local_db/db.json", processed_data)
        call_id = processed_data.get("call_id")
        if call_id:
            _save_local_json(f"local_db/calls/{call_id}.json", processed_data)
        print("Model: Saved local JSON copy to local_db/db.json and local_db/calls/")
        
        return True
        
    except (PyMongoError, Exception) as e:
        print(f"Model: MongoDB error saving to calls: {e}")
        return False

