import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  Send, 
  RefreshCw, 
  User, 
  AlertCircle,
  CheckCheck,
  Clock
} from "lucide-react";

export default function WhatsAppInbox() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const API_BASE_URL = 'http://localhost:4000';

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversations on mount
  useEffect(() => {
    console.log('🚀 Component mounted, fetching conversations...');
    fetchConversations();
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchConversations();
        if (selectedConversation) {
          loadConversationMessages(selectedConversation, true);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, selectedConversation]);

  const fetchConversations = async () => {
    try {
      setIsFetching(true);
      setError(null);
      
      console.log('📡 Fetching conversations from:', `${API_BASE_URL}/api/whatsapp/conversations`);
      
      const response = await fetch(`${API_BASE_URL}/api/whatsapp/conversations`);
      const data = await response.json();
      
      console.log('📥 Conversations response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch conversations');
      }
      
      if (data.success) {
        const convArray = Array.isArray(data.conversations) ? data.conversations : [];
        console.log('✅ Conversations loaded:', convArray.length);
        setConversations(convArray);
      } else {
        throw new Error(data.error || 'Invalid response format');
      }
    } catch (error) {
      console.error('❌ Error fetching conversations:', error);
      setError(`Failed to load conversations: ${error.message}`);
      setConversations([]);
    } finally {
      setIsFetching(false);
    }
  };

  const loadConversationMessages = async (phoneNumber, silent = false) => {
    try {
      if (!silent) {
        setIsLoadingMessages(true);
      }
      setError(null);
      
      // Extract clean phone number (remove whatsapp: prefix if present)
      const cleanNumber = phoneNumber.replace('whatsapp:', '');
      
      console.log('📨 Loading messages for:', cleanNumber);
      
      const response = await fetch(
        `${API_BASE_URL}/api/whatsapp/conversations/${encodeURIComponent(cleanNumber)}`
      );
      const data = await response.json();
      
      console.log('📥 Messages response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load messages');
      }
      
      if (data.success) {
        // Set selected conversation
        setSelectedConversation(phoneNumber);
        
        // Sort messages by timestamp
        const sortedMessages = Array.isArray(data.messages) 
          ? data.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          : [];
        
        console.log('✅ Messages loaded:', sortedMessages.length);
        setMessages(sortedMessages);
      } else {
        throw new Error(data.error || 'Invalid response format');
      }
    } catch (error) {
      console.error('❌ Error loading messages:', error);
      if (!silent) {
        setError(`Failed to load messages: ${error.message}`);
        setMessages([]);
      }
    } finally {
      if (!silent) {
        setIsLoadingMessages(false);
      }
    }
  };

  const handleConversationClick = (conv) => {
    console.log('🖱️ Conversation clicked:', conv);
    if (conv && (conv.phoneNumber || conv.conversationId)) {
      const phone = conv.phoneNumber || `whatsapp:${conv.conversationId}`;
      loadConversationMessages(phone);
    } else {
      console.error('⚠️ Invalid conversation data:', conv);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedConversation) {
      console.warn('⚠️ Cannot send: empty message or no conversation selected');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('📤 Sending message to:', selectedConversation);
      
      const response = await fetch(`${API_BASE_URL}/api/send-whatsapp`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: selectedConversation,
          body: replyText,
          channel: 'whatsapp'
        })
      });
      
      const result = await response.json();
      
      console.log('📥 Send response:', result);
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }
      
      if (result.success) {
        console.log('✅ Message sent successfully');
        setReplyText("");
        
        // Refresh messages immediately
        await loadConversationMessages(selectedConversation, true);
        await fetchConversations();
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('❌ Error sending reply:', error);
      setError(`Failed to send message: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'Unknown';
    return phone.replace('whatsapp:', '');
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 24) {
      return date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short' 
      });
    }
  };

  return (
    <div className="flex h-screen gap-4 p-4 bg-gray-50">
      {/* Left Sidebar - Conversations List */}
      <Card className="w-96 flex flex-col shadow-lg">
        <CardHeader className="border-b bg-white">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-600" />
              <span>WhatsApp Inbox</span>
            </span>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground flex items-center gap-1 cursor-pointer">
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
                className="h-8 w-8 p-0"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            {/* Global Error */}
            {error && !selectedConversation && (
              <div className="p-3 m-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2 text-red-700">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="text-xs">{error}</span>
                </div>
              </div>
            )}
            
            {/* Loading State */}
            {isFetching && conversations.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3 text-gray-400" />
                <p className="text-sm">Loading conversations...</p>
              </div>
            )}
            
            {/* Empty State */}
            {!isFetching && conversations.length === 0 && !error && (
              <div className="p-8 text-center text-muted-foreground">
                <MessageCircle className="h-16 w-16 mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium">No conversations yet</p>
                <p className="text-xs mt-1 text-gray-400">
                  Send a WhatsApp message to start
                </p>
              </div>
            )}
            
            {/* Conversations List */}
            {conversations.length > 0 && (
              <div className="divide-y">
                {conversations.map((conv) => {
                  if (!conv) return null;
                  
                  const phoneNumber = conv.phoneNumber || `whatsapp:${conv.conversationId}`;
                  const isSelected = selectedConversation === phoneNumber;
                  
                  return (
                    <div
                      key={phoneNumber}
                      onClick={() => handleConversationClick(conv)}
                      className={`p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                        isSelected 
                          ? 'bg-green-50 border-l-4 border-green-500' 
                          : 'border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`rounded-full p-2.5 flex-shrink-0 ${
                          isSelected ? 'bg-green-600' : 'bg-green-500'
                        }`}>
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-sm truncate">
                              {formatPhoneNumber(phoneNumber)}
                            </p>
                            <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                              {formatTime(conv.lastMessage)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 truncate">
                            {conv.lastMessageText || 'No messages'}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-400">
                              {conv.messageCount || 0} message{conv.messageCount !== 1 ? 's' : ''}
                            </span>
                            {conv.unreadCount > 0 && (
                              <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Right Side - Chat Window */}
      <Card className="flex-1 flex flex-col shadow-lg">
        {/* Chat Header */}
        <CardHeader className="border-b bg-white">
          <CardTitle>
            {selectedConversation ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 rounded-full p-2.5">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-base font-semibold">
                      {formatPhoneNumber(selectedConversation)}
                    </p>
                    <p className="text-xs font-normal text-muted-foreground">
                      {messages.length} message{messages.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => loadConversationMessages(selectedConversation)}
                  disabled={isLoadingMessages}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="h-5 w-5" />
                <span>Select a conversation</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        
        {/* Messages Area */}
        <CardContent className="p-0 flex-1 flex flex-col min-h-0 bg-gray-50">
          <ScrollArea className="flex-1 p-4">
            {!selectedConversation ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <MessageCircle className="h-20 w-20 mx-auto mb-4 text-gray-300" />
                  <p className="text-base font-medium">Welcome to WhatsApp Inbox</p>
                  <p className="text-sm mt-2 text-gray-400">
                    Select a conversation from the left to start messaging
                  </p>
                </div>
              </div>
            ) : isLoadingMessages ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3 text-gray-400" />
                  <p className="text-sm text-muted-foreground">Loading messages...</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <MessageCircle className="h-16 w-16 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs mt-1 text-gray-400">
                    Start the conversation by sending a message
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, idx) => {
                  if (!msg) return null;
                  
                  const isOutbound = msg.direction === 'outbound';
                  
                  return (
                    <div
                      key={msg._id || msg.messageSid || idx}
                      className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg px-4 py-2 shadow-sm ${
                          isOutbound
                            ? 'bg-green-500 text-white rounded-br-none'
                            : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                          {msg.body || '(No content)'}
                        </p>
                        {msg.mediaUrl && (
                          <div className="mt-2 pt-2 border-t border-gray-300">
                            <a 
                              href={msg.mediaUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs underline hover:no-underline"
                            >
                              📎 View attachment
                            </a>
                          </div>
                        )}
                        <div className={`flex items-center gap-1 mt-1 ${
                          isOutbound ? 'justify-end' : 'justify-start'
                        }`}>
                          <Clock className={`h-3 w-3 ${
                            isOutbound ? 'text-green-100' : 'text-gray-400'
                          }`} />
                          <span className={`text-xs ${
                            isOutbound ? 'text-green-100' : 'text-gray-500'
                          }`}>
                            {formatTime(msg.timestamp)}
                          </span>
                          {isOutbound && (
                            <CheckCheck className="h-3 w-3 text-green-100 ml-1" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Message Input */}
          {selectedConversation && (
            <div className="border-t bg-white p-4">
              {error && selectedConversation && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2 text-red-700">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="text-xs">{error}</span>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendReply} 
                  disabled={isLoading || !replyText.trim()}
                  className="bg-green-500 hover:bg-green-600 px-6"
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
