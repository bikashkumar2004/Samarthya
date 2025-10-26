import mongoose from "mongoose";

const callSchema = new mongoose.Schema(
  {
    call_id: { type: String, required: true, unique: true },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContactDetails",
      required: true,
      index: true,
    },
    call_start_iso: { type: Date, required: true, default: Date.now },
    call_end_iso: { type: Date, required: true, default: Date.now },
    call_duration_seconds: { type: Number, required: true },
    summary: { type: String, default: "" },
    sentiment_overall: {
      type: String,
      enum: ["Positive", "Negative", "Neutral"],
      default: "Neutral",
    },
    turn_counts: {
      first_agent_utterance: { type: String, default: "" },
      last_user_utterance: { type: String, default: "" },
    },
    transcript: [
      {
        speaker: { type: String, enum: ["Agent", "User"], required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    realtime: {
      created_at_iso: { type: Date, default: Date.now },
      updated_at_iso: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

callSchema.index({ customer_id: 1, createdAt: -1 });

callSchema.set("toJSON", {
  transform: function (doc, ret) {
    const formatDate = (date) =>
      date
        ? new Date(date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        : null;

    ["call_start_iso", "call_end_iso", "createdAt", "updatedAt"].forEach(
      (field) => {
        ret[field] = formatDate(ret[field]);
      }
    );

    if (ret.realtime) {
      ret.realtime.created_at_iso = formatDate(ret.realtime.created_at_iso);
      ret.realtime.updated_at_iso = formatDate(ret.realtime.updated_at_iso);
    }

    if (Array.isArray(ret.transcript)) {
      ret.transcript = ret.transcript.map((t) => ({
        ...t,
        timestamp: formatDate(t.timestamp),
      }));
    }

    return ret;
  },
});

export default mongoose.model("Calls", callSchema);
