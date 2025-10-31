// StartCampaign.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tag, Mail, Phone, Save, Play, X } from "lucide-react";
import { toast } from "sonner";
import { getTaskById, createNewCampaign } from "@/store/campaign";

function StartCampaign({ onClose }) {
  const dispatch = useDispatch();
  const { taskData, isLoading } = useSelector((state) => state.campaigns);

  const [showCategories, setShowCategories] = useState(false);
  const [dataImported, setDataImported] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [activeTab, setActiveTab] = useState("message"); // "message" | "call"
  const [campaignName, setCampaignName] = useState("");
  const [messageDetails, setMessageDetails] = useState("");
  const [callDetails, setCallDetails] = useState("");
  const [messageChannels, setMessageChannels] = useState({ email: false, sms: false, whatsapp: false });
  const [selectedCategory, setSelectedCategory] = useState("");

  const availableCategories = taskData?.categories || [];

  const handleGoClick = async () => {
    if (!taskId.trim()) {
      toast.error("Please enter a valid Task ID");
      return;
    }
    try {
      await dispatch(getTaskById({ taskId: taskId.trim() })).unwrap();
      setShowCategories(true);
      toast.success("Task found successfully!");
    } catch (err) {
      const msg = err?.message || err?.error || "Task not found";
      toast.error(msg);
      setShowCategories(false);
    }
  };

  const handleFilterChange = (value) => {
    setSelectedCategory(value);
    setDataImported(true);
  };

  const handleTabChange = (value) => setActiveTab(value);

  const handleChannelChange = (channel) => {
    setMessageChannels((prev) => ({ ...prev, [channel]: !prev[channel] }));
  };

  const handleSaveAsDraft = () => {
    if (!campaignName.trim()) {
      toast.error("Please enter a campaign name");
      return;
    }
    const draftData = {
      campaignName,
      taskId,
      type: activeTab,
      messageDetails: activeTab === "message" ? messageDetails : null,
      callDetails: activeTab === "call" ? callDetails : null,
      messageChannels: activeTab === "message" ? messageChannels : null,
      category: selectedCategory,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    console.log("Saving draft:", draftData);
    toast.success(`Campaign "${campaignName}" saved as draft!`);
    onClose?.();
  };

const handleStartCampaign = async () => {
  if (!campaignName.trim()) {
    toast.error("Please enter a campaign name");
    return;
  }
  if (!selectedCategory) {
    toast.error("Please select a category");
    return;
  }
  if (!["message", "call"].includes(activeTab)) {
    toast.error("Invalid campaign type");
    return;
  }

  const val = taskId.trim();
  const isHex24 = /^[0-9a-fA-F]{24}$/.test(val); // ObjectId-like

  const base = {
    campaignName,
    type: activeTab,              // "call" | "message"
    category: selectedCategory,
    status: "running",
    startedAt: new Date().toISOString(),
    ...(isHex24 ? { taskId: val } : { taskCode: val }),
  };

  const payload =
    activeTab === "message"
      ? {
          ...base,
          messageConfig: {
            channels: {
              email: !!messageChannels.email,
              sms: !!messageChannels.sms,
              whatsapp: !!messageChannels.whatsapp,
            },
            template: messageDetails || "",
          },
        }
      : base;

  try {
    await dispatch(createNewCampaign(payload)).unwrap();
    toast.success(`Campaign "${campaignName}" started successfully!`);
    onClose?.();
  } catch (err) {
    const msg = err?.message || err?.error || "Error while creating campaign";
    toast.error(msg);
  }
};



  return (
    <div className="space-y-6">
      <Card className="border-2 border-purple-200 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#043927] flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Campaign Name
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="e.g., Frontend Hiring 2025"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            className="border-2 border-purple-300 focus:border-purple-500 text-base"
          />
        </CardContent>
      </Card>

      <Card className="border-2 border-gray-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardTitle className="text-lg font-bold text-[#043927]">Select Task</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Enter Task ID</label>
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="e.g., TSK001 or MongoID"
                  value={taskId}
                  onChange={(e) => setTaskId(e.target.value)}
                  className="flex-1 border-2 border-gray-300 focus:border-[#043927]"
                />
                <Button onClick={handleGoClick} disabled={isLoading} className="bg-gradient-to-r from-[#043927] to-emerald-600 text-white font-bold px-6">
                  {isLoading ? "Loading..." : "Go"}
                </Button>
              </div>
            </div>

            {showCategories && taskData && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-800">
                  ✓ Task found — {taskData.totalRows} users imported.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {showCategories && (taskData?.categories?.length ?? 0) > 0 && (
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-gray-100 to-gray-50">
            <TabsTrigger value="message" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-bold">
              <Mail className="w-4 h-4 mr-2" />
              Message
            </TabsTrigger>
            <TabsTrigger value="call" className="data-[state=active]:bg-green-600 data-[state=active]:text-white font-bold">
              <Phone className="w-4 h-4 mr-2" />
              Call
            </TabsTrigger>
          </TabsList>

          {/* Message tab: category + channels */}
          <TabsContent value="message" className="space-y-6 mt-6">
            <Card className="border-2 border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="text-lg font-bold text-[#043927]">Filter by Category</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Select value={selectedCategory} onValueChange={handleFilterChange}>
                  <SelectTrigger className="border-2 border-gray-300">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((cat, idx) => (
                      <SelectItem key={idx} value={cat.category}>
                        {cat.category} ({cat.totalUsers} users)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {dataImported && selectedCategory && (
                  <div className="mt-4 bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <p className="text-sm font-bold text-green-800">✓ {selectedCategory} category loaded successfully!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="text-lg font-bold text-[#043927]">Select Channels</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {["email", "sms", "whatsapp"].map((ch) => (
                  <div key={ch} className="flex items-center space-x-3">
                    <Checkbox id={ch} checked={messageChannels[ch]} onCheckedChange={() => handleChannelChange(ch)} />
                    <label htmlFor={ch} className="text-sm font-medium capitalize cursor-pointer">{ch}</label>
                  </div>
                ))}
              </CardContent>
            </Card>

            {dataImported && selectedCategory && (
              <Card className="border-2 border-gray-200 shadow-lg">
                <CardHeader><CardTitle>Message Template</CardTitle></CardHeader>
                <CardContent>
                  <textarea
                    placeholder="Enter message content..."
                    value={messageDetails}
                    onChange={(e) => setMessageDetails(e.target.value)}
                    className="w-full min-h-[120px] p-4 border-2 border-gray-300 rounded-lg resize-none"
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Call tab: only category */}
          <TabsContent value="call" className="space-y-6 mt-6">
            <Card className="border-2 border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="text-lg font-bold text-[#043927]">Filter by Category</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Select value={selectedCategory} onValueChange={handleFilterChange}>
                  <SelectTrigger className="border-2 border-gray-300">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((cat, idx) => (
                      <SelectItem key={idx} value={cat.category}>
                        {cat.category} ({cat.totalUsers} users)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {dataImported && selectedCategory && (
              <Card className="border-2 border-gray-200 shadow-lg">
                <CardHeader><CardTitle>Call Script</CardTitle></CardHeader>
                <CardContent>
                  <textarea
                    placeholder="Enter call script..."
                    value={callDetails}
                    onChange={(e) => setCallDetails(e.target.value)}
                    className="w-full min-h-[120px] p-4 border-2 border-gray-300 rounded-lg resize-none"
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {dataImported && selectedCategory && (
        <div className="flex flex-col sm:flex-row gap-3 pt-4 sticky bottom-0 bg-white pb-4 border-t-2 border-gray-200">
          <Button onClick={onClose} variant="outline" className="border-gray-400 text-gray-700">
            <X className="w-4 h-4 mr-2" /> Cancel
          </Button>
          <Button onClick={handleSaveAsDraft} variant="outline" className="border-amber-500 text-amber-700 hover:bg-amber-50 font-bold">
            <Save className="w-4 h-4 mr-2" /> Save as Draft
          </Button>
          <Button onClick={handleStartCampaign} className="bg-gradient-to-r from-[#043927] to-emerald-600 hover:from-[#032d1f] hover:to-emerald-700 text-white font-bold">
            <Play className="w-4 h-4 mr-2" /> Start Campaign
          </Button>
        </div>
      )}
    </div>
  );
}

export default StartCampaign;
