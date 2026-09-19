import asyncio
import base64
from datetime import datetime
import json
import websockets
import os
import sys
import uuid
from dotenv import load_dotenv
import contextlib 
import functions.transcript.transcript_code as transcript_code
import functions.transcript.model as model
from pymongo import MongoClient
from bson import ObjectId
from functions.rag.customer_context import build_pre_call_briefing
from functions.rag.tools import DEEPGRAM_TOOL_DEFINITIONS, execute_tool, format_function_response

# Ensure immediate UTF-8 printing in PowerShell / Windows terminals
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace', line_buffering=True)
    except Exception:
        pass

load_dotenv()
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
mongo_uri = os.getenv("MONGODB_URI") or os.getenv("MONGODB_URL")
mongo_db = os.getenv("MONGODB_DB", "whitespace-crm")

print("==================================================")
print(f"[*] Deepgram Key: {'OK' if DEEPGRAM_API_KEY else 'MISSING'}")
print(f"[*] MongoDB:      {'OK' if mongo_uri else 'MISSING'} (Database: {mongo_db})")
print("==================================================")

client = MongoClient(mongo_uri) if mongo_uri else None

def sts_connect():
    """
    Creates a WebSocket connection to Deepgram's Speech-to-Speech service
    This is where the AI agent processes voice conversations
    """
    if not DEEPGRAM_API_KEY:
        raise Exception("DEEPGRAM_API_KEY not found in environment")
    # Connect to Deepgram's agent service using WebSocket. The API key is passed as a subprotocol for authentication
    print("Deepgram: initiating websocket connect")
    return websockets.connect(
        "wss://agent.deepgram.com/v1/agent/converse",
        subprotocols=["token", DEEPGRAM_API_KEY]
    )


def load_config():
    """
    Loads configuration settings from config.json file
    This file contains settings for how the AI agent should behave
    """
    with open("config.json", "r") as f:
        return json.load(f)


def build_config(customer_data, customer_id=None):
    cfg = load_config()
    
    try:
        # Extract customer information
        name = customer_data.get("name", "there")
        purpose = (customer_data.get("description") or "General assistance").strip()
        
        # Build enriched dynamic prompt with pre-call customer context & historical RAG
        pre_call_context = build_pre_call_briefing(str(customer_id) if customer_id else "", customer_data)
        
        dynamic_prompt = (
            f"You are a knowledgeable, direct, and proactive pharmacy AI voice assistant for Whitespace Pharmacy.\n\n"
            f"{pre_call_context}\n\n"
            f"CRITICAL INSTRUCTIONS FOR ANSWERING CUSTOMERS:\n"
            f"1. ANSWER IMMEDIATELY & DIRECTLY: When the customer asks about medicines, fever, cold, cough, headache, or pain, immediately answer with the recommended medication, dosage, and price.\n"
            f"   - For fever / cold / body ache: Recommend Paracetamol / Acetaminophen 500mg ($6.99 for 25 tablets, brands Dolo/Crocin/Tylenol) or Ibuprofen 400mg ($7.99 for 20 tablets, Advil).\n"
            f"   - For allergy / runny nose: Recommend Cetirizine 10mg ($8.99 for 30 tablets).\n"
            f"2. NEVER SAY 'COULD YOU CLARIFY' OR 'FINISH YOUR THOUGHT': Even if phone audio is brief or has an accent (e.g. sounds like 'paper' or 'parity payment'), recognize they mean fever/cold medicine or Paracetamol. Answer helpfully without commenting on audio or accents.\n"
            f"3. PROACTIVE & CONCISE: State the solution in 1-2 short sentences, then ask: 'Would you like me to place an order for you?'\n"
            f"4. TOOLS: Use `search_knowledge_base` to check medications, doses, prices, or policies. Use `place_order` when the customer agrees to purchase.\n"
        )
        
        # Build natural greeting text
        if "cold" in purpose.lower() or "fever" in purpose.lower():
            greeting_text = f"Hello {name}! This is Whitespace Pharmacy. I understand you are experiencing cold and fever symptoms. How are you feeling right now, and how can I help you with your medications?"
        elif purpose and purpose != "General assistance":
            greeting_text = f"Hello {name}! This is Whitespace Pharmacy calling regarding your inquiry. How can I assist you today?"
        else:
            greeting_text = f"Hello {name}! This is Whitespace Pharmacy. How can I assist you with your medications today?"
        
        # Update config with dynamic prompt and registered tools
        cfg["agent"]["think"]["prompt"] = dynamic_prompt
        cfg["agent"]["think"]["functions"] = DEEPGRAM_TOOL_DEFINITIONS
        cfg["agent"]["greeting"] = greeting_text
        
        # Print for debugging
        print(f"[Config] Customer: {name}")
        print(f"[Config] Purpose: {purpose or 'General assistance'}")
        print(f"[Config] Registered {len(DEEPGRAM_TOOL_DEFINITIONS)} Deepgram RAG tools")
        
    except Exception as e:
        print(f"Error fetching customer config: {e}")
        print("Falling back to default config")
    
    return cfg

    

