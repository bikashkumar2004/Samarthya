import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  Plus, 
  Play, 
  Pause, 
  Square, 
  Download, 
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  Smile,
  Meh,
  Frown,
  CalendarClock,
  FileEdit,
  Trash2,
  Eye,
  TrendingUp,
  Activity
} from "lucide-react";
import StartCampaign from "@/components/agent-view/StartCampaign";

// Sample data for demonstration
const campaignsData = {
  active: [
    {
      id: 1,
      campaignName: "Healthcare Awareness Drive",
      campaignId: "CMP-2025-001",
      taskId: "TSK-001",
      startedAt: "2025-10-20 09:30 AM",
      progress: 65,
      status: "running",
      stats: {
        completed: 98,
        inProgress: 52,
        queue: 50,
        answered: 85,
        notAnswered: 13,
        failed: 2,
        positive: 60,
        neutral: 25,
        negative: 13
      }
    },
    {
      id: 2,
      campaignName: "Education Survey Campaign",
      campaignId: "CMP-2025-002",
      taskId: "TSK-002",
      startedAt: "2025-10-15 10:00 AM",
      progress: 45,
      status: "paused",
      stats: {
        completed: 90,
        inProgress: 30,
        queue: 80,
        answered: 70,
        notAnswered: 20,
        failed: 5,
        positive: 50,
        neutral: 30,
        negative: 10
      }
    }
  ],
  scheduled: [
    {
      id: 3,
      campaignName: "Vaccination Reminder Campaign",
      campaignId: "CMP-2025-003",
      taskId: "TSK-003",
      scheduledFor: "2025-11-01 10:00 AM",
      totalContacts: 300,
      estimatedDuration: "3 hours"
    },
    {
      id: 4,
      campaignName: "Tax Filing Awareness",
      campaignId: "CMP-2025-004",
      taskId: "TSK-004",
      scheduledFor: "2025-11-15 09:00 AM",
      totalContacts: 250,
      estimatedDuration: "2.5 hours"
    }
  ],
  completed: [
    {
      id: 5,
      campaignName: "Census Data Collection",
      campaignId: "CMP-2025-005",
      taskId: "TSK-005",
      startedAt: "2025-09-01 08:00 AM",
      completedAt: "2025-10-15 05:30 PM",
      totalContacts: 500,
      completionRate: 92,
      stats: {
        completed: 500,
        answered: 460,
        notAnswered: 30,
        failed: 10,
        positive: 320,
        neutral: 120,
        negative: 20
      }
    },
    {
      id: 6,
      campaignName: "Voter Registration Drive",
      campaignId: "CMP-2025-006",
      taskId: "TSK-006",
      startedAt: "2025-08-01 09:00 AM",
      completedAt: "2025-09-30 06:00 PM",
      totalContacts: 450,
      completionRate: 88,
      stats: {
        completed: 450,
        answered: 396,
        notAnswered: 40,
        failed: 14,
        positive: 280,
        neutral: 96,
        negative: 20
      }
    }
  ],
  draft: [
    {
      id: 7,
      campaignName: "Environmental Initiative",
      campaignId: "CMP-2025-007",
      taskId: "TSK-007",
      createdAt: "2025-10-25 03:15 PM",
      totalContacts: 350,
      lastModified: "2025-10-27 11:30 AM"
    },
    {
      id: 8,
      campaignName: "Road Safety Awareness",
      campaignId: "CMP-2025-008",
      taskId: "TSK-008",
      createdAt: "2025-10-26 02:00 PM",
      totalContacts: 200,
      lastModified: "2025-10-28 09:00 AM"
    }
  ]
};

