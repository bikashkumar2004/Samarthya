import express from "express";
import { createCampaign, getid, retrieveCampaigns } from "../../controller/agent/campaignController.js";
import { authMiddleware } from "../../controller/auth/authController.js";



const router = express.Router();

router.post("/create", authMiddleware,createCampaign);
router.get("/get/:id",authMiddleware, getid);
router.get("/retrieve",authMiddleware, retrieveCampaigns);


export default router;
