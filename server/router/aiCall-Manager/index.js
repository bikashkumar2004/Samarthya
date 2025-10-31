import express from "express";
import { fetchAllCalls, getLiveMonitor } from "../../controller/aiCallManager/index.js"; 
import { getCallHistory, getCallHistoryByIds } from "../../controller/aiCallManager/callHistory.js";

const aiCallmanager = express.Router();

aiCallmanager.get("/live-monitor", getLiveMonitor);
aiCallmanager.get("/fetch", fetchAllCalls);
aiCallmanager.get("/call-history",getCallHistory)
aiCallmanager.get("/call-history/id",getCallHistoryByIds)

export default aiCallmanager; 
