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
  Layers,
  Award,
  Kanban,
  Send,
  TrendingUp,
  Target,
  FileText,
  LayoutDashboard,
  CheckSquare,
  Calendar,
  UserPlus,
  Building2,
  SlidersHorizontal,
  Mail,
  UserCheck,
  AlertCircle,
  Menu,
  X
} from "lucide-react";

export default function Landing() {
  const [activeTab, setActiveTab] = useState("customer360");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Glow Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-emerald-500/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-[850px] right-0 w-[600px] h-[500px] bg-blue-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[1600px] left-0 w-[550px] h-[500px] bg-purple-600/10 blur-[130px] pointer-events-none" />

      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-purple-950/70 to-slate-950/80 border-b border-indigo-500/20 py-2.5 px-4 text-center text-xs sm:text-sm font-medium text-indigo-200">
        <span className="inline-flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-emerald-400">Next-Gen CRM Platform:</span>
          Omnichannel WhatsApp, 360° Customer Profiles & Sub-50ms Autonomous Voice AI
          <Link to="/agent/dashboard" className="underline font-bold text-white hover:text-indigo-300 ml-1 inline-flex items-center">
            Explore Workspace <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </span>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/90 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-emerald-400 p-[1px] shadow-lg shadow-indigo-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                <LayoutDashboard className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent whitespace-nowrap">
                Whitespace CRM
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold whitespace-nowrap">
                Customer Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-slate-300">
            <a href="#crm-overview" className="whitespace-nowrap hover:text-white transition-colors">
              Features
            </a>
            <a href="#omnichannel" className="whitespace-nowrap hover:text-white transition-colors">
              Omnichannel
            </a>
            <a href="#pipelines" className="whitespace-nowrap hover:text-white transition-colors">
              Pipelines
            </a>
            <a href="#voice-telephony" className="whitespace-nowrap hover:text-white transition-colors">
              Voice AI
            </a>
            <a href="#manager-hub" className="whitespace-nowrap hover:text-white transition-colors">
              Manager Hub
            </a>
            <a href="#pricing" className="whitespace-nowrap hover:text-white transition-colors">
              Pricing
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/auth/login"
              className="whitespace-nowrap text-xs sm:text-sm font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>

            <Link
              to="/agent/dashboard"
              className="whitespace-nowrap text-xs sm:text-sm font-semibold text-indigo-300 hover:text-white px-3.5 py-2 rounded-xl bg-indigo-950/60 border border-indigo-500/30 hover:bg-indigo-900/60 transition-colors hidden sm:inline-flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Agent CRM</span>
            </Link>

            <Link
              to="/manager/dashboard"
              className="whitespace-nowrap relative group overflow-hidden rounded-xl p-[1px] font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/20 shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 group-hover:scale-105 transition-transform" />
              <div className="relative px-3.5 sm:px-4 py-2 rounded-[11px] bg-slate-950 hover:bg-slate-900 text-white flex items-center gap-1.5 transition-colors">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="whitespace-nowrap">Manager Hub</span>
              </div>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-6 py-4 bg-slate-950/95 border-b border-slate-800 space-y-3 font-medium text-sm animate-fadeIn">
            <a
              href="#crm-overview"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-white py-1"
            >
              Features
            </a>
            <a
              href="#omnichannel"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-white py-1"
            >
              Omnichannel Inbox
            </a>
            <a
              href="#pipelines"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-white py-1"
            >
              Lead Pipelines
            </a>
            <a
              href="#voice-telephony"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-white py-1"
            >
              Voice AI Engine
            </a>
            <a
              href="#manager-hub"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-white py-1"
            >
              Manager Hub
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-white py-1"
            >
              Pricing
            </a>
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <Link
                to="/agent/dashboard"
                className="w-full text-center py-2 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold"
              >
                Open Agent CRM
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-20 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Complete Customer Relationship Management Platform</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-emerald-400 font-semibold">Autonomous Voice + Omnichannel</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            The AI-Powered CRM That Connects Every{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-300 bg-clip-text text-transparent">
              Customer, Conversation & Pipeline
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Unify your customer interactions across WhatsApp, SMS, email, and live phone calls. Manage 360° patient and client profiles, accelerate sales pipelines, balance agent workloads, and let autonomous Voice AI resolve inquiries in real time.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              to="/agent/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm sm:text-base shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2.5 group transition-all"
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-200" />
              <span>Open Agent Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/manager/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Manager Command Center</span>
            </Link>
            <a
              href="#crm-demo"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800/80 text-slate-300 font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-colors"
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>Interactive CRM Demo</span>
            </a>
          </div>

          {/* Key CRM Performance Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-slate-900 mt-10 text-center">
            <div>
              <div className="text-2xl sm:text-4xl font-extrabold text-white">360°</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-medium">Customer Timeline</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-extrabold text-indigo-400">3.8x</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-medium">Lead Conversion Speed</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-extrabold text-purple-400">&lt; 48ms</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-medium">RAG Knowledge Retrieval</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-extrabold text-emerald-400">100%</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-medium">Automated CRM Call Logging</div>
            </div>
          </div>
        </div>

        {/* Interactive CRM & Voice Demo Showcase */}
        <div id="crm-demo" className="mt-14 max-w-6xl mx-auto rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-2xl p-5 sm:p-7 shadow-2xl shadow-indigo-950/40 relative">
          
          {/* Top Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-4 pb-5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="font-bold text-white text-base sm:text-lg">Live CRM Experience Hub</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                Unified Ecosystem
              </span>
            </div>

            {/* Interactive Tab Switchers */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setActiveTab("customer360")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === "customer360"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Customer 360° Profile</span>
              </button>

              <button
                onClick={() => setActiveTab("pipeline")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === "pipeline"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Lead Pipeline</span>
              </button>

              <button
                onClick={() => setActiveTab("voice")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === "voice"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Headphones className="w-3.5 h-3.5 text-emerald-400" />
                <span>Autonomous Voice AI</span>
              </button>

              <button
                onClick={() => setActiveTab("manager")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === "manager"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                <span>Manager Hub</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Customer 360° Profile View */}
          {activeTab === "customer360" && (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
              {/* Profile Card */}
              <div className="bg-slate-950/80 rounded-xl p-5 border border-slate-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      SM
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">Sarah Miller</h4>
                      <p className="text-xs text-slate-400">+1 (555) 019-2834 • sarah.m@healthnet.com</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    VIP Customer
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">Lead Status</span>
                    <span className="font-semibold text-indigo-400">Active Prescribing</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">Lifetime Value</span>
                    <span className="font-semibold text-emerald-400">$3,420.00</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">Assigned Agent</span>
                    <span className="font-semibold text-slate-200">Dr. Rachel Green</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">Primary Channel</span>
                    <span className="font-semibold text-purple-400">WhatsApp + Voice</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-300 block mb-2">Customer Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-900/30 text-indigo-300 border border-indigo-500/20">Chronic Refill</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-900/30 text-purple-300 border border-purple-500/20">Express Shipping</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-900/30 text-emerald-300 border border-emerald-500/20">High Priority</span>
                  </div>
                </div>

                <Link
                  to="/agent/my-contacts"
                  className="w-full py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>View All 1,420 Contacts</span>
                </Link>
              </div>

              {/* Omnichannel Activity Timeline */}
              <div className="lg:col-span-2 bg-slate-950/80 rounded-xl p-5 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span>Omnichannel Interaction Timeline</span>
                  </h4>
                  <span className="text-xs text-slate-400">Synced across WhatsApp, Voice & Email</span>
                </div>

                <div className="space-y-3 font-sans text-xs">
                  {/* WhatsApp Event */}
                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-emerald-400">WhatsApp Message Received</span>
                        <span className="text-[10px] text-slate-500">10 mins ago</span>
                      </div>
                      <p className="text-slate-300">"Can you please confirm if my refill order for Metformin 500mg has been dispatched?"</p>
                    </div>
                  </div>

                  {/* AI Call Event */}
                  <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/20 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-indigo-400">Autonomous Inbound Call Completed (1m 42s)</span>
                        <span className="text-[10px] text-slate-500">2 hours ago</span>
                      </div>
                      <p className="text-slate-300">AI verified identity, confirmed prescription eligibility, and generated CRM task: Dispense Paracetamol 500mg.</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-800">
                          Sentiment: Positive (94%)
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-purple-300 border border-slate-800">
                          RAG: 38ms
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Email & Task Event */}
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                      <CheckSquare className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-purple-400">Automated Follow-Up SMS Dispatched</span>
                        <span className="text-[10px] text-slate-500">2 hours ago</span>
                      </div>
                      <p className="text-slate-400">"Tracking link #WH-8841 sent to +1 (555) 019-2834 via Twilio Messaging API."</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
                  <span className="text-slate-400">Auto-synced with MongoDB CRM core</span>
                  <Link to="/agent/whatsapp-inbox" className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                    <span>Open Live WhatsApp Inbox</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Lead Pipeline View */}
          {activeTab === "pipeline" && (
            <div className="mt-6 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-base">Visual Lead Pipeline & Deal Velocity</h4>
                  <p className="text-xs text-slate-400">Track inquiries from initial contact to completed prescription and repeat orders.</p>
                </div>
                <Link
                  to="/agent/leads"
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1"
                >
                  <span>Open Full Pipeline</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Kanban Stage Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Stage 1 */}
                <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                    <span className="font-bold text-xs text-blue-400 uppercase tracking-wider">New Inbound (14)</span>
                    <span className="text-xs text-slate-400 font-bold">$18,400</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-white">St. Jude Clinic</span>
                      <span className="text-emerald-400 font-mono">$4,200</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Bulk Amoxicillin & Antibiotics contract inquiry.</p>
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Inbound Web Form
                    </span>
                  </div>
                </div>

                {/* Stage 2 */}
                <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                    <span className="font-bold text-xs text-indigo-400 uppercase tracking-wider">Contacted / Call (8)</span>
                    <span className="text-xs text-slate-400 font-bold">$34,100</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-white">Sarah Miller</span>
                      <span className="text-emerald-400 font-mono">$3,420</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Voice AI verified prescription; awaiting doctor sign-off.</p>
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      Voice AI Qualified
                    </span>
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                    <span className="font-bold text-xs text-purple-400 uppercase tracking-wider">Proposal / Review (6)</span>
                    <span className="text-xs text-slate-400 font-bold">$52,600</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-white">Oakwood Wellness</span>
                      <span className="text-emerald-400 font-mono">$12,800</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Monthly specialty medication dispensary proposal.</p>
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      Quote Sent
                    </span>
                  </div>
                </div>

                {/* Stage 4 */}
                <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                    <span className="font-bold text-xs text-emerald-400 uppercase tracking-wider">Closed Won (29)</span>
                    <span className="text-xs text-slate-400 font-bold">$148,900</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-white">Horizon Health Group</span>
                      <span className="text-emerald-400 font-mono">$24,500</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Automated refill agreement closed via WhatsApp CRM.</p>
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active Customer
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Autonomous Voice AI View */}
          {activeTab === "voice" && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
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
                  <span>CRM Knowledge Base: <strong>search_knowledge_base("Paracetamol 500mg price")</strong> — <strong>38ms</strong></span>
                </div>

                <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    AI
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-emerald-400 mb-1 flex items-center gap-2">
                      <span>Whitespace Voice Agent</span>
                      <span className="text-[10px] text-slate-500 font-mono">Deepgram Nova-3 + GPT-4o-mini</span>
                    </div>
                    <p className="text-slate-300">
                      "Yes, we have Paracetamol 500mg available in 25-tablet packs for $6.99 (brands Dolo and Crocin). You can take one tablet every 4 to 6 hours as needed. Would you like me to place an order for you?"
                    </p>
                  </div>
                </div>
              </div>

              {/* Live Telephony & CRM Auto-Sync Telemetry */}
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
                  <div className="text-[11px] text-slate-400 mb-2 font-semibold">Automated Post-Call CRM Actions:</div>
                  <div className="text-xs bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-300 font-mono space-y-1">
                    <div className="text-emerald-400">✓ Task: Dispense Paracetamol 500mg</div>
                    <div className="text-indigo-300">✓ Lead Status: Won (Quote Accepted)</div>
                    <div className="text-slate-400">✓ Twilio SMS Confirmation queued</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Manager Hub View */}
          {activeTab === "manager" && (
            <div className="mt-6 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-base">Manager Command Center & Workload Balancing</h4>
                  <p className="text-xs text-slate-400">Real-time team distribution, round-robin lead allocation, and supervisor audits.</p>
                </div>
                <Link
                  to="/manager/dashboard"
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1"
                >
                  <span>Open Manager Hub</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Rep 1 */}
                <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center text-xs">
                        RG
                      </div>
                      <div>
                        <span className="font-bold text-white text-xs block">Dr. Rachel Green</span>
                        <span className="text-[10px] text-slate-400">Senior Care Specialist</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active (92%)
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Assigned Leads</span>
                      <span className="font-semibold">34 Leads</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Avg Resolution</span>
                      <span className="font-semibold text-emerald-400">4m 12s</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Quota Achieved</span>
                      <span className="font-semibold text-indigo-400">118%</span>
                    </div>
                  </div>
                </div>

                {/* Rep 2 */}
                <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 font-bold flex items-center justify-center text-xs">
                        MJ
                      </div>
                      <div>
                        <span className="font-bold text-white text-xs block">Marcus Johnson</span>
                        <span className="text-[10px] text-slate-400">Account Executive</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active (78%)
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Assigned Leads</span>
                      <span className="font-semibold">28 Leads</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Avg Resolution</span>
                      <span className="font-semibold text-emerald-400">5m 30s</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Quota Achieved</span>
                      <span className="font-semibold text-indigo-400">96%</span>
                    </div>
                  </div>
                </div>

                {/* Supervisor Queue */}
                <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Rejection Audit Queue
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      3 Pending
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Supervisor review of customer disconnections, unfulfilled prescription queries, and churn-risk contacts.
                  </p>
                  <Link
                    to="/manager/review-rejection"
                    className="w-full py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Audit Rejected Leads</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Core CRM Capabilities Section */}
      <section id="crm-overview" className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-500/30">
            End-To-End Customer Relationship Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Everything Your Organization Needs To Manage, Engage & Convert Customers
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Built from the ground up for modern businesses, healthcare practices, multi-location pharmacies, and high-volume customer service teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1: Omnichannel Inbox */}
          <div className="group rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/50 p-8 transition-all hover:shadow-xl hover:shadow-indigo-950/30">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Unified Omnichannel Inbox</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Bring WhatsApp chats, two-way SMS, email messages, and telephone recordings into one unified conversation timeline. Never lose customer context again.
            </p>
            <Link to="/agent/whatsapp-inbox" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              <span>Explore WhatsApp Inbox</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 2: 360° Profiles */}
          <div className="group rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-purple-500/50 p-8 transition-all hover:shadow-xl hover:shadow-purple-950/30">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">360° Customer & Contact Profiles</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Rich patient records containing full prescription histories, past inquiries, sentiment ratings, customer tags, and custom attributes backed by MongoDB.
            </p>
            <Link to="/agent/my-contacts" className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1">
              <span>View Contact Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 3: Lead Pipeline */}
          <div className="group rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-emerald-500/50 p-8 transition-all hover:shadow-xl hover:shadow-emerald-950/30">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Kanban className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Visual Lead & Deal Pipelines</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Kanban-style sales and prescription stages with automatic deal scoring, stage progression automation, and deal velocity metrics for reps and supervisors.
            </p>
            <Link to="/agent/leads" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              <span>Manage Lead Pipeline</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 4: Autonomous Voice AI */}
          <div className="group rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-blue-500/50 p-8 transition-all hover:shadow-xl hover:shadow-blue-950/30">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Autonomous Voice AI & RAG</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Native Twilio + Deepgram STS telephony integration. Resolves caller questions with sub-50ms knowledge base lookups and natural human cadence.
            </p>
            <Link to="/agent/aicallmanager" className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
              <span>Open AI Call Manager</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 5: Automated Post-Call CRM Sync */}
          <div className="group rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-rose-500/50 p-8 transition-all hover:shadow-xl hover:shadow-rose-950/30">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Automated Post-Call CRM Sync</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Eliminate manual data entry. Transcripts are automatically synthesized into CRM tasks, follow-up deadlines, customer status updates, and SMS notifications.
            </p>
            <Link to="/agent/task-management" className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1">
              <span>View Task Management</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 6: Manager Operations */}
          <div className="group rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-amber-500/50 p-8 transition-all hover:shadow-xl hover:shadow-amber-950/30">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Manager Command & Allocation</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Intelligent lead round-robin distribution, agent workload tracking, quota monitoring, and rejection audit workflows to ensure zero dropped opportunities.
            </p>
            <Link to="/manager/dashboard" className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1">
              <span>View Manager Hub</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Role-Based Showcase: Frontline Agents vs Clinic Managers */}
      <section id="manager-hub" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            Built For Dual Operational Excellence
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Tailored Experiences For Frontline Reps & Team Leaders
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Whitespace CRM provides dedicated, high-speed environments optimized for individual rep productivity and supervisor team management.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Agent Role Card */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-950/50 via-slate-900/80 to-slate-950 border border-indigo-500/30 p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                <Users className="w-3.5 h-3.5" />
                <span>For Frontline Agents & Care Specialists</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Everything To Close Deals & Resolve Customer Inquiries
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Empower your frontline staff with real-time customer context, automated pending follow-up queues, integrated WhatsApp inbox, and AI call transcription.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unified Customer 360 with prescription & order history</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real-time WhatsApp customer threads and quick replies</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Automated pending follow-up queues and deadline alerts</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Autonomous AI Telephony co-pilot with live RAG answers</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Link
                to="/agent/dashboard"
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/30"
              >
                <span>Launch Frontline Agent Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Manager Role Card */}
          <div className="rounded-3xl bg-gradient-to-br from-purple-950/50 via-slate-900/80 to-slate-950 border border-purple-500/30 p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>For Clinic Directors & Sales Managers</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Command Visibility, Workload Balancing & Quality Assurance
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Supercharge team performance with instant capacity metrics, automatic lead assignment algorithms, and a comprehensive rejection audit workflow.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real-time team workload and live active call telemetry</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Intelligent lead & inquiry auto-assignment (round-robin)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Supervisor audit queue for rejected or lost leads</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pipeline velocity benchmarks and sales conversion forecasting</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Link
                to="/manager/dashboard"
                className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-purple-600/30"
              >
                <span>Launch Manager Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Omnichannel Section */}
      <section id="omnichannel" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-900">
        <div className="rounded-3xl bg-slate-900/50 border border-slate-800 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-500/30">
                Omnichannel Connectivity
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Meet Customers On Their Terms: WhatsApp, Voice, SMS & Email
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Whether a customer calls with an urgent fever, messages via WhatsApp for a medication price check, or replies to an automated SMS prescription reminder, Whitespace CRM records and routes every touchpoint seamlessly.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-3">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Business</span>
                  </div>
                  <p className="text-xs text-slate-400">Two-way messaging with media, prescription PDFs, and automated quick buttons.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-1">
                    <Phone className="w-4 h-4" />
                    <span>Live Telephony</span>
                  </div>
                  <p className="text-xs text-slate-400">Twilio SIP trunking with full barge-in and real-time audio transcript generation.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-1">
                    <Send className="w-4 h-4" />
                    <span>Twilio SMS</span>
                  </div>
                  <p className="text-xs text-slate-400">Instant order confirmations, tracking codes, and scheduled medication intake reminders.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-1">
                    <Mail className="w-4 h-4" />
                    <span>Email & Invoices</span>
                  </div>
                  <p className="text-xs text-slate-400">Clinical summaries, itemized invoices, and automated follow-up sequences.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    WA
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">WhatsApp Customer Chat</h5>
                    <span className="text-[10px] text-emerald-400">Online • Whitespace Cloud Sync</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500">Live Session</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-900 p-3 rounded-xl rounded-tl-none border border-slate-800 max-w-[85%] text-slate-300">
                  "Hello, does my insurance cover Metformin refills at your pharmacy?"
                </div>
                <div className="bg-indigo-600/20 p-3 rounded-xl rounded-tr-none border border-indigo-500/30 max-w-[85%] ml-auto text-indigo-100">
                  "Yes, Sarah! We verified your HealthNet policy (#HN-8921). Metformin 500mg has a $0 co-pay. Would you like standard delivery to your registered address?"
                </div>
                <div className="bg-slate-900 p-3 rounded-xl rounded-tl-none border border-slate-800 max-w-[85%] text-slate-300">
                  "Yes please, dispatch it today!"
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>CRM Triggered: Order #ORD-4491 created and assigned to Pharmacy Prep.</span>
                </div>
              </div>

              <Link
                to="/agent/composemessage"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-indigo-400" />
                <span>Open Omnichannel Message Composer</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Engine Specs (Complementary CRM Superpower) */}
      <section id="voice-telephony" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-500/30">
            Native CRM Telephony AI
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            High-Performance Voice AI Integrated Into Every Customer Record
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            No external bots or disconnected telephony silos. Your agents and AI share the exact same knowledge base, patient records, and real-time inventory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <Radio className="w-7 h-7 text-indigo-400 mx-auto mb-3" />
            <h4 className="font-bold text-white text-base mb-1">Silent Connect</h4>
            <p className="text-xs text-slate-400">Caller speaks first naturally without annoying robot introductions.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <Volume2 className="w-7 h-7 text-purple-400 mx-auto mb-3" />
            <h4 className="font-bold text-white text-base mb-1">Full-Duplex Barge-In</h4>
            <p className="text-xs text-slate-400">Customers can interrupt naturally; audio playback stops in under 60ms.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <Database className="w-7 h-7 text-emerald-400 mx-auto mb-3" />
            <h4 className="font-bold text-white text-base mb-1">Sub-50ms RAG</h4>
            <p className="text-xs text-slate-400">Medication prices, stock availability, and contraindications retrieved instantly.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <CheckSquare className="w-7 h-7 text-rose-400 mx-auto mb-3" />
            <h4 className="font-bold text-white text-base mb-1">Automated CRM Sync</h4>
            <p className="text-xs text-slate-400">Creates tickets, logs sentiment score, and dispatches SMS receipts automatically.</p>
          </div>
        </div>
      </section>

      {/* Pricing / Plan Teaser Section */}
      <section id="pricing" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-500/30">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Designed To Scale With Your Practice & Business
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Choose the tier that matches your customer volume, agent seats, and autonomous voice usage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="font-bold text-white text-xl">Starter CRM</h3>
              <p className="text-xs text-slate-400 mt-1">For single clinics & emerging practices</p>
              <div className="text-3xl font-extrabold text-white mt-4">$79<span className="text-sm font-normal text-slate-400">/mo</span></div>
              <ul className="space-y-3 mt-6 text-xs text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Up to 3 Agent seats</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Customer 360 & Contact Directory</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> WhatsApp Inbox & SMS Outreach</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 300 Voice AI Minutes included</li>
              </ul>
            </div>
            <Link to="/auth/register" className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs text-center transition-colors">
              Get Started
            </Link>
          </div>

          {/* Professional Plan (Highlighted) */}
          <div className="p-8 rounded-2xl bg-slate-900/80 border-2 border-indigo-500 relative flex flex-col justify-between space-y-6 shadow-2xl shadow-indigo-950/50">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md">
              Most Popular
            </span>
            <div>
              <h3 className="font-bold text-white text-xl">Professional Practice</h3>
              <p className="text-xs text-slate-400 mt-1">For growing multi-rep sales & care teams</p>
              <div className="text-3xl font-extrabold text-white mt-4">$199<span className="text-sm font-normal text-slate-400">/mo</span></div>
              <ul className="space-y-3 mt-6 text-xs text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Up to 12 Agent & Manager seats</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Visual Lead Pipelines & Kanban</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Manager Hub & Auto Lead Allocation</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 2,000 Voice AI Minutes with RAG</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Rejection Audit & Supervisor QA</li>
              </ul>
            </div>
            <Link to="/auth/register" className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs text-center transition-all shadow-lg shadow-indigo-500/25">
              Start Free 14-Day Trial
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="font-bold text-white text-xl">Enterprise Network</h3>
              <p className="text-xs text-slate-400 mt-1">For hospital networks & pharmacy chains</p>
              <div className="text-3xl font-extrabold text-white mt-4">Custom</div>
              <ul className="space-y-3 mt-6 text-xs text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlimited seats & custom roles</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Dedicated sub-50ms RAG cluster</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> FHIR/HL7 EHR & Pharmacy Sync</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> HIPAA BAA & 99.99% SLA guarantee</li>
              </ul>
            </div>
            <Link to="/auth/login" className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs text-center transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-950/80 via-purple-950/70 to-slate-950 border border-indigo-500/30 p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
              Upgrade Your Customer Relationships & Voice Operations
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Launch Whitespace CRM today. Experience unified omnichannel engagement, visual deal pipelines, manager oversight, and autonomous Voice AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/agent/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-bold text-base shadow-xl transition-all"
              >
                Go to Agent CRM
              </Link>
              <Link
                to="/manager/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/40 text-white font-semibold text-base transition-colors"
              >
                Go to Manager Hub
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Comprehensive CRM Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12 text-xs">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-6 h-6 text-indigo-400" />
              <span className="font-bold text-white text-lg">Whitespace CRM</span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              The next-generation Customer Relationship Management platform. Unifying WhatsApp, SMS, email, team operations, and autonomous voice intelligence in one seamless system.
            </p>
            <div className="text-[11px] text-slate-500">
              HIPAA Compliant • Deepgram STS • Twilio Telephony • MongoDB Grounded
            </div>
          </div>

          {/* Col 1: CRM Core */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">CRM Modules</h5>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/agent/my-contacts" className="hover:text-white transition-colors">360° Contacts</Link></li>
              <li><Link to="/agent/leads" className="hover:text-white transition-colors">Lead Pipeline</Link></li>
              <li><Link to="/agent/whatsapp-inbox" className="hover:text-white transition-colors">WhatsApp Inbox</Link></li>
              <li><Link to="/agent/task-management" className="hover:text-white transition-colors">Task Management</Link></li>
              <li><Link to="/agent/campaigns" className="hover:text-white transition-colors">Campaigns</Link></li>
            </ul>
          </div>

          {/* Col 2: Voice & Intelligence */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Voice & AI</h5>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/agent/aicallmanager" className="hover:text-white transition-colors">AI Call Manager</Link></li>
              <li><a href="#voice-telephony" className="hover:text-white transition-colors">Sub-50ms RAG</a></li>
              <li><a href="#voice-telephony" className="hover:text-white transition-colors">Deepgram STS</a></li>
              <li><a href="#voice-telephony" className="hover:text-white transition-colors">Twilio Audio Stream</a></li>
              <li><Link to="/agent/pending-followups" className="hover:text-white transition-colors">Pending Follow-ups</Link></li>
            </ul>
          </div>

          {/* Col 3: Management & Portals */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Team & Portals</h5>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/manager/dashboard" className="hover:text-white transition-colors">Manager Overview</Link></li>
              <li><Link to="/manager/team" className="hover:text-white transition-colors">Team Members</Link></li>
              <li><Link to="/manager/assign" className="hover:text-white transition-colors">Lead Assignment</Link></li>
              <li><Link to="/manager/review-rejection" className="hover:text-white transition-colors">Rejection Audit</Link></li>
              <li><Link to="/auth/login" className="hover:text-white transition-colors">User Sign In</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Whitespace CRM Platform. All rights reserved.
          </div>
          <div className="flex gap-6 text-slate-400">
            <Link to="/agent/dashboard" className="hover:text-white transition-colors">Agent Portal</Link>
            <Link to="/manager/dashboard" className="hover:text-white transition-colors">Manager Portal</Link>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <Link to="/auth/login" className="hover:text-white transition-colors">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}