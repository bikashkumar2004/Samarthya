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
      <h3 className="text-lg font-semibold mb-4 text-neutral-900">Select Channel</h3>
      <Tabs value={selectedChannel} onValueChange={handleChannelChange} className="w-full">
  <TabsList className="grid w-full grid-cols-3 bg-white border border-neutral-200">
    <TabsTrigger value="sms" className="data-[state=active]:bg-black data-[state=active]:text-white text-neutral-700 hover:text-neutral-900">SMS</TabsTrigger>
    <TabsTrigger value="email" className="data-[state=active]:bg-black data-[state=active]:text-white text-neutral-700 hover:text-neutral-900">Email</TabsTrigger>
    <TabsTrigger value="whatsapp" className="data-[state=active]:bg-black data-[state=active]:text-white text-neutral-700 hover:text-neutral-900">WhatsApp</TabsTrigger>
  </TabsList>
</Tabs>


    </div>
  );
}
