import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus, Activity } from "lucide-react";
import StartCampaign from "@/components/agent-view/Campaigns/StartCampaign";
import ActiveCampaigns from "@/components/agent-view/Campaigns/ActiveCampaigns";
import ScheduledCampaigns from "@/components/agent-view/Campaigns/ScheduledCampaigns";
import CompletedCampaigns from "@/components/agent-view/Campaigns/CompletedCampaigns";
import DraftCampaigns from "@/components/agent-view/Campaigns/DraftCampaigns";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 p-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-5">
        <div className="">
          <h1 className="text-4xl font-black text-black flex items-center gap-3">
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
          <ActiveCampaigns campaigns={campaignsData.active}/>
        </TabsContent>

        <TabsContent value="scheduled" className="mt-6">
          <ScheduledCampaigns campaigns={campaignsData.scheduled}/>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <CompletedCampaigns campaigns={campaignsData.completed}/>
        </TabsContent>

        <TabsContent value="draft" className="mt-6">
          <DraftCampaigns campaigns={campaignsData.draft}/>
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
