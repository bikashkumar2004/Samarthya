import twilio from "twilio";
import dotenv from "dotenv";
import mongoose from "mongoose";
import ContactDetails from "../../models/contactDetails.js";

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const initiateCall = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(" Customer ID:", id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Customer ID",
      });
    }

    const contact = await ContactDetails.findById(id).lean();

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    if (!contact.phone) {
      return res.status(400).json({
        success: false,
        message: "Contact has no phone number",
      });
    }

    const wsUrl = process.env.MEDIA_WS_URL_BIKASH;

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Connect>
        <Stream url="${wsUrl}" />
    </Connect>
</Response>`;

    console.log(" Connecting to WebSocket:", wsUrl);
    console.log("Calling:", contact.phone);

    const call = await client.calls.create({
      to: contact.phone,
      from: process.env.TWILIO_NUMBER,
      twiml: twiml,
    });

    console.log("Call SID:", call.sid);
    console.log(" Call Status:", call.status);

    res.status(201).json({
      success: true,
      message: "Call initiated successfully",
      callSid: call.sid,
      to: contact.phone,
      status: call.status,
    });
  } catch (error) {
    console.error("Call initiation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to initiate call",
      error: error.message,
    });
  }
};
