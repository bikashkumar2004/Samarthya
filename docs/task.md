# Project Task Tracker

## Whitespace CRM: Development Roadmap & Tasks

---

## 1. Completed Tasks (Done)

- [x] **Twilio Bi-directional Audio Streaming**: Integrated 8kHz mulaw WebSocket pipeline between Twilio Media Streams and local server.
- [x] **Deepgram STS Pipeline**: Connected Nova-3 speech recognition, OpenAI GPT-4o-mini reasoning, and Aura-2 Thalia voice synthesis over persistent WebSocket.
- [x] **Silent Call Reception Protocol**:
  - [x] Removed automated greeting from `agent/config.json`.
  - [x] Updated `agent/main.py` dynamic config to pop `greeting` parameter so agent does not speak upon answering.
  - [x] Injected prompt rule 0 instructing agent to remain completely silent until caller speaks first.
- [x] **In-Call Real-Time RAG Tool Calling**:
  - [x] Implemented `search_knowledge_base` with sub-50ms hybrid vector and keyword search.
  - [x] Added `place_order` and `lookup_order` tools with parameter validation.
- [x] **Barge-In Support**: Configured Twilio `clear` event on `UserStartedSpeaking` Deepgram event to cancel active TTS speech.
- [x] **Post-Call LangChain Intelligence Pipeline**:
  - [x] Built structured LangChain extraction for executive summary, sentiment analysis, and action items.
  - [x] Implemented automatic task insertion into MongoDB `taskdetails` collection.
- [x] **CRM Platform Landing Page Transformation**:
  - [x] Repositioned `Landing.jsx` from an isolated Voice bot page to a comprehensive **Customer Relationship Management (CRM) Platform**.
  - [x] Showcased Omnichannel Customer 360°, WhatsApp Inbox, Visual Lead Pipelines, Manager Workload Balancing, and Sub-50ms Autonomous Voice AI.
  - [x] Added interactive CRM experience hub with tabbed Customer 360, Kanban Pipeline, Voice Telephony, and Manager Command Center views.
  - [x] Provided direct role navigation for Frontline Agents (`/agent/dashboard`) and Clinic/Sales Managers (`/manager/dashboard`).
