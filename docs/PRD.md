# Product Requirements Document (PRD)

## Project: Whitespace CRM — Voice AI Agent with LangChain & RAG

---

## 1. Executive Summary
Whitespace CRM is an omnichannel customer relationship management platform purpose-built for healthcare providers, pharmacies, and clinics. The core differentiator of Whitespace CRM is its real-time, low-latency Voice AI Agent capable of conducting inbound and outbound phone calls with callers over Twilio Media Streams, answering medical and prescription queries using Retrieval-Augmented Generation (RAG), placing orders, and syncing post-call intelligence back to the CRM database.

---

## 2. Product Objectives & Goals
1. **Automated Phone Inquiries**: Handle patient inquiries regarding medications, dosages, brand alternatives, indications, side effects, operating hours, and delivery policies with <50ms local knowledge base retrieval.
2. **Order Management via Voice**: Enable callers to order medications directly over phone calls with full verification (customer name, drug name, and quantity).
3. **Silent Call Reception Protocol**:
   - **Requirement**: While allowing the agent to answer/receive incoming phone calls, the agent must **not speak anything immediately** upon connection.
   - **Rationale**: Allow the caller to initiate the dialogue naturally without being interrupted by automated robotic greetings. The agent stays in silent listening mode until the caller begins speaking.
4. **Pre-Call Context Grounding**: Retrieve caller history and past interactions from MongoDB (`uploaddetails` and `calls`) prior to media connection so that the conversational agent has context without asking repetitive questions.
5. **Post-Call Automated Workflow**: Extract sentiment, executive call summaries, CRM tasks, and draft follow-up messages automatically via LangChain structured output chains.

---

## 3. User Personas
- **Caller / Patient**: Seeking quick answers regarding their medication, order status, or pharmacy hours. Expects natural human-like voice conversation without aggressive automated interruptions.
- **Pharmacist / Care Agent**: Relies on the CRM dashboard to monitor live calls, review transcripts, track sentiment, and fulfill tasks created by the voice assistant.
- **Pharmacy Admin / Supervisor**: Manages customer contact lists, initiates bulk or single AI calls, and audits customer satisfaction ratings.

---

## 4. Key Functional Requirements

### 4.1 Inbound & Outbound Voice Calling
- **Twilio Integration**: Twilio bi-directional Media Streams over WebSockets using 8kHz `audio/x-mulaw`.
- **Deepgram STS Pipeline**: Deepgram Voice Agent API (`wss://agent.deepgram.com/v1/agent/converse`) leveraging:
  - **STT**: Nova-3 with domain-specific medical keyterms.
  - **LLM / Think**: OpenAI GPT-4o-mini with dynamic clinical system prompt.
  - **TTS**: Aura-2 Thalia English voice model.
- **Barge-in / Interruption Support**: Immediate clearing of Twilio audio playback when `UserStartedSpeaking` event fires.
- **Call Answering Silence Policy**:
  - No automated greeting speech is pushed to Twilio when a call connects.
  - The agent remains in silent listening mode until the caller initiates speech.

### 4.2 In-Call Real-Time RAG (Deepgram Tool Calling)
- Deepgram function calling triggers `search_knowledge_base`, `place_order`, and `lookup_order`.
- Sub-50ms hybrid vector and keyword search over pharmacy catalog and FAQ documents.

### 4.3 Pre-Call Dynamic Context
- Dynamic system prompt construction using MongoDB customer profile and historical call summaries before WebSocket audio streaming begins.

### 4.4 Post-Call Intelligence
- When Twilio streams complete, the full transcript is parsed with LangChain:
  - Executive summary generation.
  - Sentiment scoring (Positive, Neutral, Negative with rationale).
  - Task generation inserted into MongoDB `taskdetails`.
  - Automated follow-up message draft (SMS / WhatsApp / Email).

---

## 5. Non-Functional Requirements
- **Latency**: End-to-end voice latency < 1000ms; internal knowledge retrieval < 50ms.
- **Reliability**: Graceful fallback when MongoDB or LLM API keys are unconfigured or unavailable.
- **Audio Integrity**: Seamless 3200-byte frame buffering (20 chunks of 160 bytes) for Twilio mulaw streaming.
- **Security & Privacy**: Protection of protected health information (PHI) and secure credential handling via environment variables.

---

## 6. Success Metrics & KPIs
- **First Call Resolution (FCR)**: > 75% of routine pharmacy inquiries resolved without human intervention.
- **Average Handle Time (AHT)**: Reduced from 4 minutes to under 90 seconds for standard drug price/availability checks.
- **Caller Satisfaction**: Positive sentiment score > 85% based on automated post-call analysis.
