import express from "express";
import { fetchAllCalls, getLiveMonitor } from "../../controller/aiCallManager/index.js";
import { authMiddleware } from "../../controller/auth/authController.js";
import { getCallHistory, getCallHistoryByIds } from "../../controller/aiCallManager/callHistory.js";
import { allLeads } from "../../controller/aiCallManager/allLeads.js";

const aiCallmanager = express.Router();

aiCallmanager.get("/live-monitor", authMiddleware, getLiveMonitor);
aiCallmanager.get("/fetch", authMiddleware, fetchAllCalls);
aiCallmanager.get("/call-history", authMiddleware, getCallHistory);
aiCallmanager.get("/call-history/:customerId/:callId", authMiddleware, getCallHistoryByIds);

aiCallmanager.get("/call-history/:id", authMiddleware, getCallHistoryByIds);
aiCallmanager.get("/leads", authMiddleware, allLeads);

export default aiCallmanager;
