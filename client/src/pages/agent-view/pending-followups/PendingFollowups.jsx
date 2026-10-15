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
  const leads = useSelector(selectLeadsData) || [];
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span>Pending Follow-ups</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track urgent pharmacist callbacks, prescription verifications, and patient escalations
          </p>
        </div>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <DialogHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-500" />
              <span>Call Transcript & Intelligence Details</span>
            </DialogTitle>
          </DialogHeader>
          {loadingCall && <div className="py-6 text-center text-xs text-slate-400 animate-pulse">Loading transcript…</div>}
          {callError && <div className="py-4 text-xs text-rose-500">{callError}</div>}
          {selectedCall && <ViewCallDetail callData={selectedCall} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
