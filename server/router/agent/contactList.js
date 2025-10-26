import express from "express";
import { upload } from "../../helper/uploadxls.js";
import {
  handleContactUpload,
  addContactDetails,
  editList,
  deleteList,
  fetchAllContactList,
  showcontactDetails,
} from "../../controller/agent/addList.js";
import { initiateCall } from "../../controller/agent/calliniciate.js";


const router = express.Router();

router.post("/upload-xlsx", upload.single("file"), handleContactUpload);
router.post("/add", addContactDetails);
router.put("/edit/:id", editList);
router.delete("/delete/:id", deleteList);
router.get("/get", fetchAllContactList);
router.get("/get/:id",showcontactDetails);
router.post("/call/:customerId",initiateCall);



export default router;
