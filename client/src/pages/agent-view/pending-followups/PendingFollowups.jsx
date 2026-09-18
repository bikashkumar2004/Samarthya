import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Clock, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ViewCallDetail from "@/components/agent-view/pending-followups/ViewCallDetail";
import PendingStatsCards from "@/components/agent-view/pending-followups/PendingStatsCards";
import PendingTable from "@/components/agent-view/pending-followups/PendingTable";
import {
  clearSelectedCall,
  fetchCallDetail,
  fetchLeads,
  selectCallError,
  selectCallLoading,
  selectLeadsData,
  selectLeadsError,
  selectLeadsLoading,
  selectSelectedCall,
} from "@/store/call-mannager/pendingFollowups";

export default function PendingFollowups() {
  const dispatch = useDispatch();
  const leads = useSelector(selectLeadsData);
  const isLoading = useSelector(selectLeadsLoading);
  const loadError = useSelector(selectLeadsError);

  const selectedCall = useSelector(selectSelectedCall);
  const loadingCall = useSelector(selectCallLoading);
  const callError = useSelector(selectCallError);

  const [filterStatus, setFilterStatus] = useState("all");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchLeads({ page: 1, pageSize: 100, order: "desc" }));
  }, [dispatch]);

  const filteredData = useMemo(() => {
    return filterStatus === "all"
      ? leads
      : (leads || []).filter(
          (item) => item.status?.toLowerCase() === filterStatus.toLowerCase()
        );
  }, [leads, filterStatus]);

  function handleViewCall(row) {
    dispatch(fetchCallDetail(row.customer_id));
    setViewDialogOpen(true);
  }

  function handleCloseDialog() {
    setViewDialogOpen(false);
    dispatch(clearSelectedCall());
  }

  const stats = {
    rejected: leads.filter((d) => d.status === "Rejected").length,
    followups: leads.filter((d) => d.status === "Pending").length,
    missed: leads.filter((d) => d.sentiment === "Negative").length,
    urgent: leads.filter(
      (d) => d.status === "Pending" && d.sentiment === "Negative"
    ).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-black flex items-center gap-3">
          <Clock className="w-8 h-8 md:w-10 md:h-10" />
          Pending Follow-ups
        </h1>
        <p className="text-gray-600 text-sm md:text-base mt-1">
          Track and manage your pending customer interactions
        </p>
      </div>

      {/* Stats Cards Subcomponent */}
      <PendingStatsCards stats={stats} />

      {/* Table Subcomponent */}
      <PendingTable
        filteredData={filteredData}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        isLoading={isLoading}
        loadError={loadError}
        onViewCall={handleViewCall}
      />

      {/* Detail Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#043927] flex items-center gap-2">
              <Eye className="w-6 h-6" />
              Call Details
            </DialogTitle>
          </DialogHeader>
          {loadingCall && <div>Loading call details…</div>}
          {callError && <div className="text-red-600">{callError}</div>}
          {selectedCall && <ViewCallDetail callData={selectedCall} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