def fetch_customer_config(customer_id):
    """
    Fetches customer data from MongoDB uploaddetails or contactdetails.
    Falls back gracefully without crashing if customer is not found.
    """
    if not client or not customer_id or customer_id == "guest":
        return {"name": "there", "description": "General assistance"}

    try:
        db = client[mongo_db]
        is_oid = ObjectId.is_valid(customer_id) if isinstance(customer_id, str) else isinstance(customer_id, ObjectId)
        query = {"_id": ObjectId(customer_id)} if is_oid else {"$or": [{"customer_id": customer_id}, {"_id": customer_id}]}
        customer = db.uploaddetails.find_one(query) or db.contactdetails.find_one(query)
        if customer:
            return customer
    except Exception as e:
        print(f"Notice looking up customer {customer_id}: {e}")

    print(f"Notice: Customer {customer_id} not found in DB. Using default profile.")
    return {"name": "there", "description": "General assistance"}

async def handle_barge_in(decoded, twilio_ws, streamsid):
    """
    Handles interruptions when user starts speaking while AI is talking
    This creates natural conversation flow by stopping AI when user interrupts
    """
    # Check if user started speaking
    if decoded.get("type") == "UserStartedSpeaking":
        # Send clear command to Twilio to stop current audio playback
        await twilio_ws.send(json.dumps({"event": "clear", "streamSid": streamsid}))

async def handle_text_message(decoded, twilio_ws, sts_ws, streamsid, transcript_session=None):
    """
    Processes text-based messages from Deepgram and appends to transcript
    Handles user interruptions, live function calls, and transcription events
    """
    await handle_barge_in(decoded, twilio_ws, streamsid)

    msg_type = decoded.get("type", "")

    # Handle Deepgram Function Calling (In-Call Real-Time RAG & Orders)
    if msg_type == "FunctionCallRequest":
        functions_list = decoded.get("functions")
        if not functions_list:
            functions_list = [{
                "id": decoded.get("id") or decoded.get("function_call_id", ""),
                "name": decoded.get("name") or decoded.get("function_name", ""),
                "arguments": decoded.get("arguments") or decoded.get("input", {})
            }]

        for fn in functions_list:
            fn_id = fn.get("id", "")
            fn_name = fn.get("name", "")
            raw_args = fn.get("arguments", {})

            # Parse JSON string arguments if needed
            if isinstance(raw_args, str):
                try:
                    fn_args = json.loads(raw_args)
                except Exception:
                    fn_args = {"query": raw_args}
            else:
                fn_args = raw_args or {}

            print(f"[Deepgram Tool] Executing: {fn_name} (id={fn_id}) with args: {fn_args}")
            tool_result = execute_tool(fn_name, fn_args)
            response_msg = format_function_response(fn_id, fn_name, tool_result)
            await sts_ws.send(json.dumps(response_msg))
            print(f"[Deepgram Tool] Sent FunctionCallResponse for {fn_name}: {response_msg['content'][:80]}...")

    if transcript_session:
        content = decoded.get("content", "")
        role = decoded.get("role", "").lower()
        
        if msg_type == "ConversationText" and content:
            if "assistant" in role or "agent" in role:
                transcript_session.append("assistant", content)
                print(f"[Live Transcript] Assistant: {content}")
            elif any(u in role for u in ("user", "customer", "human", "client")):
                transcript_session.append("user", content)
                print(f"[Live Transcript] User: {content}")
            else:
                transcript_session.append(role or "speaker", content)
                print(f"[Live Transcript] {role}: {content}")
                
