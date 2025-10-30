// frontend/src/components/admin/ViewTaskDialog.jsx
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleTask } from "@/store/create-task/createTask";

const ViewTaskDialog = ({ open, onOpenChange, selectedTask }) => {
  const dispatch = useDispatch();
  const { taskDetails, isLoading } = useSelector((state) => state.upload);

  useEffect(() => {
    if (open && selectedTask?._id) {
      dispatch(fetchSingleTask(selectedTask._id));
    }
  }, [open, selectedTask, dispatch]);

  const taskInfo = taskDetails || selectedTask;
  const rows = taskDetails?.uploads ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#043927] flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-2 rounded-lg">
              <Eye className="w-5 h-5 text-white" />
            </div>
            Task Details
          </DialogTitle>

          <div className="mt-3 text-gray-700 text-sm bg-gray-50 p-3 rounded-lg border">
            <p><strong>Task ID:</strong> {taskInfo?.taskId || "N/A"}</p>
            <p><strong>File Name:</strong> {taskInfo?.fileName || "N/A"}</p>
            <p><strong>Total Rows:</strong> {taskInfo?.rowsNo || "0"}</p>
            <p><strong>Created At:</strong> {new Date(taskInfo?.createdAt).toLocaleString() || "N/A"}</p>
          </div>
        </DialogHeader>

        <div className="mt-6">
          <div className="overflow-x-auto bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200">
            {isLoading ? (
              <div className="p-6 text-center text-gray-500">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-100 to-gray-50">
                    <TableHead className="font-bold text-gray-900">Sl No.</TableHead>
                    <TableHead className="font-bold text-gray-900">Name</TableHead>
                    <TableHead className="font-bold text-gray-900">Category</TableHead>
                    <TableHead className="font-bold text-gray-900">Description</TableHead>
                    <TableHead className="font-bold text-gray-900">Phone</TableHead>
                    <TableHead className="font-bold text-gray-900">Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length > 0 ? (
                    rows.map((row, index) => (
                      <TableRow key={index} className="hover:bg-blue-50">
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell>{row.phoneNo}</TableCell>
                        <TableCell>{row.email}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="6" className="text-center py-6 text-gray-500">
                        No records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTaskDialog;
