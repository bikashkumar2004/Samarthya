import express from "express";
import { fetchAllCalls, getLiveMonitor } from "../../controller/aiCallManager/index.js"; 

const aiCallmanager = express.Router();

aiCallmanager.get("/live-monitor", getLiveMonitor);
aiCallmanager.get("/fetch", fetchAllCalls);

export default aiCallmanager; 
