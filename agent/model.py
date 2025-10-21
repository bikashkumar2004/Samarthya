import os
import json
import datetime
import google.generativeai as genai

# Configure Gemini API
genai.configure(api_key=os.getenv("API_KEY"))


def generate_summary_and_sentiment(transcript):
    try:
        full_text = "\n".join([f"{t['role']}: {t['content']}" for t in transcript if t.get('content')])
        if not full_text:
            return "No content", "Neutral"

        # Latest SDK correct API call
        response = genai.chat.completions.create(
            model="gemini-1.5-t",
            messages=[
                {"role": "system", "content": "You are an assistant that generates short call summaries and sentiment."},
                {"role": "user", "content": f"Summarize in 20 words and provide sentiment of this call:\n{full_text}"}
            ]
        )

        content = response.choices[0].message.content

        if "Sentiment:" in content:
            parts = content.split("Sentiment:")
            summary = parts[0].strip()
            sentiment = parts[1].strip()
        else:
            summary = content.strip()
            sentiment = "Neutral"

        return summary, sentiment

    except Exception as e:
        print(f"[model] Gemini API failed, using fallback. Error: {e}")
        fallback_summary = (full_text[:50] + "...") if full_text else "No content"
        return fallback_summary, "Neutral"


def store_call_to_db(call_id, customer_id, call_start, transcript, db_file="db.json"):
    try:
        call_duration = None
        if transcript:
            start_time = datetime.datetime.fromisoformat(transcript[0]["timestamp_iso"])
            end_time = datetime.datetime.fromisoformat(transcript[-1]["timestamp_iso"])
            call_duration = (end_time - start_time).total_seconds()

        summary, sentiment = generate_summary_and_sentiment(transcript)

        call_record = {
            "call_id": call_id,
            "customer_id": customer_id,
            "call_start": call_start,
            "call_duration": call_duration,
            "summary": summary,
            "sentiment": sentiment,
            "transcript": transcript
        }

        if os.path.exists(db_file):
            with open(db_file, "r", encoding="utf-8") as f:
                db = json.load(f)
        else:
            db = []

        # Avoid duplicate call_id
        if not any(c["call_id"] == call_id for c in db):
            db.append(call_record)

        with open(db_file, "w", encoding="utf-8") as f:
            json.dump(db, f, indent=2)

        print(f"[model] Saved call {call_id} to {db_file}")

    except Exception as e:
        print(f"[model] Error storing call to DB: {e}")
