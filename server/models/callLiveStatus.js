import mongoose from "mongoose";

const liveSchema = new mongoose.Schema(
  {
    call_id: { type: String, required: true, unique: true, index: true }, 
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "UploadDetails" },
    to: String,
    from: String,
    last_status: { type: String, index: true }, 
    updated_at_iso: { type: Date, default: Date.now, index: true },
    // optional: duration if you already capture on completed via webhook
    duration_seconds: { type: Number, default: 0 },
  },
  { timestamps: false }
);
const CallLiveStatus=mongoose.model("CallLiveStatus", liveSchema);
export default CallLiveStatus; 
