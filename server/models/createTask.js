import mongoose from "mongoose";

const taskDetailsSchema = new mongoose.Schema(
  {
    taskId: { type: String, required: true, unique: true },
    fileName: { type: String, required: true },
    rows: { type: Number, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateTime: {
      type: String,
      default: () => {
        const now = new Date();
        return now.toISOString().replace("T", " ").substring(0, 16);
      },
    },
  },
  { timestamps: true }
);
const taskDetails = mongoose.model("TaskDetails", taskDetailsSchema);
export default taskDetails;
