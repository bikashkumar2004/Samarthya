import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { deleteTask } from "@/store/create-task/createTask";
import { toast } from "sonner";

const DeleteTaskDialog = ({ open, onOpenChange, selectedTask, onDeleted }) => {
  const dispatch = useDispatch();

  if (!selectedTask) return null;

  const handleDelete = async () => {
    try {
      await dispatch(deleteTask(selectedTask._id)).unwrap();
      toast.success(`Task ${selectedTask.taskID} deleted successfully`);
      onOpenChange(false);
      onDeleted?.();
    } catch (error) {
      toast.error(error?.message || "Failed to delete task");
    }
  };

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
              <p>Are you sure you want to delete this task? All associated contacts and calls will be removed.</p>

              <div className="bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-xl border-2 border-red-200">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-red-700 font-semibold mb-1">Task ID</div>
                    <div className="font-bold text-gray-900">{selectedTask.taskID}</div>
                  </div>

                  <div>
                    <div className="text-xs text-red-700 font-semibold mb-1">Rows</div>
                    <div className="font-bold text-gray-900">{selectedTask.rowsNo}</div>
                  </div>

                  <div className="col-span-2">
                    <div className="text-xs text-red-700 font-semibold mb-1">File Name</div>
                    <div className="font-bold text-gray-900 truncate">{selectedTask.fileName}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  variant="outline"
                  className="flex-1 border-2 border-gray-300 font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Task
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTaskDialog;
