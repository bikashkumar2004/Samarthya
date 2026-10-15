import React from "react";
import DashboardOverview from "@/components/agent-view/dashboard/DashboardOverview";
import LiveMonitor from "@/components/agent-view/dashboard/LiveMonitor";
import PendingDash from "@/components/agent-view/dashboard/PendingDash";

export default function Dashboardlayout() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <DashboardOverview />
      <LiveMonitor />
      <PendingDash />
    </div>
  );
}
