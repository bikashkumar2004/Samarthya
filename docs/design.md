# Design Specification & Unified Design System

## Whitespace CRM: Design System, UX & Visual Specifications

---

## 1. Unified Visual Design System

To ensure seamless visual harmony across every page and component (Dashboard, Compose Message, WhatsApp Inbox, Task Management, My Contacts, Leads, AI Call Manager, Pending Followups, and Campaigns), Whitespace CRM enforces a unified clinical-grade, modern SaaS design system.

### 1.1 Cohesive Color Palette

| Token | Hex / Class | Purpose | Application |
|---|---|---|---|
| **Primary Accent** | `#6366F1` / `indigo-500` - `indigo-600` | Core brand & active actions | Primary buttons, active sidebar items, focus rings |
| **Secondary Accent** | `#8B5CF6` / `purple-500` - `purple-600` | AI intelligence indicators | RAG badges, tool-execution indicators, AI tags |
| **Canvas Background** | `#F8FAFC` (`slate-50`) / `slate-950` | Primary app canvas | Outer page wrappers, body background |
| **Card / Surface** | `#FFFFFF` (`white`) / `slate-900` | Content containers | Tables, KPI cards, modal dialogs, drawer panels |
| **Subtle Border** | `#E2E8F0` (`slate-200`) / `slate-800` | Elevation & division | Card borders, table dividers, tab separators |
| **Primary Text** | `#0F172A` (`slate-900`) / `white` | High-contrast headers | Page titles, KPI numbers, primary data cells |
| **Muted Text** | `#64748B` (`slate-500`) / `slate-400` | Secondary descriptions | Subtitles, helper text, phone numbers, timestamps |

### 1.2 Unified Status & Sentiment Color Standards

Every page must use consistent semantic status colors:

- **Success / Positive Experience**:
  - Badge: `bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60`
  - Icon: `<CheckCircle2 />` or `<Smile />`
  - Used for: Completed calls, verified orders, positive sentiment, online agents.

- **In-Progress / Streaming / Info**:
  - Badge: `bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60`
  - Icon: `<Activity />` or `<Radio />` with pulsing dot
  - Used for: Live audio streams, active campaigns, neutral inquiries.

- **Pending / Action Required**:
  - Badge: `bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60`
  - Icon: `<Clock />` or `<AlertTriangle />`
  - Used for: Pharmacist follow-ups, queued contacts, prescription verifications.

- **Error / Rejected / Escalated**:
  - Badge: `bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60`
  - Icon: `<AlertCircle />` or `<Frown />`
  - Used for: Failed calls, rejected tasks, customer complaints.

---

## 2. Component Guidelines & Patterns

### 2.1 Cards & Containers
- Border radius: `rounded-2xl`
- Elevation: `shadow-sm hover:shadow-md transition-shadow`
- Border: `border border-slate-200 dark:border-slate-800`
- Padding: `p-6` for primary sections, `p-4` for compact widgets

### 2.2 Navigation & Sidebar (`SidebarDemo.jsx`)
- Active State: Highlighted with `bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold rounded-xl` and active route indicator.
- Inactive State: `text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-all`.
- Unified brand header: Whitespace CRM logo with glowing AI icon.

### 2.3 Tables (`LiveMonitor`, `PendingDash`, `ContactTable`, `CallHistory`, `TeamTable`, `LeadTable`)
- Header: `bg-slate-50/60 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider`
- Rows: `hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800/60`
- Numbers & Durations: Monospaced font (`font-mono text-xs`) for clean numerical alignment.

### 2.4 Manager Command Center & Team Allocation (`/manager/*`)
- **Navigation (`SidebarManager.jsx`)**: Unified Whitespace CRM branding, `useLocation` active route pill indicators (`bg-indigo-50 text-indigo-700`), and responsive mobile drawer.
- **Manager Dashboard (`Man.jsx`)**: Executive metric cards for voice session volume, average connect rate, clinical sentiment distribution matrix, and priority supervisor action queue.
- **Team Workload Overview (`Team.jsx`)**: Live agent capacity tracker, workload intensity meters (`High` / `Medium` / `Low`), and sorting by open tasks or active campaign count.
- **Batch Lead Assignment (`Assign.jsx`)**: 2-step allocation wizard with drag-and-drop CSV parser, lead row inspection/rejection, dedicated agent selector, and round-robin auto-distributor.
- **Task Rejection Audits (`ReviewRejection.jsx`)**: Manager review cards with agent justifications, lead metadata, and one-click Approve Dismissal or Reassign actions.

### 2.5 Real-Time Communication Hubs & Multi-Channel Dispatch
- **WhatsApp Inbox (`WhatsappInbox.jsx`, `ConversationList`, `ChatWindow`)**:
  - Live conversation list with unread counters, contact search, and auto-poll toggle.
  - Chat window with outbound message bubbles in unified Indigo (`bg-indigo-600 text-white`), inbound white cards, and instant reply dispatch.
