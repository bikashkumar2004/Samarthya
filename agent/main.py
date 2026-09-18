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


def build_config(customer_data):
    cfg = load_config()
    
    try:
        # Extract customer information
        name = customer_data.get("name", "there")
        purpose = (customer_data.get("description") or "ululululu").strip()
        
        # Build dynamic prompt
        dynamic_prompt = (
            f"You are a professional AI calling assistant.\n\n"
            f"Customer name: {name}\n\n"
            f"Call purpose: {purpose or 'General assistance'}.\n"
            f"Be polite, natural, and conversational. Listen carefully and respond appropriately."
        )
        
        # Build greeting text
        greeting_text = (
            f"Hello {name}! "
            f"{('I am calling about ' + purpose) if purpose else 'How can I assist you today?'}"
        )
        
        # Update config with dynamic values
        cfg["agent"]["think"]["prompt"] = dynamic_prompt
        cfg["agent"]["greeting"] = greeting_text
        
        # Print for debugging
        print(f"Customer Name: {name}")
        print(f"Call Purpose: {purpose or 'General assistance'}")
        
    except Exception as e:
        print(f"Error fetching customer config: {e}")
        print("Falling back to default config")
    
    return cfg

    

def fetch_customer_config(customer_id):
    """
    Fetches customer data from MongoDB contactdetails collection
    """
    db = client[mongo_db]
    
    try:
        # Convert string to ObjectId
        customer = db.uploaddetails.find_one({"_id": ObjectId(customer_id)})
    except Exception as e:
        raise Exception(f"Invalid customer_id format: {customer_id}")
    
    if not customer:
        raise Exception(f"Customer {customer_id} not found")
    
    return customer

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
    This handles user interruptions
    """
    await handle_barge_in(decoded, twilio_ws, streamsid)
    if transcript_session:
        msg_type = decoded.get("type", "")
        content = decoded.get("content", "")
        role = decoded.get("role", "").lower()
        
        if msg_type == "ConversationText" and content:
            if "assistant" in role or "agent" in role:
                transcript_session.append("assistant", content)
            elif "user" in role or "customer" in role:
                transcript_session.append("user", content)
                
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
            # capture IDs and purpose from customParameters
            ctx["call_id"] = start.get("callSid") or ctx.get("call_id")
            cp = start.get("customParameters") or {}
            ctx["customer_id"] = cp.get("customer_id") or ctx.get("customer_id")
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

        # Wait for customer_id from Twilio start event
        try:
            print("Handler: Waiting for Twilio start/customParameters...")
            await asyncio.wait_for(purpose_ready.wait(), timeout=5.0)
            call_id = ctx.get("call_id")
            customer_id = ctx.get("customer_id")
            
            if not customer_id:
                print("Handler ERROR: No customer_id received from Twilio")
                await twilio_ws.close()
                return
            
            transcript_session = transcript_code.create_transcript(call_id, customer_id)
            
            # Fetch customer data from MongoDB
            print(f"Handler: Fetching customer {customer_id} from MongoDB")
            customer_data = fetch_customer_config(customer_id)
            print(f"Handler: Loaded config for {customer_data.get('name')}")
            
            # Build dynamic config
            settings = build_config(customer_data)
            #print(f"Config ready: greeting='{settings['settings']['agent']['greeting']['text']}'") 
            
        except asyncio.TimeoutError:
            print("Handler ERROR: Timeout waiting for customer_id")
            await twilio_ws.close()
            return
        except Exception as e:
            print(f"Handler: ERROR: Failed to load customer config: {e}")
            await twilio_ws.close()
            return

        # Send Settings to Deepgram STS
        print("Handler: Sending settings to Deepgram)")
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
