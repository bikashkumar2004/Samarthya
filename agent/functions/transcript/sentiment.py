import os
import re
from typing import Dict, List, Tuple
from huggingface_hub import InferenceClient

SUMMARIZATION_MODEL = "facebook/bart-large-cnn"
SENTIMENT_MODEL = "cardiffnlp/twitter-roberta-base-sentiment-latest"

def format_transcript(transcript_data: List[Dict]) -> str:
    """Format transcript into readable conversation text."""
    conversation = []
    for entry in transcript_data:
        role = entry.get('role', 'speaker').capitalize()
        content = entry.get('content', '').strip()
        if content:
            conversation.append(f"{role}: {content}")
    return "\n".join(conversation)

def get_api_token() -> str:
    """Retrieve Hugging Face API token from environment variables."""
    token = os.getenv("HUGGINGFACEHUB_API_TOKEN") or os.getenv("HF_TOKEN")
    if not token:
        raise ValueError("HUGGINGFACEHUB_API_TOKEN or HF_TOKEN not set in environment")
    return token

def generate_fallback_summary(transcript_data: List[Dict]) -> str:
    """Intelligent fallback summary generator if remote API is unavailable."""
    user_messages = [e.get('content', '') for e in transcript_data if e.get('role') == 'user' and e.get('content')]
    assistant_messages = [e.get('content', '') for e in transcript_data if e.get('role') == 'assistant' and e.get('content')]
    
    # Check for greeting or purpose statement in first assistant turn
    purpose = ""
    if assistant_messages:
        first_turn = assistant_messages[0]
        match = re.search(r"calling about (.*)", first_turn, re.IGNORECASE)
        if match:
            purpose = match.group(1).strip()

    if purpose and user_messages:
        return f"Customer called regarding {purpose}. Customer mentioned: '{user_messages[0]}'. Further follow-up requested."
    elif purpose:
        return f"Call conducted regarding {purpose}. Conversation recorded with {len(transcript_data)} turns."
    elif user_messages:
        return f"Customer inquired about: {user_messages[0]}. Total {len(transcript_data)} conversation turns logged."
    
    return "Call completed. Transcript logged."

def analyze_transcript_data(transcript_data: List[Dict]) -> Tuple[str, str]:
    """
    Analyze transcript using specialized Hugging Face models:
    - Summarization: facebook/bart-large-cnn
    - Sentiment: cardiffnlp/twitter-roberta-base-sentiment-latest
    """
    if not transcript_data:
        return ("Neutral", "No transcript data available")

    formatted_text = format_transcript(transcript_data)
    overall_sentiment = "Neutral"
    summary = ""

    try:
        token = get_api_token()

        # 1. Generate Summary using facebook/bart-large-cnn
        try:
            sum_client = InferenceClient(model=SUMMARIZATION_MODEL, api_key=token, timeout=20)
            # Truncate to first 2000 chars to fit context window
            input_text = formatted_text[:2000]
            resp = sum_client.summarization(input_text)
            if hasattr(resp, 'summary_text') and resp.summary_text:
                summary = resp.summary_text.strip()
            elif isinstance(resp, dict) and 'summary_text' in resp:
                summary = resp['summary_text'].strip()
        except Exception as sum_err:
            print(f"Sentiment/Summary: HF summarization notice: {sum_err}")
            summary = generate_fallback_summary(transcript_data)

        # 2. Analyze Sentiment using cardiffnlp/twitter-roberta-base-sentiment-latest
        try:
            # Analyze user input primarily, or full text
            user_texts = [e.get('content', '') for e in transcript_data if e.get('role') == 'user']
            text_for_sentiment = " ".join(user_texts)[:500] if user_texts else formatted_text[:500]
            
            sent_client = InferenceClient(model=SENTIMENT_MODEL, api_key=token, timeout=15)
            sent_res = sent_client.text_classification(text_for_sentiment)
            
            if sent_res:
                best_label = max(sent_res, key=lambda x: getattr(x, 'score', 0))
                label_name = getattr(best_label, 'label', 'neutral').capitalize()
                if label_name in ["Positive", "Negative", "Neutral"]:
                    overall_sentiment = label_name
        except Exception as sent_err:
            print(f"Sentiment/Summary: HF sentiment classification notice: {sent_err}")
            overall_sentiment = "Neutral"

        if not summary:
            summary = generate_fallback_summary(transcript_data)

        return (overall_sentiment, summary)

    except Exception as e:
        print(f"Sentiment analysis fallback (reason: {e})")
        return ("Neutral", generate_fallback_summary(transcript_data))
