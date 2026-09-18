import React from "react";
import DashboardOverview from "@/components/agent-view/dashboard/DashboardOverview";
import LiveMonitor from "@/components/agent-view/dashboard/LiveMonitor";
import PendingDash from "@/components/agent-view/dashboard/PendingDash";

export default function Dashboardlayout() {
  return (
    <div className="space-y-6">
      <DashboardOverview />
      <div className="mt-5">
        <LiveMonitor />
      </div>
      <PendingDash />
    </div>
  );
}
