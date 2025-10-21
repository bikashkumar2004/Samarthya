import asyncio
import base64
import json
import websockets
import os
import uuid
from dotenv import load_dotenv
from pharmacy_functions import FUNCTION_MAP
import transcript_code
import model

# Load environment variables
load_dotenv()
API_KEY = os.getenv("API_KEY")
CUSTOMER_ID = os.getenv("CUSTOMER_ID")
CALL_ID = f"call-{uuid.uuid4()}"  # Unique per session
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")


def sts_connect():
    if not DEEPGRAM_API_KEY:
        raise Exception("DEEPGRAM_API_KEY not found")
    return websockets.connect(
        "wss://agent.deepgram.com/v1/agent/converse",
        subprotocols=["token", DEEPGRAM_API_KEY]
    )


def load_config():
    with open("config.json", "r") as f:
        return json.load(f)


def execute_function_call(func_name, arguments):
    if func_name in FUNCTION_MAP:
        return FUNCTION_MAP[func_name](**arguments)
    return {"error": f"Unknown function: {func_name}"}


def create_function_call_response(func_id, func_name, result):
    return {
        "type": "FunctionCallResponse",
        "id": func_id,
        "name": func_name,
        "content": json.dumps(result)
    }


async def handle_barge_in(decoded, twilio_ws, streamsid):
    if decoded.get("type") == "UserStartedSpeaking":
        await twilio_ws.send(json.dumps({"event": "clear", "streamSid": streamsid}))


async def handle_function_call_request(decoded, sts_ws):
    for function_call in decoded.get("functions", []):
        func_name = function_call["name"]
        func_id = function_call["id"]
        arguments = json.loads(function_call["arguments"])
        result = execute_function_call(func_name, arguments)
        await sts_ws.send(json.dumps(create_function_call_response(func_id, func_name, result)))


async def handle_text_message(decoded, twilio_ws, sts_ws, streamsid):
    await handle_barge_in(decoded, twilio_ws, streamsid)
    if decoded.get("type") == "FunctionCallRequest":
        await handle_function_call_request(decoded, sts_ws)


async def sts_sender(sts_ws, audio_queue):
    while True:
        chunk = await audio_queue.get()
        await sts_ws.send(chunk)


async def sts_receiver(sts_ws, twilio_ws, streamsid_queue):
    streamsid = await streamsid_queue.get()
    async for message in sts_ws:
        if isinstance(message, str):
            try:
                decoded = json.loads(message)
            except Exception:
                decoded = {"type": "raw", "content": message}
            transcript_code.append_transcript(decoded)
            await handle_text_message(decoded, twilio_ws, sts_ws, streamsid)
        else:
            await twilio_ws.send(json.dumps({
                "event": "media",
                "streamSid": streamsid,
                "media": {"payload": base64.b64encode(message).decode("ascii")}
            }))


async def twilio_receiver(twilio_ws, audio_queue, streamsid_queue):
    BUFFER_SIZE = 20 * 160
    inbuffer = bytearray()
    async for message in twilio_ws:
        data = json.loads(message)
        event = data.get("event")
        if event == "start":
            streamsid = data.get("start", {}).get("streamSid")
            if streamsid: streamsid_queue.put_nowait(streamsid)
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
    audio_queue = asyncio.Queue()
    streamsid_queue = asyncio.Queue()
    async with sts_connect() as sts_ws:
        await sts_ws.send(json.dumps(load_config()))
        await asyncio.gather(
            sts_sender(sts_ws, audio_queue),
            sts_receiver(sts_ws, twilio_ws, streamsid_queue),
            twilio_receiver(twilio_ws, audio_queue, streamsid_queue)
        )
    await twilio_ws.close()


async def main():
    server = await websockets.serve(twilio_handler, "localhost", 5000)
    print("Server running at ws://localhost:5000")
    try:
        await asyncio.Future()  # run forever
    finally:
        transcript_code.save_transcripts()
        if transcript_code.TRANSCRIPTS:
            call_start = transcript_code.TRANSCRIPTS[0]["timestamp_iso"]
            model.store_call_to_db(
                call_id=CALL_ID,
                customer_id=CUSTOMER_ID,
                call_start=call_start,
                transcript=transcript_code.TRANSCRIPTS
            )
        server.close()
        await server.wait_closed()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        transcript_code.save_transcripts()
        if transcript_code.TRANSCRIPTS:
            call_start = transcript_code.TRANSCRIPTS[0]["timestamp_iso"]
            model.store_call_to_db(
                call_id=CALL_ID,
                customer_id=CUSTOMER_ID,
                call_start=call_start,
                transcript=transcript_code.TRANSCRIPTS
            )