async def sts_sender(sts_ws, audio_queue):
    """
    Continuously sends audio data from Twilio Receiver to Deepgram
    This takes incoming voice from phone call and sends it to AI for processing
    """
    count = 0
    while True:
        # Wait for audio chunk from the queue
        chunk = await audio_queue.get()
        # Send audio chunk to Deepgram for processing
        await sts_ws.send(chunk)
        count += 1
        if count % 50 == 0:
            print(f"STS Sender: Sent to Deepgram: {count} chunks")  # DEBUG: sender throttle

async def sts_receiver(sts_ws, twilio_ws, streamsid_queue, transcript_session=None):
    """
    Receives messages from Deepgram and processes them
    This handles both AI responses and transcription data
    Text messages: Transcripts, user interruptions, function calls
    Binary audio: AI speech response
    """
    # Get the stream ID for this call
    streamsid = await streamsid_queue.get()
    print(f"STS Receiver: Deepgram attached to streamSid={streamsid}")
    
    # Listen for messages from Deepgram
    async for message in sts_ws:
        if isinstance(message, str):
            # This is a text message (transcription, function calls, etc.)
            try:
                decoded = json.loads(message)
            except Exception:
                # If JSON parsing fails, treat as raw text
                decoded = {"type": "raw", "content": message}
            print(f"STS Receiver: Text event: type={decoded.get('type','raw')}")
            print(decoded)
            
            # Handle the message (interruptions, function calls, etc.)
            await handle_text_message(decoded, twilio_ws, sts_ws, streamsid, transcript_session)
        else:
            # This is audio data (AI speaking response)
            # Convert binary audio to base64 and send to Twilio for playback
            audio_bytes = len(message)
            await twilio_ws.send(json.dumps({
                "event": "media",
                "streamSid": streamsid,
                "media": {"payload": base64.b64encode(message).decode("ascii")}
            }))
            #print(f"Deepgram TTS audio: {audio_bytes} bytes -> Twilio")


async def twilio_receiver(twilio_ws, audio_queue, streamsid_queue, ctx, ready_evt):
    """
    Receives audio from phone call
    Buffers into 3200-byte chunks (20×160)
    Puts chunks in audio queue
    """
    BUFFER_SIZE = 20 * 160
    inbuffer = bytearray()
    async for message in twilio_ws:
        data = json.loads(message)
        event = data.get("event")
        if event == "start":
            start = data.get("start", {})
            streamsid = start.get("streamSid")
            if streamsid:
                streamsid_queue.put_nowait(streamsid)
            # capture IDs and purpose from customParameters (supporting both customer_id and customerId)
            ctx["call_id"] = start.get("callSid") or ctx.get("call_id")
            cp = start.get("customParameters") or {}
            ctx["customer_id"] = cp.get("customer_id") or cp.get("customerId") or ctx.get("customer_id")
            ready_evt.set()
            print(f"Receiver: streamSid={streamsid}, callSid={ctx['call_id']}, "
                  f"customer_id={ctx['customer_id']}")
            
        elif event == "media":
            media = data.get("media", {})
            payload = media.get("payload")
            track = media.get("track")
            if payload and track == "inbound":
                inbuffer.extend(base64.b64decode(payload))
        elif event == "stop":
            break
        while len(inbuffer) >= BUFFER_SIZE:
            #print(f"Flush to Deepgram: {BUFFER_SIZE} bytes")
            audio_queue.put_nowait(inbuffer[:BUFFER_SIZE])
            inbuffer = inbuffer[BUFFER_SIZE:]



