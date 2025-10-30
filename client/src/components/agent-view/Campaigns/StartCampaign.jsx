import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tag, Mail, Phone, Save, Play, X } from 'lucide-react';
import { toast } from 'sonner';

function StartCampaign({ onClose }) {
  const [showCategories, setShowCategories] = useState(false);
  const [dataImported, setDataImported] = useState(false);
  const [taskId, setTaskId] = useState('');
  const [activeTab, setActiveTab] = useState('message');
  const [campaignName, setCampaignName] = useState('');
  
  // Separate states for message and call tabs
  const [messageDetails, setMessageDetails] = useState('');
  const [callDetails, setCallDetails] = useState('');
  const [messageChannels, setMessageChannels] = useState({
    email: false,
    sms: false,
    whatsapp: false,
  });
  const [messageCategory, setMessageCategory] = useState('');
  const [callCategory, setCallCategory] = useState('');

  function handleGoClick() {
    if (taskId.trim()) {
      setShowCategories(true);
      setDataImported(false);
    }
  }

  function handleFilterChange(value, tabType) {
    if (tabType === 'message') {
      setMessageCategory(value);
    } else {
      setCallCategory(value);
    }
    setDataImported(true);
  }

  function handleTabChange(value) {
    setActiveTab(value);
  }

  function handleChannelChange(channel) {
    setMessageChannels(prev => ({
      ...prev,
      [channel]: !prev[channel]
    }));
  }

  function handleSaveAsDraft() {
    if (!campaignName.trim()) {
      toast.error('Please enter a campaign name');
      return;
    }

    // Collect campaign data
    const draftData = {
      campaignName,
      taskId,
      type: activeTab,
      messageDetails: activeTab === 'message' ? messageDetails : null,
      callDetails: activeTab === 'call' ? callDetails : null,
      messageChannels: activeTab === 'message' ? messageChannels : null,
      messageCategory: activeTab === 'message' ? messageCategory : null,
      callCategory: activeTab === 'call' ? callCategory : null,
      status: 'draft',
      createdAt: new Date().toISOString()
    };

    console.log('Saving draft:', draftData);
    toast.success(`Campaign "${campaignName}" saved as draft!`);
    onClose();
  }

  function handleStartCampaign() {
    if (!campaignName.trim()) {
      toast.error('Please enter a campaign name');
      return;
    }

    // Collect campaign data
    const campaignData = {
      campaignName,
      taskId,
      type: activeTab,
      messageDetails: activeTab === 'message' ? messageDetails : null,
      callDetails: activeTab === 'call' ? callDetails : null,
      messageChannels: activeTab === 'message' ? messageChannels : null,
      messageCategory: activeTab === 'message' ? messageCategory : null,
      callCategory: activeTab === 'call' ? callCategory : null,
      status: 'active',
      startedAt: new Date().toISOString()
    };

    console.log('Starting campaign:', campaignData);
    toast.success(`Campaign "${campaignName}" started successfully!`);
    onClose();
  }

  return (
    <div className="space-y-6">
      {/* Campaign Name Input */}
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
            placeholder="e.g., Healthcare Awareness 2025"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            className="border-2 border-purple-300 focus:border-purple-500 text-base"
          />
        </CardContent>
      </Card>

      {/* Task ID Input Section */}
      <Card className="border-2 border-gray-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardTitle className="text-lg font-bold text-[#043927]">Select Task</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Enter Task ID
              </label>
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="e.g., TSK-001"
                  value={taskId}
                  onChange={(e) => setTaskId(e.target.value)}
                  className="flex-1 border-2 border-gray-300 focus:border-[#043927]"
                />
                <Button
                  onClick={handleGoClick}
                  className="bg-gradient-to-r from-[#043927] to-emerald-600 hover:from-[#032d1f] hover:to-emerald-700 text-white font-bold px-6"
                >
                  Go
                </Button>
              </div>
            </div>

            {showCategories && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 animate-in slide-in-from-top">
                <p className="text-sm font-semibold text-green-800">
                  ✓ Task found! Ready to configure campaign.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Scheduling Note */}
      {showCategories && (
        <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
          <CardContent className="pt-6">
            <p className="text-sm text-amber-800 font-medium">
              📅 It will be Scheduled after "Healthcare Outreach 2025"
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tabs for Message/Call */}
      {showCategories && (
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-gray-100 to-gray-50">
            <TabsTrigger
              value="message"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white font-bold"
            >
              <Mail className="w-4 h-4 mr-2" />
              Message
            </TabsTrigger>
            <TabsTrigger
              value="call"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-500 data-[state=active]:text-white font-bold"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call
            </TabsTrigger>
          </TabsList>

          <TabsContent value="message" className="space-y-6 mt-6">
            {/* Channels Card */}
            <Card className="border-2 border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="text-lg font-bold text-[#043927]">Select Channels</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {[
                    { id: 'email', label: 'Email', icon: '📧' },
                    { id: 'sms', label: 'SMS', icon: '💬' },
                    { id: 'whatsapp', label: 'WhatsApp', icon: '📱' }
                  ].map((channel) => (
                    <div key={channel.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Checkbox
                        id={channel.id}
                        checked={messageChannels[channel.id]}
                        onCheckedChange={() => handleChannelChange(channel.id)}
                      />
                      <label
                        htmlFor={channel.id}
                        className="text-sm font-medium cursor-pointer flex-1 flex items-center gap-2"
                      >
                        <span>{channel.icon}</span>
                        {channel.label}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Filter and Category */}
            <Card className="border-2 border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="text-lg font-bold text-[#043927]">Filter by Category</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Select value={messageCategory} onValueChange={(value) => handleFilterChange(value, 'message')}>
                  <SelectTrigger className="border-2 border-gray-300">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>

                {dataImported && messageCategory && (
                  <div className="mt-4 space-y-2">
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-bold text-blue-800">Category found: 67</p>
                    </div>
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                      <p className="text-sm font-bold text-green-800">✓ Data imported</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Campaign Details */}
            {dataImported && messageCategory && (
              <Card className="border-2 border-gray-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-lg font-bold text-[#043927]">Message Template</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <textarea
                    placeholder="Enter message template, content, or instructions..."
                    value={messageDetails}
                    onChange={(e) => setMessageDetails(e.target.value)}
                    className="w-full min-h-[120px] p-4 border-2 border-gray-300 rounded-lg focus:border-[#043927] focus:outline-none resize-none"
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="call" className="space-y-6 mt-6">
            <Card className="border-2 border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="text-lg font-bold text-[#043927]">Filter by Category</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Select value={callCategory} onValueChange={(value) => handleFilterChange(value, 'call')}>
                  <SelectTrigger className="border-2 border-gray-300">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>

                {dataImported && callCategory && (
                  <div className="mt-4 space-y-2">
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-bold text-blue-800">Category found: 67</p>
                    </div>
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                      <p className="text-sm font-bold text-green-800">✓ Data imported</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {dataImported && callCategory && (
              <Card className="border-2 border-gray-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-lg font-bold text-[#043927]">Call Script</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <textarea
                    placeholder="Enter call script, talking points, or campaign instructions..."
                    value={callDetails}
                    onChange={(e) => setCallDetails(e.target.value)}
                    className="w-full min-h-[120px] p-4 border-2 border-gray-300 rounded-lg focus:border-[#043927] focus:outline-none resize-none"
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Action Buttons */}
      {dataImported && (messageCategory || callCategory) && (
        <div className="flex flex-col sm:flex-row gap-3 pt-4 sticky bottom-0 bg-white pb-4 border-t-2 border-gray-200">
          <Button
            onClick={onClose}
            variant="outline"
            className="sm:flex-1 border-2 border-gray-400 text-gray-700 hover:bg-gray-100 font-bold"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSaveAsDraft}
            variant="outline"
            className="sm:flex-1 border-2 border-amber-500 text-amber-700 hover:bg-amber-50 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!campaignName.trim()}
          >
            <Save className="w-4 h-4 mr-2" />
            Save as Draft
          </Button>
          <Button
            onClick={handleStartCampaign}
            disabled={!campaignName.trim()}
            className="sm:flex-1 bg-gradient-to-r from-[#043927] to-emerald-600 hover:from-[#032d1f] hover:to-emerald-700 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Campaign
          </Button>
        </div>
      )}
    </div>
  );
}

export default StartCampaign;
