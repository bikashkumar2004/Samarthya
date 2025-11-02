// src/pages/LeadManagement.jsx
import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Download,
  Search,
  Filter,
  X,
  MoreVertical,
  Edit,
  Trash2,
  Smile,
  Meh,
  Frown,
  Users,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { fetchAllLeads, selectLeadsData, selectLeadsError, selectLeadsLoading, setOrder, setPage, setPageSize } from "@/store/allLeads";

const LeadManagement = () => {
  // Redux
  const dispatch = useDispatch();
  const leads = useSelector(selectLeadsData);
  const isLoading = useSelector(selectLeadsLoading);
  const loadError = useSelector(selectLeadsError);

  // Local UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // Client-side pagination for table view (server returns a page already; we fetch a larger page to support local paging)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Filters (keep only sentiment and category since API doesn’t include source/lastContacted)
  const [sentimentFilter, setSentimentFilter] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);

  // Fetch first page of leads on mount; adjust as needed to match server paging
  useEffect(() => {
    dispatch(setPage(1));
    dispatch(setPageSize(200)); // grab a larger chunk to enable local pagination
    dispatch(setOrder("desc"));
    dispatch(fetchAllLeads({ page: 1, pageSize: 200, order: "desc" }));
  }, [dispatch]);

  // Derive categories from data
  const categories = useMemo(
    () => Array.from(new Set((leads || []).map((l) => l?.category).filter(Boolean))).sort(),
    [leads]
  );

  // Helpers
  const getSentimentClass = (sentiment) => {
    const classes = {
      Positive: "text-green-600 bg-green-100 border-green-300",
      Neutral: "text-yellow-600 bg-yellow-100 border-yellow-300",
      Negative: "text-red-600 bg-red-100 border-red-300",
    };
    return classes[sentiment] || "text-gray-600 bg-gray-100 border-gray-300";
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment === "Positive") return <Smile className="w-4 h-4" />;
    if (sentiment === "Neutral") return <Meh className="w-4 h-4" />;
    if (sentiment === "Negative") return <Frown className="w-4 h-4" />;
    return null;
  };

  const clearAllFilters = () => {
    setSentimentFilter([]);
    setCategoryFilter([]);
    setCurrentPage(1);
  };

  const handleSentimentChange = (sentiment) => {
    setSentimentFilter((prev) =>
      prev.includes(sentiment) ? prev.filter((s) => s !== sentiment) : [...prev, sentiment]
    );
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setEditDialogOpen(true);
  };

  const handleDelete = (lead) => {
    setSelectedLead(lead);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    toast.info("Delete API not implemented yet"); // placeholder
    setDeleteDialogOpen(false);
    setSelectedLead(null);
  };

  // Filtering against API fields: name, category, summary, sentiment, call_time
  const filteredLeads = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return (leads || []).filter((lead) => {
      const matchesSearch =
        !term ||
        String(lead?.name || "").toLowerCase().includes(term) ||
        String(lead?.category || "").toLowerCase().includes(term) ||
        String(lead?.summary || "").toLowerCase().includes(term);

      const matchesSentiment = sentimentFilter.length === 0 || sentimentFilter.includes(lead?.sentiment);
      const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(lead?.category);

      return matchesSearch && matchesSentiment && matchesCategory;
    });
  }, [leads, searchTerm, sentimentFilter, categoryFilter]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil((filteredLeads?.length || 0) / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLeads = filteredLeads.slice(startIndex, endIndex);

  // Stats
  const totalCount = leads?.length || 0;
  const positiveCount = (leads || []).filter((l) => l?.sentiment === "Positive").length;
  const neutralCount = (leads || []).filter((l) => l?.sentiment === "Neutral").length;
  const negativeCount = (leads || []).filter((l) => l?.sentiment === "Negative").length;

  const downloadExcel = () => {
    const exportRows = filteredLeads.map((l, idx) => ({
      "Sl No": idx + 1,
      Name: l?.name || "",
      Category: l?.category || "",
      Sentiment: l?.sentiment || "",
      "Call Time": l?.call_time || "",
      Summary: l?.summary || "",
    }));
    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");
    XLSX.writeFile(wb, "leads_data.xlsx");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#043927] via-emerald-700 to-green-600 p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
          <Users className="w-8 h-8 md:w-10 md:h-10" />
          Lead Management
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-700">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {isLoading ? "…" : totalCount}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-700">Positive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {isLoading ? "…" : positiveCount}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-yellow-700">Neutral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
              {isLoading ? "…" : neutralCount}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-rose-50 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-red-700">Negative</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              {isLoading ? "…" : negativeCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card className="border-2 border-gray-200 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-2xl font-bold text-[#043927] flex items-center gap-2">
              <Users className="w-6 h-6" />
              All Leads
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial ">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64 border border-[#8e8e94]"
                />
              </div>

              <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-2 border-[#043927] text-[#043927] hover:bg-[#043927] hover:text-white font-bold"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filter By
                    {(sentimentFilter.length > 0 || categoryFilter.length > 0) && (
                      <span className="ml-2 bg-[#043927] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {sentimentFilter.length + categoryFilter.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-96 overflow-y-auto bg-white">
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-bold text-[#043927]">Filter Options</SheetTitle>
                  </SheetHeader>

                  <div className="space-y-6 mt-6">
                    {/* Sentiment Filter */}
                    <div className="space-y-3">
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

                    {/* Category Filter */}
                    <div className="space-y-3 border-t pt-6">
                      <Label className="text-base font-bold text-gray-900">Category</Label>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category}`}
                              checked={categoryFilter.includes(category)}
                              onCheckedChange={() => handleCategoryChange(category)}
                            />
                            <label
                              htmlFor={`category-${category}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
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
                        className="w-full bg-gradient-to-r from-[#043927] to-emerald-700 hover:from-[#032d1f] hover:to-emerald-800 text-white font-bold"
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                onClick={clearAllFilters}
                variant="outline"
                className="border-2 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold transition-all"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>

              <Button
                onClick={downloadExcel}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold shadow-lg"
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
                <TableRow className="bg-gradient-to-r from-gray-100 to-gray-50">
                  <TableHead className="font-bold text-gray-900">Sl No.</TableHead>
                  <TableHead className="font-bold text-gray-900">Name</TableHead>
                  <TableHead className="font-bold text-gray-900 hidden lg:table-cell">Category</TableHead>
                  <TableHead className="font-bold text-gray-900">Call Summary</TableHead>
                  <TableHead className="font-bold text-gray-900 hidden sm:table-cell">Sentiment</TableHead>
                  <TableHead className="font-bold text-gray-900 hidden md:table-cell">Call Time</TableHead>
                  <TableHead className="font-bold text-gray-900 text-center">Action</TableHead>
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
                ) : currentLeads.length > 0 ? (
                  currentLeads.map((lead, index) => {
                    const callTimeStr =
                      lead?.call_time
                        ? new Date(lead.call_time).toLocaleString("en-IN", { hour12: true })
                        : "-";
                    return (
                      <TableRow
                        key={`${lead?.customer_id || "na"}-${lead?.call_time || index}`}
                        className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-colors"
                      >
                        <TableCell className="font-semibold">{startIndex + index + 1}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-semibold text-gray-900">{lead?.name || "-"}</div>
                            <div className="text-xs text-gray-500 lg:hidden">{lead?.category || "-"}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border border-purple-300">
                            {lead?.category || "-"}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate text-gray-700">{lead?.summary || "-"}</div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getSentimentClass(
                              lead?.sentiment
                            )}`}
                          >
                            {getSentimentIcon(lead?.sentiment)}
                            {lead?.sentiment || "-"}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell font-mono text-sm text-gray-700">
                          {callTimeStr}
                        </TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem
                                onClick={() => handleEdit(lead)}
                                className="cursor-pointer hover:bg-blue-50"
                              >
                                <Edit className="w-4 h-4 mr-2 text-blue-600" />
                                <span className="font-semibold">Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(lead)}
                                className="cursor-pointer hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                                <span className="font-semibold">Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="font-medium">No leads found matching your filters</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {filteredLeads.length > 0 && (
            <div className="border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-bold text-[#043927]">{startIndex + 1}</span> to{" "}
                  <span className="font-bold text-[#043927]">{Math.min(endIndex, filteredLeads.length)}</span> of{" "}
                  <span className="font-bold text-[#043927]">{filteredLeads.length}</span> results
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
                    {currentPage > 2 && (
                      <>
                        <Button
                          onClick={() => setCurrentPage(1)}
                          variant="outline"
                          size="sm"
                          className="w-10 h-10 border-2 border-gray-300 hover:bg-gray-100 font-bold"
                        >
                          1
                        </Button>
                        {currentPage > 3 && <span className="px-2 text-gray-500">...</span>}
                      </>
                    )}

                    {currentPage > 1 && (
                      <Button
                        onClick={() => setCurrentPage((p) => p - 1)}
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

                    {currentPage < totalPages && (
                      <Button
                        onClick={() => setCurrentPage((p) => p + 1)}
                        variant="outline"
                        size="sm"
                        className="w-10 h-10 border-2 border-gray-300 hover:bg-gray-100 font-bold"
                      >
                        {currentPage + 1}
                      </Button>
                    )}

                    {currentPage < totalPages - 1 && (
                      <>
                        {currentPage < totalPages - 2 && <span className="px-2 text-gray-500">...</span>}
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#043927] flex items-center gap-2">
              <Edit className="w-6 h-6" />
              Edit Lead - {selectedLead?.name}
            </DialogTitle>
            <DialogDescription>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input defaultValue={selectedLead?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input defaultValue={selectedLead?.category} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Call Summary</Label>
                  <Input defaultValue={selectedLead?.summary} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sentiment</Label>
                    <Input defaultValue={selectedLead?.sentiment} />
                  </div>
                  <div className="space-y-2">
                    <Label>Call Time</Label>
                    <Input defaultValue={selectedLead?.call_time} />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button onClick={() => setEditDialogOpen(false)} variant="outline" className="flex-1 border-2 font-bold">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      toast.success("Lead updated successfully");
                      setEditDialogOpen(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-[#043927] to-emerald-700 text-white font-bold"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              <div className="mt-4 space-y-4">
                <p className="text-gray-700">
                  Are you sure you want to delete the lead <strong>{selectedLead?.name}</strong>? This action cannot be
                  undone.
                </p>
                <div className="bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-xl border-2 border-red-200">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-red-700 font-semibold">Name:</span>
                      <span className="text-sm font-bold text-gray-900">{selectedLead?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-red-700 font-semibold">Category:</span>
                      <span className="text-sm font-bold text-gray-900">{selectedLead?.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button onClick={() => setDeleteDialogOpen(false)} variant="outline" className="flex-1 border-2 font-bold">
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmDelete}
                    className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Lead
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadManagement;
