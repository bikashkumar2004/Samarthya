"""
Pre-Call Dynamic Context Retriever (RAG from CRM & Historical Calls).
Fetches customer profile, recent call summaries, and pending follow-ups
from MongoDB before call connection to ground the AI agent's prompt.
"""

import os
from typing import Dict, List, Optional
from bson import ObjectId
from pymongo import MongoClient


def _get_db():
    """Retrieve shared MongoDB client and database."""
    mongo_uri = os.getenv("MONGODB_URI") or os.getenv("MONGODB_URL")
    if not mongo_uri:
        return None
    db_name = os.getenv("MONGODB_DB", "whitespace-crm")
    try:
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=3000)
        return client[db_name]
    except Exception as e:
        print(f"[CustomerContext] Warning: MongoDB connection error: {e}")
        return None


def get_customer_history(customer_id_str: str, limit_calls: int = 3) -> Dict:
    """
    Retrieves customer profile and recent call history from MongoDB.
    """
    db = _get_db()
    if db is None:
        return {"customer": {}, "recent_calls": [], "summary_context": ""}

    customer_doc = {}
    is_valid_oid = ObjectId.is_valid(customer_id_str) if customer_id_str else False

    try:
        if is_valid_oid:
            obj_id = ObjectId(customer_id_str)
            # Check uploaddetails first (standard in whitespace-crm)
            customer_doc = db.uploaddetails.find_one({"_id": obj_id})
            if not customer_doc:
                customer_doc = db.contactdetails.find_one({"_id": obj_id}) or {}
        else:
            customer_doc = db.uploaddetails.find_one({"customer_id": customer_id_str}) or {}
    except Exception as e:
        print(f"[CustomerContext] Notice: Customer lookup error for ID '{customer_id_str}': {e}")
        customer_doc = {}

    # Query recent calls for this customer
    recent_calls: List[Dict] = []
    try:
        # Match by ObjectId if valid, or string match
        if is_valid_oid:
            query = {"$or": [{"customer_id": ObjectId(customer_id_str)}, {"customer_id": customer_id_str}]}
        else:
            query = {"customer_id": customer_id_str}

        cursor = db.calls.find(query).sort("createdAt", -1).limit(limit_calls)
        for doc in cursor:
            recent_calls.append({
                "call_id": str(doc.get("call_id", "")),
                "date": str(doc.get("call_start_iso", doc.get("createdAt", "")))[:10],
                "summary": doc.get("summary", "").strip(),
                "sentiment": doc.get("sentiment_overall", "Neutral"),
                "duration": doc.get("call_duration_seconds", 0)
            })
    except Exception as e:
        print(f"[CustomerContext] Notice: Error querying past calls: {e}")

    return {
        "customer": customer_doc,
        "recent_calls": recent_calls
    }


def build_pre_call_briefing(customer_id_str: str, customer_data: Optional[Dict] = None) -> str:
    """
    Synthesizes customer data and past call history into an enriched, concise
    briefing string to inject into the voice agent's dynamic LLM prompt.
    """
    if customer_data is None or not customer_data:
        history_data = get_customer_history(customer_id_str)
        customer_data = history_data.get("customer", {})
        recent_calls = history_data.get("recent_calls", [])
    else:
        # We already have customer profile, just fetch recent calls
        history_data = get_customer_history(customer_id_str)
        recent_calls = history_data.get("recent_calls", [])

    name = customer_data.get("name", "there")
    purpose = (customer_data.get("description") or "").strip()
    phone = customer_data.get("phone", "")

    briefing_parts = [
        f"Customer Name: {name}",
        f"Call Purpose: {purpose or 'General consultation & assistance'}"
    ]

    if phone:
        briefing_parts.append(f"Phone Number: {phone}")

    if recent_calls:
        briefing_parts.append("\nPREVIOUS INTERACTION HISTORY:")
        for idx, call in enumerate(recent_calls, 1):
            summary = call.get("summary") or "General inquiry completed."
            sentiment = call.get("sentiment", "Neutral")
            date = call.get("date", "Earlier")
            briefing_parts.append(
                f"- Past Call {idx} ({date}): Summary: {summary} (Customer Mood: {sentiment})"
            )
        briefing_parts.append("Note: If relevant, warmly reference past interactions to personalize the experience.")
    else:
        briefing_parts.append("History: This is the customer's first recorded call with us. Welcome them warmly.")

    return "\n".join(briefing_parts)


if __name__ == "__main__":
    # Test with dummy or local customer ID
    briefing = build_pre_call_briefing("66f0123456789abcdef01234", {
        "name": "Alex Johnson",
        "description": "Inquiring about prescription refill and delivery options",
        "phone": "+1 (555) 234-5678"
    })
    print("Generated Pre-Call Briefing:\n")
    print(briefing)
