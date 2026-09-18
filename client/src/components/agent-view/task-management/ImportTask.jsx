import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fetchAllDetails,
  uploadDetails,
} from "@/store/create-task/createTask";
import ImportDropzone from "./ImportDropzone";
import FormatGuideCard from "./FormatGuideCard";
import RecentImportsTable from "./RecentImportsTable";
import ViewTaskDialog from "./ViewTaskDialog";
import DeleteTaskDialog from "./DeleteTaskDialog";

const ImportTask = () => {
  const dispatch = useDispatch();
  const { allTasks = [], isLoading = false } = useSelector((state) => state.upload);

  const [selectedTaskToDelete, setSelectedTaskToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTaskToView, setSelectedTaskToView] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchAllDetails());
  }, [dispatch]);

  const handleFileImport = async (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      await dispatch(uploadDetails(formData)).unwrap();
      toast.success("File uploaded and tasks imported successfully!");
      dispatch(fetchAllDetails());
    } catch (err) {
      toast.error(err?.message || "Upload failed. Please check file format.");
    } finally {
      if (event.target) event.target.value = null;
    }
  };

  const handleOpenView = (task) => {
    setSelectedTaskToView(task);
    setShowViewDialog(true);
  };

  const handleOpenDelete = (task) => {
    setSelectedTaskToDelete(task);
    setShowDeleteDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Upload & Format Guide Section */}
      <Card className="border-none shadow-xl overflow-hidden bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Import New Task
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          <ImportDropzone onFileSelect={handleFileImport} isLoading={isLoading} />
          <FormatGuideCard />
        </CardContent>
      </Card>

      {/* Recent Imports Table */}
      <RecentImportsTable
        tasks={allTasks}
        isLoading={isLoading}
        onView={handleOpenView}
        onDelete={handleOpenDelete}
      />

      {/* View Task Dialog */}
      <ViewTaskDialog
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
        selectedTask={selectedTaskToView}
      />

      {/* Delete Task Dialog */}
      <DeleteTaskDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        selectedTask={selectedTaskToDelete}
        onDeleted={() => {
          dispatch(fetchAllDetails());
          setSelectedTaskToDelete(null);
        }}
      />
    </div>
  );
};

export default ImportTask;
