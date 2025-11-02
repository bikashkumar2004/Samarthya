// models/WhatsAppMessage.js
import mongoose from 'mongoose';

const whatsappMessageSchema = new mongoose.Schema({
  messageSid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  from: {
    type: String,
    required: true,
    index: true  // For faster queries
  },
  to: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  direction: {
    type: String,
    enum: ['inbound', 'outbound'],
    required: true,
    index: true
  },
  status: {
    type: String,
    default: 'received'
  },
  mediaUrl: {
    type: String,
    default: null
  },
  mediaContentType: {
    type: String,
    default: null
  },
  conversationId: {
    type: String,
    required: true,
    index: true  // For grouping by conversation
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient conversation queries
whatsappMessageSchema.index({ conversationId: 1, timestamp: -1 });

export default mongoose.model('WhatsAppMessage', whatsappMessageSchema);