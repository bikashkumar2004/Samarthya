import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Clock,
  Eye,
  Download,
  Smile,
  Meh,
  Frown,
  Phone,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import ViewCallDetail from "@/components/agent-view/pending-followups/ViewCallDetail";
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

export default function PendingDash() {
  const dispatch = useDispatch();
  const leads = useSelector(selectLeadsData) || [];
  const isLoading = useSelector(selectLeadsLoading);
  const loadError = useSelector(selectLeadsError);

  const selectedCall = useSelector(selectSelectedCall);
  const loadingCall = useSelector(selectCallLoading);
  const callError = useSelector(selectCallError);

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchLeads({ page: 1, pageSize: 100, order: "desc" }));
  }, [dispatch]);

  const filteredData = useMemo(() => {
    return (leads || []).filter((item) => {
      const matchStatus =
        filterStatus === "all" ||
        item.status?.toLowerCase() === filterStatus.toLowerCase();
      const matchSearch =
        !searchTerm ||
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phoneNo?.includes(searchTerm) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [leads, filterStatus, searchTerm]);

  function getStatusBadge(status) {
    switch (status?.toLowerCase()) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case "rejected":
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
            <AlertCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
    }
  }

  function getSentimentBadge(sentiment) {
    switch (sentiment?.toLowerCase()) {
      case "positive":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
            <Smile className="w-3.5 h-3.5" />
            Positive
          </span>
        );
      case "negative":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
            <Frown className="w-3.5 h-3.5" />
            Negative
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Meh className="w-3.5 h-3.5 text-indigo-400" />
            Neutral
          </span>
        );
    }
  }

  function handleViewCall(row) {
    dispatch(fetchCallDetail(row.customer_id));
    setViewDialogOpen(true);
  }

  function handleCloseDialog() {
    setViewDialogOpen(false);
    dispatch(clearSelectedCall());
  }

  function handleExportCSV() {
    if (!filteredData.length) return;
    const headers = ["Name", "Phone", "Category", "Status", "Sentiment", "Duration_Sec"];
    const rows = filteredData.map((d) => [
      `"${d.name || ""}"`,
      `"${d.phoneNo || ""}"`,
      `"${d.category || ""}"`,
      `"${d.status || ""}"`,
      `"${d.sentiment || ""}"`,
      d.call_duration_seconds || 0,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `whitespace_crm_calls_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Header & Controls */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <span>Customer Calls & Actionable Follow-ups</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review completed sessions, clinical summaries, and pending pharmacist tasks
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search caller, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-44 sm:w-56"
            />
          </div>

          {/* Status Dropdown */}
          <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val)}>
            <SelectTrigger className="w-[140px] text-xs h-9 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          {/* Export CSV Button */}
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="text-xs font-semibold rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-indigo-500" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <TableHead className="text-xs font-bold text-slate-500 dark:text-slate-400">Caller Name</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden md:table-cell">Phone Number</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden lg:table-cell">Inquiry Category</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:table-cell">Resolution Status</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 dark:text-slate-400">Extracted Sentiment</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden md:table-cell">Duration</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 dark:text-slate-400 text-center">Transcript</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-xs text-slate-400">
                  <div className="animate-pulse space-y-2 max-w-sm mx-auto">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6 mx-auto" />
                  </div>
                </TableCell>
              </TableRow>
            ) : loadError ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-xs text-rose-500">
                  {loadError}
                </TableCell>
              </TableRow>
            ) : filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <TableRow
                  key={row.customer_id || index}
                  className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <TableCell>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {row.name || "Customer Inquirer"}
                    </div>
                    <div className="text-xs text-slate-400 md:hidden font-mono mt-0.5">
                      {row.phoneNo}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-xs text-slate-600 dark:text-slate-300">
                    {row.phoneNo || "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="inline-flex px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40">
                      {row.category || "General Assistance"}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {getStatusBadge(row.status)}
                  </TableCell>
                  <TableCell>
                    {getSentimentBadge(row.sentiment)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-xs text-slate-600 dark:text-slate-400">
                    {row.call_duration_seconds ? `${Math.round(row.call_duration_seconds)}s` : "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      onClick={() => handleViewCall(row)}
                      variant="outline"
                      size="sm"
                      className="text-xs font-semibold rounded-lg border-indigo-200 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-500 dark:text-slate-400">
                  <Clock className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                  <p className="font-semibold text-sm">No follow-up records found</p>
                  <p className="text-xs text-slate-400 mt-1">Completed voice call insights will automatically appear here.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Dialog Modal */}
      <Dialog open={viewDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <DialogHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-500" />
              <span>Call Intelligence & Transcript Review</span>
            </DialogTitle>
          </DialogHeader>
          {loadingCall && <div className="py-6 text-center text-xs text-slate-400 animate-pulse">Retrieving call transcript from MongoDB...</div>}
          {callError && <div className="py-4 text-xs text-rose-500">{callError}</div>}
          {selectedCall && <ViewCallDetail callData={selectedCall} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
