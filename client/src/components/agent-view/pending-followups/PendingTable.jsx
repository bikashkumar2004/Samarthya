import React from "react";
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
import { Clock, Download, Eye, Phone, Smile, Meh, Frown, CheckCircle2, AlertCircle } from "lucide-react";

export default function PendingTable({
  filteredData = [],
  filterStatus,
  setFilterStatus,
  isLoading,
  loadError,
  onViewCall,
}) {
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

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-indigo-500" />
              <span>Pending Patient Follow-up Queue</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Filter by resolution status and review complete AI call transcripts
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Select
              value={filterStatus}
              onValueChange={(value) => setFilterStatus(value)}
            >
              <SelectTrigger className="w-full sm:w-[150px] text-xs h-9 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <TableHead className="text-xs font-bold text-slate-500 dark:text-slate-400">Caller Name</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden md:table-cell">Phone Number</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden lg:table-cell">Inquiry Category</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 dark:text-slate-400">Sentiment</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden md:table-cell">Duration</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 dark:text-slate-400 text-center">Actions</TableHead>
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
                      onClick={() => onViewCall(row)}
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
                  <p className="font-semibold text-sm">No pending follow-ups</p>
                  <p className="text-xs text-slate-400 mt-1">All patient inquiries have been addressed.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
