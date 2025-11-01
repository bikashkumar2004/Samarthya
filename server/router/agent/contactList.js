// router/agent/contactList.js
import express from "express";
import twilio from "twilio";
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
import { getLiveStatus, saveLiveStatus } from "../../controller/agent/callstatus.js";
import { authMiddleware } from "../../controller/auth/authController.js";

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.post("/upload-xlsx", upload.single("file"), handleContactUpload);
router.post("/add", addContactDetails);
router.put("/edit/:id", editList);
router.delete("/delete/:id", deleteList);
router.get("/get", fetchAllContactList);
router.get("/get/:id", showcontactDetails);


router.post("/call/:customerId", authMiddleware, initiateCall);
router.get("/callTranscript/:customerId", authMiddleware, callTranscript);
router.post("/call-bulk", authMiddleware,initiateBulkCalls);
router.post("/call-filtered",authMiddleware, initiateFilteredCalls);
router.get("/queue-status",authMiddleware, getQueueStatus);

router.post(
  "/call/status",
  twilio.webhook({ validate: true }), 
  saveLiveStatus
);
router.get("/status/:callId",authMiddleware, getLiveStatus);

export default router;