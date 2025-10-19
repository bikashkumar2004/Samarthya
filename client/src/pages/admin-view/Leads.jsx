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
} from "@/store/admin-slice";
import { toast } from "sonner";
import Admincard from "./Admincard";

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

  const dispatch = useDispatch();
  const { contactList } = useSelector((state) => state.contactList);

  function onSubmit(event) {
    event.preventDefault();
    if (currentEditedId !== null) {
      dispatch(editContactList({ id: currentEditedId, formData })).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllContactList());
          setopenCreateProductDialog(false);
          setfromdata(initialState);
          toast("Contact edited successfully.");
        }
      });
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

  function handleDelete(contactId) {
    dispatch(deleteContactList(contactId)).then((data) => {
      if (data.payload?.success) {
        dispatch(fetchAllContactList());
        toast("Contact deleted successfully.");
      }
    });
  }

  useEffect(() => {
    dispatch(fetchAllContactList());
  }, [dispatch]);

  return (
    <Fragment>
      {/* Header Section */}
      <div className="my-5 flex flex-col w-full px-4 sm:px-8 lg:px-10 bg-white border border-gray-200 rounded-md shadow-sm py-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h1 className="font-bold text-2xl sm:text-3xl">
            {contactList?.length || 0} Contacts
          </h1>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button className="border border-gray-300 rounded-md bg-white text-black text-sm sm:text-lg font-semibold px-4 sm:px-5 py-2 shadow-sm hover:bg-gray-100 transition">
              Import Contact
            </Button>
            <Button className="border border-gray-700 rounded-lg bg-black text-white text-sm sm:text-lg font-semibold px-4 sm:px-5 py-2 shadow-sm hover:bg-gray-800 transition">
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
        {contactList && contactList.length > 0 ? (
          contactList.map((contactItem) => (
            <Admincard
              key={contactItem._id}
              setfromdata={setfromdata}
              setopenCreateProductDialog={setopenCreateProductDialog}
              setcurrentEditedId={setcurrentEditedId}
              handleDelete={handleDelete}
              contact={contactItem}
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
            <Button className="border border-gray-300 rounded-lg bg-white text-black text-lg font-semibold px-5 py-2 shadow-sm hover:bg-gray-100 transition">
              Create a new contact
            </Button>
          </div>
        )}
      </div>
    </Fragment>
  );
}
