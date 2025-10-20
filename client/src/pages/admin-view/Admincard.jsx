import DetailDialog from "@/components/admin/DetailDialog";
import { EllipsisVertical } from "lucide-react";
import React, { useState } from "react";

export default function Admincard({
  contact,
  setfromdata,
  setopenCreateProductDialog,
  setcurrentEditedId,
  handleDelete,
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-0 px-6 sm:px-10 py-4 items-start sm:items-center border-b border-gray-200 bg-white hover:bg-gray-50 transition relative">
      
      {isOpen && (
        <DetailDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
      {/* Name */}
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900 sm:hidden">Name:</span>
        <span onClick={() => setIsOpen(true)} className="text-gray-800 font-medium cursor-pointer hover:underline">
          {contact?.name || "-"}
        </span>
      </div>
      

      {/* Status */}
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900 sm:hidden">Status:</span>
        <span
          className={`text-sm font-semibold px-3 py-1 rounded-full w-fit
            ${
              contact?.status === "New"
                ? "bg-blue-100 text-blue-700"
                : contact?.status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : contact?.status === "Rejected"
                ? "bg-red-100 text-red-700"
                : contact?.status === "Assigned"
                ? "bg-purple-100 text-purple-700"
                : contact?.status === "Imported"
                ? "bg-gray-200 text-gray-800"
                : contact?.status === "Contacted"
                ? "bg-green-100 text-green-700"
                : contact?.status === "Interested"
                ? "bg-emerald-100 text-emerald-700"
                : contact?.status === "No Replay"
                ? "bg-orange-100 text-orange-700"
                : contact?.status === "Engaging"
                ? "bg-teal-100 text-teal-700"
                : "bg-gray-100 text-gray-600"
            }`}
        >
          {contact?.status || "N/A"}
        </span>
      </div>

      {/* Phone */}
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900 sm:hidden">Phone:</span>
        <span className="text-gray-700">{contact?.phone || "-"}</span>
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900 sm:hidden">Email:</span>
        <span className="text-gray-700 break-all">{contact?.email || "-"}</span>
      </div>

      {/* Actions */}
      <div className="flex justify-end sm:justify-end items-center relative">
        <EllipsisVertical
          className="text-gray-500 cursor-pointer hover:text-gray-700 transition"
          onClick={() => setOpenMenu(!openMenu)}
        />

        {/* Dropdown menu */}
        {openMenu && (
          <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-md shadow-md z-10 w-36">
            <button
              onClick={() => {
                setfromdata(contact);
                setcurrentEditedId(contact._id);
                setopenCreateProductDialog(true);
                setOpenMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
            >
              Edit
            </button>
            <button
              onClick={() => {
                handleDelete(contact._id);
                setOpenMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
