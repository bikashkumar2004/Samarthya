// routes/dashboard.js
import express from "express";
import { authMiddleware } from "../../controller/auth/authController";
import { getDashboardSummary } from "../../controller/dashboard/index.js";
import { getCategoryDistribution } from "../../controller/dashboard/barchat.js";

const Dashboard = express.Router();
Dashboard.get("/summary", authMiddleware, getDashboardSummary);
Dashboard.get("/barchat",authMiddleware,getCategoryDistribution)
export default Dashboard;
