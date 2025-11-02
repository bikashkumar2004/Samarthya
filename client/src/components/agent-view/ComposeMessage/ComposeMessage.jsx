import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Single from "./Single";


export default function ComposeMessage({ onMessageSent, onwpMessageSent }) {
  const [channels, setChannels] = useState({
    sms: false,
    email: false,
    whatsapp: false
  });

  const handleChannelChange = (channel) => {
    setChannels(prev => ({
      ...prev,
      [channel]: !prev[channel]
    }));
  };

  return (
    <div className="w-full">
        {/* Header Section with Title and Tabs */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Compose message</h1>
          
        </div>
          <Single 
            channels={channels} 
            onChannelChange={handleChannelChange}
            onMessageSent={onMessageSent}
            onwpMessageSent={onwpMessageSent}
          />
    </div>
  );
}
