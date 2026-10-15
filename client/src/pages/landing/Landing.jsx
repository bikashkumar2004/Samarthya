import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Bot,
  Zap,
  Shield,
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart3,
  MessageSquare,
  Users,
  Database,
  Radio,
  Volume2,
  ChevronRight,
  Search,
  Headphones,
  Check,
  Play,
  Layers,
  Award
} from "lucide-react";

export default function Landing() {
  const [activeTab, setActiveTab] = useState("voice");
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Glow Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-[800px] right-0 w-[600px] h-[500px] bg-blue-600/10 blur-[120px] pointer-events-none" />

      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900/40 border-b border-indigo-500/20 py-2.5 px-4 text-center text-xs sm:text-sm font-medium text-indigo-200">
        <span className="inline-flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-emerald-400">Deepgram STS + Twilio + LangChain RAG Live:</span>
          Sub-50ms In-Call Medication & Inquiry Retrieval
          <Link to="/agent/dashboard" className="underline font-bold text-white hover:text-indigo-300 ml-1 inline-flex items-center">
            Open Dashboard <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </span>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-emerald-400 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                Whitespace CRM
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
                Voice AI
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#voice-pipeline" className="hover:text-white transition-colors">Voice Pipeline</a>
            <a href="#rag-engine" className="hover:text-white transition-colors">RAG Engine</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/auth/login"
              className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/agent/dashboard"
              className="relative group overflow-hidden rounded-xl p-[1px] font-semibold text-sm shadow-md shadow-indigo-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 group-hover:scale-105 transition-transform" />
              <div className="relative px-5 py-2.5 rounded-[11px] bg-slate-950 hover:bg-slate-900 text-white flex items-center gap-2 transition-colors">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Live Dashboard</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Next-Gen Healthcare & Pharmacy Voice Intelligence</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-emerald-400 font-semibold">Sub-50ms RAG</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Intelligent Voice AI That{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-300 bg-clip-text text-transparent">
              Calls, Understands & Resolves
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Conduct autonomous telephone conversations with human-grade latency. Retrieve medication prices in sub-50ms, capture verified orders, and auto-sync LangChain insights directly into your CRM.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/agent/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-base shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-3 group transition-all"
            >
              <span>Explore Live Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#live-demo"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-base flex items-center justify-center gap-2.5 transition-colors"
            >
              <Volume2 className="w-4 h-4 text-indigo-400" />
              <span>Simulate Voice Call</span>
            </a>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-12 border-t border-slate-900 mt-12 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">&lt; 48ms</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-medium">RAG Query Latency</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">94.8%</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-medium">Auto-Resolution Rate</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400">Full Duplex</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-medium">Real-Time Barge-In</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-purple-400">100%</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-medium">MongoDB Grounded</div>
            </div>
          </div>
        </div>

        {/* Live Audio & Interface Preview */}
        <div id="live-demo" className="mt-16 max-w-5xl mx-auto rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/40 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Headphones className="w-6 h-6 animate-pulse" />
                </div>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-ping" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-lg">Live Telephony Session</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    Twilio + Deepgram Active
                  </span>
                </div>
                <p className="text-xs text-slate-400">Caller: +1 (555) 019-2834 • Whitespace Pharmacy Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
                Audio: 8kHz mulaw
              </span>
              <Link
                to="/agent/dashboard"
                className="text-xs font-semibold px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5"
              >
                <span>Live Monitor</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Interactive Simulated Waveform & Conversation */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Conversation Flow */}
            <div className="md:col-span-2 space-y-4 font-sans text-sm">
              <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  U
                </div>
                <div>
                  <div className="text-xs font-semibold text-blue-400 mb-1">Customer (Caller)</div>
                  <p className="text-slate-300">"Hi, I've had a fever and bad headache since yesterday. Do you have Paracetamol in stock and what's the price?"</p>
                </div>
              </div>

              {/* RAG Tool Execution Pill */}
              <div className="ml-6 flex items-center gap-2 text-xs font-mono text-purple-300 bg-purple-950/40 border border-purple-500/30 px-3 py-1.5 rounded-lg">
                <Database className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                <span>Tool Execution: <strong>search_knowledge_base("Paracetamol 500mg price")</strong> — Resolved in <strong>38ms</strong></span>
              </div>

              <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  AI
                </div>
                <div>
                  <div className="text-xs font-semibold text-emerald-400 mb-1 flex items-center gap-2">
                    <span>Whitespace AI Assistant</span>
                    <span className="text-[10px] text-slate-500 font-mono">Deepgram Nova-3 + GPT-4o-mini</span>
                  </div>
                  <p className="text-slate-300">
                    "Yes, we have Paracetamol 500mg available in 25-tablet packs for $6.99 (brands Dolo and Crocin). You can take one tablet every 4 to 6 hours as needed. Would you like me to place an order for you?"
                  </p>
                </div>
              </div>
            </div>

            {/* Live Metrics Column */}
            <div className="bg-slate-950/80 rounded-xl p-5 border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Live Call Telemetry</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Speech Latency</span>
                      <span className="text-emerald-400 font-bold">420ms</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full w-[35%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">RAG Vector Search</span>
                      <span className="text-purple-400 font-bold">38ms</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-400 h-full w-[15%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Sentiment Score</span>
                      <span className="text-indigo-400 font-bold">Positive (94%)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-400 h-full w-[94%]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80">
                <div className="text-[11px] text-slate-400 mb-2">Automated Next Action:</div>
                <div className="text-xs bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-300 font-mono">
                  ✓ Task: Dispense Paracetamol 500mg
                  <br />
                  ✓ SMS follow-up ready
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-500/30">
            Engineered For Healthcare & Scale
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Everything Required To Run An Autonomous Voice Call Center
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Built from the ground up for high-throughput healthcare providers, multi-location pharmacies, and patient support teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/50 p-8 transition-all hover:shadow-xl hover:shadow-indigo-950/30">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Sub-50ms Hybrid RAG</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Instant retrieval over medications, inventory stock, drug interactions, prescription rules, and return policies with zero network lag.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-purple-500/50 p-8 transition-all hover:shadow-xl hover:shadow-purple-950/30">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Twilio & Deepgram STS</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Full-duplex telephony streams over WebSockets. Integrated Nova-3 speech recognition, GPT-4o-mini clinical reasoning, and Aura-2 natural voice.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-emerald-500/50 p-8 transition-all hover:shadow-xl hover:shadow-emerald-950/30">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Silent Answering Protocol</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Upon call connection, the agent waits silently without robotic interruptions, letting the customer speak first for a natural conversational experience.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="group rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-blue-500/50 p-8 transition-all hover:shadow-xl hover:shadow-blue-950/30">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">MongoDB Pre-Call Grounding</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Before the call connects, customer records, prior symptoms, and past call summaries are compiled to prime the agent's personalized prompt.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="group rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-rose-500/50 p-8 transition-all hover:shadow-xl hover:shadow-rose-950/30">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">LangChain Post-Call Intelligence</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Transcripts are immediately processed with structured chains to extract executive summaries, sentiment ratings, and auto-created CRM action items.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="group rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-amber-500/50 p-8 transition-all hover:shadow-xl hover:shadow-amber-950/30">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Omnichannel Automation</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Seamless follow-ups across SMS, WhatsApp, and Email. Trigger confirmation messages and medicine intake reminders automatically.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-slate-900/80 border border-indigo-500/30 p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
              Ready to Upgrade Your Healthcare Voice Operations?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Launch your autonomous pharmacy and clinic CRM agent today. Experience instant RAG lookups, live monitoring, and automated post-call intelligence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/agent/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-bold text-base shadow-xl transition-all"
              >
                Go to Agent Dashboard
              </Link>
              <Link
                to="/auth/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/40 text-white font-semibold text-base transition-colors"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-slate-300">Whitespace CRM</span>
            <span>• Powered by Deepgram STS, Twilio & LangChain RAG</span>
          </div>

          <div className="flex gap-6 text-slate-400">
            <Link to="/agent/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link to="/agent/aicallmanager" className="hover:text-white transition-colors">Call Manager</Link>
            <Link to="/agent/my-contacts" className="hover:text-white transition-colors">Contacts</Link>
            <Link to="/auth/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>

          <div>
            © {new Date().getFullYear()} Whitespace CRM. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}