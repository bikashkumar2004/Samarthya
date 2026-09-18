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
    <Card className="flex-1 flex flex-col overflow-hidden">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            <CardTitle className="text-lg">WhatsApp Inbox</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              Auto
            </label>
            <Button
              size="sm"
              variant="ghost"
              onClick={onRefresh}
              disabled={isFetching}
            >
              <RefreshCw
                className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm flex gap-2 items-start">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <ScrollArea className="h-full">
          {isFetching && conversations.length === 0 ? (
            <div className="p-4 text-center text-slate-500">
              Loading conversations...
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-slate-500">
              <div className="text-sm">No conversations yet</div>
              <div className="text-xs mt-2">
                Send a WhatsApp message to start
              </div>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {conversations.map((conv, idx) => {
                const isSelected =
                  normalizePhone(selectedConversation) ===
                  normalizePhone(conv.phoneNumber);
                return (
                  <button
                    key={idx}
                    onClick={() => onSelectConversation(conv)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      isSelected
                        ? "bg-green-100 border-l-4 border-green-600"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">
                          {formatPhoneNumber(conv.phoneNumber)}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {conv.lastMessageText || "No messages"}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-slate-400">
                          {formatTime(conv.lastMessage)}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
