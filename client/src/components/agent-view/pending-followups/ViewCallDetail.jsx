import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Tag,
  Clock,
  Timer,
  Smile,
  Meh,
  Frown,
  FileText,
  MessageSquare,
  Phone,
  Calendar
} from "lucide-react";

export default function ViewCallDetail({ callData }) {
  const getSentimentIcon = (sentiment) => {
    if (sentiment === "Positive") return <Smile className="w-5 h-5" />;
    if (sentiment === "Neutral") return <Meh className="w-5 h-5" />;
    if (sentiment === "Negative") return <Frown className="w-5 h-5" />;
    return null;
  };

  const getSentimentClass = (sentiment) => {
    const classes = {
      Positive: "from-emerald-500 to-green-600 text-white",
      Neutral: "from-gray-400 to-slate-500 text-white",
      Negative: "from-red-500 to-rose-600 text-white",
    };
    return classes[sentiment] || "from-gray-400 to-gray-600 text-white";
  };

  return (
    <div className="space-y-6">
      {/* Header Info Card */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400"></div>
        <CardHeader className="pt-6">
          <CardTitle className="text-2xl font-bold text-[#043927] flex items-center gap-2">
            <Phone className="w-6 h-6" />
            Call Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="bg-white p-4 rounded-xl border-2 border-blue-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-2 rounded-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Name</span>
              </div>
              <div className="text-lg font-bold text-gray-900">{callData?.name || "John Doe"}</div>
            </div>

            {/* Category */}
            <div className="bg-white p-4 rounded-xl border-2 border-purple-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-lg">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Category</span>
              </div>
              <div className="text-lg font-bold text-gray-900">{callData?.category || "Sales"}</div>
            </div>

            {/* Called At */}
            <div className="bg-white p-4 rounded-xl border-2 border-green-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Called At</span>
              </div>
              <div className="text-lg font-bold text-gray-900">{callData?.calledAt || "10:30 AM"}</div>
            </div>

            {/* Duration */}
            <div className="bg-white p-4 rounded-xl border-2 border-orange-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-lg">
                  <Timer className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Call Duration</span>
              </div>
              <div className="text-lg font-bold text-gray-900">{callData?.duration || "5:30"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Card */}
      <Card className="border-2 border-gray-200 shadow-lg overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${getSentimentClass(callData?.sentiment)}`}></div>
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
          <CardTitle className="text-xl font-bold text-[#043927] flex items-center gap-2">
            {getSentimentIcon(callData?.sentiment)}
            Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r ${getSentimentClass(callData?.sentiment)} shadow-lg`}>
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              {getSentimentIcon(callData?.sentiment)}
            </div>
            <span className="text-2xl font-black">
              {callData?.sentiment || "Positive"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <CardHeader className="pt-6">
          <CardTitle className="text-xl font-bold text-[#043927] flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Call Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white p-6 rounded-xl border-2 border-indigo-200 shadow-sm">
            <p className="text-gray-800 leading-relaxed text-base">
              {callData?.summary || 
                "Customer expressed interest in our premium package. Requested a follow-up call next week to discuss pricing and implementation details. Very positive interaction with high conversion potential."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Transcription Card */}
      <Card className="border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 shadow-lg overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500"></div>
        <CardHeader className="pt-6">
          <CardTitle className="text-xl font-bold text-[#043927] flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            Call Transcription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white p-6 rounded-xl border-2 border-teal-200 shadow-sm">
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {callData?.transcription ? (
                callData.transcription.split("\n").map((line, index) => {
                  const isAgent = line.toLowerCase().startsWith("agent");
                  const isCustomer = line.toLowerCase().startsWith("customer");
                  
                  if (isAgent || isCustomer) {
                    const [speaker, ...messageParts] = line.split(":");
                    const message = messageParts.join(":").trim();
                    
                    return (
                      <div key={index} className={`flex ${isAgent ? "justify-start" : "justify-end"}`}>
                        <div className={`max-w-[80%] ${isAgent ? "order-1" : "order-2"}`}>
                          <div className={`inline-flex items-center gap-2 mb-1 ${isAgent ? "" : "flex-row-reverse"}`}>
                            <span className={`text-xs font-bold uppercase tracking-wide ${
                              isAgent ? "text-blue-700" : "text-green-700"
                            }`}>
                              {speaker}
                            </span>
                          </div>
                          <div className={`p-4 rounded-2xl shadow-md ${
                            isAgent 
                              ? "bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-200 rounded-tl-none" 
                              : "bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-200 rounded-tr-none"
                          }`}>
                            <p className="text-gray-800 text-sm leading-relaxed">
                              {message}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-500 font-medium">No transcription available</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
