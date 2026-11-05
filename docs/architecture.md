# System Architecture

## Architecture Overview: Whitespace CRM Voice AI Platform

Whitespace CRM incorporates a hybrid architecture spanning a Python real-time voice streaming service, a Node.js/Express backend API, a React/Vite front-end dashboard, and a MongoDB persistent data layer.

```
+-------------------------------------------------------------------------------------------------------+
|                                        PROPOSED ARCHITECTURE                                          |
+-------------------------------------------------------------------------------------------------------+

                     +----------------------------------------------------+
                     |              Real-Time Audio Pipeline              |
                     |                                                    |
                     |    +------------------------------------------+    |
                     |    |           Twilio Media Stream            |    |
                     |    +------------------------------------------+    |
                     |                          ^                         |
                     |                          | Bi-directional audio    |
                     |                          v (8kHz mulaw WebSocket)  |
                     |    +------------------------------------------+    |
                     |    |          main.py WebSocket Server        |    |
                     |    +------------------------------------------+    |
                     |          |                      ^                  |
                     |          | FunctionCallRequest  | Enriched Prompt  |
                     |          v & FunctionResponse   |                  |
                     |    +-----------------------+    |                  |
                     |    | Deepgram Voice Agent  |    |                  |
                     |    |     (Nova-3 / GPT-4o) |    |                  |
                     |    +-----------------------+    |                  |
                     |               |                 |                  |
                     |               v                 |                  |
                     |    +-----------------------+    |                  |
                     |    | RAG Knowledge Base    |    |                  |
                     |    | Tool (vector/keyword) |    |                  |
                     |    +-----------------------+    |                  |
                     |               |                 |                  |
                     |               v                 |                  |
                     |    +-----------------------+    |                  |
                     |    | Knowledge Base Docs   |    |                  |
                     |    | Catalog & FAQ Data    |    |                  |
                     |    +-----------------------+    |                  |
                     +----------------------------------------------------+
                                      | Completed Transcript
                                      v
       +-------------------------------------------------------------------+
       |                       LangChain Intelligence                      |
       |                                                                   |
       |             +----------------------------------------+            |
       |             |        LangChain Structured Chain      |            |
       |             +----------------------------------------+            |
       |                    /                          \                   |
       |                   v                            v                  |
       |     +----------------------------+  +---------------------------+ |
       |     | Structured Summary & Sent. |  | CRM Tasks & Follow-up Draft|
       |     +----------------------------+  +---------------------------+ |
       +-------------------------------------------------------------------+
                            \                            /
                             \                          / Grounding & Persistence
                              v                        v
                     +----------------------------------------------------+
                     |                      Grounding                     |
                     |                                                    |
                     |               +--------------------+               |
                     |               |      MongoDB       |               |
                     |               +--------------------+               |
                     |                         |                          |
                     |                         v Past Calls & CRM Data    |
                     |               +--------------------+               |
                     |               |  Pre-Call Context  |---------------+
                     |               |      Retriever     |
                     |               +--------------------+
                     +----------------------------------------------------+
```

---

## 1. Real-Time Audio Pipeline (`agent/main.py`)

### 1.1 Twilio Media Streams
- **Transport**: WebSockets (`ws://<host>:<port>`).
- **Audio Format**: Inbound and outbound 8kHz `audio/x-mulaw`.
- **Chunking**: Twilio receiver collects audio and buffers into 3,200-byte frames (20 chunks of 160 bytes) before forwarding to Deepgram.

### 1.2 Deepgram Speech-to-Speech (STS)
- Connects to `wss://agent.deepgram.com/v1/agent/converse` using token subprotocol.
- **Listen (STT)**: Nova-3 configured with pharmacy domain keyterms.
- **Think (LLM)**: OpenAI GPT-4o-mini with dynamic clinical system prompt.
- **Speak (TTS)**: Deepgram Aura-2 Thalia English voice model.
- **Silence on Answering (No Initial Greeting)**:
  - Configuration excludes automatic greeting strings (`cfg["agent"].pop("greeting", None)`).
  - The voice agent initiates in listening mode without synthesizing early speech, allowing the caller to speak first.

### 1.3 Barge-In & Interruption Handling
- Deepgram emits `UserStartedSpeaking` events upon caller vocalization.
- The WebSocket handler instantly transmits an `{ "event": "clear", "streamSid": streamSid }` message to Twilio to stop playing queued audio.

---

## 2. In-Call Real-Time RAG (`agent/functions/rag/`)

- **Knowledge Base (`knowledge_base.py`)**:
  - Local hybrid search combining cosine similarity vector search and BM25-style keyword matching.
  - Sub-50ms execution overhead.
- **Tool Definitions (`tools.py`)**:
  - `search_knowledge_base`: Retrieves medication prices, dosages, indications, policies.
  - `place_order`: Saves verified order requests to DB / state.
  - `lookup_order`: Fetches live status of past orders.

---

## 3. Pre-Call Dynamic Context Retrieval (`customer_context.py`)

- Before the audio conversation begins, the agent queries MongoDB:
  - `uploaddetails` / `contactdetails` for customer profile, primary symptoms, and notes.
  - `calls` collection for recent call transcripts and sentiment ratings.
- Compiles an enriched pre-call briefing injected directly into the LLM system prompt.

---

## 4. Post-Call LangChain Intelligence (`post_call_chain.py` & `model.py`)

- Transcripts are tracked per call session and saved to `local_db/transcript.json` and MongoDB `transcripts`.
- Post-call processing executes LangChain structured extraction:
  - **Executive Summary**: Core topic, customer request, resolution status.
  - **Sentiment Analysis**: Score and detailed rationale.
  - **Action Items**: Inserted into `taskdetails` collection for pharmacist follow-up.
  - **Follow-up Message**: Pre-drafted SMS or WhatsApp follow-up communication.

---

## 5. Technology Stack Summary

| Layer | Technologies |
|---|---|
| **Voice AI Agent** | Python 3.10+, Deepgram STS, LangChain, WebSockets, PyMongo |
| **Backend API** | Node.js, Express, Mongoose, Twilio SDK, CORS, JWT |
| **Frontend CRM** | React 18, Vite, Tailwind CSS, Lucide Icons |
| **Database** | MongoDB Atlas / Local MongoDB |
| **Telephony** | Twilio Voice & Media Streams |
