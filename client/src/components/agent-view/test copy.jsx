// WhatsAppInbox.jsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, RefreshCw, User, AlertCircle } from "lucide-react";

export default function WhatsAppInbox() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState(null);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchConversations();
        if (selectedConversation) {
          loadConversationMessages(selectedConversation);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, selectedConversation]);

  const fetchConversations = async () => {
    try {
      setIsFetching(true);
      setError(null);
      
      const response = await fetch('http://localhost:4000/api/whatsapp/conversations');
      const data = await response.json();
      
      if (data.success) {
        // ✅ Ensure conversations is always an array
        setConversations(Array.isArray(data.conversations) ? data.conversations : []);
      } else {
        setError(data.error || 'Failed to fetch conversations');
        setConversations([]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Failed to connect to server');
      setConversations([]);
    } finally {
      setIsFetching(false);
    }
  };

  const loadConversationMessages = async (phoneNumber) => {
    try {
      setError(null);
      
      // Extract clean phone number
      const cleanNumber = phoneNumber.replace('whatsapp:', '');
      
      const response = await fetch(
        `http://localhost:4000/api/whatsapp/conversations/${cleanNumber}`
      );
      const data = await response.json();
      
      if (data.success) {
        setSelectedConversation(phoneNumber);
        // ✅ Ensure messages is always an array and sort by timestamp
        const sortedMessages = Array.isArray(data.messages) 
          ? data.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          : [];
        setMessages(sortedMessages);
      } else {
        setError(data.error || 'Failed to load messages');
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Failed to load conversation');
      setMessages([]);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedConversation) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:4000/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedConversation,
          body: replyText
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setReplyText("");
        // Refresh messages to show the sent message
        await loadConversationMessages(selectedConversation);
        await fetchConversations();
      } else {
        setError(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      setError('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen gap-4 p-4">
      {/* Conversations List */}
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              WhatsApp Inbox
            </span>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded"
                />
                Auto
              </label>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={fetchConversations}
                disabled={isFetching}
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-120px)]">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-b border-red-200">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}
            
            {/* Loading State */}
            {isFetching && conversations.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                Loading conversations...
              </div>
            )}
            
            {/* Empty State */}
            {!isFetching && conversations.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs mt-1">Send a WhatsApp message to start</p>
              </div>
            )}
            
            {/* Conversations List */}
            {conversations.length > 0 && conversations.map((conv) => {
              // ✅ Safety check for undefined conversation
              if (!conv || !conv.phoneNumber) return null;
              
              return (
                <div
                  key={conv.phoneNumber || conv.conversationId}
                  onClick={() => loadConversationMessages(conv.phoneNumber)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation === conv.phoneNumber ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500 rounded-full p-2 flex-shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {conv.phoneNumber?.replace('whatsapp:', '') || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {conv.lastMessageText || 'No messages'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {conv.lastMessage 
                          ? new Date(conv.lastMessage).toLocaleString()
                          : 'No timestamp'
                        }
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 flex-shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Window */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b">
          <CardTitle>
            {selectedConversation ? (
              <div className="flex items-center gap-2">
                <div className="bg-green-500 rounded-full p-2">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-base">
                    {selectedConversation.replace('whatsapp:', '')}
                  </p>
                  <p className="text-xs font-normal text-muted-foreground">
                    {messages.length} message{messages.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="h-5 w-5" />
                Select a conversation
              </div>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0 flex flex-col flex-1 min-h-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {!selectedConversation ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p className="text-sm">Select a conversation to view messages</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p className="text-sm">No messages in this conversation</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) => {
                  // ✅ Safety check for undefined message
                  if (!msg) return null;
                  
                  return (
                    <div
                      key={msg._id || msg.messageSid || idx}
                      className={`flex ${
                        msg.direction === 'outbound' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          msg.direction === 'outbound'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {msg.body || '(No content)'}
                        </p>
                        {msg.mediaUrl && (
                          <div className="mt-2">
                            <a 
                              href={msg.mediaUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs underline"
                            >
                              View media
                            </a>
                          </div>
                        )}
                        <p className={`text-xs mt-1 ${
                          msg.direction === 'outbound' 
                            ? 'text-blue-100' 
                            : 'text-gray-500'
                        }`}>
                          {msg.timestamp 
                            ? new Date(msg.timestamp).toLocaleTimeString()
                            : 'Unknown time'
                          }
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Reply Input */}
          {selectedConversation && (
            <div className="border-t p-4 bg-white">
              {error && (
                <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                  {error}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendReply();
                    }
                  }}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendReply} 
                  disabled={isLoading || !replyText.trim()}
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
