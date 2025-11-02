// routes/dashboard.js
import express from "express";

import { getDashboardSummary } from "../../controller/dashboard/index.js";
import { getCategoryDistribution } from "../../controller/dashboard/barchat.js";
import { getWeeklyPerformance } from "../../controller/dashboard/weaklychat.js";


const Dashboard = express.Router();
Dashboard.get("/summary",getDashboardSummary);
Dashboard.get("/barchat",getCategoryDistribution);
Dashboard.get("/weaklychat",getWeeklyPerformance)
export default Dashboard;
