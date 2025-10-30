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



export default function ActiveCampaigns({campaigns}) {
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