- **Compose Message (`ComposeMsg.jsx`, `Channels.jsx`, `Sbody.jsx`)**:
  - Channel selector tabs with Indigo active state for SMS, Email, and WhatsApp.
  - Multi-language AI draft generator (English, Hindi, Odia) powered by Gemini.
  - Delivery status confirmation with Twilio gateway message SID inspection.

### 2.6 Authentication Experience (`LoginPage.jsx`, `RegisterPage.jsx`, `EmailVer.jsx`)
- Clean split layout with interactive cursor eye-tracking characters on brand gradient canvas.
- Crisp Whitespace CRM logo badge, modern rounded inputs with focus rings, and 6-digit OTP verification inputs.

---

## 3. Conversational Experience Design

### 3.1 Inbound Call Reception Protocol ("Silent Connect")
- **Behavior**: When an incoming call connects via Twilio Media Streams, the assistant **must not speak anything initially**.
- **Implementation**:
  - `greeting` parameter omitted from Deepgram STS Settings packet.
  - The dynamic LLM prompt includes Rule 0: *"When receiving a call, DO NOT speak anything initially. Remain completely silent and wait for caller to speak first."*
  - Deepgram STT listener remains active; audio transmission to TTS triggers only after caller vocalization.

### 3.2 Direct & Clinically Helpful Responses
- **Response Philosophy**: Concise and solution-oriented (1 to 2 sentences per turn).
- State recommended OTC medicines, standard dosage, and price immediately.
- Avoid conversational filler (e.g. "Could you clarify what you mean?").

### 3.3 Barge-In & Low Latency Streaming
- Audio transmission occurs in 8kHz mulaw chunks.
- When Deepgram detects speech while assistant TTS is active, it emits `UserStartedSpeaking`.
- Twilio WebSocket receives `{"event": "clear"}` to dump audio buffers immediately, preventing speech overlap.

---

## 4. Hybrid RAG Architecture Design

```
Caller Query ("Do you have Paracetamol 500mg?")
                  |
                  v
       +-----------------------+
       |   Deepgram STS Tool   |
       | search_knowledge_base |
       +-----------------------+
                  |
         +--------+--------+
         |                 |
         v                 v
   +-----------+     +-----------+
   |  Vector   |     |  Keyword  |
   | Embeddings|     | Matching  |
   | (Cosine)  |     |  (BM25)   |
   +-----------+     +-----------+
         \                 /
          \               /
           v             v
       +-----------------------+
       |   Hybrid Re-ranker    |
       |     (<50ms Total)     |
       +-----------------------+
                  |
                  v
         Structured Result
  (Drug name, Dosage, Price, Stock)
```

1. **Local Hybrid Retrieval**: Combines semantic closeness with exact keyword matching in under 50ms without external network hops.
2. **MongoDB Grounding**: Pre-call patient history is retrieved from `uploaddetails` and `calls` prior to audio streaming.

---

## 5. CRM Platform Landing Page Architecture

The landing page represents a complete **Customer Relationship Management (CRM) Platform** where Autonomous Voice AI serves as a built-in superpower rather than an isolated developer bot tool:

1. **Omnichannel Core**: Highlights unified interactions across WhatsApp, SMS, Email, and live phone calls in a single timeline.
2. **Customer 360° Profiles**: Shows rich contact records, medical/prescription notes, tags, and lifetime value.
3. **Visual Lead Pipelines**: Showcases deal stages (New Inbound, Contacted, Proposal, Won) with velocity metrics.
4. **Autonomous Voice AI & RAG Engine**: Demonstrates sub-50ms knowledge lookups, full barge-in, and instant post-call CRM action logging.
5. **Manager Command & Operations**: Features team workload balancing, round-robin lead allocation, and supervisor rejection audit workflows.
6. **Dual Role Navigation**: Clear entry points for Frontline Agents (`/agent/dashboard`) and Clinic/Sales Managers (`/manager/dashboard`).

---

## 6. Authentication & Onboarding Visual System Alignment

All authentication pages (`/auth/login`, `/auth/register`, `/auth/send-verify-otp`) are styled to seamlessly match the Landing page's clinical dark aesthetic:

- **Canvas & Ambient Lighting**: `bg-slate-950` with high-elevation `blur-[140px]` gradient glows (`indigo-600/20`, `purple-600/20`, `emerald-500/15`).
- **Brand Header**: Whitespace CRM logo badge with high-contrast text and a direct `← Back to Home` return link.
- **Glassmorphism Panels**: `rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-2xl shadow-2xl shadow-indigo-950/50`.
- **Form Controls**: Deep slate inputs (`bg-slate-950/80 border-slate-800`) with glowing `indigo-500` focus rings and gradient submit buttons (`bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600`).
- **Enterprise Showcase**: Desktop views display a live customer preview card highlighting real-time WhatsApp sync, sub-50ms RAG telemetry, and HIPAA compliance badges.


