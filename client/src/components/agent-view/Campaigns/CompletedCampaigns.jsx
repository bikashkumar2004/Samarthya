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



export default function CompletedCampaigns({campaigns})  {
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
