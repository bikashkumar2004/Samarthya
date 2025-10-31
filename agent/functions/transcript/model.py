import os
import json
import datetime
from typing import Dict, Optional
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from .sentiment import analyze_transcript_data
from bson import ObjectId

ISO_FMT = "%Y-%m-%dT%H:%M:%S"

def _now_iso() -> str:
    return datetime.datetime.now().strftime(ISO_FMT)

def save_transcript_to_mongodb(transcript_data: Dict) -> Optional[str]:
    """Step 1: Save raw transcript to MongoDB 'transcripts' collection"""
    try:
        mongo_uri = os.getenv("MONGODB_URI")
        mongo_db = os.getenv("MONGODB_DB")
        
        client = MongoClient(mongo_uri)
        db = client[mongo_db]
        collection = db["transcripts"]
        
        transcript_data["saved_at"] = _now_iso()
        transcript_data["status"] = "raw"
        
        result = collection.insert_one(transcript_data)
        print(f"Model: ✓ Saved to transcripts: {result.inserted_id}")
        return str(result.inserted_id)
        
    except PyMongoError as e:
        print(f"Model: ✗ MongoDB error: {e}")
        return None

def process_transcript(mongodb_transcript_id: str) -> Optional[Dict]:
    """Step 2: Fetch and add sentiment + summary"""
    try:
        mongo_uri = os.getenv("MONGODB_URI")
        mongo_db = os.getenv("MONGODB_DB")
        
        client = MongoClient(mongo_uri)
        db = client[mongo_db]
        collection = db["transcripts"]
        
        print(f"Model: Fetching transcript {mongodb_transcript_id}...")
        transcript_doc = collection.find_one({"_id": ObjectId(mongodb_transcript_id)})
        
        if not transcript_doc:
            print(f"Model: ✗ Transcript not found")
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
                "user": sum(1 for e in entries if e["role"] == "user"),
                "assistant": sum(1 for e in entries if e["role"] == "assistant")
            },
            "processed_at": _now_iso()
        }
        
        collection.update_one(
            {"_id": ObjectId(mongodb_transcript_id)},
            {"$set": {"processed_data": processed_data, "status": "processed"}}
        )
        
        print(f"Model: ✓ Processed - Sentiment: {overall_sentiment}")
        return processed_data
        
    except PyMongoError as e:
        print(f"Model: ✗ MongoDB error: {e}")
        return None
    except Exception as e:
        print(f"Model: ✗ Error: {e}")
        return None

def save_processed_to_mongodb(processed_data: Dict) -> bool:
    """Step 3: Save to calls collection"""
    try:
        mongo_uri = os.getenv("MONGODB_URI")
        mongo_db = os.getenv("MONGODB_DB")
        
        client = MongoClient(mongo_uri)
        db = client[mongo_db]
        collection = db["calls"]
        
        processed_data["imported_at"] = _now_iso()
        result = collection.insert_one(processed_data)
        
        print(f"Model: ✓ Saved to calls: {result.inserted_id}")
        print(f"Model: ✓✓✓ CALL DATA COMPLETE ✓✓✓")
        print(f"Model:   Call ID: {processed_data['call_id']}")
        print(f"Model:   Customer: {processed_data['customer_id']}")
        print(f"Model:   Entries: {len(processed_data['transcripts'])}")
        print(f"Model:   Sentiment: {processed_data['sentiment_overall']}")
        print(f"Model:   Duration: {processed_data['call_duration_seconds']}s")
        
        return True
        
    except PyMongoError as e:
        print(f"Model: ✗ MongoDB error: {e}")
        return False
