
import TaskDetails from "../../models/createTask.js";
import UploadDetails from "../../models/uploadDetails.js";
import Campaign from '../../models/campaign.js'
import * as autoCallerService from '../../services/autoCallerService.js';
import Calls from '../../models/callHistory.js';

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




// Enable auto-caller
export const enableAutoCaller = async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    const result = await autoCallerService.startAutoCaller(campaignId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Disable auto-caller
export const disableAutoCaller = async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    const result = await autoCallerService.stopAutoCaller(campaignId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get campaign status
export const getCampaignStatus = async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    const status = await autoCallerService.getCampaignStatus(campaignId);
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Handle Twilio status callback
export const handleCallStatusCallback = async (req, res) => {
  try {
    const {
      CallSid,
      CallStatus,
      CallDuration,
      From,
      To
    } = req.body;

    console.log(`Call status callback - SID: ${CallSid}, Status: ${CallStatus}`);

    // Find call record by Twilio SID
    const callRecord = await Calls.findOne({ call_id: CallSid });

    if (callRecord && CallStatus === 'completed') {
      callRecord.call_end_iso = new Date();
      callRecord.call_duration_seconds = parseInt(CallDuration) || 0;
      callRecord.realtime.updated_at_iso = new Date();
      
      // Mark as answered if duration > 10 seconds
      if (callRecord.call_duration_seconds > 10) {
        callRecord.summary = callRecord.summary || 'Call completed successfully';
      } else {
        callRecord.summary = 'Call not answered or very short';
      }
      
      await callRecord.save();
      console.log(`Call record updated for SID: ${CallSid}`);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error handling call status callback:', error);
    res.status(500).send('Error');
  }
};


export const getid = async (req, res) => {
  try {
    const { id } = req.params; 
    const cleanedId = id.trim();
    const task = await TaskDetails.findOne({ taskId: cleanedId });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task ID '${cleanedId}' not found in TaskDetails.`,
      });
    }
    const uploadData = await UploadDetails.find({ taskId: task._id });
    if (!uploadData.length) {
      return res.status(404).json({
        success: false,
        message: "No uploaded user data found for this Task ID.",
      });
    }
    const categoryMap = {};
    for (const user of uploadData) {
      if (!categoryMap[user.category]) categoryMap[user.category] = [];
      if (categoryMap[user.category].length < 30) {
        categoryMap[user.category].push(user);
      }
    }

    const result = Object.entries(categoryMap).map(([category, users]) => ({
      category,
      users,
      totalUsers: users.length,
    }));

    res.status(200).json({
      success: true,
      message: "Task data fetched successfully.",
      data: {
        taskId: task.taskId,
        fileName: task.fileName,
        totalRows: uploadData.length,
        categories: result,
      },
    });
  } catch (error) {
    console.error("getid Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred.",
      error: error.message,
    });
  }
};
