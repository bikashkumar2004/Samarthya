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
import { getLiveStatus, saveLiveStatus } from "../../controller/agent/callStatus.js";

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.post("/upload-xlsx", upload.single("file"), handleContactUpload);
router.post("/add", addContactDetails);
router.put("/edit/:id", editList);
router.delete("/delete/:id", deleteList);
router.get("/get", fetchAllContactList);
router.get("/get/:id", showcontactDetails);


router.post("/call/:customerId", initiateCall);
router.get("/callTranscript/:customerId",  callTranscript);
router.post("/call-bulk",initiateBulkCalls);
router.post("/call-filtered", initiateFilteredCalls);
router.get("/queue-status", getQueueStatus);

router.post(
  "/call/status",
  twilio.webhook({ validate: true }), 
  saveLiveStatus
);
router.get("/status/:callId", getLiveStatus);

export default router;