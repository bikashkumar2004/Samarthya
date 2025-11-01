import express from 'express';
import { Message } from '../../models/Message.js';

const router = express.Router();

/**
 * GET /api/messages
 * Get all messages
 */
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error('❌ Error fetching messages:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/messages/:id
 * Get message by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }
    res.status(200).json({
      success: true,
      message
    });
  } catch (error) {
    console.error('❌ Error fetching message:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/messages/type/:type
 * Get messages by type (SMS or Email)
 */
router.get('/type/:type', async (req, res) => {
  try {
    const messages = await Message.find({ type: req.params.type }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error('❌ Error fetching messages by type:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/messages/:id
 * Delete message
 */
router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting message:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
