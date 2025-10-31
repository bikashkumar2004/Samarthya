// models/counter.js
import mongoose, { Schema } from "mongoose";

const counterSchema = new Schema({
  key: { type: String, required: true, unique: true }, // e.g., "CMP-2025"
  seq: { type: Number, default: 0 },
});

export default mongoose.model("Counter", counterSchema);
