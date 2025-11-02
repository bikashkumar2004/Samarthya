import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Download, Search, Filter, X, MoreVertical, Edit, Trash2, Users,
  ChevronLeft, ChevronRight, AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { fetchAllContacts, selectContacts, selectContactsError, selectContactsLoading } from "@/store/agent-slice/allConcats";
import { clearMessages, deleteContactList, editContactList } from "@/store/agent-slice";
// import DetailDialog from "@/components/agent-view/DetailDialog";

const ContactManagement = () => {
  const dispatch = useDispatch();

  // Redux state
  const contacts = useSelector(selectContacts);
  const isLoading = useSelector(selectContactsLoading);
  const error = useSelector(selectContactsError);

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Filters
  const [categoryFilter, setCategoryFilter] = useState([]);

  // Load data on mount
  useEffect(() => {
    dispatch(fetchAllContacts());
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  // Compute unique categories from server data
  const categories = useMemo(
    () => Array.from(new Set((contacts || []).map((c) => c?.category).filter(Boolean))),
    [contacts]
  );

  // Filtered list
  const filteredContact = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return (contacts || []).filter((c) => {
      const name = (c?.name || "").toLowerCase();
      const category = (c?.category || "").toLowerCase();
      const matchesSearch = term === "" || name.includes(term) || category.includes(term);
      const matchesCategory =
        categoryFilter.length === 0 || categoryFilter.includes(c?.category || "");
      return matchesSearch && matchesCategory;
    });
  }, [contacts, searchTerm, categoryFilter]);

  // Pagination window
  const totalPages = Math.max(1, Math.ceil(filteredContact.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContact = filteredContact.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  const clearAllFilters = () => {
    setCategoryFilter([]);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleEdit = (contact) => {
    setSelectedContact(contact);
    setEditDialogOpen(true);
  };

  const handleDelete = (contact) => {
    setSelectedContact(contact);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (!selectedContact?._id) return;
      await dispatch(deleteContactList(selectedContact._id)).unwrap();
      toast.success(`Contact "${selectedContact.name}" deleted successfully`);
    } catch (e) {
      toast.error(typeof e === "string" ? e : "Failed to delete contact");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedContact(null);
    }
  };

  const saveEdit = async (form) => {
    try {
      if (!selectedContact?._id) return;
      // Minimal form read; adapt as needed
      const payload = {
        name: form.get("name"),
        category: form.get("category"),
        description: form.get("description"),
        phoneNo: form.get("phoneNo"),
        purpose: form.get("purpose") || "General", // if required by API
      };
      await dispatch(
        editContactList({ id: selectedContact._id, formData: payload })
      ).unwrap();
      toast.success("Contact updated successfully");
      setEditDialogOpen(false);
      setSelectedContact(null);
    } catch (e) {
      toast.error(typeof e === "string" ? e : "Failed to update contact");
    }
  };

  const downloadExcel = () => {
    // Map to a flat export structure
    const exportRows = filteredContact.map((c, idx) => ({
      "Sl No": idx + 1,
      Name: c?.name || "",
      Category: c?.category || "",
      Description: c?.description || "",
      "Phone Number": c?.phoneNo || "",
      Email: c?.email || "",
    }));
    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contacts");
    XLSX.writeFile(wb, "contacts_data.xlsx");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#043927] via-emerald-700 to-green-600 p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
          <Users className="w-8 h-8 md:w-10 md:h-10" />
          My Contacts
        </h1>
      </div>

      {/* Status / Error */}
      {isLoading && (
        <div className="rounded-md border p-3 text-sm text-gray-700 bg-yellow-50">
          Loading contacts…
        </div>
      )}
      {error && (
        <div className="rounded-md border p-3 text-sm text-red-700 bg-red-50">
          {typeof error === "string" ? error : "Failed to load contacts"}
        </div>
      )}

      {/* Contacts Table */}
      <Card className="border-2 border-gray-200 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-2xl font-bold text-[#043927] flex items-center gap-2">
              <Users className="w-6 h-6" />
              All Contacts
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>

              <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="border-[#808085] text-black font-bold">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter By
                    {categoryFilter.length > 0 && (
                      <span className="ml-2 bg-[#043927] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {categoryFilter.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-96 overflow-y-auto bg-white">
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-bold text-[#043927]">
                      Filter Options
                    </SheetTitle>
                  </SheetHeader>

                  <div className="space-y-6 mt-6">
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
                        className="w-full bg-gradient-to-r from-[#043927] to-emerald-700 hover:from-[#032d1f] hover:to-emerald-800 text-white font-bold"
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Clear Filter Button */}
              {categoryFilter.length > 0 && (
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  className="border-2 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold transition-all"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              )}

              <Button
                onClick={downloadExcel}
                className="text-black bg-transparent border font-bold shadow-lg"
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
                  <TableHead className="font-bold text-[#8f8e94]">Sl No.</TableHead>
                  <TableHead className="font-bold text-[#8f8e94]">Name</TableHead>
                  <TableHead className="font-bold text-[#8f8e94] hidden lg:table-cell">
                    Category
                  </TableHead>
                  <TableHead className="font-bold text-[#8f8e94]">Description</TableHead>
                  <TableHead className="font-bold text-[#8f8e94] hidden sm:table-cell">
                    Phone Number
                  </TableHead>
                  <TableHead className="font-bold text-[#8f8e94] hidden md:table-cell">
                    Email
                  </TableHead>
                  <TableHead className="font-bold text-[#8f8e94] text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentContact.length > 0 ? (
                  currentContact.map((contact, index) => (
                    <TableRow key={contact._id} className="hover:bg-[#f7f7f8] transition-colors">
                      <TableCell className="font-semibold">{startIndex + index + 1}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold text-gray-900">{contact.name}</div>
                          <div className="text-xs text-gray-500 lg:hidden">{contact.category}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="inline-flex py-1 rounded-full text-sm font-semibold ">
                          {contact.category}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate text-gray-700">{contact.description}</div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold">
                          {contact.phoneNo}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-s text-gray-700">
                        {contact.email}
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 bg-white">
                            <DropdownMenuItem
                              onClick={() => handleEdit(contact)}
                              className="cursor-pointer hover:bg-blue-50 "
                            >
                              <Edit className="w-4 h-4 mr-2 text-blue-600" />
                              <span className="font-semibold">Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(contact)}
                              className="cursor-pointer hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                              <span className="font-semibold">Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="font-medium">No contacts found matching your filters</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {filteredContact.length > 0 && (
            <div className="border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-bold text-[#043927]">{startIndex + 1}</span> to{" "}
                  <span className="font-bold text-[#043927]">
                    {Math.min(endIndex, filteredContact.length)}
                  </span>{" "}
                  of <span className="font-bold text-[#043927]">{filteredContact.length}</span> results
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setCurrentPage(currentPage - 1)}
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
                      className="w-10 h-10 border-2 border-[#043927] text-black font-bold shadow-lg"
                    >
                      {currentPage}
                    </Button>

                    {currentPage < totalPages && (
                      <Button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        variant="outline"
                        size="sm"
                        className="w-10 h-10 border-2 border-gray-300 hover:bg-gray-100 font-bold"
                      >
                        {currentPage + 1}
                      </Button>
                    )}

                    {currentPage < totalPages - 1 && (
                      <>
                        {currentPage < totalPages - 2 && (
                          <span className="px-2 text-gray-500">...</span>
                        )}
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
                    onClick={() => setCurrentPage(currentPage + 1)}
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
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#043927] flex items-center gap-2">
              <Edit className="w-6 h-6" />
              Edit Contact {selectedContact?.name ? `- ${selectedContact.name}` : ""}
            </DialogTitle>
            <DialogDescription>
              <form
                className="mt-4 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = new FormData(e.currentTarget);
                  saveEdit(form);
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input name="name" defaultValue={selectedContact?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input name="category" defaultValue={selectedContact?.category} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input name="description" defaultValue={selectedContact?.description} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNo">Phone Number</Label>
                    <Input name="phoneNo" defaultValue={selectedContact?.phoneNo} />
                  </div>
                </div>
                {/* Only if your API requires a purpose field */}
                <input type="hidden" name="purpose" defaultValue="General" />
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => setEditDialogOpen(false)}
                    variant="outline"
                    className="flex-1 border-2 font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#043927] to-emerald-700 text-white font-bold"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              <div className="mt-4 space-y-4">
                <p className="text-gray-700">
                  Are you sure you want to delete the contact{" "}
                  <strong>{selectedContact?.name}</strong>? This action cannot be undone.
                </p>
                <div className="bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-xl border-2 border-red-200">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-red-700 font-semibold">Name:</span>
                      <span className="text-sm font-bold text-gray-900">
                        {selectedContact?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-red-700 font-semibold">Category:</span>
                      <span className="text-sm font-bold text-gray-900">
                        {selectedContact?.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setDeleteDialogOpen(false)}
                    variant="outline"
                    className="flex-1 border-2 font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmDelete}
                    className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Contact
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* <DetailDialog/> */}
    </div>
  );
};

export default ContactManagement;
