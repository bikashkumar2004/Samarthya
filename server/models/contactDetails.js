import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    whatsappNo: { type: String, trim: true },
    source: {
      type: String,
      enum: ["WhatsApp", "Email", "Call", "SMS"],
      required: true,
    },
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
    },
  },
  { timestamps: true }
);

const ContactDetails = mongoose.model("ContactDetails", contactSchema);
export default ContactDetails;

