import UploadDetails from "../../models/uploadDetails.js";
import TaskDetails from "../../models/createTask.js";
import { processExceccvlFile } from "./processxlccv.js";
import path from "path";

export const handleUploadDetails = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User not logged in" });
    }
    const result = await processExceccvlFile(req.file.path, userId);
    const fileName = path.basename(req.file.originalname);
    const taskId = `TASK-${Date.now()}`;
    await TaskDetails.create({
      taskId,
      fileName,
      rows: result.importedRecords, 
      userId,
    });

    res.status(200).json({
      success: true,
      message: "File uploaded and task created successfully.",
      taskId,
      fileName,
      ...result,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while processing the file",
    });
  }
};

// Fetch only uploads created by the logged-in agent
export const fetchUploadDetails = async (req, res) => {
  try {
    const userId = req.user?._id;

    const taskList = await TaskDetails.find({ userId }).sort({
      createdAt: -1,
    });

    if (!taskList.length) {
      return res.status(404).json({
        success: false,
        message: "No uploaded tasks found for this user.",
      });
    }

    res.status(200).json({
      success: true,
      data: taskList,
    });
  } catch (error) {
    console.error("Fetch upload error:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred while fetching uploads.",
    });
  }
};
