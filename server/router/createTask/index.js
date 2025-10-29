import express from "express";
import { upload } from "../../controller/createTask/upload.js";
import { authMiddleware } from "../../controller/auth/authController.js";
import {fetchUploadDetails, handleUploadDetails} from "../../controller/createTask/index.js"

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("file"),handleUploadDetails);
router.get("/upload-details", authMiddleware,fetchUploadDetails);

export default router;
