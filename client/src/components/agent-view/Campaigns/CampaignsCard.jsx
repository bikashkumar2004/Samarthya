// src/components/CampaignsCard.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Clock, TrendingUp, Activity, Play, Pause } from "lucide-react";

export default function CampaignsCard({ campaigns }) {
  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-gradient-to-br from-gray-100 to-gray-50 p-8 rounded-2xl shadow-sm">
          <BarChart3 className="w-16 h-16 text-gray-400 mb-4 mx-auto" />
          <p className="text-gray-500 text-lg font-medium">No active campaigns</p>
        </div>
      </div>
    );
  }

  // Fallback client-side IST formatting if server didn't send startedAtIst
  const formatIST = (iso) => {
    try {
      if (!iso) return "-";
      const d = new Date(iso);
      return d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6">
      {campaigns.map((campaign) => {
        const stats = campaign.stats || {};
        const progress = typeof campaign.progress === "number" ? campaign.progress : 0;

        return (
          <Card
            key={campaign._id}
            className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#043927]/20 group"
          >
            {/* Accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#043927] via-emerald-500 to-green-400" />

            <CardHeader className="pb-4 bg-gradient-to-br from-gray-50 to-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold text-[#043927] mb-2 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-[#043927]" />
                    {campaign.campaignName}
                  </CardTitle>

                  <div className="flex gap-3 mt-2 text-sm text-gray-600 flex-wrap">
                    <span className="bg-white px-3 py-1 rounded-full border border-gray-200">
                      <strong>Campaign ID:</strong> {campaign.campaignId || campaign.campaignCode}
                    </span>
                    <span className="bg-white px-3 py-1 rounded-full border border-gray-200">
                      <strong>Task Code:</strong> {campaign.taskCode || "-"}
                    </span>
                    <span className="bg-white px-3 py-1 rounded-full border border-gray-200">
                      <strong>Task ID:</strong> {campaign.taskId}
                    </span>
                    <span className="bg-white px-3 py-1 rounded-full border border-gray-200">
                      <strong>Type:</strong> {campaign.type}
                    </span>
                    <span className="bg-white px-3 py-1 rounded-full border border-gray-200">
                      <strong>Category:</strong> {campaign.category}
                    </span>
                    {campaign.type === "message" && campaign.messageConfig ? (
                      <span className="bg-white px-3 py-1 rounded-full border border-gray-200">
                        <strong>Channels:</strong>{" "}
                        {[
                          campaign.messageConfig.channels?.email ? "Email" : null,
                          campaign.messageConfig.channels?.sms ? "SMS" : null,
                          campaign.messageConfig.channels?.whatsapp ? "WhatsApp" : null,
                        ]
                          .filter(Boolean)
                          .join(", ") || "None"}
                      </span>
                    ) : null}
                  </div>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                    campaign.status === "running"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white animate-pulse"
                      : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                  }`}
                >
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
                <span>
                  <strong className="text-gray-900">Started at:</strong>{" "}
                  {campaign.startedAtIst || formatIST(campaign.startedAt)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-700 mb-3">
                  <span className="font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#043927]" />
                    Progress
                  </span>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#043927] via-emerald-500 to-green-400 transition-all duration-500 rounded-full shadow-lg"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Stats (optional placeholders) */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-center shadow-lg">
                  <div className="text-3xl font-black text-white">{stats.completed ?? 0}</div>
                  <div className="text-xs text-blue-100 mt-1 font-semibold">Completed</div>
                </div>
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-4 rounded-xl text-center shadow-lg">
                  <div className="text-3xl font-black text-white">{stats.inProgress ?? 0}</div>
                  <div className="text-xs text-orange-100 mt-1 font-semibold">In Progress</div>
                </div>
                <div className="bg-gradient-to-br from-slate-500 to-slate-600 p-4 rounded-xl text-center shadow-lg">
                  <div className="text-3xl font-black text-white">{stats.queue ?? 0}</div>
                  <div className="text-xs text-slate-100 mt-1 font-semibold">Queue</div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
