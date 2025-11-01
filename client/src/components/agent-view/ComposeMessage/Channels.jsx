import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Channels({ onChannelSelect }) {
  const [selectedChannel, setSelectedChannel] = useState("sms");

  const handleChannelChange = (channel) => {
    setSelectedChannel(channel);
    if (onChannelSelect) {
      onChannelSelect(channel);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Select Channel</h3>
      <Tabs value={selectedChannel} onValueChange={handleChannelChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
