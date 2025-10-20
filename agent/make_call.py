import os
import asyncio
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()

# Twilio credentials
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
PHONE_NUMBER_FROM = os.getenv("PHONE_NUMBER_FROM")
NGROK_DOMAIN = os.getenv("NGROK_DOMAIN")

# Initialize Twilio client
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

async def make_outbound_call(phone_number_to_call):
    """Make an outbound call using Twilio"""
    
    # TwiML to connect call to your WebSocket server
    twiml = f'''<?xml version="1.0" encoding="UTF-8"?>
    <Response>
        <Connect>
            <Stream url="wss://{NGROK_DOMAIN}/websocket" />
        </Connect>
    </Response>'''
    
    try:
        call = client.calls.create(
            from_=PHONE_NUMBER_FROM,
            to=phone_number_to_call,
            twiml=twiml
        )
        
        print(f"Call initiated with SID: {call.sid}")
        print(f"Calling: {phone_number_to_call}")
        print(f"Status: {call.status}")
        return call.sid
        
    except Exception as e:
        print(f"Error making call: {e}")
        return None

if __name__ == "__main__":
    # Replace with the number you want to call (E.164 format)
    target_number = "+917735220216"
    asyncio.run(make_outbound_call(target_number))
