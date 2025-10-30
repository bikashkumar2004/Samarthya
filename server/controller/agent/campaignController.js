import Campaign from '../../models/campaign.js'

// Get all campaigns grouped by status
export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = {
      active: await Campaign.find({ 
        status: { $in: ['active', 'running', 'paused'] } 
      }).sort({ startedAt: -1 }),
      
      scheduled: await Campaign.find({ 
        status: 'scheduled' 
      }).sort({ scheduledFor: 1 }),
      
      completed: await Campaign.find({ 
        status: 'completed' 
      }).sort({ completedAt: -1 }),
      
      draft: await Campaign.find({ 
        status: 'draft' 
      }).sort({ lastModified: -1 })
    };
    
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new campaign
export const createCampaign = async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    const savedCampaign = await campaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update campaign
export const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    res.status(200).json(campaign);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete campaign
export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    res.status(200).json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
