import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  whatshapNo: String,
  source: {
    type: String,
    enum: ["WhatsApp", "Email", "Call", "SMS"],
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "CartList" },
  createdAt: { type: Date, default: Date.now },
});

const ContactDetails = mongoose.model("ContactDetails", contactSchema);
export default ContactDetails;

