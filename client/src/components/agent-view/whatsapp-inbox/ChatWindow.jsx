import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  Send,
  User,
  AlertCircle,
  CheckCheck,
  X,
} from "lucide-react";

export default function ChatWindow({
  selectedConversation,
  messages = [],
  onCloseConversation,
  isLoadingMessages,
  replyText,
  setReplyText,
  onSendReply,
  onKeyPress,
  isLoading,
  error,
  formatPhoneNumber,
  formatTime,
  messagesEndRef,
}) {
  if (!selectedConversation) {
    return (
      <Card className="flex-1 flex flex-col items-center justify-center p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-center">
        <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
          <MessageCircle className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
          WhatsApp Messenger
        </h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Select a conversation from the left to view transcripts, customer interaction history, and dispatch instant replies
        </p>
      </Card>
    );
  }

  return (
    <Card className="flex-1 flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      {/* Header */}
      <CardHeader className="py-3 px-5 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {formatPhoneNumber(selectedConversation)}
              </CardTitle>
              <p className="text-[11px] text-slate-400">
                {messages.length} message{messages.length !== 1 ? "s" : ""} recorded
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onCloseConversation}
            className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 p-0 overflow-hidden flex flex-col bg-slate-50/50 dark:bg-slate-950/30">
        <ScrollArea className="flex-1 p-4">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center h-full py-12">
              <div className="text-center text-xs text-slate-400">
                Loading messages...
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full py-12">
              <div className="text-center text-slate-400">
                <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <div className="text-sm font-medium text-slate-600 dark:text-slate-300">No messages yet</div>
                <div className="text-xs text-slate-400 mt-1">
                  Start the conversation by sending a message below
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.direction === "outbound"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-sm rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                      msg.direction === "outbound"
                        ? "bg-indigo-600 text-white rounded-br-sm"
                        : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-sm"
                    }`}
                  >
                    <p className="leading-relaxed">{msg.body || "(No content)"}</p>
                    {msg.mediaUrl && (
                      <a
                        href={msg.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] underline mt-1.5 block opacity-90 hover:opacity-100"
                      >
                        View Attached Media
                      </a>
                    )}
                    <div
                      className={`text-[10px] mt-1.5 flex items-center justify-end gap-1 ${
                        msg.direction === "outbound"
                          ? "text-indigo-200"
                          : "text-slate-400"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                      {msg.direction === "outbound" && (
                        <CheckCheck className="w-3 h-3" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-slate-200/80 dark:border-slate-800 p-3 bg-white dark:bg-slate-900 flex-shrink-0">
          {error && (
            <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl mb-2 flex gap-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyPress={onKeyPress}
              placeholder="Type a WhatsApp message..."
              className="flex-1 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-indigo-600 text-xs"
            />
            <Button
              onClick={onSendReply}
              disabled={isLoading || !replyText.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl px-4 shadow-sm shadow-indigo-200"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
