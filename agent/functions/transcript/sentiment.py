import json
import os
from huggingface_hub import InferenceClient

os.environ["HUGGINGFACEHUB_API_TOKEN"] = "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"

def format_transcript(transcript_data):
    """Format transcript into conversation text"""
    conversation = []
    for entry in transcript_data:
        role = entry['role'].capitalize()
        content = entry['content']
        conversation.append(f"{role}: {content}")
    return "\n".join(conversation)

def initialize_client():
    """Initialize Hugging Face Inference Client"""
    api_token = os.environ.get("HUGGINGFACEHUB_API_TOKEN")
    if not api_token:
        raise ValueError("HUGGINGFACEHUB_API_TOKEN not set")
    return InferenceClient(model="HuggingFaceH4/zephyr-7b-beta", api_key=api_token)

def analyze_transcript_data(transcript_data):
    """Analyze using Hugging Face - REAL sentiment and summary"""
    try:
        if not transcript_data:
            return ("Neutral", "No transcript data available")
        
        formatted_text = format_transcript(transcript_data)
        client = initialize_client()

        # ===== SUMMARY (Summarization - Works!) =====
        summary = "Call summary not available"
        # try:
        #print(formatted_text)
        #result = client.summarization(formatted_text)
        messages = [
        {
            "role": "user",
            "content": f"""Analyze this customer service conversation and provide:

1. Overall Sentiment: Choose ONLY ONE word - Positive, Negative, or Neutral
2. Summary: Write a concise summary in maximum 100 words covering the purpose, what was discussed, and current status.

Conversation:
{formatted_text}

Provide your response in this exact format:
Overall Sentiment: [Positive/Negative/Neutral]
Summary: [Your 100-word summary here]"""
        }
    ]
    except Exception as e:
        print(e)

    try:
        response = client.chat_completion(
            messages=messages,
            max_tokens=300,
            temperature=0.5,
        )
        
        analysis_text = response.choices[0].message.content
        lines = analysis_text.strip().split('\n')
    
        overall_sentiment = "Neutral"  # Default
        summary = ""
        
        for i, line in enumerate(lines):
            if 'Overall Sentiment:' in line or 'Sentiment:' in line:
                # Extract sentiment
                sentiment_part = line.split(':', 1)[1].strip()
                # Get first word only
                sentiment_word = sentiment_part.split()[0].strip('.,!?')
                if sentiment_word in ['Positive', 'Negative', 'Neutral']:
                    overall_sentiment = sentiment_word
            
            if 'Summary:' in line:
                # Get everything after "Summary:"
                summary = line.split(':', 1)[1].strip()
                # If summary continues on next lines, add them
                if i + 1 < len(lines):
                    for next_line in lines[i+1:]:
                        if next_line.strip() and not ':' in next_line:
                            summary += " " + next_line.strip()
                break
        
        # If summary is empty, try to extract any descriptive text
        if not summary:
            summary = " ".join([l.strip() for l in lines if l.strip() and 'Sentiment:' not in l])
        
        # Limit summary to approximately 100 words
        words = summary.split()
        if len(words) > 100:
            summary = " ".join(words[:100]) + "..."
        return (overall_sentiment, summary)
    
    except Exception as e:
        print(f"Error in analysis: {e}")
        return ("Neutral", "Error analyzing transcript")
