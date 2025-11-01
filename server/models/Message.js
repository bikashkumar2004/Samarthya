import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['SMS', 'Email'],
      required: true
    },
    recipient: {
      phone: String,
      email: String
    },
    message: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: 'Customer'
    },
    purpose: {
      type: String,
      default: 'General'
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'delivered'],
      default: 'pending'
    },
    messageId: {
      type: String,
      default: null
    },
    error: {
      type: String,
      default: null
    },
    metadata: {
      userAgent: String,
      ipAddress: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export const Message = mongoose.model('Message', messageSchema);
