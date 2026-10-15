import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MessageSquare, Clock, MessageSquarePlus, CheckCircle2 } from "lucide-react";
import ComposeMessage from "@/components/agent-view/ComposeMessage/ComposeMessage";

export default function ComposeMsg() {
  const [sentMessages, setSentMessages] = useState([]);

  const handleMessageSent = (messageData) => {
    setSentMessages((prev) => [messageData, ...prev]);
  };

  const handlewpMessageSent = (messageData) => {
    setSentMessages((prev) => [messageData, ...prev]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <span>Compose Message</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Dispatch single or multi-channel SMS, WhatsApp, and Email messages to patients
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Card - Compose Message Form */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <ComposeMessage
            onMessageSent={handleMessageSent}
            onwpMessageSent={handlewpMessageSent}
          />
        </div>

        {/* Right Card - Sent Messages History */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Recent Dispatches</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {sentMessages.length} sent
            </span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {sentMessages.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No messages dispatched yet</p>
                <p className="text-xs text-slate-400 mt-1">Sent SMS, Email, and WhatsApp updates will appear here live.</p>
              </div>
            ) : (
              sentMessages.map((msg, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
                        {msg.name ? msg.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{msg.name}</span>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                      <CheckCircle2 className="w-3 h-3" />
                      {msg.status || "Delivered"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <div>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">Phone: </span>
                      <span className="font-mono">{msg.number || "—"}</span>
                    </div>
                    {msg.email && (
                      <div className="truncate">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">Email: </span>
                        <span>{msg.email}</span>
                      </div>
                    )}
                  </div>

                  {msg.message && (
                    <div className="text-xs bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      {msg.message}
                    </div>
                  )}

                  <div className="flex items-center justify-end text-[11px] text-slate-400">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{msg.timestamp || "Just now"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
