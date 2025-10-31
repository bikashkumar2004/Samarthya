// models/campaign.js
import mongoose, { Schema } from "mongoose";

const messageConfigSchema = new Schema(
  {
    channels: {
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      whatsapp: { type: Boolean, default: false },
    },
    template: { type: String, default: "" },
  },
  { _id: false }
);

const campaignSchema = new Schema(
  {
    campaignId: { type: String, unique: true, index: true },   // legacy unique index support
    campaignCode: { type: String, unique: true, index: true }, // CMP-YYYY-XXX

    campaignName: { type: String, required: true, trim: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "TaskDetails", required: true },
    taskCode: { type: String, index: true },

    type: { type: String, enum: ["call", "message"], required: true },
    category: { type: String, required: true },

    messageConfig: { type: messageConfigSchema, default: undefined },

    targetedUsers: [
      {
        name: { type: String, required: true },
        phoneNo: { type: String, required: true },
        email: { type: String },
        description: { type: String },
        category: { type: String },
      },
    ],

    status: { type: String, enum: ["pending", "running", "completed"], default: "pending" },
    startedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Campaign", campaignSchema);
