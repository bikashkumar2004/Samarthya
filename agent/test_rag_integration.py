import asyncio
import json
from functions.rag.knowledge_base import query_knowledge_base
from functions.rag.tools import execute_tool, format_function_response, DEEPGRAM_TOOL_DEFINITIONS
from functions.rag.customer_context import build_pre_call_briefing
from functions.rag.post_call_chain import run_post_call_chain
from main import build_config

print("=== 1. TEST RAG KNOWLEDGE SEARCH ===")
queries = [
    "What are the indications and side effects for Aspirin?",
    "Do you deliver same day and how much does it cost?",
    "Can I return opened prescription medication?",
    "What is the dosage for Amoxicillin?"
]
for q in queries:
    res = query_knowledge_base(q)
    print(f"\n[Query]: {q}")
    print(f"[Results]: {res['results_count']} doc(s) matched")
    print(f"[Speech]: {res['speech_summary'][:180]}...")

print("\n=== 2. TEST DEEPGRAM TOOL EXECUTION ===")
# Simulate FunctionCallRequest for search_knowledge_base
rag_tool_res = execute_tool("search_knowledge_base", {"query": "tramadol prescription requirement"})
print("[Tool RAG Result]:", rag_tool_res["speech_response"][:140], "...")

# Simulate FunctionCallRequest for place_order
order_tool_res = execute_tool("place_order", {
    "customer_name": "Sarah Miller",
    "drug_name": "Ibuprofen",
    "quantity": 2
})
print("[Tool Order Result]:", order_tool_res["speech_response"])

# Test format_function_response
response_packet = format_function_response("call_abc123", order_tool_res)
print("[Formatted Packet Type]:", response_packet["type"])
print("[Formatted Packet ID]:", response_packet["function_call_id"])

print("\n=== 3. TEST PRE-CALL DYNAMIC BRIEFING ===")
mock_customer = {
    "name": "Sarah Miller",
    "description": "Needs refill for regular pain medication",
    "phone": "+1-800-555-0199"
}
briefing = build_pre_call_briefing("mock_cust_id", mock_customer)
print(briefing)

print("\n=== 4. TEST BUILD_CONFIG INTEGRATION ===")
cfg = build_config(mock_customer, customer_id="mock_cust_id")
print(f"Think Provider: {cfg['agent']['think']['provider']['type']}")
print(f"Registered Tools: {[f['name'] for f in cfg['agent']['think']['functions']]}")
print(f"Prompt Length: {len(cfg['agent']['think']['prompt'])} characters")

print("\n=== 5. TEST POST-CALL LANGCHAIN CHAIN ===")
sample_transcript = [
    {"role": "assistant", "content": "Hello Sarah! How can I assist you today?"},
    {"role": "user", "content": "Hi, I need to order two packs of Ibuprofen please."},
    {"role": "assistant", "content": "Certainly Sarah, that is $15.98 total. Order #1 has been confirmed."},
    {"role": "user", "content": "Thank you so much, that was very quick and helpful!"},
    {"role": "assistant", "content": "You are welcome Sarah! Have a wonderful day."}
]
analysis = run_post_call_chain(sample_transcript, customer_name="Sarah Miller")
print(f"Summary:   {analysis.summary}")
print(f"Sentiment: {analysis.sentiment_overall} (Score: {analysis.sentiment_score})")
print(f"Tasks:     {[t.task_title for t in analysis.action_items]}")
print(f"Follow-up: {analysis.draft_followup_message}")

print("\nALL INTEGRATION TESTS COMPLETED SUCCESSFULLY!")
