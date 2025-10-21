import asyncio
import base64
import json
import websockets
import os
import uuid
from dotenv import load_dotenv
import contextlib 
from functions.testing.pharmacy_functions import FUNCTION_MAP
import functions.transcript.transcript_code as transcript_code
import functions.transcript.model as model


# Load environment variables
load_dotenv()
API_KEY = os.getenv("API_KEY")
CUSTOMER_ID = os.getenv("CUSTOMER_ID")
CALL_ID = f"call-{uuid.uuid4()}"  # Unique per session
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")


def sts_connect():
    """
    Creates a WebSocket connection to Deepgram's Speech-to-Speech service
    This is where the AI agent processes voice conversations
    """
    if not DEEPGRAM_API_KEY:
        raise Exception("DEEPGRAM_API_KEY not found")
    
    
    # Connect to Deepgram's agent service using WebSocket
    # The API key is passed as a subprotocol for authentication
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

def build_config(ctx):
    cfg = load_config()  # loads config.json
    purpose = (ctx.get("purpose") or "").strip()
    if purpose:
        base_prompt = cfg["agent"]["think"]["prompt"]
        cfg["agent"]["think"]["prompt"] = (
            f"{base_prompt}\n\n"
            f"Call purpose: {purpose}.\n"
            f"Always steer the conversation to accomplish this goal while following verification and safety steps."
        )
        # optional: make the greeting reflect the purpose
        base_greeting = cfg["agent"].get("greeting", "How can I assist you?")
        cfg["agent"]["greeting"] = f"{base_greeting} This call is about: {purpose}."
    return cfg


def execute_function_call(func_name, arguments):
    """
    Executes specific functions when the AI agent needs to perform actions
    For example: looking up pharmacy information, checking inventory, etc.
    """
    # Check if the requested function exists in our function map
    if func_name in FUNCTION_MAP:
        # Execute the function with the provided arguments
        return FUNCTION_MAP[func_name](**arguments)
    return {"error": f"Unknown function: {func_name}"}


def create_function_call_response(func_id, func_name, result):
    """
    Creates a properly formatted response after executing a function
    This tells Deepgram what happened when we ran the function
    """
    return {
        "type": "FunctionCallResponse",  # Type of message
        "id": func_id,                   # Unique identifier for this function call
        "name": func_name,               # Name of the function that was called
        "content": json.dumps(result)    # The result of the function execution
    }


async def handle_barge_in(decoded, twilio_ws, streamsid):
    """
    Handles interruptions when user starts speaking while AI is talking
    This creates natural conversation flow by stopping AI when user interrupts
    """
    # Check if user started speaking
    if decoded.get("type") == "UserStartedSpeaking":
        # Send clear command to Twilio to stop current audio playback
        await twilio_ws.send(json.dumps({"event": "clear", "streamSid": streamsid}))


async def handle_function_call_request(decoded, sts_ws):
    """
    Processes requests from AI agent to execute specific functions
    When AI needs to look something up or perform an action, it calls this
    """
    # Loop through all function calls in the request
    for function_call in decoded.get("functions", []):
        func_name = function_call["name"]                    # Function to call
        func_id = function_call["id"]                        # Unique identifier
        arguments = json.loads(function_call["arguments"])   # Parameters for function
        
        # Execute the requested function
        result = execute_function_call(func_name, arguments)
        
        # Send the result back to Deepgram
        await sts_ws.send(json.dumps(create_function_call_response(func_id, func_name, result)))


async def handle_text_message(decoded, twilio_ws, sts_ws, streamsid):
    """
    Processes text-based messages from Deepgram
    This handles both user interruptions and function call requests
    """
    # Handle user interruptions first
    await handle_barge_in(decoded, twilio_ws, streamsid)
    
    # Check if this is a function call request
    if decoded.get("type") == "FunctionCallRequest":
        await handle_function_call_request(decoded, sts_ws)

async def sts_sender(sts_ws, audio_queue):
    """
    Continuously sends audio data from Twilio to Deepgram
    This takes incoming voice from phone call and sends it to AI for processing
    """
    while True:
        # Wait for audio chunk from the queue
        chunk = await audio_queue.get()
        # Send audio chunk to Deepgram for processing
        await sts_ws.send(chunk)

