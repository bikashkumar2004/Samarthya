import express from "express";
import { upload } from "../../controller/createTask/upload.js";
import { authMiddleware } from "../../controller/auth/authController.js";
import {
  deleteTask,
  fetchUploadDetails,
  getSingleTask,
  handleUploadDetails,
} from "../../controller/createTask/index.js";

const router = express.Router();
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"), // multer middleware
  handleUploadDetails     // main controller
);

router.get("/upload-details", authMiddleware, fetchUploadDetails);
router.delete("/delete-task/:taskId", authMiddleware, deleteTask);
router.use((err, req, res, next) => {
  console.error("UPLOAD ERROR:", err.message);
  res.status(400).json({
    success: false,
    message: err.message || "File upload failed",
  });
});
router.get("/single/:id",authMiddleware,getSingleTask);

export default router;
