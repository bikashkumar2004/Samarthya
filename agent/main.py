import asyncio
import base64
import json
import websockets
import os
import uuid
from dotenv import load_dotenv
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


async def twilio_receiver(twilio_ws, audio_queue, streamsid_queue):
    """
    Receives audio and control messages from Twilio phone service
    This handles incoming voice data from phone calls
    """
    BUFFER_SIZE = 20 * 160  # Size of audio chunks to process (optimized for speech)
    inbuffer = bytearray()  # Buffer to collect audio data
    
    # Listen for messages from Twilio
    async for message in twilio_ws:
        data = json.loads(message)
        event = data.get("event")
        
        if event == "start":
            # Call is starting - get the stream ID
            streamsid = data.get("start", {}).get("streamSid")
            if streamsid: 
                streamsid_queue.put_nowait(streamsid)
                
        elif event == "media":
            # Audio data received from caller
            media = data.get("media", {})
            payload = media.get("payload")  # Base64 encoded audio
            track = media.get("track")      # Direction (inbound/outbound)
            
            # Only process incoming audio from caller
            if payload and track == "inbound":
                # Decode base64 audio and add to buffer
                inbuffer.extend(base64.b64decode(payload))
                
        elif event == "stop":
            # Call ended
            break
        
        # When buffer has enough data, send it for processing
        while len(inbuffer) >= BUFFER_SIZE:
            audio_queue.put_nowait(inbuffer[:BUFFER_SIZE])
            inbuffer = inbuffer[BUFFER_SIZE:]


async def twilio_handler(twilio_ws):
    """
    Main handler for each Twilio WebSocket connection
    This coordinates all the different parts of the call handling
    """
    # Create queues for communication between different parts
    audio_queue = asyncio.Queue()      # Queue for audio data
    streamsid_queue = asyncio.Queue()  # Queue for stream ID
    
    # Connect to Deepgram and start processing
    async with sts_connect() as sts_ws:
        # Send configuration to Deepgram to set up the AI agent
        await sts_ws.send(json.dumps(load_config()))
        
        # Run all three main processes simultaneously:
        # 1. Send audio to Deepgram (sts_sender)
        # 2. Receive responses from Deepgram (sts_receiver)  
        # 3. Receive audio from Twilio (twilio_receiver)
        await asyncio.gather(
            sts_sender(sts_ws, audio_queue),
            sts_receiver(sts_ws, twilio_ws, streamsid_queue),
            twilio_receiver(twilio_ws, audio_queue, streamsid_queue)
        )
    
    # Close the Twilio connection when done
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
        # When server stops, save all transcript data
        transcript_code.save_transcripts()
        
        # If we have transcripts, save the call data to database
        if transcript_code.TRANSCRIPTS:
            call_start = transcript_code.TRANSCRIPTS[0]["timestamp_iso"]
            model.store_call_to_db(
                call_id=CALL_ID,
                customer_id=CUSTOMER_ID,
                call_start=call_start,
                transcript=transcript_code.TRANSCRIPTS
            )
        
        # Properly close the server
        server.close()
        await server.wait_closed()


if __name__ == "__main__":
    try:
        # Start the main async function
        asyncio.run(main())
    except KeyboardInterrupt:
        # If user presses Ctrl+C, save transcripts before exiting
        transcript_code.save_transcripts()
        
        # Save call data to database if available
        if transcript_code.TRANSCRIPTS:
            call_start = transcript_code.TRANSCRIPTS[0]["timestamp_iso"]
            model.store_call_to_db(
                call_id=CALL_ID,
                customer_id=CUSTOMER_ID,
                call_start=call_start,
                transcript=transcript_code.TRANSCRIPTS
            )