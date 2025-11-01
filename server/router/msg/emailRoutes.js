import express from 'express';
import { handleEmailSend } from '../../services/emailService.js';

const router = express.Router();

/**
 * POST /api/email/send
 * Send email message
 */
router.post('/send', async (req, res) => {
  try {
    const { to_email, message, name = 'Customer', purpose = 'General' } = req.body;

    console.log(`📧 Received Email request:`, req.body);

    if (!to_email || !message) {
      console.error('Missing to_email or message');
      return res.status(400).json({
        success: false,
        error: 'Missing to_email or message'
      });
    }

    const result = await handleEmailSend(to_email, message, name, purpose);

    if (result.success) {
      console.log(`✅ Email Response:`, result);
      return res.status(200).json(result);
    } else {
      console.error(`❌ Email Response:`, result);
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error(`❌ Email Route Error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
