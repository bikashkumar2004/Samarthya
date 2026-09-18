import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertCircle, PhoneOff, AlertTriangle } from "lucide-react";

export default function PendingStatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-rose-50 hover:shadow-xl transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Calls Rejected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-black bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
            {stats.rejected}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 hover:shadow-xl transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-yellow-700 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Follow-ups Needed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-black bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
            {stats.followups}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-xl transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-blue-700 flex items-center gap-2">
            <PhoneOff className="w-4 h-4" />
            Missed Calls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {stats.missed}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-xl transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-purple-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Urgent Follow-ups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {stats.urgent}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
