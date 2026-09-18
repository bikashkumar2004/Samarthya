import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, Users, X } from "lucide-react";
import { toast } from "sonner";

import {
  fetchAllContacts,
  selectContacts,
  selectContactsError,
  selectContactsLoading,
  clearMessages,
  editContact,
  deleteContact,
} from "@/store/agent-slice/allConcats";

// Modular Subcomponents
import ContactTable from "@/components/agent-view/contacts/ContactTable";
import ContactFilterSheet from "@/components/agent-view/contacts/ContactFilterSheet";
import ContactPagination from "@/components/agent-view/contacts/ContactPagination";
import EditContactDialog from "@/components/agent-view/contacts/EditContactDialog";
import DeleteContactDialog from "@/components/agent-view/contacts/DeleteContactDialog";

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

  // Pagination & Filtering
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [categoryFilter, setCategoryFilter] = useState([]);

  // Load data on mount
  useEffect(() => {
    dispatch(fetchAllContacts());
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  // Compute unique categories from contact records
  const categories = useMemo(
    () => Array.from(new Set((contacts || []).map((c) => c?.category).filter(Boolean))),
    [contacts]
  );

  // Filtered contacts list
  const filteredContact = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return (contacts || []).filter((c) => {
      const name = (c?.name || "").toLowerCase();
      const category = (c?.category || "").toLowerCase();
      const phone = (c?.phoneNo || "").toLowerCase();
      const email = (c?.email || "").toLowerCase();

      const matchesSearch =
        term === "" ||
        name.includes(term) ||
        category.includes(term) ||
        phone.includes(term) ||
        email.includes(term);

      const matchesCategory =
        categoryFilter.length === 0 || categoryFilter.includes(c?.category || "");

      return matchesSearch && matchesCategory;
    });
  }, [contacts, searchTerm, categoryFilter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredContact.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContact = filteredContact.slice(startIndex, endIndex);

  // Reset to first page when search or category filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  const clearAllFilters = () => {
    setCategoryFilter([]);
    setSearchTerm("");
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
      await dispatch(deleteContact(selectedContact._id)).unwrap();
      toast.success(`Contact "${selectedContact.name}" deleted successfully`);
      setDeleteDialogOpen(false);
      setSelectedContact(null);
      dispatch(fetchAllContacts());
    } catch (e) {
      toast.error(typeof e === "string" ? e : (e?.message || "Failed to delete contact"));
    }
  };

  const saveEdit = async (form) => {
    try {
      if (!selectedContact?._id) return;
      const payload = {
        name: form.get("name")?.trim(),
        category: form.get("category")?.trim(),
        description: form.get("description")?.trim(),
        phoneNo: form.get("phoneNo")?.trim(),
        email: form.get("email")?.trim(),
      };
      await dispatch(
        editContact({ id: selectedContact._id, formData: payload })
      ).unwrap();
      toast.success("Contact updated successfully");
      setEditDialogOpen(false);
      setSelectedContact(null);
      dispatch(fetchAllContacts());
    } catch (e) {
      toast.error(typeof e === "string" ? e : (e?.message || "Failed to update contact"));
    }
  };

  const downloadExcel = () => {
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
      {/* Page Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-black flex items-center gap-3">
          <Users className="w-8 h-8 md:w-10 md:h-10" />
          My Contacts
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Manage, search, edit, and export customer contacts
        </p>
      </div>

      {/* Loading / Error States */}
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

      {/* Main Table Card */}
      <Card className="border-2 border-gray-200 shadow-xl overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>

              {/* Category Filter Drawer */}
              <ContactFilterSheet
                open={filterOpen}
                onOpenChange={setFilterOpen}
                categories={categories}
                categoryFilter={categoryFilter}
                onCategoryChange={handleCategoryChange}
                onClearAll={clearAllFilters}
              />

              {/* Active Filter Clear Tag */}
              {(categoryFilter.length > 0 || searchTerm) && (
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  size="sm"
                  className="border-2 border-red-400 text-red-600 hover:bg-red-50 font-bold"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reset
                </Button>
              )}
            </div>

            {/* Export Button */}
            <Button
              onClick={downloadExcel}
              variant="outline"
              className="text-black border-gray-300 font-bold shadow-sm hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Modular Table */}
          <ContactTable
            contacts={currentContact}
            startIndex={startIndex}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Modular Pagination */}
          <ContactPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={filteredContact.length}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog Subcomponent */}
      <EditContactDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        selectedContact={selectedContact}
        onSave={saveEdit}
      />

      {/* Delete Dialog Subcomponent */}
      <DeleteContactDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        selectedContact={selectedContact}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ContactManagement;