async def sts_receiver(sts_ws, twilio_ws, streamsid_queue):
    """
    Receives messages from Deepgram and processes them
    This handles both AI responses and transcription data
    """
    # Get the stream ID for this call
    streamsid = await streamsid_queue.get()
    
    # Listen for messages from Deepgram
    async for message in sts_ws:
        if isinstance(message, str):
            # This is a text message (transcription, function calls, etc.)
            try:
                decoded = json.loads(message)
            except Exception:
                # If JSON parsing fails, treat as raw text
                decoded = {"type": "raw", "content": message}
            
            # Save transcription data for later use
            transcript_code.append_transcript(decoded)
            
            # Handle the message (interruptions, function calls, etc.)
            await handle_text_message(decoded, twilio_ws, sts_ws, streamsid)
        else:
            # This is audio data (AI speaking response)
            # Convert binary audio to base64 and send to Twilio for playback
            await twilio_ws.send(json.dumps({
                "event": "media",
                "streamSid": streamsid,
                "media": {"payload": base64.b64encode(message).decode("ascii")}
            }))


# Add an event so handler knows when 'purpose' is available
async def twilio_receiver(twilio_ws, audio_queue, streamsid_queue, ctx, ready_evt):
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
            ctx["purpose"] = cp.get("purpose") or ctx.get("purpose")
            ready_evt.set()  # signal that we have purpose
        elif event == "media":
            media = data.get("media", {})
            payload = media.get("payload")
            track = media.get("track")
            if payload and track == "inbound":
                inbuffer.extend(base64.b64decode(payload))
        elif event == "stop":
            break
        while len(inbuffer) >= BUFFER_SIZE:
            audio_queue.put_nowait(inbuffer[:BUFFER_SIZE])
            inbuffer = inbuffer[BUFFER_SIZE:]



async def twilio_handler(twilio_ws):
    ctx = {"call_id": None, "customer_id": None, "purpose": None}
    purpose_ready = asyncio.Event()

    audio_queue = asyncio.Queue()
    streamsid_queue = asyncio.Queue()

    async with sts_connect() as sts_ws:
        # start Twilio receiver first so we can read 'start' quickly
        twilio_task = asyncio.create_task(
            twilio_receiver(twilio_ws, audio_queue, streamsid_queue, ctx, purpose_ready)
        )

        # wait briefly for purpose; if not present, fall back to base Settings
        try:
            await asyncio.wait_for(purpose_ready.wait(), timeout=2.0)
            settings = build_config(ctx)
        except asyncio.TimeoutError:
            settings = load_config()

        # now send Settings to Deepgram STS
        await sts_ws.send(json.dumps(settings))

        # start the audio pipeline tasks
        sender_task = asyncio.create_task(sts_sender(sts_ws, audio_queue))
        receiver_task = asyncio.create_task(sts_receiver(sts_ws, twilio_ws, streamsid_queue))

        try:
            await twilio_task  # ends on Twilio 'stop'
        finally:
            for t in (sender_task, receiver_task):
                t.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await sender_task
                await receiver_task

            transcript_code.save_transcripts()

            if transcript_code.TRANSCRIPTS:
                final_call_id = ctx["call_id"] or f"call-{uuid.uuid4()}"
                final_customer_id = ctx["customer_id"]
                model.store_call_to_db(
                    call_id=final_call_id,
                    customer_id=final_customer_id,
                    transcript=transcript_code.TRANSCRIPTS,
                )

            await twilio_ws.close()


async def main():
    """
    Main function that starts the WebSocket server
    This sets up the server to handle incoming calls from Twilio
    """
    # Start WebSocket server on localhost port 5000
    # Each incoming connection will be handled by twilio_handler
    server = await websockets.serve(twilio_handler, "localhost", 5000)
    print("Server running at ws://localhost:5000")
    
    try:
        # Keep the server running indefinitely
        await asyncio.Future()  # Run forever
    finally:
        # Only manage server shutdown here; per-call storage happens in twilio_handler
        server.close()
        await server.wait_closed()



if __name__ == "__main__":
    try:
        # Start the main async function
        asyncio.run(main())
    except KeyboardInterrupt:
        # Optional: last-resort flush of transcripts if you want a safety net
        # (per-call store happens in twilio_handler on 'stop')
        # You can keep or remove the next line depending on your preference.
        transcript_code.save_transcripts()
        pass
