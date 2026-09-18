import express from 'express';
import { handleSMSSend } from '../../services/smsService.js';

const router = express.Router();

router.post('/send', async (req, res) => {
  try {
    const { to_number, message, name = 'Customer', purpose = 'General' } = req.body;

    console.log(`📨 Received SMS request:`, req.body);

    if (!to_number || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to_number, message'
      });
    }

    const result = await handleSMSSend(to_number, message, name, purpose);
    const statusCode = result.success ? 200 : 500;
    res.status(statusCode).json(result);

  } catch (error) {
    console.error(`SMS Route Error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