async def twilio_handler(twilio_ws):
    print("=== NEW CALL CONNECTION ===")
    # Immediately reset local_db/transcript.json for this fresh call connection
    transcript_code.reset_transcript_file()
    ctx = {"call_id": None, "customer_id": None}
    purpose_ready = asyncio.Event()
    audio_queue = asyncio.Queue()
    streamsid_queue = asyncio.Queue()
    
    call_id = None
    transcript_session = None

    async with sts_connect() as sts_ws:
        print("Deepgram: connected")
        # Start Twilio receiver first so we can read 'start' quickly
        twilio_task = asyncio.create_task(
            twilio_receiver(twilio_ws, audio_queue, streamsid_queue, ctx, purpose_ready)
        )
        print("Handler: Receiver task started")

        # Wait for customer_id from Twilio start event (with safe fallback)
        try:
            print("Handler: Waiting for Twilio start/customParameters...")
            await asyncio.wait_for(purpose_ready.wait(), timeout=4.0)
        except asyncio.TimeoutError:
            print("Handler Notice: Timeout waiting for customParameters, continuing with defaults")
        except Exception as e:
            print(f"Handler Notice: {e}")

        call_id = ctx.get("call_id") or f"CALL-{uuid.uuid4().hex[:8]}"
        customer_id = ctx.get("customer_id") or "guest"
        
        transcript_session = transcript_code.create_transcript(call_id, customer_id)
        
        # Fetch customer data from MongoDB
        print(f"Handler: Fetching customer {customer_id} from MongoDB")
        customer_data = fetch_customer_config(customer_id)
        print(f"Handler: Loaded config for {customer_data.get('name', 'there')}")
        
        # Build dynamic config with customer ID for pre-call context
        settings = build_config(customer_data, customer_id=customer_id)

        # Send Settings to Deepgram STS
        print("Handler: Sending settings to Deepgram")
        await sts_ws.send(json.dumps(settings))
        print("Handler: Settings sent to Deepgram")

        # Start the audio pipeline tasks
        sender_task = asyncio.create_task(sts_sender(sts_ws, audio_queue))
        receiver_task = asyncio.create_task(sts_receiver(sts_ws, twilio_ws, streamsid_queue, transcript_session))
        print("Handler: Audio pipeline tasks started") 

        try:
            #The three tasks run continuously until Twilio sends a stop event, creating a real-time bidirectional voice conversation.
            await twilio_task  # Ends on Twilio 'stop'
        finally:
            print("Handler: Cancelling audio tasks...")
            for t in (sender_task, receiver_task):
                t.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await sender_task
                await receiver_task
            print("Handler: Audio tasks cancelled")

        # Save transcript and call data
        if transcript_session and transcript_session.entries:
                print(f"Call Ended - Saving {len(transcript_session.entries)} entries")
                
                transcript_data = transcript_session.get_all()
                mongodb_id = model.save_transcript_to_mongodb(transcript_data)
                
                if mongodb_id:
                    processed_data = model.process_transcript(mongodb_id)
                    if processed_data:
                        model.save_processed_to_mongodb(processed_data)
                
                transcript_code.remove_transcript(call_id)
        

    await twilio_ws.close()
    print("Twilio websocket closed") 



async def main():
    """
    Main function that starts the WebSocket server
    This sets up the server to handle incoming calls from Twilio
    """
    host = os.getenv("AGENT_HOST", "0.0.0.0")
    port = int(os.getenv("PORT", os.getenv("AGENT_PORT", 5000)))

    server = await websockets.serve(twilio_handler, host, port)
    print(f"[ONLINE] WebSocket server is RUNNING at ws://{host}:{port}")
    print("[WAITING] Ready & waiting for phone calls from Twilio...")
    print("==================================================")

    try:
        await asyncio.Future()  # Run forever
    finally:
        print("Shutting down server...")
        server.close()
        await server.wait_closed()



if __name__ == "__main__":
    try:
        # Start the main async function
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
