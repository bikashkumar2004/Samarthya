import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { Fragment, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewContact,
  deleteContactList,
  editContactList,
  fetchAllContactList,
  uploadContactList,
} from "@/store/admin-slice";
import { toast } from "sonner";
import Admincard from "./Admincard";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CommonForm from "@/components/common/commonForm";
import { addContactFormElements } from "@/config";
import DetailDialog from "../../components/admin-view/DetailDialog"; 

const initialState = {
  name: "",
  email: "",
  phone: "",
  whatsappNo: "",
  status: "",
};

export default function LeadsAd() {
  const [formData, setfromdata] = useState(initialState);
  const [openCreateProductDialog, setopenCreateProductDialog] = useState(false);
  const [currentEditedId, setcurrentEditedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");


  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const dispatch = useDispatch();
  const { contactList } = useSelector((state) => state.contactList);

  // Add/Edit contact
  function onSubmit(event) {
    event.preventDefault();
    if (currentEditedId !== null) {
      dispatch(editContactList({ id: currentEditedId, formData })).then(
        (data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllContactList());
            setopenCreateProductDialog(false);
            setfromdata(initialState);
            toast("Contact edited successfully.");
          }
        }
      );
    } else {
      dispatch(addNewContact(formData)).then((data) => {
        if (data.payload?.success) {
          dispatch(fetchAllContactList());
          setopenCreateProductDialog(false);
          setfromdata(initialState);
          toast("Contact added successfully.");
        }
      });
    }
  }

  // Delete contact
  function handleDelete(contactId) {
    dispatch(deleteContactList(contactId)).then((data) => {
      if (data.payload?.success) {
        dispatch(fetchAllContactList());
        toast("Contact deleted successfully.");
      }
    });
  }

  // Import contacts
  async function handleImportContact(event) {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const result = await dispatch(uploadContactList(file));
      if (result?.payload?.success) {
        toast.success("Contacts imported successfully!");
        dispatch(fetchAllContactList());
      } else {
        toast.error(result?.payload?.message || "Failed to import contacts");
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Something went wrong while importing contacts.");
    } finally {
      event.target.value = null;
    }
  }

  const filteredContacts = contactList.filter((contact) => {
    const term = searchTerm.toLowerCase();
    return (
      contact.name?.toLowerCase().includes(term) ||
      contact.email?.toLowerCase().includes(term) ||
      contact.phone?.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    dispatch(fetchAllContactList());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="my-5 flex flex-col w-full px-4 sm:px-8 lg:px-10 bg-white border border-gray-200 rounded-md shadow-sm py-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h1 className="font-bold text-2xl sm:text-3xl">
            {contactList?.length || 0} Contacts
          </h1>
          <div className="flex gap-2 sm:gap-3 items-center">
            <div>
              <input
                type="file"
                accept=".xlsx, .xls"
                className="hidden"
                id="file-upload"
                onChange={handleImportContact}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer border border-gray-300 rounded-md bg-white text-black text-sm sm:text-lg font-semibold px-4 sm:px-5 py-2 shadow-sm hover:bg-gray-100 transition"
              >
                Import Contact
              </label>
            </div>

            <Button
              className="border border-gray-700 rounded-lg bg-black text-white text-sm sm:text-lg font-semibold px-4 sm:px-5 py-2 shadow-sm hover:bg-gray-800 transition"
              onClick={() => setopenCreateProductDialog(true)}
            >
              Create a Contact
            </Button>
          </div>
        </div>

        {/* Search Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name, email, phone number..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm w-full focus:ring-2 focus:ring-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="hidden sm:block border-t border-b border-gray-200 mt-3 bg-gray-100">
        <div className="grid grid-cols-5 px-6 sm:px-10 py-3 font-semibold text-gray-700 text-xs sm:text-sm uppercase tracking-wide">
          <span>Name</span>
          <span>Status</span>
          <span>Phone</span>
          <span>Email</span>
          <span className="text-right">Actions</span>
        </div>
      </div>

      {/* Contact List */}
      <div className="divide-y divide-gray-100">
        {filteredContacts && filteredContacts.length > 0 ? (
          filteredContacts.map((contactItem) => (
            <Admincard
              key={contactItem._id}
              setfromdata={setfromdata}
              //setopenCreateProductDialog={setopenCreateProductDialog}
              handleDelete={handleDelete}
              setcurrentEditedId={setcurrentEditedId}
              contact={contactItem}
              onShowDetails={(id) => {
                setSelectedId(id);
                setIsDetailOpen(true);
              }}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-white">
            <h2 className="text-2xl font-semibold mb-2">
              You don't have contacts in this list yet
            </h2>
            <p className="text-gray-600 mb-6 text-lg max-w-md">
              Add new contacts to this list and continue enriching your contact
              database.
            </p>
            <Button
              className="border border-gray-300 rounded-lg bg-white text-black text-lg font-semibold px-5 py-2 shadow-sm hover:bg-gray-100 transition"
              onClick={() => setopenCreateProductDialog(true)}
            >
              Create a new contact
            </Button>
          </div>
        )}
      </div>

      {/* Slide-out Sheet for Add/Edit */}
      <Sheet
        open={openCreateProductDialog}
        onOpenChange={() => {
          setopenCreateProductDialog(false);
          setcurrentEditedId(null);
          setfromdata(initialState);
        }}
      >
        <SheetContent
          side="right"
          className="w-[400px] bg-white text-[#043927] border-r p-6"
          overlayClassName="bg-transparent"
        >
          <SheetHeader className="pb-4 border-b">
            <SheetTitle>
              {currentEditedId !== null ? "Edit Details" : "Add New Contact"}
            </SheetTitle>
          </SheetHeader>

          <div className="px-5 py-6">
            <CommonForm
              formData={formData}
              setFormData={setfromdata}
              formControls={addContactFormElements}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              onSubmit={onSubmit}
            />
          </div>
        </SheetContent>
      </Sheet>


      <DetailDialog
        isOpen={isDetailOpen}
        setIsOpen={setIsDetailOpen}
        id={selectedId}
      />
    </Fragment>
  );
}