export default function Campaigns() {
  const [activeTab, setActiveTab] = useState("active");
  const [startCampaignOpen, setStartCampaignOpen] = useState(false);

  const renderActiveCampaignCards = (campaigns) => {
    if (campaigns.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-gradient-to-br from-gray-100 to-gray-50 p-8 rounded-2xl shadow-sm">
            <BarChart3 className="w-16 h-16 text-gray-400 mb-4 mx-auto" />
            <p className="text-gray-500 text-lg font-medium">No active campaigns</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {campaigns.map((campaign) => (
          <Card 
            key={campaign.id} 
            className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#043927]/20 group"
          >
            {/* Gradient Background Accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#043927] via-emerald-500 to-green-400"></div>
            
            <CardHeader className="pb-4 bg-gradient-to-br from-gray-50 to-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold text-[#043927] mb-2 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-[#043927]" />
                    {campaign.campaignName}
                  </CardTitle>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span className="bg-white px-3 py-1 rounded-full border border-gray-200">
                      <strong>Campaign ID:</strong> {campaign.campaignId}
                    </span>
                    <span className="bg-white px-3 py-1 rounded-full border border-gray-200">
                      <strong>Task ID:</strong> {campaign.taskId}
                    </span>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                  campaign.status === "running" 
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white animate-pulse" 
                    : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                }`}>
                  {campaign.status === "running" ? (
                    <span className="flex items-center gap-2">
                      <Play className="w-4 h-4" /> Running
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Pause className="w-4 h-4" /> Paused
                    </span>
                  )}
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-5 pt-5">
              {/* Started At */}
              <div className="flex items-center text-sm text-gray-700 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 rounded-xl">
                <Clock className="w-5 h-5 mr-3 text-blue-600" />
                <span><strong className="text-gray-900">Started at:</strong> {campaign.startedAt}</span>
              </div>

              {/* Progress Bar */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-700 mb-3">
                  <span className="font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#043927]" />
                    Progress
                  </span>
                  <span className="font-bold text-[#043927] text-lg">{campaign.progress}%</span>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#043927] via-emerald-500 to-green-400 transition-all duration-500 rounded-full shadow-lg" 
                    style={{ width: `${campaign.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Live Stats */}
              <div className="border-t-2 border-gray-100 pt-5">
                <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#043927]" />
                  Live Statistics
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105 transition-transform">
                    <div className="text-3xl font-black text-white">{campaign.stats.completed}</div>
                    <div className="text-xs text-blue-100 mt-1 font-semibold">Completed</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105 transition-transform">
                    <div className="text-3xl font-black text-white">{campaign.stats.inProgress}</div>
                    <div className="text-xs text-orange-100 mt-1 font-semibold">In Progress</div>
                  </div>
                  <div className="bg-gradient-to-br from-slate-500 to-slate-600 p-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105 transition-transform">
                    <div className="text-3xl font-black text-white">{campaign.stats.queue}</div>
                    <div className="text-xs text-slate-100 mt-1 font-semibold">Queue</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105 transition-transform">
                    <div className="text-3xl font-black text-white">{campaign.stats.answered}</div>
                    <div className="text-xs text-green-100 mt-1 font-semibold">Answered</div>
                  </div>
                  <div className="bg-gradient-to-br from-red-500 to-rose-600 p-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105 transition-transform">
                    <div className="text-3xl font-black text-white">{campaign.stats.notAnswered}</div>
                    <div className="text-xs text-red-100 mt-1 font-semibold">Not Answered</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105 transition-transform">
                    <div className="text-3xl font-black text-white">{campaign.stats.failed}</div>
                    <div className="text-xs text-orange-100 mt-1 font-semibold">Failed</div>
                  </div>
                </div>
              </div>

              {/* Sentiment Analysis */}
              <div className="border-t-2 border-gray-100 pt-5">
                <h4 className="text-base font-bold text-gray-900 mb-4">Sentiment Analysis</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-5 rounded-2xl text-center border-2 border-emerald-200 shadow-md hover:shadow-lg transition-shadow">
                    <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                      <Smile className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-black text-emerald-700">{campaign.stats.positive}</div>
                    <div className="text-xs text-emerald-600 mt-1 font-bold">Positive</div>
                  </div>
                  <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-5 rounded-2xl text-center border-2 border-slate-200 shadow-md hover:shadow-lg transition-shadow">
                    <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                      <Meh className="w-8 h-8 text-slate-600" />
                    </div>
                    <div className="text-2xl font-black text-slate-700">{campaign.stats.neutral}</div>
                    <div className="text-xs text-slate-600 mt-1 font-bold">Neutral</div>
                  </div>
                  <div className="bg-gradient-to-br from-rose-50 to-red-50 p-5 rounded-2xl text-center border-2 border-rose-200 shadow-md hover:shadow-lg transition-shadow">
                    <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                      <Frown className="w-8 h-8 text-rose-600" />
                    </div>
                    <div className="text-2xl font-black text-rose-700">{campaign.stats.negative}</div>
                    <div className="text-xs text-rose-600 mt-1 font-bold">Negative</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-5 border-t-2 border-gray-100">
                <Button 
                  className="bg-gradient-to-r from-[#043927] to-emerald-700 hover:from-[#032d1f] hover:to-emerald-800 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  size="sm"
                >
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Dashboard
                </Button>
                <Button 
                  className={campaign.status === "running" 
                    ? "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  }
                  size="sm"
                >
                  {campaign.status === "running" ? (
                    <>
                      <Pause className="w-4 h-4 mr-1" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-1" />
                      Resume
                    </>
                  )}
                </Button>
                <Button 
                  className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  size="sm"
                >
                  <Square className="w-4 h-4 mr-1" />
                  Stop
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderScheduledCampaignCards = (campaigns) => {
    if (campaigns.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-8 rounded-2xl shadow-sm">
            <CalendarClock className="w-16 h-16 text-blue-400 mb-4 mx-auto" />
            <p className="text-gray-500 text-lg font-medium">No scheduled campaigns</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {campaigns.map((campaign) => (
          <Card 
            key={campaign.id} 
            className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-500/20 group"
          >
            {/* Gradient Background Accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-400"></div>
            
            <CardHeader className="pb-4 bg-gradient-to-br from-blue-50 to-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold text-[#043927] mb-2 flex items-center gap-2">
                    <CalendarClock className="w-6 h-6 text-blue-600" />
                    {campaign.campaignName}
                  </CardTitle>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span className="bg-white px-3 py-1 rounded-full border border-blue-200">
                      <strong>Campaign ID:</strong> {campaign.campaignId}
                    </span>
                    <span className="bg-white px-3 py-1 rounded-full border border-blue-200">
                      <strong>Task ID:</strong> {campaign.taskId}
                    </span>
                  </div>
                </div>
                <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg">
                  <span className="flex items-center gap-2">
                    <CalendarClock className="w-4 h-4" /> Scheduled
                  </span>
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-5 pt-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-5 rounded-2xl shadow-md border border-blue-200">
                  <div className="text-xs text-blue-700 mb-2 font-bold uppercase tracking-wide">Scheduled For</div>
                  <div className="text-base font-bold text-gray-900">{campaign.scheduledFor}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-5 rounded-2xl shadow-md border border-purple-200">
                  <div className="text-xs text-purple-700 mb-2 font-bold uppercase tracking-wide">Total Contacts</div>
                  <div className="text-base font-bold text-gray-900">{campaign.totalContacts}</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-100 to-amber-50 p-5 rounded-2xl shadow-md border border-amber-200">
                <div className="text-xs text-amber-700 mb-2 font-bold uppercase tracking-wide">Estimated Duration</div>
                <div className="text-base font-bold text-gray-900">{campaign.estimatedDuration}</div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-5 border-t-2 border-gray-100">
                <Button 
                  className="bg-gradient-to-r from-[#043927] to-emerald-700 hover:from-[#032d1f] hover:to-emerald-800 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  size="sm"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  size="sm"
                >
                  <FileEdit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Start
                </Button>
                <Button 
                  className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderCompletedCampaignCards = (campaigns) => {
    if (campaigns.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-gradient-to-br from-green-100 to-emerald-50 p-8 rounded-2xl shadow-sm">
            <CheckCircle className="w-16 h-16 text-green-400 mb-4 mx-auto" />
            <p className="text-gray-500 text-lg font-medium">No completed campaigns</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {campaigns.map((campaign) => (
          <Card 
            key={campaign.id} 
            className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-500/20 group"
          >
            {/* Gradient Background Accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-400"></div>
            
            <CardHeader className="pb-4 bg-gradient-to-br from-green-50 to-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold text-[#043927] mb-2 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    {campaign.campaignName}
                  </CardTitle>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span className="bg-white px-3 py-1 rounded-full border border-green-200">
                      <strong>Campaign ID:</strong> {campaign.campaignId}
                    </span>
                    <span className="bg-white px-3 py-1 rounded-full border border-green-200">
                      <strong>Task ID:</strong> {campaign.taskId}
                    </span>
                  </div>
                </div>
                <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Completed
                  </span>
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-5 pt-5">
              {/* Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-100 to-emerald-50 p-5 rounded-2xl shadow-md border border-green-200">
                  <div className="text-xs text-green-700 mb-2 font-bold uppercase tracking-wide">Started At</div>
                  <div className="text-base font-bold text-gray-900">{campaign.startedAt}</div>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-5 rounded-2xl shadow-md border border-blue-200">
                  <div className="text-xs text-blue-700 mb-2 font-bold uppercase tracking-wide">Completed At</div>
                  <div className="text-base font-bold text-gray-900">{campaign.completedAt}</div>
                </div>
              </div>

              {/* Completion Rate */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-700 mb-3">
                  <span className="font-bold text-gray-900">Completion Rate</span>
                  <span className="font-bold text-green-600 text-lg">{campaign.completionRate}%</span>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-400 transition-all duration-500 rounded-full shadow-lg" 
                    style={{ width: `${campaign.completionRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Final Stats */}
              <div className="border-t-2 border-gray-100 pt-5">
                <h4 className="text-base font-bold text-gray-900 mb-4">Final Statistics</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-center shadow-lg">
                    <div className="text-3xl font-black text-white">{campaign.stats.completed}</div>
                    <div className="text-xs text-blue-100 mt-1 font-semibold">Total Calls</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-xl text-center shadow-lg">
                    <div className="text-3xl font-black text-white">{campaign.stats.answered}</div>
                    <div className="text-xs text-green-100 mt-1 font-semibold">Answered</div>
                  </div>
                  <div className="bg-gradient-to-br from-red-500 to-rose-600 p-4 rounded-xl text-center shadow-lg">
                    <div className="text-3xl font-black text-white">{campaign.stats.notAnswered}</div>
                    <div className="text-xs text-red-100 mt-1 font-semibold">Not Answered</div>
                  </div>
                </div>
              </div>

              {/* Sentiment Analysis */}
              <div className="border-t-2 border-gray-100 pt-5">
                <h4 className="text-base font-bold text-gray-900 mb-4">Sentiment Analysis</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-5 rounded-2xl text-center border-2 border-emerald-200 shadow-md">
                    <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                      <Smile className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-black text-emerald-700">{campaign.stats.positive}</div>
                    <div className="text-xs text-emerald-600 mt-1 font-bold">Positive</div>
                  </div>
                  <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-5 rounded-2xl text-center border-2 border-slate-200 shadow-md">
                    <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                      <Meh className="w-8 h-8 text-slate-600" />
                    </div>
                    <div className="text-2xl font-black text-slate-700">{campaign.stats.neutral}</div>
                    <div className="text-xs text-slate-600 mt-1 font-bold">Neutral</div>
                  </div>
                  <div className="bg-gradient-to-br from-rose-50 to-red-50 p-5 rounded-2xl text-center border-2 border-rose-200 shadow-md">
                    <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                      <Frown className="w-8 h-8 text-rose-600" />
                    </div>
                    <div className="text-2xl font-black text-rose-700">{campaign.stats.negative}</div>
                    <div className="text-xs text-rose-600 mt-1 font-bold">Negative</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-5 border-t-2 border-gray-100">
                <Button 
                  className="bg-gradient-to-r from-[#043927] to-emerald-700 hover:from-[#032d1f] hover:to-emerald-800 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  size="sm"
                >
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Dashboard
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Report
                </Button>
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  size="sm"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Calls
                </Button>
                <Button 
                  className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderDraftCampaignCards = (campaigns) => {
    if (campaigns.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-gradient-to-br from-amber-100 to-yellow-50 p-8 rounded-2xl shadow-sm">
            <FileEdit className="w-16 h-16 text-amber-400 mb-4 mx-auto" />
            <p className="text-gray-500 text-lg font-medium">No draft campaigns</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {campaigns.map((campaign) => (
          <Card 
            key={campaign.id} 
            className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-amber-500/20 group"
          >
            {/* Gradient Background Accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-400"></div>
            
            <CardHeader className="pb-4 bg-gradient-to-br from-amber-50 to-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold text-[#043927] mb-2 flex items-center gap-2">
                    <FileEdit className="w-6 h-6 text-amber-600" />
                    {campaign.campaignName}
                  </CardTitle>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span className="bg-white px-3 py-1 rounded-full border border-amber-200">
                      <strong>Campaign ID:</strong> {campaign.campaignId}
                    </span>
                    <span className="bg-white px-3 py-1 rounded-full border border-amber-200">
                      <strong>Task ID:</strong> {campaign.taskId}
                    </span>
                  </div>
                </div>
                <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg">
                  <span className="flex items-center gap-2">
                    <FileEdit className="w-4 h-4" /> Draft
                  </span>
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-5 pt-5">
              {/* Draft Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-amber-100 to-yellow-50 p-5 rounded-2xl shadow-md border border-amber-200">
                  <div className="text-xs text-amber-700 mb-2 font-bold uppercase tracking-wide">Created At</div>
                  <div className="text-base font-bold text-gray-900">{campaign.createdAt}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-5 rounded-2xl shadow-md border border-purple-200">
                  <div className="text-xs text-purple-700 mb-2 font-bold uppercase tracking-wide">Last Modified</div>
                  <div className="text-base font-bold text-gray-900">{campaign.lastModified}</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-5 rounded-2xl shadow-md border border-blue-200">
                <div className="text-xs text-blue-700 mb-2 font-bold uppercase tracking-wide">Total Contacts</div>
                <div className="text-base font-bold text-gray-900">{campaign.totalContacts}</div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-5 border-t-2 border-gray-100">
                <Button 
                  className="bg-gradient-to-r from-[#043927] to-emerald-700 hover:from-[#032d1f] hover:to-emerald-800 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  size="sm"
                >
                  <FileEdit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  size="sm"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
                <Button 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Start
                </Button>
                <Button 
                  className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 p-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-5">
        <div className="bg-gradient-to-r from-[#043927] via-emerald-700 to-green-600 p-6 rounded-2xl shadow-xl">
          <h1 className="text-4xl font-black text-white flex items-center gap-3">
            <Activity className="w-10 h-10" />
            Campaigns
          </h1>
        </div>
        
        <div className="flex flex-col items-center space-y-3 bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100">
          <Button 
            onClick={() => setStartCampaignOpen(true)}
            className="bg-gradient-to-r from-[#043927] via-emerald-600 to-green-500 hover:from-[#032d1f] hover:via-emerald-700 hover:to-green-600 text-white font-bold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Start Campaign
          </Button>
          
          <p className="text-gray-500 text-base">
            No data? <span className="text-[#043927] font-bold cursor-pointer hover:underline hover:text-emerald-600 transition-colors">Import now!</span>
          </p>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="active" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-gray-100 to-gray-50 p-1 rounded-xl shadow-md h-14">
          <TabsTrigger 
            value="active" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#043927] data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-base rounded-lg transition-all"
          >
            Active ({campaignsData.active.length})
          </TabsTrigger>
          <TabsTrigger 
            value="scheduled"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-base rounded-lg transition-all"
          >
            Scheduled ({campaignsData.scheduled.length})
          </TabsTrigger>
          <TabsTrigger 
            value="completed"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-base rounded-lg transition-all"
          >
            Completed ({campaignsData.completed.length})
          </TabsTrigger>
          <TabsTrigger 
            value="draft"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-base rounded-lg transition-all"
          >
            Draft ({campaignsData.draft.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {renderActiveCampaignCards(campaignsData.active)}
        </TabsContent>

        <TabsContent value="scheduled" className="mt-6">
          {renderScheduledCampaignCards(campaignsData.scheduled)}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {renderCompletedCampaignCards(campaignsData.completed)}
        </TabsContent>

        <TabsContent value="draft" className="mt-6">
          {renderDraftCampaignCards(campaignsData.draft)}
        </TabsContent>
      </Tabs>

      {/* Start Campaign Sheet */}
      <Sheet open={startCampaignOpen} onOpenChange={setStartCampaignOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0 bg-white">
          <SheetHeader className="bg-gradient-to-r from-[#043927] via-emerald-700 to-green-600 p-6 sticky top-0 z-10">
            <SheetTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Start New Campaign
            </SheetTitle>
          </SheetHeader>
          <div className="p-6">
            <StartCampaign onClose={() => setStartCampaignOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
