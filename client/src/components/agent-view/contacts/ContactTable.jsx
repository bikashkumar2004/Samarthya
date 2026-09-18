import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2, Users } from "lucide-react";

const ContactTable = ({ contacts = [], startIndex = 0, onEdit, onDelete }) => {
  return (
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
          {contacts.length > 0 ? (
            contacts.map((contact, index) => (
              <TableRow key={contact._id || index} className="hover:bg-[#f7f7f8] transition-colors">
                <TableCell className="font-semibold">{startIndex + index + 1}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-semibold text-gray-900">{contact.name}</div>
                    <div className="text-xs text-gray-500 lg:hidden">{contact.category}</div>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {contact.category || "Uncategorized"}
                  </span>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate text-gray-700" title={contact.description}>
                    {contact.description || "-"}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className="inline-flex items-center font-mono text-xs font-semibold text-gray-800">
                    {contact.phoneNo || "-"}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-gray-700">
                  {contact.email || "-"}
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-white shadow-lg border border-gray-100">
                      <DropdownMenuItem
                        onClick={() => onEdit(contact)}
                        className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50"
                      >
                        <Edit className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="font-semibold text-gray-800">Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(contact)}
                        className="cursor-pointer hover:bg-red-50 focus:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                        <span className="font-semibold text-red-600">Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="font-semibold text-base text-gray-700">No contacts found</p>
                <p className="text-xs text-gray-400 mt-1">Try adjusting your search or category filters</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContactTable;
