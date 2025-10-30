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



export default function DraftCampaigns({campaigns}) {
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