"""
Post-Call Intelligence Pipeline using LangChain & Structured Outputs.
Extracts structured executive summaries, sentiment ratings, actionable CRM tasks,
and drafts customer follow-up messages from call transcripts.
"""

import datetime
import json
import os
import re
from typing import Dict, List, Optional
from pymongo import MongoClient
from bson import ObjectId

try:
    from pydantic import BaseModel, Field
except ImportError:
    # Graceful fallback if pydantic is not yet installed in the current environment
    class BaseModel:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)
        def model_dump(self):
            return {k: (v.model_dump() if hasattr(v, "model_dump") else v) for k, v in self.__dict__.items()}
        def dict(self):
            return self.model_dump()

    def Field(*args, default=None, default_factory=None, **kwargs):
        if default_factory is not None:
            return default_factory()
        return default

# Schemas for Structured Output
class CallActionItem(BaseModel):
    task_title: str = Field(description="Clear, actionable task description for CRM agents")
    priority: str = Field(description="Priority level: Low, Medium, or High", default="Medium")
    category: str = Field(description="Category e.g. Prescription, Delivery, Support, Follow-up", default="Follow-up")


class PostCallAnalysis(BaseModel):
    summary: str = Field(description="Concise 2-3 sentence executive summary of the phone conversation")
    sentiment_overall: str = Field(description="Positive, Negative, or Neutral")
    sentiment_score: float = Field(description="Estimated sentiment score from -1.0 to 1.0", default=0.0)
    sentiment_reasoning: str = Field(description="Why the customer felt this way", default="")
    key_topics: List[str] = Field(description="List of key topics or drug names discussed", default_factory=list)
    action_items: List[CallActionItem] = Field(description="Actionable tasks required after this call", default_factory=list)
    draft_followup_message: str = Field(description="Draft SMS or email message ready to send to the customer", default="")


def format_transcript_for_prompt(transcript_data: List[Dict]) -> str:
    """Formats transcript entries into standard conversation dialogue."""
    lines = []
    for entry in transcript_data:
        role = entry.get("role", "Speaker").capitalize()
        content = entry.get("content", "").strip()
        if content:
            lines.append(f"{role}: {content}")
    return "\n".join(lines)


def _heuristic_analysis(transcript_data: List[Dict], customer_name: str = "Customer") -> PostCallAnalysis:
    """
    Intelligent local fallback analyzer ensuring zero downtime even without external LLM keys.
    """
    user_texts = [e.get("content", "") for e in transcript_data if e.get("role") == "user" and e.get("content")]
    assistant_texts = [e.get("content", "") for e in transcript_data if e.get("role") == "assistant" and e.get("content")]
    all_text = " ".join(user_texts + assistant_texts).lower()

    # Detect topics and medications
    common_meds = [
        "aspirin", "ibuprofen", "paracetamol", "acetaminophen", "tramadol",
        "amoxicillin", "azithromycin", "ciprofloxacin", "cetirizine", "omeprazole",
        "metformin", "atorvastatin", "lisinopril"
    ]
    detected_topics = [med.capitalize() for med in common_meds if med in all_text]
    if "order" in all_text or "buy" in all_text or "purchase" in all_text:
        detected_topics.append("Order Management")
    if "delivery" in all_text or "shipping" in all_text:
        detected_topics.append("Delivery & Shipping")
    if "prescription" in all_text or "doctor" in all_text:
        detected_topics.append("Prescription Verification")

    # Determine sentiment
    pos_words = ["thank", "great", "good", "perfect", "appreciate", "helpful", "awesome", "yes"]
    neg_words = ["bad", "wrong", "upset", "angry", "terrible", "late", "error", "cancel", "pain", "expensive"]
    pos_count = sum(1 for w in pos_words if w in all_text)
    neg_count = sum(1 for w in neg_words if w in all_text)

    if pos_count > neg_count and pos_count >= 2:
        sentiment = "Positive"
        score = 0.6
        reasoning = "Customer expressed satisfaction and positive feedback during the interaction."
    elif neg_count > pos_count and neg_count >= 2:
        sentiment = "Negative"
        score = -0.5
        reasoning = "Customer voiced concerns, pain points, or frustrations."
    else:
        sentiment = "Neutral"
        score = 0.0
        reasoning = "Standard professional inquiry with balanced tone."

    # Build summary
    if detected_topics and user_texts:
        summary = f"Customer inquired about {', '.join(detected_topics[:3])}. The agent provided product guidance and assistance."
    elif user_texts:
        summary = f"Customer called regarding '{user_texts[0][:80]}'. Total {len(transcript_data)} conversation turns logged."
    else:
        summary = "Phone consultation conducted with customer."

    # Generate Action Items
    action_items = []
    if "order" in all_text:
        action_items.append(CallActionItem(
            task_title=f"Verify and dispatch order for {customer_name}",
            priority="High",
            category="Order"
        ))
    if "prescription" in all_text or any(m in ["tramadol", "amoxicillin", "metformin"] for m in all_text.split()):
        action_items.append(CallActionItem(
            task_title=f"Request and verify doctor prescription from {customer_name}",
            priority="High",
            category="Prescription"
        ))
    if not action_items:
        action_items.append(CallActionItem(
            task_title=f"Log call record and check if {customer_name} requires further assistance",
            priority="Low",
            category="Follow-up"
        ))

    draft_msg = (
        f"Hi {customer_name}, thank you for calling Whitespace Pharmacy! "
        f"Following up on our conversation today regarding your inquiry. "
        f"If you have any further questions, please reply to this message or call us back."
    )

    return PostCallAnalysis(
        summary=summary,
        sentiment_overall=sentiment,
        sentiment_score=score,
        sentiment_reasoning=reasoning,
        key_topics=detected_topics,
        action_items=action_items,
        draft_followup_message=draft_msg
    )


