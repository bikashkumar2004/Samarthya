import express from "express";
import { upload } from "../../helper/uploadxls.js";
import {
  handleContactUpload,
  addContactDetails,
  editList,
  deleteList,
  fetchAllContactList,
} from "../../controller/admin/addList.js";

const router = express.Router();

router.post("/upload-xlsx", upload.single("file"), handleContactUpload);
router.post("/add", addContactDetails);
router.put("/edit/:id", editList);
router.delete("/delete/:id", deleteList);
router.get("/get", fetchAllContactList);

export default router;
