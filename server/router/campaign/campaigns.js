import express from 'express';
import { 
  getAllCampaigns, 
  createCampaign, 
  updateCampaign, 
  deleteCampaign 
} from '../../controller/agent/campaignController.js';

const router = express.Router();

// Get all campaigns
router.get('/', getAllCampaigns);

// Create new campaign
router.post('/', createCampaign);

// Update campaign
router.put('/:id', updateCampaign);

// Delete campaign
router.delete('/:id', deleteCampaign);

export default router;