- [x] **Forgot Password & Password Reset Suite**:
  - [x] Created [ForgotPasswordPage.jsx](file:///c:/Users/HP/OneDrive/%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88/GitHub/whitespace-crm/client/src/pages/auth/ForgotPasswordPage.jsx) featuring a 2-step password recovery flow (Email OTP request + New password reset).
  - [x] Connected Redux thunks `resetOTP` and `resetPassword` to backend `/api/auth/reset-OTP` and `/api/auth/reset-Password`.
  - [x] Fixed `authRoute.js` to allow public password reset access without requiring a pre-existing authenticated token.
  - [x] Registered routes `/auth/forgot-password` and `/auth/reset-password` in [App.jsx](file:///c:/Users/HP/OneDrive/%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88/GitHub/whitespace-crm/client/src/App.jsx).
  - [x] Linked "Forgot password?" in [LoginPage.jsx](file:///c:/Users/HP/OneDrive/%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88/GitHub/whitespace-crm/client/src/pages/auth/LoginPage.jsx) directly to the new recovery flow.
- [x] **Documentation Suite Created**:
  - [x] `PRD.md`
  - [x] `architecture.md`
  - [x] `deployment.md`
  - [x] `design.md`
  - [x] `interview-guide.md`
  - [x] `project-memory.md` & `project memory.md`
  - [x] `rules.md`
  - [x] `task.md`

---

## 2. In-Progress Tasks (Active)

- [ ] **Live Call Monitor UX Enhancements**: Polish the real-time waveform and transcript streaming component on the frontend dashboard.
- [ ] **Automated Integration Test Suite**: Expand `agent/test_rag_integration.py` to simulate inbound WebSocket connections and verify silence before caller speech.

---

## 3. High-Priority Enhancements (Immediate ROI)

- [ ] **Redis In-Memory Caching & Pub/Sub Layer**:
  - [ ] Implement caller profile & pre-call history caching in Redis for sub-5ms retrieval before audio connection.
  - [ ] Use Redis Pub/Sub to broadcast live call events and transcript turns between Python agent and Node.js backend.
  - [ ] Add Redis-based rate limiting to protect Twilio outbound call concurrency limits.

- [ ] **Interactive API Documentation (Swagger / OpenAPI)**:
  - [ ] Install `swagger-ui-express` and `swagger-jsdoc` on the Node.js server.
  - [ ] Document all REST routes (`/api/sms`, `/api/aiCall`, `/api/agent/contactList`, `/api/campaigns`) at `/api-docs`.
  - [ ] Provide one-click API test playground for frontend and integration testing.

- [ ] **Socket.io Real-Time Live Transcript Streaming**:
  - [ ] Attach Socket.io to Express server on port 4000.
  - [ ] Stream caller/assistant utterances from `agent/main.py` directly to the React dashboard live monitor without page refreshes.

- [ ] **Vector Database Integration (ChromaDB / MongoDB Atlas Vector Search)**:
  - [ ] Evaluate embedded ChromaDB/LanceDB (local, sub-30ms latency) vs. MongoDB Atlas Vector Search ($vectorSearch on existing cluster).
  - [ ] Generate dense embeddings (e.g. `text-embedding-3-small` or Hugging Face `all-MiniLM-L6-v2`) for pharmacy catalog and medical policies.
  - [ ] Update `agent/functions/rag/knowledge_base.py` to query the vector database while keeping voice turn-taking retrieval strictly under 50ms.

---

## 4. Medium-Priority Enhancements (Architecture & Scaling)

- [ ] **GraphQL API Layer (Apollo Server / Yoga)**:
  - [ ] Build a unified GraphQL schema for CRM dashboard aggregations (calls, leads, tasks, follow-ups).
  - [ ] Consolidate multiple REST calls on page load into a single optimized query.
  - [ ] Add GraphQL Subscriptions over WebSockets for reactive dashboard updates.

- [ ] **BullMQ Background Task & Campaign Queue**:
  - [ ] Decouple post-call LangChain extraction and customer SMS dispatch from the main HTTP process using Redis-backed queues.
  - [ ] Enable controlled, retry-resilient bulk outbound campaign scheduling with pause/resume capabilities.

- [ ] **Prisma ORM & Type Safety Evaluation**:
  - [ ] Evaluate Prisma with MongoDB provider (`provider = "mongodb"`) for schema safety and auto-generated TypeScript definitions.
  - [ ] Benchmark query overhead compared to current Mongoose models.

---

## 5. Enterprise, Security & Observability Backlog

- [ ] **Twilio Webhook Cryptographic Verification**:
  - [ ] Enforce `twilio.webhook()` middleware across all inbound call and media stream webhook endpoints to block spoofed requests.
- [ ] **LangSmith & Observability Tracing**:
  - [ ] Add LangSmith / OpenTelemetry tracing for LangChain RAG retrieval accuracy, token costs, and LLM latency tracking.
- [ ] **Multi-Language Support**:
  - [ ] Expand STT and TTS models in Deepgram to support Spanish and regional dialects.
- [ ] **Advanced EHR/Pharmacy System Sync (FHIR / HL7)**:
  - [ ] Integrate standard healthcare interoperability endpoints for real-time inventory and patient prescription verification.
- [ ] **Voicemail & Answering Machine Detection (AMD)**:
  - [ ] Enable Twilio AMD to detect automated answering systems and leave structured voicemail messages or cleanly terminate calls.
- [ ] **SMS Follow-Up Automation**:
  - [ ] Auto-dispatch drafted follow-up SMS/WhatsApp messages via Twilio Messaging API immediately upon call completion.
