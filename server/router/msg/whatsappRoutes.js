// router/msg/whatsappRoutes.js
import express from 'express';
import twilio from 'twilio';
import WhatsAppMessage from '../../models/WhatsAppMessage.js';

const router = express.Router();
const MessagingResponse = twilio.twiml.MessagingResponse;

// Webhook endpoint - Receives incoming WhatsApp messages
router.post('/webhook', async (req, res) => {
  try {
    console.log('📥 Incoming WhatsApp webhook:', req.body);

    const { MessageSid, From, To, Body, MediaUrl0, MediaContentType0 } = req.body;

    // Extract phone number for conversation grouping
    const conversationId = From.replace('whatsapp:', '');

    // Create message document
    const incomingMessage = new WhatsAppMessage({
      messageSid: MessageSid,
      from: From,
      to: To,
      body: Body || '',
      direction: 'inbound',
      status: 'received',
      mediaUrl: MediaUrl0 || null,
      mediaContentType: MediaContentType0 || null,
      conversationId: conversationId,
      timestamp: new Date()
    });

    // Save to database
    await incomingMessage.save();
    console.log('✅ Message saved to database:', MessageSid);

    // Optional: Send auto-reply using TwiML
    const twiml = new MessagingResponse();
    // Uncomment to enable auto-reply:
    // twiml.message('Thanks for your message! We\'ll get back to you soon.');

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());

  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).send('Error processing webhook');
  }
});

// // Get all conversations
// router.get('/conversations', async (req, res) => {
//   try {
//     // Aggregate messages by conversation
//     const conversations = await WhatsAppMessage.aggregate([
//       {
//         $group: {
//           _id: '$conversationId',
//           phoneNumber: { $first: '$conversationId' },
//           lastMessage: { $max: '$timestamp' },
//           messageCount: { $sum: 1 },
//           unreadCount: {
//             $sum: {
//               $cond: [
//                 { $and: [{ $eq: ['$direction', 'inbound'] }, { $eq: ['$isRead', false] }] },
//                 1,
//                 0
//               ]
//             }
//           },
//           lastMessageText: { $last: '$body' }
//         }
//       },
//       {
//         $sort: { lastMessage: -1 }
//       },
//       {
//         $project: {
//           _id: 0,
//           conversationId: '$_id',
//           phoneNumber: `whatsapp:+917735220216`,
//           lastMessage: 1,
//           messageCount: 1,
//           unreadCount: 1,
//           lastMessageText: 1
//         }
//       }
//     ]);

//     res.json({
//       success: true,
//       count: conversations.length,
//       conversations
//     });

//   } catch (error) {
//     console.error('Error fetching conversations:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });
router.get('/conversations', async (req, res) => {
  try {
    // Aggregate messages by conversation
    const conversations = await WhatsAppMessage.aggregate([
      {
        $group: {
          _id: '$conversationId',
          phoneNumber: { $first: '$conversationId' },
          lastMessage: { $max: '$timestamp' },
          messageCount: { $sum: 1 },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$direction', 'inbound'] }, { $eq: ['$isRead', false] }] },
                1,
                0
              ]
            }
          },
          lastMessageText: { $last: '$body' }
        }
      },
      {
        $sort: { lastMessage: -1 }
      },
      {
        $project: {
          _id: 0,
          conversationId: '$_id',
          phoneNumber: {
            $concat: ['whatsapp:', '$phoneNumber']
          },
          lastMessage: 1,
          messageCount: 1,
          unreadCount: 1,
          lastMessageText: 1
        }
      }
    ]);

    console.log('✅ Conversations fetched:', conversations);
    res.json({
      success: true,
      count: conversations.length,
      conversations
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get messages for a specific conversation
router.get('/conversations/:phoneNumber', async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber.replace('whatsapp:', '');
    
    const messages = await WhatsAppMessage.find({
      conversationId: phoneNumber
    })
    .sort({ timestamp: 1 })
    .lean();

    // Mark inbound messages as read
    await WhatsAppMessage.updateMany(
      { conversationId: phoneNumber, direction: 'inbound', isRead: false },
      { $set: { isRead: true } }
    );

    res.json({
      success: true,
      phoneNumber: `whatsapp:${phoneNumber}`,
      count: messages.length,
      messages
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all messages (inbox view)
router.get('/messages', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const messages = await WhatsAppMessage.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await WhatsAppMessage.countDocuments();

    res.json({
      success: true,
      messages,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete a conversation
router.delete('/conversations/:phoneNumber', async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber.replace('whatsapp:', '');
    
    const result = await WhatsAppMessage.deleteMany({
      conversationId: phoneNumber
    });

    res.json({
      success: true,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