def run_post_call_chain(transcript_data: List[Dict], customer_name: str = "Customer") -> PostCallAnalysis:
    """
    Executes LangChain structured analysis over the conversation transcript.
    Falls back gracefully to local analysis if external LLM inference is unavailable.
    """
    if not transcript_data:
        return _heuristic_analysis([], customer_name)

    formatted_transcript = format_transcript_for_prompt(transcript_data)

    # Check for Hugging Face or OpenAI or Gemini environment tokens
    hf_token = os.getenv("HUGGINGFACEHUB_API_TOKEN") or os.getenv("HF_TOKEN")
    openai_key = os.getenv("OPENAI_API_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

    # If OpenAI API Key is available, use LangChain ChatOpenAI with structured output
    if openai_key:
        try:
            from langchain_core.prompts import ChatPromptTemplate
            from langchain_openai import ChatOpenAI

            llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2, api_key=openai_key)
            structured_llm = llm.with_structured_output(PostCallAnalysis)

            prompt = ChatPromptTemplate.from_messages([
                ("system", "You are an expert CRM voice call analyst for Whitespace CRM Pharmacy. "
                           "Analyze the phone transcript and produce structured insights."),
                ("human", "Customer Name: {customer_name}\n\nTranscript:\n{transcript}")
            ])
            chain = prompt | structured_llm
            result = chain.invoke({"customer_name": customer_name, "transcript": formatted_transcript})
            if result:
                return result
        except Exception as e:
            print(f"[PostCallChain] OpenAI LangChain notice: {e}")

    # If Gemini API Key is available, use Gemini
    if gemini_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt_text = (
                f"Analyze this customer service phone call transcript for Whitespace CRM.\n"
                f"Customer Name: {customer_name}\n"
                f"Transcript:\n{formatted_transcript}\n\n"
                f"Return valid JSON matching this schema:\n"
                f"{json.dumps(PostCallAnalysis.model_json_schema())}"
            )
            response = model.generate_content(prompt_text)
            clean_json = re.search(r"\{.*\}", response.text, re.DOTALL)
            if clean_json:
                data = json.loads(clean_json.group(0))
                return PostCallAnalysis(**data)
        except Exception as e:
            print(f"[PostCallChain] Gemini notice: {e}")

    # If Hugging Face token is available, we can augment with HF models or return robust analysis
    return _heuristic_analysis(transcript_data, customer_name)


def save_action_items_to_crm_tasks(action_items: List[CallActionItem], customer_id: str, call_id: str):
    """
    Saves extracted action items into the MongoDB 'taskdetails' collection
    so they immediately populate the Whitespace CRM Task Management dashboard.
    """
    mongo_uri = os.getenv("MONGODB_URI") or os.getenv("MONGODB_URL")
    if not mongo_uri or not action_items:
        return

    try:
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=3000)
        db_name = os.getenv("MONGODB_DB", "whitespace-crm")
        db = client[db_name]
        collection = db["taskdetails"]

        now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

        inserted_count = 0
        for item in action_items:
            task_doc = {
                "taskId": f"TASK-{call_id[-6:] if call_id else '000'}-{inserted_count+1}",
                "fileName": f"Call Action: {item.task_title}",
                "rows": 1,
                "userId": ObjectId(customer_id) if (customer_id and len(customer_id) == 24) else None,
                "priority": item.priority,
                "category": item.category,
                "call_id": call_id,
                "dateTime": now_str,
                "status": "Pending",
                "createdAt": datetime.datetime.now(),
                "updatedAt": datetime.datetime.now()
            }
            collection.insert_one(task_doc)
            inserted_count += 1

        print(f"[PostCallChain] Successfully inserted {inserted_count} tasks into MongoDB 'taskdetails'")

    except Exception as e:
        print(f"[PostCallChain] Error saving tasks to MongoDB: {e}")


if __name__ == "__main__":
    sample_transcript = [
        {"role": "assistant", "content": "Hello Alex! How can I assist you today?"},
        {"role": "user", "content": "Hi, I have a terrible headache and fever. Do you have Ibuprofen in stock and how much is it?"},
        {"role": "assistant", "content": "Yes Alex, we have Ibuprofen 400mg in stock for $7.99 for 20 tablets. It is great for headache and fever relief."},
        {"role": "user", "content": "That sounds great, please place an order for one pack for Alex Johnson."},
        {"role": "assistant", "content": "Order #1 has been confirmed for 1 pack of Ibuprofen 400mg. Total is $7.99."}
    ]

    analysis = run_post_call_chain(sample_transcript, "Alex Johnson")
    print("\n--- POST CALL ANALYSIS RESULT ---")
    print(f"Summary:    {analysis.summary}")
    print(f"Sentiment:  {analysis.sentiment_overall} (Score: {analysis.sentiment_score})")
    print(f"Reasoning:  {analysis.sentiment_reasoning}")
    print(f"Topics:     {analysis.key_topics}")
    print(f"Tasks:      {[t.task_title for t in analysis.action_items]}")
    print(f"Follow-up:  {analysis.draft_followup_message}")
