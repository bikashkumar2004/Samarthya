import { useState } from "react";
import Channels from "./Channels";
import Sbody from "./Sbody";
import { Separator } from "@/components/ui/separator";

export default function Single({ onMessageSent }) {
  const [selectedChannel, setSelectedChannel] = useState("sms");

  return (
    <div className="space-y-6">
      <Channels onChannelSelect={setSelectedChannel} />
      <Separator />
      <Sbody selectedChannel={selectedChannel} onMessageSent={onMessageSent} />
    </div>
  );
}
