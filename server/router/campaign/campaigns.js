import express from "express";
import { createCampaign, getid, retrieveCampaigns } from "../../controller/agent/campaignController.js";



const router = express.Router();

router.post("/create",createCampaign);
router.get("/get/:id", getid);
router.get("/retrieve", retrieveCampaigns);


export default router;
