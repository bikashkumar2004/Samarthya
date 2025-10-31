import express from "express";
import { createCampaign, getid } from "../../controller/agent/campaignController.js";



const router = express.Router();

router.post("/create",createCampaign);
router.get("/get/:id", getid);

export default router;
