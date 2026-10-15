# Technical Interview Guide & Architecture Walkthrough

## Whitespace CRM: Real-Time Voice AI Agent with RAG

This document serves as an exhaustive technical guide for software engineering interviews, project presentations, and architecture audits of the Whitespace CRM Voice AI platform.

---

## 1. High-Level Project Elevator Pitch
"Whitespace CRM is an omnichannel healthcare and pharmacy CRM featuring an ultra-low latency real-time voice calling AI assistant. Built on Deepgram's Speech-to-Speech (STS) pipeline and Twilio Media Streams, it answers customer medication inquiries using in-call hybrid Retrieval-Augmented Generation (RAG) in under 50ms, executes orders via tool calling, remains silent upon call connection until the caller speaks, and triggers post-call LangChain intelligence pipelines for CRM task creation and sentiment extraction."

---

## 2. Core Architecture & Tech Stack
- **Audio Transport**: Twilio Media Streams over WebSockets delivering bi-directional 8kHz `audio/x-mulaw`.
- **Speech-to-Speech (STS)**: Deepgram Converse WebSocket API running:
  - **Nova-3 STT**: High accuracy medical term recognition.
  - **OpenAI GPT-4o-mini**: Dynamic clinical reasoning & tool calling.
  - **Aura-2 Thalia TTS**: Human-grade low-latency voice synthesis.
- **RAG & Search**: In-memory hybrid vector + BM25 keyword search engine (`functions.rag.knowledge_base`).
- **Orchestration & Intelligence**: LangChain structured output chains for post-call analytics (`functions.rag.post_call_chain`).
- **Data Layer**: MongoDB Atlas storing customer profiles, call transcripts, sentiment scores, and automated follow-up tasks.
- **Backend & Frontend**: Node.js/Express REST server and React 18/Vite dashboard with Tailwind CSS.

---

## 3. Top Interview Questions & Recommended Answers

### Q1: Why use Deepgram Speech-to-Speech (STS) instead of chaining individual STT -> LLM -> TTS services?
**Answer**:
"Traditional pipelining (transcribing full audio, waiting for turn completion, sending text to an LLM, and streaming text chunks to a separate TTS) introduces cumulative network latency of 1500ms to 3000ms. Deepgram STS operates an integrated full-duplex conversational engine over a single persistent WebSocket. This reduces turn-taking latency to 400-700ms, natively manages barge-in/interruptions, and handles function calling directly within the conversational loop."

---

### Q2: How does the system handle inbound calls and silent connection?
**Answer**:
"When Twilio connects a media stream to `main.py`, the agent deliberately omits the initial `greeting` property in the Deepgram STS Settings message and instructs the LLM via prompt rule 0 to stay completely silent until the caller speaks. This prevents robotic canned greetings from cutting off callers or misinterpreting ambient noise upon pickup, enabling a natural caller-led conversation."

---

### Q3: How is sub-50ms latency achieved for the in-call RAG pipeline?
**Answer**:
"External vector databases (like Pinecone or Qdrant) introduce round-trip network hops that add 80-200ms per query. In a live phone call, every millisecond counts. We implemented an in-process local hybrid vector and keyword search engine directly inside Python. Embeddings are cached in memory and queries are resolved via numpy cosine distance combined with tokenized keyword matching in under 30-50ms."

---

### Q4: How is barge-in (interruption) handled over the telephone?
**Answer**:
"When a user speaks while the AI assistant is outputting TTS audio, Deepgram's Nova-3 voice activity detector fires a `UserStartedSpeaking` text event over the WebSocket. Our handler catches this immediately and sends `{"event": "clear", "streamSid": streamSid}` to Twilio, flushing Twilio's audio buffer instantaneously so the caller does not hear trailing audio."

---

### Q5: What happens when the call ends?
**Answer**:
"Once Twilio sends the `stop` event:
1. The WebSocket closes and the full multi-turn transcript is saved to MongoDB.
2. The transcript is fed to a LangChain pipeline with structured JSON schema output.
3. LangChain extracts an executive summary, sentiment rating (with clinical rationale), and action items.
4. Action items are automatically inserted into the MongoDB `taskdetails` collection for pharmacists.
5. A draft customer follow-up message (SMS/WhatsApp) is generated and stored for human review."

---

## 4. Live Demo Walkthrough Checklist
1. **Show Architecture Diagram**: Reference `agent/image.png` or `architecture.md`.
2. **Demonstrate Silent Call Answering**: Trigger call, pick up, observe that the agent waits silently without speaking until caller says "Hello, do you have medicine for fever?".
3. **Demonstrate In-Call RAG**: Ask for prices and dosage of Paracetamol or Advil; highlight Deepgram tool call logs in terminal.
4. **Demonstrate Barge-In**: Interrupt the bot mid-sentence and verify immediate audio truncation.
5. **Demonstrate Post-Call Insights**: Refresh CRM dashboard to show the generated summary, positive sentiment score, and new follow-up task.
