# Project Memory & Knowledge State

## Repository: Whitespace CRM (Voice AI & Multi-Channel CRM)

---

## 1. Project Identity & Purpose
- **System**: Whitespace CRM
- **Core Feature**: Real-time Voice AI Pharmacy Calling Assistant with LangChain & RAG.
- **Repository Layout**:
  - `agent/`: Python 3.10+ voice AI server connecting Twilio Media Streams and Deepgram STS.
  - `server/`: Node.js / Express backend managing authentication, contact uploads, Twilio call dispatch, and MongoDB persistence.
  - `client/`: React 18 / Vite frontend dashboard for live call monitoring, contact management, and campaign execution.

---

## 2. Key Architectural Decisions (ADR Summary)
1. **Full-Duplex Speech-to-Speech (STS)**:
   - Selected Deepgram Nova-3 + GPT-4o-mini + Aura-2 over cascaded HTTP APIs for sub-second turn latency.
2. **In-Call Local Hybrid RAG**:
   - Implemented in `agent/functions/rag/knowledge_base.py`. Avoids external vector DB latency by maintaining embeddings in memory.
3. **Silent Inbound Call Connection**:
   - Configured Deepgram and system prompt to stay silent upon call connection. The agent does not speak any greeting until the caller initiates speech.
4. **Structured Post-Call Extraction**:
   - LangChain structured chains transform unstructured telephone conversations into normalized CRM tasks and sentiment metrics.

---

## 3. Database Schema Overview (MongoDB `whitespace-crm`)
- `uploaddetails` / `contactdetails`: Customer records (name, phone number, medical inquiry notes).
- `calls`: Historical call records, status updates, duration, and link to transcripts.
- `transcripts`: Full turn-by-turn conversational history.
- `taskdetails`: Automated follow-up tasks created by post-call LangChain extraction.
- `users`: Authenticated CRM staff and pharmacy operators.

---

## 4. Current State & Configuration
- **Twilio Audio Specs**: 8kHz sample rate, `mulaw` encoding, 3200-byte frame buffer.
- **Deepgram Model Specs**: Nova-3 STT, GPT-4o-mini Think, Aura-2 Thalia TTS.
- **Default Port**: Voice Agent on port 5000, Server API on port 4000, Client on port 5173.
- **Active Behavior**: Agent waits silently when call connects.

---

## 5. Technology Evaluation & Roadmap
- **Redis**: Prioritized for pre-call customer context caching (<5ms), live transcript Pub/Sub, and call concurrency rate limiting.
- **Swagger / OpenAPI**: Prioritized for Node.js REST API interactive documentation (`/api-docs`).
- **Socket.io**: Planned for real-time live call transcript broadcasting to the frontend dashboard.
- **Vector DB**: ChromaDB (local embedded) or MongoDB Atlas Vector Search ($vectorSearch).
- **GraphQL**: Planned for consolidated CRM dashboard metric queries and WebSocket subscriptions.
- **BullMQ**: Planned for asynchronous post-call LangChain extraction and campaign dispatch queues.
- **Prisma**: Optional evaluation for MongoDB type safety and auto-generated TypeScript models.
