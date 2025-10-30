import express from 'express';
import { 
  getAllCampaigns, 
  createCampaign, 
  updateCampaign, 
  deleteCampaign, 
  getid
} from '../../controller/agent/campaignController.js';
import { authMiddleware } from '../../controller/auth/authController.js';

const router = express.Router();

// Get all campaigns
router.get('/retrive',authMiddleware, getAllCampaigns);
router.post('/create',authMiddleware, createCampaign);
router.put('/update/:id',authMiddleware, updateCampaign);
router.delete('/delete/:id',authMiddleware, deleteCampaign);
router.get("/get-task/:id",authMiddleware,getid)

export default router;
