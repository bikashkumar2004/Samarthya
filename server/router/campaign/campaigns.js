import express from 'express';
import { 
  getAllCampaigns, 
  createCampaign, 
  updateCampaign, 
  deleteCampaign,
  enableAutoCaller,
  disableAutoCaller,
  getCampaignStatus,
  handleCallStatusCallback
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

router.post('/:campaignId/enable', enableAutoCaller);
router.post('/:campaignId/disable', disableAutoCaller);
router.get('/:campaignId/status', getCampaignStatus);
router.post('/status-callback', handleCallStatusCallback);

export default router;
