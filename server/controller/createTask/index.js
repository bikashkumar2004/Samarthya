import UploadDetails from "../../models/uploadDetails.js";
import TaskDetails from "../../models/createTask.js";
import {  processExcelFile } from "./processxlccv.js";

export const handleUploadDetails = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "No file uploaded" });

    const userId = req.user?._id;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized: User not logged in" });

    const result = await processExcelFile(req.file.path, userId);

    res.status(200).json({
      success: true,
      message: "File uploaded and task created successfully.",
      ...result,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while processing the file",
    });
  }
};

// Fetch only uploads created by the logged-in agent
export const fetchUploadDetails = async (req, res) => {
  try {
    const userId = req.user?._id;

    const taskList = await TaskDetails.find({ userId })
      .sort({ createdAt: -1 })
      .select("taskId fileName rows createdAt");

    if (!taskList.length) {
      return res.status(200).json({
        success: true,
        message: "No uploaded tasks found.",
        data: [],
      });
    }

    // 🧠 Transform response to match frontend
    const formattedTasks = taskList.map((t) => ({
      _id: t._id,
      taskID: t.taskId,
      fileName: t.fileName,
      rowsNo: t.rows,
      dateTime: new Date(t.createdAt).toLocaleString(),
    }));

    res.status(200).json({
      success: true,
      data: formattedTasks,
    });
  } catch (error) {
    console.error("Fetch upload error:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred while fetching uploads.",
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { taskId } = req.params;

    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User not logged in" });

    const task = await TaskDetails.findOne({ _id: taskId, userId });
    if (!task)
      return res
        .status(404)
        .json({ success: false, message: "Task not found or unauthorized" });

    await UploadDetails.deleteMany({ taskId });
    await TaskDetails.deleteOne({ _id: taskId });

    res.status(200).json({
      success: true,
      message: `Task ${task.taskId} deleted successfully.`,
      taskId,
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete task.",
    });
  }
};
export const getSingleTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await TaskDetails.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    const uploadedUsers = await UploadDetails.find({ taskId: id }).select(
      "name category description phoneNo email"
    );

    res.status(200).json({
      success: true,
      message: "Task details fetched successfully",
      data: {
        taskId: task.taskId,
        fileName: task.fileName,
        rowsNo: task.rows || 0,
        createdAt: task.createdAt,
        uploads: uploadedUsers, 
      },
    });
  } catch (error) {
    console.error("getSingleTask Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

