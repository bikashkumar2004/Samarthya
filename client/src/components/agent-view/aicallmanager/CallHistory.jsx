
import React, { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Phone, PhoneOff, Download, Search, Filter, X, Eye, Clock, Calendar,
  Smile, Meh, Frown, Activity, CheckCircle, AlertCircle, ChevronLeft, ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import ViewCard from "./ViewCard";
import { fetchCallHistory, fetchCallHistoryByIds, selectCallHistoryLoading, selectCallHistoryRows } from "@/store/call-mannager/callhistory";

// helpers
function formatDuration(totalSec = 0) {
  const sNum = Number(totalSec) || 0;
  const s = Math.max(0, Math.round(sNum));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const rem = s % 60;
  if (h > 0) return `${h}h ${m}m ${rem}s`;
  if (m > 0) return `${m}m ${rem}s`;
  return `0m ${rem}s`;
}

function prettyStatus(s = "") {
  const v = String(s || "").toLowerCase();
  if (v === "in-progress") return "In Progress";
  if (v === "no-answer") return "No Answer";
  if (v === "queued") return "Queued";
  if (v === "initiated") return "Initiated";
  if (v === "ringing") return "Ringing";
  if (v === "completed") return "Completed";
  if (v === "busy") return "Busy";
  if (v === "failed") return "Failed";
  if (v === "canceled") return "Canceled";
  return v.charAt(0).toUpperCase() + v.slice(1);
}

const CallHistory = () => {
  const dispatch = useDispatch();
  const rowsRaw = useSelector(selectCallHistoryRows);
  const loading = useSelector(selectCallHistoryLoading);

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Filter States
  const [statusFilter, setStatusFilter] = useState([]);
  const [sentimentFilter, setSentimentFilter] = useState([]);
  const [durationFilter, setDurationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // initial load
  useEffect(() => {
    dispatch(fetchCallHistory({ limit: 50 }));
  }, [dispatch]);

  // normalize rows for UI/search/filter
  const normalizedRows = useMemo(() => {
    return (rowsRaw || []).map((r, idx) => {
      const uiStatus = prettyStatus(r.status || "");
      const dateISO = r.updated_at_iso ? new Date(r.updated_at_iso).toISOString() : "";
      const dateKey = dateISO ? dateISO.slice(0, 10) : ""; // YYYY-MM-DD
      return {
        sl: idx + 1,
        call_id: r.call_id,
        customer_id: r.customer_id,
        name: r.name || "Unknown",
        phoneNo: r.phoneNo || "Unknown",
        status: uiStatus,
        sentiment: r.sentiment || "Neutral",
        duration_seconds: r.duration_seconds ?? 0,
        duration_text: formatDuration(r.duration_seconds ?? 0),
        dateKey,
      };
    });
  }, [rowsRaw]);

  // apply filters
  const filteredCalls = useMemo(() => {
    return normalizedRows.filter((call) => {
      const matchesSearch =
        call.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.phoneNo.includes(searchTerm);

      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(call.status);
      const matchesSentiment = sentimentFilter.length === 0 || sentimentFilter.includes(call.sentiment);

      let matchesDuration = true;
      if (durationFilter) {
        const minutes = Math.floor((call.duration_seconds || 0) / 60);
        if (durationFilter === "<1min" && minutes >= 1) matchesDuration = false;
        if (durationFilter === "1-3min" && (minutes < 1 || minutes > 3)) matchesDuration = false;
        if (durationFilter === ">3min" && minutes <= 3) matchesDuration = false;
      }

      const matchesDate = !dateFilter || call.dateKey === dateFilter;

      return matchesSearch && matchesStatus && matchesSentiment && matchesDuration && matchesDate;
    });
  }, [normalizedRows, searchTerm, statusFilter, sentimentFilter, durationFilter, dateFilter]);

  // pagination
  const totalPages = Math.ceil(filteredCalls.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCalls = filteredCalls.slice(startIndex, endIndex);

  // helpers: UI classes/icons
  const getSentimentClass = (sentiment) => {
    const classes = {
      Positive: "text-green-600 bg-green-100",
      Neutral: "text-yellow-600 bg-yellow-100",
      Negative: "text-red-600 bg-red-100",
    };
    return classes[sentiment] || "text-gray-600 bg-gray-100";
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment === "Positive") return <Smile className="w-4 h-4" />;
    if (sentiment === "Neutral") return <Meh className="w-4 h-4" />;
    if (sentiment === "Negative") return <Frown className="w-4 h-4" />;
    return null;
  };

  const getStatusClass = (status) => {
    const classes = {
      Completed: "bg-green-100 text-green-700 border-green-300",
      "In Progress": "bg-blue-100 text-blue-700 border-blue-300",
      "No Answer": "bg-yellow-100 text-yellow-700 border-yellow-300",
      Failed: "bg-red-100 text-red-700 border-red-300",
      Busy: "bg-orange-100 text-orange-700 border-orange-300",
      Canceled: "bg-gray-100 text-gray-700 border-gray-300",
      Queued: "bg-gray-100 text-gray-700 border-gray-300",
      Initiated: "bg-gray-100 text-gray-700 border-gray-300",
      Ringing: "bg-blue-50 text-blue-700 border-blue-200",
    };
    return classes[status] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const getStatusIcon = (status) => {
    if (status === "Completed") return <CheckCircle className="w-4 h-4" />;
    if (status === "In Progress") return <Activity className="w-4 h-4 animate-pulse" />;
    if (status === "Failed") return <AlertCircle className="w-4 h-4" />;
    if (status === "No Answer") return <PhoneOff className="w-4 h-4" />;
    return null;
  };

  // filter UI handlers
  const clearAllFilters = () => {
    setStatusFilter([]);
    setSentimentFilter([]);
    setDurationFilter("");
    setDateFilter("");
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sentimentFilter, durationFilter, dateFilter]);

  const handleStatusChange = (status) => {
    setStatusFilter((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const handleSentimentChange = (sentiment) => {
    setSentimentFilter((prev) =>
      prev.includes(sentiment) ? prev.filter((s) => s !== sentiment) : [...prev, sentiment]
    );
  };

  // export to Excel
  const downloadExcel = () => {
    const exportRows = filteredCalls.map((c) => ({
      Name: c.name,
      Phone: c.phoneNo,
      Status: c.status,
      Sentiment: c.sentiment,
      Duration: c.duration_text,
      UpdatedAt: c.dateKey,
    }));
    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "AI Calls");
    XLSX.writeFile(wb, "ai_calls_data.xlsx");
  };

  // view details: fetch detail (with summary) then open modal
  const viewDetails = async (row) => {
    try {
      const res = await dispatch(
        fetchCallHistoryByIds({ customerId: row.customer_id, callId: row.call_id })
      ).unwrap();
      setModalContent(res?.data || null);
      setModalOpen(true);
    } catch (e) {
      console.error("View detail error:", e);
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-indigo-500" />
              <span>Historical Voice Inquiries & Records</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comprehensive log of all AI telephony sessions, sentiment ratings, and audio durations
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-xs h-9 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 w-full sm:w-56"
              />
            </div>

            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-xl text-xs font-semibold border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Filter</span>
                  {(statusFilter.length > 0 ||
                    sentimentFilter.length > 0 ||
                    durationFilter ||
                    dateFilter) && (
                    <span className="ml-1 bg-indigo-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                      {statusFilter.length +
                        sentimentFilter.length +
                        (durationFilter ? 1 : 0) +
                        (dateFilter ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-full sm:w-96 overflow-y-auto bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6">
                <SheetHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
                  <SheetTitle className="text-lg font-bold text-slate-900 dark:text-white">Filter Voice Calls</SheetTitle>
                </SheetHeader>

                <div className="space-y-6 mt-6">
                  {/* Status Filter */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-bold text-gray-900">Status</Label>
                      </div>
                      <div className="space-y-2">
                        {["Completed", "In Progress", "No Answer", "Failed", "Busy", "Canceled", "Queued", "Initiated", "Ringing"].map(
                          (status) => (
                            <div key={status} className="flex items-center space-x-2">
                              <Checkbox
                                id={`status-${status}`}
                                checked={statusFilter.includes(status)}
                                onCheckedChange={() => handleStatusChange(status)}
                              />
                              <label
                                htmlFor={`status-${status}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {status}
                              </label>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Sentiment Filter */}
                    <div className="space-y-3 border-t pt-6">
                      <Label className="text-base font-bold text-gray-900">Sentiment</Label>
                      <div className="space-y-2">
                        {["Positive", "Neutral", "Negative"].map((sentiment) => (
                          <div key={sentiment} className="flex items-center space-x-2">
                            <Checkbox
                              id={`sentiment-${sentiment}`}
                              checked={sentimentFilter.includes(sentiment)}
                              onCheckedChange={() => handleSentimentChange(sentiment)}
                            />
                            <label
                              htmlFor={`sentiment-${sentiment}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                            >
                              {getSentimentIcon(sentiment)}
                              {sentiment}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Duration Filter */}
                    <div className="space-y-3 border-t pt-6">
                      <Label className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Duration
                      </Label>
                      <RadioGroup value={durationFilter} onValueChange={setDurationFilter}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="" id="duration-all" />
                          <label htmlFor="duration-all" className="text-sm font-medium cursor-pointer">
                            All Durations
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="<1min" id="duration-1" />
                          <label htmlFor="duration-1" className="text-sm font-medium cursor-pointer">
                            Less than 1 minute
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1-3min" id="duration-2" />
                          <label htmlFor="duration-2" className="text-sm font-medium cursor-pointer">
                            1-3 minutes
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value=">3min" id="duration-3" />
                          <label htmlFor="duration-3" className="text-sm font-medium cursor-pointer">
                            More than 3 minutes
                          </label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Date Filter */}
                    <div className="space-y-3 border-t pt-6">
                      <Label className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date
                      </Label>
                      <Input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 border-t pt-6">
                      <Button
                        onClick={clearAllFilters}
                        variant="outline"
                        className="w-full border-2 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Clear All Filters
                      </Button>
                      <Button
                        onClick={() => setFilterOpen(false)}
                        className="w-full cursor-pointer bg-gradient-to-r from-[#043927] to-emerald-700 hover:from-[#032d1f] hover:to-emerald-800 text-white font-bold"
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {(statusFilter.length > 0 || sentimentFilter.length > 0 || durationFilter || dateFilter) && (
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  className="border cursor-pointer text-black border-gray-500 font-bold transition-all"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              )}

              <Button
                onClick={downloadExcel}
                className=" text-black font-bold border border-gray-500 cursor-pointer bg-white"
              >
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
                <TableRow className="bg-gray-50">
                  <TableHead className="font-bold text-gray-900">Sl No.</TableHead>
                  <TableHead className="font-bold text-gray-900">Name</TableHead>
                  <TableHead className="font-bold text-gray-900 hidden md:table-cell">Phone No.</TableHead>
                  <TableHead className="font-bold text-gray-900 hidden lg:table-cell">Status</TableHead>
                  <TableHead className="font-bold text-gray-900 hidden sm:table-cell">Sentiment</TableHead>
                  <TableHead className="font-bold text-gray-900">Duration</TableHead>
                  <TableHead className="font-bold text-gray-900 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading && currentCalls.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Loading…
                    </TableCell>
                  </TableRow>
                )}

                {!loading && currentCalls.length > 0 && currentCalls.map((call) => (
                  <TableRow key={call.call_id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-semibold">{call.sl}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-semibold text-gray-900">{call.name}</div>
                        <div className="text-xs text-gray-500 md:hidden">{call.phoneNo}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-sm">{call.phoneNo}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusClass(
                          call.status
                        )}`}
                      >
                        {getStatusIcon(call.status)}
                        {call.status}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getSentimentClass(
                          call.sentiment
                        )}`}
                      >
                        {getSentimentIcon(call.sentiment)}
                        {call.sentiment}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm font-semibold">{call.duration_text}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => viewDetails(call)}
                        variant=""
                        size="sm"
                        className="text-black font-bold bg-transparent cursor-pointer"
                      >
                        {/* <Eye className="w-4 h-4 sm:mr-1" /> */}
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {!loading && currentCalls.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      <PhoneOff className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="font-medium">No calls found matching your filters</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredCalls.length > 0 && (
            <div className="border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-bold text-[#043927]">{startIndex + 1}</span> to{" "}
                  <span className="font-bold text-[#043927]">{Math.min(endIndex, filteredCalls.length)}</span> of{" "}
                  <span className="font-bold text-[#043927]">{filteredCalls.length}</span> results
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="border-2 border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  <div className="hidden sm:flex items-center gap-1">
                    {currentPage > 3 && (
                      <>
                        <Button
                          onClick={() => setCurrentPage(1)}
                          variant="outline"
                          size="sm"
                          className="w-10 h-10 border-2 border-gray-300 hover:bg-gray-100 font-bold"
                        >
                          1
                        </Button>
                        {currentPage > 4 && <span className="px-2 text-gray-500">...</span>}
                      </>
                    )}
                    {currentPage > 2 && (
                      <Button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        variant="outline"
                        size="sm"
                        className="w-10 h-10 border-2 border-gray-300 hover:bg-gray-100 font-bold"
                      >
                        {currentPage - 1}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-10 h-10 border-2 border-[#043927] bg-gradient-to-r from-[#043927] to-emerald-600 text-white font-bold shadow-lg"
                    >
                      {currentPage}
                    </Button>
                    {currentPage < totalPages - 1 && (
                      <Button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        variant="outline"
                        size="sm"
                        className="w-10 h-10 border-2 border-gray-300 hover:bg-gray-100 font-bold"
                      >
                        {currentPage + 1}
                      </Button>
                    )}
                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && <span className="px-2 text-gray-500">...</span>}
                        <Button
                          onClick={() => setCurrentPage(totalPages)}
                          variant="outline"
                          size="sm"
                          className="w-10 h-10 border-2 border-gray-300 hover:bg-gray-100 font-bold"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>

                  <div className="sm:hidden text-sm font-bold text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>

                  <Button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                    className="border-2 border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {modalOpen && modalContent && (
        <ViewCard modalContent={modalContent} setModalOpen={setModalOpen} />
      )}
    </div>
  );
};

export default CallHistory;
