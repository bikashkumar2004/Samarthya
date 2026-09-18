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
      <Card className="flex-1 flex flex-col items-center justify-center p-8">
        <MessageCircle className="w-16 h-16 text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-600 mb-2">
          Welcome to WhatsApp Inbox
        </h3>
        <p className="text-slate-500 text-center">
          Select a conversation from the left to start messaging
        </p>
      </Card>
    );
  }

  return (
    <Card className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <CardHeader className="pb-3 border-b flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base">
                {formatPhoneNumber(selectedConversation)}
              </CardTitle>
              <p className="text-xs text-slate-500">
                {messages.length} message{messages.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onCloseConversation}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 p-4">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-slate-500">
                Loading messages...
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-slate-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <div className="text-sm">No messages yet</div>
                <div className="text-xs mt-1">
                  Start the conversation by sending a message
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
                    className={`max-w-xs rounded-lg px-4 py-2 ${
                      msg.direction === "outbound"
                        ? "bg-green-600 text-white"
                        : "bg-slate-200 text-slate-900"
                    }`}
                  >
                    <p className="text-sm">{msg.body || "(No content)"}</p>
                    {msg.mediaUrl && (
                      <a
                        href={msg.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline mt-1 block"
                      >
                        View Media
                      </a>
                    )}
                    <div
                      className={`text-xs mt-1 flex items-center gap-1 ${
                        msg.direction === "outbound"
                          ? "text-green-100"
                          : "text-slate-500"
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
        <div className="border-t p-3 flex-shrink-0">
          {error && (
            <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded mb-2 flex gap-2">
              <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyPress={onKeyPress}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button
              onClick={onSendReply}
              disabled={isLoading || !replyText.trim()}
              className="bg-green-600 hover:bg-green-700 text-white font-bold"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
