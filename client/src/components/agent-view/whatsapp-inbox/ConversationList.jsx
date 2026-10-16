import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, RefreshCw, User, AlertCircle } from "lucide-react";

export default function ConversationList({
  conversations = [],
  selectedConversation,
  onSelectConversation,
  autoRefresh,
  setAutoRefresh,
  onRefresh,
  isFetching,
  error,
  formatPhoneNumber,
  formatTime,
  normalizePhone,
}) {
  return (
    <Card className="flex-1 flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <MessageCircle className="w-4 h-4" />
            </div>
            <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">WhatsApp Inbox</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              Live
            </label>
            <Button
              size="sm"
              variant="ghost"
              onClick={onRefresh}
              disabled={isFetching}
              className="h-8 w-8 p-0 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        {error && (
          <div className="p-3 bg-rose-50 border-b border-rose-200 text-rose-700 text-xs flex gap-2 items-start">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <ScrollArea className="h-full">
          {isFetching && conversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Loading active conversations...
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
              <div className="text-sm font-medium text-slate-600 dark:text-slate-300">No conversations yet</div>
              <div className="text-xs text-slate-400 mt-1">
                Incoming and outbound WhatsApp chats will appear here
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 p-2.5">
              {conversations.map((conv, idx) => {
                const isSelected =
                  normalizePhone(selectedConversation) ===
                  normalizePhone(conv.phoneNumber);
                return (
                  <button
                    key={idx}
                    onClick={() => onSelectConversation(conv)}
                    className={`w-full p-3 rounded-xl text-left transition-all ${
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-950/40 border-l-4 border-indigo-600 shadow-xs"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isSelected 
                          ? "bg-indigo-600 text-white shadow-xs" 
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}>
                        <User className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                          {formatPhoneNumber(conv.phoneNumber)}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {conv.lastMessageText || "No messages"}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] text-slate-400">
                          {formatTime(conv.lastMessage)}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="bg-indigo-600 text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
