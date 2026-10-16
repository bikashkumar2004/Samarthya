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
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <TabsTrigger value="sms" className="rounded-lg py-2 text-xs font-semibold data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-600 dark:text-slate-300 data-[state=active]:shadow-xs transition">SMS</TabsTrigger>
          <TabsTrigger value="email" className="rounded-lg py-2 text-xs font-semibold data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-600 dark:text-slate-300 data-[state=active]:shadow-xs transition">Email</TabsTrigger>
          <TabsTrigger value="whatsapp" className="rounded-lg py-2 text-xs font-semibold data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-600 dark:text-slate-300 data-[state=active]:shadow-xs transition">WhatsApp</TabsTrigger>
        </TabsList>
      </Tabs>


    </div>
  );
}
