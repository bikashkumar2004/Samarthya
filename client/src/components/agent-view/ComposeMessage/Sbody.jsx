import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Send, Sparkles, Clock, CheckCheck, Phone, Mail } from "lucide-react";
import { generateMessage } from "./gemini";

export default function Sbody({ selectedChannel, onMessageSent }) {
  const [recipientData, setRecipientData] = useState("");
  const [showVerifiedSection, setShowVerifiedSection] = useState(false);
  const [verifiedData, setVerifiedData] = useState(null);
  const [showGeneratedMessage, setShowGeneratedMessage] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("english");

  // Get label and placeholder based on channel
  const getChannelConfig = (channel) => {
    switch (channel) {
      case "sms":
        return {
          label: "Phone Number",
          placeholder: "+1 234-567-8900",
          icon: Phone,
          validate: (val) => /^[\d\s\-\+()]+$/.test(val) && val.length >= 10,
          errorMsg: "Please enter a valid phone number"
        };
      case "email":
        return {
          label: "Email Address",
          placeholder: "john@example.com",
          icon: Mail,
          validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
          errorMsg: "Please enter a valid email address"
        };
      case "whatsapp":  // ✅ Add this case
        return {
          label: "WhatsApp Number",
          placeholder: "+1 234-567-8900",
          icon: Phone,
          validate: (val) => /^[\d\s\-\+()]+$/.test(val) && val.length >= 10,
          errorMsg: "Please enter a valid WhatsApp number"
        };
      default:
        return {
          label: "Recipient",
          placeholder: "Enter recipient",
          validate: (val) => val.length > 0,
          errorMsg: "Please enter a valid recipient"
        };
    }
  };

  const config = getChannelConfig(selectedChannel);

  const handleVerify = () => {
    if (!recipientData.trim()) {
      alert(config.errorMsg);
      return;
    }

    if (!config.validate(recipientData)) {
      alert(config.errorMsg);
      return;
    }

    let newVerifiedData = {
      channel: selectedChannel,
      purpose: "Customer Support Inquiry"
    };

    if (selectedChannel === "sms") {
      newVerifiedData = {
        ...newVerifiedData,
        number: recipientData,
        name: "Customer",
        description: `This recipient has been verified for SMS delivery. The contact information has been validated and confirmed active in the system.`
      };
    } else if (selectedChannel === "email") {
      newVerifiedData = {
        ...newVerifiedData,
        email: recipientData,
        name: "Customer",
        description: `This recipient has been verified for EMAIL delivery. The email address has been validated and confirmed active in the system.`
      };
    } else if (selectedChannel === "whatsapp") {
      newVerifiedData = {
        ...newVerifiedData,
        number: recipientData,
        name: "Customer",
        description: `This recipient has been verified for WHATSAPP delivery. The whatsapp address has been validated and confirmed active in the system.`
      };
    } 

    setVerifiedData(newVerifiedData);
    setShowVerifiedSection(true);
  };

  const handleGenerate = async () => {
    if (!verifiedData) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const aiMessage = await generateMessage(
        verifiedData.purpose,
        verifiedData.name,
        selectedLanguage,
        selectedChannel
      );
      setGeneratedMessage(aiMessage);
      setShowGeneratedMessage(true);
    } catch (error) {
      console.error("Failed to generate message:", error);
      setGeneratedMessage("Failed to generate message. Please try again.");
      setShowGeneratedMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    try {
      setIsLoading(true);
      
      let endpoint = '';
      let payload = {
        message: generatedMessage,
        name: verifiedData.name,
        purpose: verifiedData.purpose,
        channel: selectedChannel,
        language: selectedLanguage
      };

      if (selectedChannel === "sms") {
        endpoint = '/api/sms/send';
        payload.to_number = verifiedData.number;
      } else if (selectedChannel === "email") {
        endpoint = '/api/email/send';
        payload.to_email = verifiedData.email;
      } else if(selectedChannel === "whatsapp") {
        payload = {
          to:verifiedData.number,
          body: generatedMessage,
        };
        endpoint = '/api/send-whatsapp';
      }
      
      console.log(`📱 Sending ${selectedChannel.toUpperCase()} (${selectedLanguage})`, payload);
      
      const response = await fetch(`http://localhost:4000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      
      console.log("Backend response:", result);
      
      if (result.success) {
        console.log(`✅ ${selectedChannel.toUpperCase()} sent successfully!`);
        
        setMessageStatus({
          status: "Sent",
          timestamp: new Date().toLocaleString(),
          deliveryStatus: "Delivered",
          messageSid: result.message_sid
        });
        
        if (onMessageSent && verifiedData) {
          onMessageSent({
            name: verifiedData.name,
            number: verifiedData.number || "N/A",
            email: verifiedData.email || "N/A",
            purpose: verifiedData.purpose,
            message: generatedMessage,
            language: selectedLanguage,
            status: "Sent",
            timestamp: new Date().toLocaleString(),
            messageSid: result.message_sid,
            channel: selectedChannel
          });
        }
      } else {
        console.error(`❌ Error sending ${selectedChannel.toUpperCase()}:`, result.error);
        setMessageStatus({
          status: "Failed",
          timestamp: new Date().toLocaleString(),
          deliveryStatus: "Error: " + result.error
        });
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setMessageStatus({
        status: "Failed",
        timestamp: new Date().toLocaleString(),
        deliveryStatus: "Error: " + error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Recipient */}
      <Card>
        <CardHeader>
          <CardTitle>Search Recipient for {selectedChannel.toUpperCase()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input 
              placeholder={config.placeholder}
              value={recipientData}
              onChange={(e) => setRecipientData(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleVerify}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Verify
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Verified Recipient */}
      {showVerifiedSection && verifiedData && (
        <Card className="border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Verified Recipient
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Channel</p>
                <p className="text-base font-semibold">{selectedChannel.toUpperCase()}</p>
              </div>
              {verifiedData.number && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Number</p>
                  <p className="text-base font-semibold">{verifiedData.number}</p>
                </div>
              )}
              {verifiedData.email && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base font-semibold">{verifiedData.email}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Purpose</p>
                <p className="text-base font-semibold">{verifiedData.purpose}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="text-sm text-gray-600 mt-1">{verifiedData.description}</p>
            </div>

            {/* Language Selection with Generate Button */}
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground">Select Language</label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                    <SelectItem value="odia">ଓଡ଼ିଆ (Odia)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleGenerate} disabled={isLoading}>
                <Sparkles className="mr-2 h-4 w-4" />
                {isLoading ? "Generating..." : "Generate"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Message */}
      {showGeneratedMessage && (
        <Card>
          <CardHeader>
            <CardTitle>Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              value={generatedMessage}
              onChange={(e) => setGeneratedMessage(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <Button onClick={handleSend} className="w-full" disabled={isLoading}>
              <Send className="mr-2 h-4 w-4" />
              {isLoading ? "Sending..." : `Send ${selectedChannel.toUpperCase()}`}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Message Status */}
      {messageStatus && (
        <Card className="border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-600">
              <CheckCheck className="mr-2 h-5 w-5" />
              Message Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="text-base font-semibold" style={{ color: messageStatus.status === "Sent" ? "#16a34a" : "#dc2626" }}>
                  {messageStatus.status}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  <Clock className="inline mr-1 h-4 w-4" />
                  Timestamp
                </p>
                <p className="text-base">{messageStatus.timestamp}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delivery</p>
                <p className="text-base font-semibold" style={{ color: messageStatus.status === "Sent" ? "#16a34a" : "#dc2626" }}>
                  {messageStatus.deliveryStatus}
                </p>
              </div>
            </div>
            {messageStatus.messageSid && (
              <div className="mt-4 p-2 bg-gray-100 rounded">
                <p className="text-xs text-gray-600">Message ID: {messageStatus.messageSid}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
