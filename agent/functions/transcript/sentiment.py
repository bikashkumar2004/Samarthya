import json
import os
from huggingface_hub import InferenceClient

# Set your Hugging Face API token
# Get free API token from: https://huggingface.co/settings/tokens
os.environ["HUGGINGFACEHUB_API_TOKEN"] = "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"

# Load the transcript
def load_transcript(file_path):
    """Load transcript from JSON file"""
    with open(file_path, 'r') as f:
        data = json.load(f)
    return data

# Convert transcript to readable format
def format_transcript(transcript_data):
    """Format transcript into conversation text"""
    conversation = []
    for entry in transcript_data:
        role = entry['role'].capitalize()
        content = entry['content']
        conversation.append(f"{role}: {content}")
    return "\n".join(conversation)

# Initialize Hugging Face client
def initialize_client():
    """Initialize Hugging Face Inference Client"""
    api_token = os.environ.get("HUGGINGFACEHUB_API_TOKEN")
    if not api_token or api_token == "your_huggingface_api_token_here":
        raise ValueError("Please set your Hugging Face API token!")
    
    client = InferenceClient(
        model="HuggingFaceH4/zephyr-7b-beta",
        token=api_token
    )
    return client

# Combined Analysis
def analyze_conversation(client, conversation_text):
    """Perform combined sentiment analysis and summary"""
    
    messages = [
        {
            "role": "user",
            "content": f"""Analyze this customer service conversation and provide:

1. Overall Sentiment: Choose ONLY ONE word - Positive, Negative, or Neutral
2. Summary: Write a concise summary in maximum 100 words covering the purpose, what was discussed, and current status.

Conversation:
{conversation_text}

Provide your response in this exact format:
Overall Sentiment: [Positive/Negative/Neutral]
Summary: [Your 100-word summary here]"""
        }
    ]

    try:
        response = client.chat_completion(
            messages=messages,
            max_tokens=300,
            temperature=0.5,
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error in analysis: {str(e)}"

# Parse the analysis response
def parse_analysis(analysis_text):
    """Parse the analysis response into sentiment and summary"""
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
    
    return overall_sentiment, summary


# Main function to call from other files
def get_sentiment_and_summary(transcript_file_path):
    """
    Main function to get sentiment and summary from transcript file.
    
    Args:
        transcript_file_path (str): Path to the transcript JSON file
        
    Returns:
        tuple: (overall_sentiment, summary)
        - overall_sentiment: str - "Positive", "Negative", or "Neutral"
        - summary: str - Concise summary (max 100 words)
    """
    try:
        # Load and format transcript
        transcript_data = load_transcript(transcript_file_path)
        conversation_text = format_transcript(transcript_data)
        
        # Initialize client
        client = initialize_client()
        
        # Perform combined analysis
        analysis_result = analyze_conversation(client, conversation_text)
        
        # Parse the results
        overall_sentiment, summary = parse_analysis(analysis_result)
        
        return overall_sentiment, summary
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return None, None


# Alternative function to analyze from transcript data directly
def analyze_transcript_data(transcript_data):
    """
    Analyze transcript data directly (without file).
    
    Args:
        transcript_data (list): List of transcript dictionaries
        
    Returns:
        tuple: (overall_sentiment, summary)
    """
    try:
        # Format transcript
        conversation_text = format_transcript(transcript_data)
        
        # Initialize client
        client = initialize_client()
        
        # Perform combined analysis
        analysis_result = analyze_conversation(client, conversation_text)
        
        # Parse the results
        overall_sentiment, summary = parse_analysis(analysis_result)
        
        return overall_sentiment, summary
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return None, None


# Keep the main function for standalone testing
def main():
    """Main function for standalone testing"""
    
    try:
        # Load and format transcript
        print("Loading transcript...")
        transcript_data = load_transcript('transcript.json')
        conversation_text = format_transcript(transcript_data)
        
        print("\n" + "="*60)
        print("FORMATTED CONVERSATION")
        print("="*60)
        print(conversation_text)
        
        # Initialize client
        print("\n\nInitializing Hugging Face client...")
        client = initialize_client()
        
        # Perform combined analysis
        print("\n" + "="*60)
        print("ANALYZING CONVERSATION...")
        print("="*60)
        
        analysis_result = analyze_conversation(client, conversation_text)
        
        # Parse the results
        overall_sentiment, summary = parse_analysis(analysis_result)
        
        print("\n" + "="*60)
        print("RESULTS")
        print("="*60)
        print(f"\nOverall Sentiment: {overall_sentiment}")
        print(f"\nSummary:\n{summary}")
        
        # Store results in a clean structure
        results = {
            "overall_sentiment": overall_sentiment,
            "summary": summary,
            "transcript": conversation_text,
            "metadata": {
                "total_messages": len(transcript_data),
                "user_messages": sum(1 for m in transcript_data if m['role'] == 'user'),
                "assistant_messages": sum(1 for m in transcript_data if m['role'] == 'assistant'),
                "start_time": transcript_data[0]['timestamp_iso'],
                "end_time": transcript_data[-1]['timestamp_iso']
            }
        }
        
        # Save results to JSON
        with open('analysis_results.json', 'w') as f:
            json.dump(results, f, indent=2)
        
        print("\n" + "="*60)
        print("Results saved to 'analysis_results.json'")
        print("="*60)
        
        return overall_sentiment, summary
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return None, None


if __name__ == "__main__":
    # Run the analysis when script is run directly
    overall_sentiment, summary = main()
    
    if overall_sentiment and summary:
        print("\n✓ overall_sentiment variable contains: " + overall_sentiment)
        print("✓ summary variable contains the concise summary")
    else:
        print("\n✗ Analysis failed. Please check the error messages above.")