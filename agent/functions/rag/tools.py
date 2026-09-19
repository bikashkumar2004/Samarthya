"""
Deepgram Function Calling Tool Router & Definitions.
Integrates live in-call RAG search, order placement, and order lookup
with Deepgram's Speech-to-Speech WebSocket agent.
"""

import json
from typing import Any, Dict, List
from .knowledge_base import query_knowledge_base
import functions.testing.pharmacy_functions as pharmacy_functions

# Deepgram Think Provider Function Specifications
DEEPGRAM_TOOL_DEFINITIONS = [
    {
        "name": "search_knowledge_base",
        "description": "Searches the pharmacy knowledge base for medication indications, dosages, side effects, prices, prescriptions, FAQs, delivery terms, and customer support rules.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The customer's question, symptom, medication name, or topic to look up"
                }
            },
            "required": ["query"]
        }
    },
    {
        "name": "place_order",
        "description": "Places a medication order for a customer. Confirm the customer's full name, medication name, and quantity before placing.",
        "parameters": {
            "type": "object",
            "properties": {
                "customer_name": {
                    "type": "string",
                    "description": "Full name of the customer"
                },
                "drug_name": {
                    "type": "string",
                    "description": "Name of the medication requested"
                },
                "quantity": {
                    "type": "integer",
                    "description": "Number of units or packs requested (default 1)"
                }
            },
            "required": ["customer_name", "drug_name"]
        }
    },
    {
        "name": "lookup_order",
        "description": "Retrieves current status and details for an existing order by its numeric Order ID.",
        "parameters": {
            "type": "object",
            "properties": {
                "order_id": {
                    "type": "integer",
                    "description": "The numeric Order ID given to the customer"
                }
            },
            "required": ["order_id"]
        }
    }
]


def execute_tool(function_name: str, arguments: Any) -> Dict[str, Any]:
    """
    Executes a function call requested by Deepgram's Voice Agent and returns
    a clean, speech-friendly JSON response dictionary.
    """
    # Parse arguments if passed as JSON string
    if isinstance(arguments, str):
        try:
            args = json.loads(arguments)
        except Exception:
            args = {"raw": arguments}
    elif isinstance(arguments, dict):
        args = arguments
    else:
        args = {}

    print(f"[RAG Tools] Executing '{function_name}' with args: {args}")

    try:
        if function_name == "search_knowledge_base":
            query = args.get("query") or args.get("raw") or ""
            res = query_knowledge_base(query, top_k=2)
            return {
                "status": "success",
                "speech_response": res.get("speech_summary", "No details found."),
                "matched_count": res.get("results_count", 0)
            }

        elif function_name == "place_order":
            customer = args.get("customer_name", "").strip()
            drug = args.get("drug_name", "").strip()
            qty = args.get("quantity", 1)
            order_res = pharmacy_functions.place_order(customer, drug, qty)
            return {
                "status": "success" if "order_id" in order_res else "error",
                "order_details": order_res,
                "speech_response": order_res.get("message") or order_res.get("error", "Order failed.")
            }

        elif function_name == "lookup_order":
            order_id = args.get("order_id")
            lookup_res = pharmacy_functions.lookup_order(order_id)
            if "error" in lookup_res:
                return {
                    "status": "not_found",
                    "speech_response": lookup_res["error"]
                }
            return {
                "status": "success",
                "speech_response": (
                    f"Order #{lookup_res.get('order_id')} for {lookup_res.get('customer')} "
                    f"is currently {lookup_res.get('status')}. "
                    f"Items: {lookup_res.get('quantity')} of {lookup_res.get('drug')} for {lookup_res.get('total')}."
                )
            }

        else:
            return {
                "status": "unknown_function",
                "speech_response": f"I don't have an available action for {function_name}."
            }

    except Exception as e:
        print(f"[RAG Tools] Error executing {function_name}: {e}")
        return {
            "status": "error",
            "speech_response": "I encountered an error retrieving that information. Let me connect you with a pharmacist."
        }


def format_function_response(function_id: str, function_name: str, tool_result: Dict[str, Any]) -> Dict[str, Any]:
    """
    Packages the tool execution result into the exact Deepgram FunctionCallResponse schema:
    {
      "type": "FunctionCallResponse",
      "id": function_id,
      "name": function_name,
      "content": string_content
    }
    """
    # Deepgram expects a string in 'content' that the LLM reads to formulate its verbal response
    speech_content = tool_result.get("speech_response")
    if not speech_content:
        speech_content = json.dumps(tool_result, ensure_ascii=False)

    return {
        "type": "FunctionCallResponse",
        "id": function_id,
        "name": function_name,
        "content": speech_content
    }
