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

import { 
  initiateCall,
  initiateBulkCalls,
  initiateFilteredCalls,
  getQueueStatus
} from "../../controller/agent/calliniciate.js";
import { callTranscript } from "../../controller/calls/callhistory.js";


const router = express.Router();

router.post("/upload-xlsx", upload.single("file"), handleContactUpload);
router.post("/add", addContactDetails);
router.put("/edit/:id", editList);
router.delete("/delete/:id", deleteList);
router.get("/get", fetchAllContactList);
router.get("/get/:id",showcontactDetails);
router.post("/call/:customerId",initiateCall);
router.get("/callTranscript/:customerId",callTranscript)
// ✅ NEW: Bulk calls - 5 concurrent with queue
router.post("/call-bulk", initiateBulkCalls);

// ✅ NEW: Filtered calls with queue
router.post("/call-filtered", initiateFilteredCalls);

// ✅ NEW: Check queue status
router.get("/queue-status", getQueueStatus);

router.get("/callTranscript/:customerId", callTranscript);

export default router;
