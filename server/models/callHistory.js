import mongoose from "mongoose";

const callHistorySchema = new mongoose.Schema(
  {
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContactDetails",
      required: true,
    },
    phone: { type: String, required: true },
    callSid: { type: String },
    status: { type: String },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    transcript: { type: String }, // optional, for AI conversation later
    sentiment: { type: String }, // optional
    summary: { type: String }, // optional
  },
  { timestamps: true }
);

export default mongoose.model("CallHistory", callHistorySchema);
