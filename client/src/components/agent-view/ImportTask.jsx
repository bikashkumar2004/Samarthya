// src/pages/agent-view/create-task/ImportTask.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileSpreadsheet,
  FileText,
  Upload,
  Trash2,
  Eye,
  Download,
  Info,
} from "lucide-react";


import {
  deleteTask,
  fetchAllDetails,
  uploadDetails,
} from "@/store/create-task/createTask";
import ViewTaskDialog from "@/pages/agent-view/create-task/ViewTaskDialog";
import DeleteTaskDialog from "@/pages/agent-view/create-task/DeleteTaskDialog";

const ImportTask = () => {
  const dispatch = useDispatch();
  const { allTasks = [], isLoading = false } = useSelector((state) => state.upload);

  const [deleteTaskId, setDeleteTaskId] = useState("");
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Sample format UI only
  const sampleFormat = [
    { header: "Sl No.", example: "1" },
    { header: "Name", example: "John Doe" },
    { header: "Category", example: "Document Verification" },
    { header: "Issue Description", example: "Certificate issue" },
    { header: "Status", example: "Open" },
    { header: "Time Elapsed", example: "2h 30m" },
  ];

  useEffect(() => {
    dispatch(fetchAllDetails());
  }, [dispatch]);

  async function handleFileImport(event, type) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      await dispatch(uploadDetails(formData)).unwrap();
      toast.success("✅ File uploaded successfully!");
      await dispatch(fetchAllDetails());
    } catch (err) {
      toast.error(err?.message || "❌ Upload failed!");
    } finally {
      // reset input
      if (event.target) event.target.value = null;
    }
  }

  // invoked when delete confirmed inside dialog
  const handleDeleteTask = async (task) => {
    if (!task?._id) return;
    try {
      await dispatch(deleteTask(task._id)).unwrap();
      toast.success(`🗑 Task ${task.taskID} deleted successfully!`);
      setShowDeleteConfirmation(false);
      setTaskToDelete(null);
      setDeleteTaskId("");
      await dispatch(fetchAllDetails());
    } catch (err) {
      toast.error(err?.message || "❌ Failed to delete task");
    }
  };

  const handleCheckTaskId = () => {
    if (!deleteTaskId.trim()) {
      toast.error("Please enter a Task ID");
      return;
    }
    const foundTask = allTasks.find((t) => t.taskID === deleteTaskId.trim());
    if (foundTask) {
      setTaskToDelete(foundTask);
      setShowDeleteConfirmation(true);
      toast.success("✅ Task found!");
    } else {
      toast.error("❌ Task ID not found");
    }
  };

  const handleViewData = (task) => {
    setSelectedTask(task);
    setViewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Import Section */}
      <Card className="border-2 border-gray-200 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 border-b-2 border-blue-200">
          <CardTitle className="text-2xl font-bold text-[#043927] flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl shadow-lg">
              <Upload className="w-6 h-6 text-white" />
            </div>
            Import New Task
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="group cursor-pointer">
              <div className="relative border-3 border-dashed border-gray-300 rounded-2xl p-8 hover:border-emerald-500 transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50 group-hover:from-green-100 group-hover:to-emerald-100 group-hover:shadow-xl">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => handleFileImport(e, "excel")}
                  className="hidden"
                />
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <FileSpreadsheet className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">Upload Excel File</p>
                    <p className="text-sm text-gray-600 mt-1">Click to browse or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-2">Supports .xlsx, .xls formats</p>
                  </div>
                </div>
              </div>
            </label>

            <label className="group cursor-pointer">
              <div className="relative border-3 border-dashed border-gray-300 rounded-2xl p-8 hover:border-blue-500 transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50 group-hover:from-blue-100 group-hover:to-cyan-100 group-hover:shadow-xl">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileImport(e, "csv")}
                  className="hidden"
                />
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">Upload CSV File</p>
                    <p className="text-sm text-gray-600 mt-1">Click to browse or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-2">Supports .csv format</p>
                  </div>
                </div>
              </div>
            </label>
          </div>

          {/* Format Guide */}
          <Card className="mt-6 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-amber-900 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Required File Format
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-amber-100 to-yellow-100">
                      {sampleFormat.map((item, index) => (
                        <TableHead
                          key={index}
                          className="font-bold text-amber-900 border-r border-amber-200 last:border-r-0"
                        >
                          {item.header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      {sampleFormat.map((item, index) => (
                        <TableCell
                          key={index}
                          className="font-mono text-sm text-gray-700 border-r border-gray-200 last:border-r-0"
                        >
                          {item.example}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Delete Task Section */}
      <Card className="border-2 border-gray-200 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-50 via-rose-50 to-red-50 border-b-2 border-red-200">
          <CardTitle className="text-2xl font-bold text-[#043927] flex items-center gap-3">
            <div className="bg-gradient-to-br from-red-500 to-rose-600 p-3 rounded-xl shadow-lg">
              <Trash2 className="w-6 h-6 text-white" />
            </div>
            Delete Task
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              placeholder="Enter Task ID (e.g., TSK001)"
              value={deleteTaskId}
              onChange={(e) => setDeleteTaskId(e.target.value)}
              className="flex-1 border-2 border-gray-300 focus:border-red-500 h-12 text-base"
            />
            <Button
              onClick={handleCheckTaskId}
              className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold shadow-lg h-12 px-8"
            >
              Check Task
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Imports Table */}
      <Card className="border-2 border-gray-200 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-2xl font-bold text-[#043927] flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Download className="w-6 h-6 text-white" />
              </div>
              Recent Imports
            </CardTitle>
            <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full font-semibold">
              Total: {allTasks?.length ?? 0} imports
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-100 to-gray-50">
                  <TableHead>Task ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead className="hidden md:table-cell">File Name</TableHead>
                  <TableHead>Rows</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : allTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      No imports yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  allTasks.map((task, idx) => (
                    <TableRow
                      key={task._id || idx}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-colors"
                    >
                      <TableCell className="font-bold text-[#043927]">{task.taskID}</TableCell>
                      <TableCell className="font-mono text-sm">{task.dateTime}</TableCell>
                      <TableCell className="hidden md:table-cell text-gray-700">{task.fileName}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border border-purple-300">
                          {task.rowsNo} rows
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => handleViewData(task)}
                            variant="outline"
                            size="sm"
                            className="border-2 border-[#043927] text-[#043927] hover:bg-[#043927] hover:text-white font-bold"
                          >
                            <Eye className="w-4 h-4 sm:mr-1" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                          <Button
                            onClick={() => {
                              setTaskToDelete(task);
                              setShowDeleteConfirmation(true);
                            }}
                            variant="outline"
                            size="sm"
                            className="border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white font-bold"
                          >
                            <Trash2 className="w-4 h-4 sm:mr-1" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ViewTaskDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        selectedTask={selectedTask}
      />

      <DeleteTaskDialog
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
        selectedTask={taskToDelete}
        onDeleted={() => {
          dispatch(fetchAllDetails());
          setTaskToDelete(null);
          setDeleteTaskId("");
        }}
      />
    </div>
  );
};

export default ImportTask;
