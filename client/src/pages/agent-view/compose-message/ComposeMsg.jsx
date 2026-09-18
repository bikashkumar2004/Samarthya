import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MessageSquare, Clock } from "lucide-react";
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
    <div className="h-screen p-6">
      <div className="grid grid-cols-2 gap-6 h-full">
        {/* Left Card - Compose Message with Scrollbar */}
        <Card className="h-full overflow-hidden">
          <CardContent className="p-6 h-full overflow-y-auto">
            <ComposeMessage
              onMessageSent={handleMessageSent}
              onwpMessageSent={handlewpMessageSent}
            />
          </CardContent>
        </Card>

        {/* Right Card - Sent Messages History */}
        <Card className="h-full overflow-hidden">
          <CardHeader>
            <CardTitle>Sent Messages</CardTitle>
          </CardHeader>
          <CardContent className="p-6 h-full overflow-y-auto space-y-4">
            {sentMessages.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No messages sent yet. Send a message to see it here.
              </p>
            ) : (
              sentMessages.map((msg, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Name</p>
                        <p className="text-sm font-medium">{msg.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Number</p>
                        <p className="text-sm font-medium">{msg.number}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-medium">{msg.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground mt-1" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Purpose</p>
                        <p className="text-sm font-medium">{msg.purpose}</p>
                      </div>
                    </div>

                    <div className="border-t pt-3 mt-3">
                      <p className="text-xs text-muted-foreground mb-1">Message</p>
                      <p className="text-sm line-clamp-3">{msg.message}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {msg.status}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
