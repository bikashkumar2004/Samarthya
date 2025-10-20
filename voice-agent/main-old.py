import base64
import asyncio
import json, websockets, os
from dotenv import load_dotenv

load_dotenv()

def sts_connect():
	api_key = os.getenv("DEEPGRAM_API_KEY")
	if not api_key:
		raise Exception("DEEPGRAM_API_KEY not found")
	
	sts_ws = websockets.connect(
		"wss://agent.deepgram.com/v1/agent/converse",
		subprotocols=["token", api_key]
	)
	return sts_ws

def load_config():
	with open("config.json", "r") as f:
		return json.load(f)

#this will interrupt the model if user starts speaking
async def handle_barge_in(decoded, twilio_ws, streamsid):
    if decoded["type"] == "UserStartedSpeaking":
        clear_message = {
            "event": "clear",
            "streamSid": streamsid
        }
        await twilio_ws.send(json.dumps(clear_message))

async def handle_text_message(decoded, twilio_ws, sts_ws, streamsid):
    await handle_barge_in(decoded, twilio_ws, streamsid)

    # if decoded["type"] == "FunctionCallRequest":
    #     await handle_function_call_request(decoded, sts_ws)

#sts is for ur voice agent, it sends the infoto deepgram to process
#as sooon as we have chuk in audio queue, send to deepgram
async def sts_sender(sts_ws, audio_queue):
    print("sts_sender started")
    while True:
        #as soon as audio is added await is finished and send it to deepgram
        chunk = await audio_queue.get()
        await sts_ws.send(chunk)


#receives what deepgram tells us after processing and saysto twilio hey say this to the user
async def sts_receiver(sts_ws, twilio_ws, streamsid_queue):
    print("sts_receiver started")
    streamsid = await streamsid_queue.get()
	#after sending audio to deepgram it sends back multiple things to us like what to say next TTS
    async for message in sts_ws:
        #if deepgram is sending us text instead of bytes
        if type(message) is str:
            print(message)
            decoded = json.loads(message)
            await handle_text_message(decoded, twilio_ws, sts_ws, streamsid)
            continue
		
		#rae message bytes from deepgram
        raw_mulaw = message

		#take this message and send it to twilio so that it can speak in
        media_message = {
            "event": "media",
            "streamSid": streamsid,
            "media": {"payload": base64.b64encode(raw_mulaw).decode("ascii")}
        }

		#json dumps convert the message into string before sending
        await twilio_ws.send(json.dumps(media_message))

#what was said by the user (receive) then send using sts sender to deepgram
async def twilio_receiver(twilio_ws, audio_queue, streamsid_queue):
    BUFFER_SIZE = 20 * 160
    inbuffer = bytearray(b"")

	#keep looping over the audio messages received by our server from twilio
    async for message in twilio_ws:
        try:
            data = json.loads(message)
            event = data["event"]
			#ifsomeone starts start the streaming in the audio
            if event == "start":
                print("get our streamsid")
                start = data["start"]
				#every single strem from twilio has an identifierwhich is what we are pulling out
                streamsid = start["streamSid"]
				#async queue so no wait
                streamsid_queue.put_nowait(streamsid)
			#if connected then keep going no need to do anything
            elif event == "connected":
                continue
			#if media then store, process & decode so that we can respond
            elif event == "media":
                media = data["media"]
				#payload which conmes from media is bytes of the user voice, so we decode it using base64, because it is not in normal english
                chunk = base64.b64decode(media["payload"])
				#twilio also gives outbound media, inbound = user syas this, then add this chunk we decoded to the inbuffer
                if media["track"] == "inbound":
                    inbuffer.extend(chunk)
			#if stop then disconnect (user disconnected)
            elif event == "stop":
                break
			
			#buffer size is how much audio we want to store before sending to deepgram (we dont want to send it immediately)
			#so when inbuffer is greater than or equal to buffer size we get out that chunk from buffer, add that to audio queue
            while len(inbuffer) >= BUFFER_SIZE:
                chunk = inbuffer[:BUFFER_SIZE]
                audio_queue.put_nowait(chunk)
				#then  remove it from buffer
                inbuffer = inbuffer[BUFFER_SIZE:]
        except:
            break

async def twilio_handler(twilio_ws):
	#since we are receiving messages in a stream (atched audio, one word or a few words ata time)
	audio_queue = asyncio.Queue()
	streamsid_queue = asyncio.Queue()
	
	async with sts_connect() as sts_ws:
		#send deepgram our config message
		config_message = load_config()
		#send through the websocket
		await sts_ws.send(json.dumps(config_message))

		await asyncio.wait(
			#it will take the ollowing list with three things which will always be running (sts_sender, twilio_receiver, sts_receiver)
			[
				#ensure future means this is going to keep running
				#always be able to send things to deepgram
				asyncio.ensure_future(sts_sender(sts_ws, audio_queue)),
				#always be able to send things from deepgram
				asyncio.ensure_future(sts_receiver(sts_ws, twilio_ws, streamsid_queue)),
				#
				asyncio.ensure_future(twilio_receiver(twilio_ws, audio_queue, streamsid_queue)),
			]
		)
		await twilio_ws.close()


async def main():
	await websockets.serve(twilio_handler, "localhost", 5000)
	print("Server started on localhost:5000")
	await asyncio.Future()

if __name__ == "__main__":
	asyncio.run(main())