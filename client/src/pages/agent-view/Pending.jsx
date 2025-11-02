// src/pages/Pending.jsx
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
  AlertCircle,
  PhoneOff,
  AlertTriangle,
  Eye,
  Filter,
  Download,
  Smile,
  Meh,
  Frown,
  Phone,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import View from "@/components/agent-view/View";
import { clearSelectedCall, fetchCallDetail, fetchLeads, selectCallError, selectCallLoading, selectLeadsData, selectLeadsError, selectLeadsLoading, selectSelectedCall } from "@/store/call-mannager/pendingFollowups";

export default function Pending() {
  const dispatch = useDispatch();
  const leads = useSelector(selectLeadsData);
  const isLoading = useSelector(selectLeadsLoading);
  const loadError = useSelector(selectLeadsError);

  const selectedCall = useSelector(selectSelectedCall);
  const loadingCall = useSelector(selectCallLoading);
  const callError = useSelector(selectCallError);

  const [filterStatus, setFilterStatus] = useState("all");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Fetch leads on mount
  useEffect(() => {
    dispatch(fetchLeads({ page: 1, pageSize: 100, order: "desc" }));
  }, [dispatch]);

  // Filter leads by status
  const filteredData = useMemo(() => {
    return filterStatus === "all"
      ? leads
      : (leads || []).filter(
          (item) => item.status?.toLowerCase() === filterStatus.toLowerCase()
        );
  }, [leads, filterStatus]);

  // Helper functions
  function getStatusBadge(status) {
    const statusStyles = {
      Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
      Completed: "bg-green-100 text-green-700 border-green-300",
      Rejected: "bg-red-100 text-red-700 border-red-300",
    };
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
          statusStyles[status] || "bg-gray-100 text-gray-700 border-gray-300"
        }`}
      >
        {status}
      </span>
    );
  }

  function getSentimentBadge(sentiment) {
    const sentimentStyles = {
      Positive: "bg-emerald-100 text-emerald-700 border-emerald-300",
      Neutral: "bg-gray-100 text-gray-700 border-gray-300",
      Negative: "bg-rose-100 text-rose-700 border-rose-300",
    };

    const sentimentIcons = {
      Positive: <Smile className="w-4 h-4" />,
      Neutral: <Meh className="w-4 h-4" />,
      Negative: <Frown className="w-4 h-4" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
          sentimentStyles[sentiment] || "bg-gray-100 text-gray-700 border-gray-300"
        }`}
      >
        {sentimentIcons[sentiment]}
        {sentiment}
      </span>
    );
  }

  // Open call details view dialog and fetch transcript
  function handleViewCall(row) {
    dispatch(fetchCallDetail(row.customer_id)); // or row.call_id depending on data shape
    setViewDialogOpen(true);
  }

  // Close dialog and clear call detail state
  function handleCloseDialog() {
    setViewDialogOpen(false);
    dispatch(clearSelectedCall());
  }

  // Stats calculation
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
      <div className="bg-gradient-to-r from-[#043927] via-emerald-700 to-green-600 p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
          <Clock className="w-8 h-8 md:w-10 md:h-10" />
          Pending Follow-ups
        </h1>
        <p className="text-white/90 text-sm md:text-base mt-2">
          Track and manage your pending customer interactions
        </p>
      </div>

      {/* Stats Cards */}
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

        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-orange-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Urgent Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {stats.urgent}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Card */}
      <Card className="border-2 border-gray-200 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-2xl font-bold text-[#043927] flex items-center gap-2">
              <Phone className="w-6 h-6" />
              Call History
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Select
                value={filterStatus}
                onValueChange={(value) => setFilterStatus(value)}
              >
                <SelectTrigger className="w-full sm:w-[180px] border-2 border-gray-300">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold shadow-lg">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-100 to-gray-50">
                  <TableHead className="font-bold text-gray-900">Name</TableHead>
                  <TableHead className="font-bold text-gray-900 hidden md:table-cell">
                    Phone
                  </TableHead>
                  <TableHead className="font-bold text-gray-900 hidden lg:table-cell">
                    Category
                  </TableHead>
                  <TableHead className="font-bold text-gray-900 hidden sm:table-cell">
                    Status
                  </TableHead>
                  <TableHead className="font-bold text-gray-900">Sentiment</TableHead>
                  <TableHead className="font-bold text-gray-900 hidden md:table-cell">
                    Duration
                  </TableHead>
                  <TableHead className="font-bold text-gray-900 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Loading…
                    </TableCell>
                  </TableRow>
                ) : loadError ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-red-600">
                      {loadError}
                    </TableCell>
                  </TableRow>
                ) : filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <TableRow
                      key={row.customer_id || index}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-colors"
                    >
                      <TableCell>
                        <div>
                          <div className="font-semibold text-gray-900">{row.name}</div>
                          <div className="text-xs text-gray-500 md:hidden">{row.phoneNo}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-sm">
                        {row.phoneNo}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border border-purple-300">
                          {row.category}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {getStatusBadge(row.status)}
                      </TableCell>
                      <TableCell>{getSentimentBadge(row.sentiment)}</TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-sm font-semibold">
                        {row.call_duration_seconds ? `${row.call_duration_seconds.toFixed(2)} s` : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          onClick={() => handleViewCall(row)}
                          variant="outline"
                          size="sm"
                          className="border-2 border-[#043927] text-[#043927] hover:bg-[#043927] hover:text-white font-bold"
                        >
                          <Eye className="w-4 h-4 sm:mr-1" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      <Clock className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="font-medium">No calls found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
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
          {selectedCall && <View callData={selectedCall} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
