# api.py
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from twilio.rest import Client

app = FastAPI()

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
PHONE_NUMBER_FROM = os.getenv("PHONE_NUMBER_FROM")
WSS_DOMAIN = os.getenv("NGROK_DOMAIN")  # e.g., domestically-peaceable-roselee.ngrok-free.dev

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

class CallRequest(BaseModel):
    to: str
    agentId: str
    customerId: str
    sessionId: str

@app.post("/api/call")
def create_call(req: CallRequest):
    twiml = f"""
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="en">This call may be monitored or recorded.</Say>
  <Connect>
    <Stream url="wss://{WSS_DOMAIN}/twilio?agentId={req.agentId}&customerId={req.customerId}&sessionId={req.sessionId}" />
  </Connect>
</Response>
""".strip()
    try:
        call = client.calls.create(from_=PHONE_NUMBER_FROM, to=req.to, twiml=twiml)
        return {"sid": call.sid, "status": call.status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
