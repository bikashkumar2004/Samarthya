// client/src/components/agent-view/contacts/DeleteContactDialog.jsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Trash2 } from "lucide-react";

const DeleteContactDialog = ({ open, onOpenChange, selectedContact, onConfirm }) => {
  if (!selectedContact) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            Confirm Delete
          </DialogTitle>
          <DialogDescription asChild>
            <div className="mt-4 space-y-4 text-gray-700">
              <p>
                Are you sure you want to delete the contact{" "}
                <strong className="text-gray-950">{selectedContact?.name}</strong>? This action cannot be undone.
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
                    <span className="text-sm text-red-700 font-semibold">Phone:</span>
                    <span className="text-sm font-bold text-gray-900">
                      {selectedContact?.phoneNo}
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
                  onClick={() => onOpenChange(false)}
                  variant="outline"
                  className="flex-1 border-2 font-bold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={onConfirm}
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
  );
};

export default DeleteContactDialog;
