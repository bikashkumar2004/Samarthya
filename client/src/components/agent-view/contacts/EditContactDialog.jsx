// client/src/components/agent-view/contacts/EditContactDialog.jsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";

const EditContactDialog = ({ open, onOpenChange, selectedContact, onSave }) => {
  if (!selectedContact) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#043927] flex items-center gap-2">
            <Edit className="w-6 h-6" />
            Edit Contact {selectedContact?.name ? `- ${selectedContact.name}` : ""}
          </DialogTitle>
          <DialogDescription asChild>
            <form
              className="mt-4 space-y-4 text-gray-900"
              onSubmit={(e) => {
                e.preventDefault();
                const form = new FormData(e.currentTarget);
                onSave(form);
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" defaultValue={selectedContact?.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" defaultValue={selectedContact?.category} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNo">Phone Number</Label>
                  <Input id="phoneNo" name="phoneNo" defaultValue={selectedContact?.phoneNo} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" defaultValue={selectedContact?.email} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Issue / Description</Label>
                <Input id="description" name="description" defaultValue={selectedContact?.description} />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  variant="outline"
                  className="flex-1 border-2 font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#043927] to-emerald-700 text-white font-bold hover:from-[#032d1f] hover:to-emerald-800"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditContactDialog;
